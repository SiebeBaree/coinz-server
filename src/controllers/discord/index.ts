import { Request, Response } from "express"
import { Guild } from "../../models/Guild";
import { IUser, User } from "../../models/User"
import {
    createUser,
    exchangeAccessTokenForCredentials,
    exchangeAccessTokenForUserData,
    exchangeRefreshTokenForCredentials,
    getRefreshToken,
    removeUserByAccessToken,
    revokeTokenFromUser,
    updateCredentials
} from "../../services/discord"

const REDIRECT_URI = process.env.WEBAPP_URL + "/callback";

export async function callbackController(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) return res.status(400).send({ error: 'No token provided' });

    const data = await exchangeAccessTokenForCredentials({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: token,
        redirect_uri: REDIRECT_URI
    });

    if (data.code === 50035) return res.status(401).send({ error: 'Invalid token' });

    try {
        const user = await exchangeAccessTokenForUserData(data.access_token);

        const newUser: IUser = await createUser({
            id: user.id,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in
        });

        return res.send({
            id: newUser.id,
            access_token: newUser.access_token,
            refresh_token: newUser.refresh_token,
            expires_in: newUser.expires_in,
            token_type: data.token_type || "Bearer",
            avatar: user.avatar,
            discriminator: user.discriminator,
            username: user.username
        });
    } catch (e) {
        return res.status(401).send({ error: 'Invalid Token' });
    }
}

export async function refreshController(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) return res.status(400).send({ error: 'No token provided' });

    const user = await getRefreshToken(token);
    if (user === null) return res.status(401).send({ error: 'Invalid token' });

    const data = await exchangeRefreshTokenForCredentials({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: user.refresh_token
    });

    const userData = await updateCredentials({
        id: user.id,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: Math.floor(Date.now() / 1000) + (data.expires_in || 604800)
    });

    return res.send(userData);
}

export async function revokeController(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) return res.status(400).send({ error: 'No token provided' });

    const data = await revokeTokenFromUser({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        token: token
    });

    await removeUserByAccessToken(token);
    return res.send(data);
}

export async function userController(req: Request, res: Response) {
    const { token } = req.query;
    if (!token) return res.status(400).send({ error: 'No token provided' });

    const user = await exchangeAccessTokenForUserData(token as string).catch(() => {
        return res.status(401).send({ error: 'Unauthorized' });
    });
    return res.send(user);
}

export async function authorizeController(req: Request, res: Response) {
    const { id, token } = req.query;
    if (!id || !token) return res.status(400).send({ error: 'No token provided' });

    const user = await User.findOne({ id: id });
    if (!user) return res.sendStatus(401);
    return res.sendStatus(user?.access_token === token ? 200 : 401);
}

export async function guildController(req: Request, res: Response) {
    const { guilds } = req.body;
    if (!guilds) return res.status(406).send({ error: 'No guilds provided' });
    if (!Array.isArray(guilds) || guilds.length <= 0) return res.status(406).send({ error: 'Guilds must be an array with at least one guild' });
    if (guilds.length >= 30) return res.status(413).send({ error: 'Too many guilds provided' });

    const premiumGuilds = await Guild.find({ id: { $in: guilds } });
    if (premiumGuilds.length <= 0) return res.send({ guilds: {} });

    const mappedGuilds = {};
    premiumGuilds.forEach(guild => {
        mappedGuilds[guild.id] = guild.premium;
    });
    const guildKeys = Object.keys(mappedGuilds);

    const guildsObject = {};
    guilds.forEach(guild => {
        guildsObject[guild] = guildKeys.includes(guild) ? mappedGuilds[guild] : null;
    });

    return res.send({ guilds: guildsObject });
}