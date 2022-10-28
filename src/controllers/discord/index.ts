import { Request, Response } from "express"
import { IUser } from "../../models/User"
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

    exchangeAccessTokenForUserData(data.access_token).then((user) => {
        createUser({
            id: user.id,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: Math.floor(Date.now() / 1000) + (data.expires_in || 604800)
        }).then((newUser: IUser) => {
            return res.send({
                id: newUser.id,
                access_token: newUser.access_token,
                refresh_token: newUser.refresh_token,
                expires_in: newUser.expires_in,
                avatar: user.avatar,
                discriminator: user.discriminator,
                username: user.username
            });
        }).catch(() => res.sendStatus(401).send({ error: 'Invalid token' }));
    });

    return res.sendStatus(401).send({ error: 'Invalid token' });
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
    const { token } = req.params;
    if (!token) return res.status(400).send({ error: 'No token provided' });

    const user = await exchangeAccessTokenForUserData(token).catch(() => {
        return res.status(401).send({ error: 'Unauthorized' });
    });
    return res.send(user);
}