import { Request, Response } from "express";
import { createUser, exchangeAccessTokenForCredentials, exchangeAccessTokenForUserData, exchangeRefreshTokenForCredentials, getRefreshToken, revokeTokenFromUser, updateCredentials } from "../../services/discord";

const REDIRECT_URI = process.env.WEBAPP_URL + "/callback";

export async function callbackController(req: Request, res: Response) {
    const { token } = req.body;
    console.log(token)
    if (!token) return res.status(400).send({ error: 'No token provided' });

    const data = await exchangeAccessTokenForCredentials({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: token,
        redirect_uri: REDIRECT_URI
    });

    if (data.code === 50035) return res.status(401).send({ error: 'Invalid token' });

    const user = await exchangeAccessTokenForUserData(data.access_token);
    const newUser = await createUser({
        id: user.id,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: Math.floor(Date.now() / 1000) + (data.expires_in || 604800)
    });

    return res.send({
        ...newUser,
        avatar: user.avatar,
        discriminator: user.discriminator,
        username: user.username
    });
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

    // Remove user session from DB

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