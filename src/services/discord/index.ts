import axios from 'axios';
import { axiosConfig } from '../../utils/constants';
import { convertObjectToURLSearchParams, userAuthHeaders } from '../../utils/helpers';
import {
    DiscordOAuth2CredentialsResponds,
    OAuth2ExchangeRefreshRequestParams,
    OAuth2ExchangeRequestParams,
    OAuth2RevokeTokenRequestParams,
    CreateUserParams,
    DiscordOAuth2UserResponds
} from '../../utils/types';
import { IUser, User as UserModel } from '../../models/User';

export async function exchangeAccessTokenForCredentials(data: OAuth2ExchangeRequestParams) {
    const r = await axios.post<DiscordOAuth2CredentialsResponds>(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token`, convertObjectToURLSearchParams(data), axiosConfig);
    return r.data;
}

export async function exchangeRefreshTokenForCredentials(data: OAuth2ExchangeRefreshRequestParams) {
    const r = await axios.post<DiscordOAuth2CredentialsResponds>(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token`, convertObjectToURLSearchParams(data), axiosConfig);
    return r.data;
}

export async function revokeTokenFromUser(data: OAuth2RevokeTokenRequestParams) {
    const r = await axios.post(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token/revoke`, convertObjectToURLSearchParams(data), axiosConfig);
    return r.data;
}

export async function exchangeAccessTokenForUserData(token: string) {
    const r = await axios.get<DiscordOAuth2UserResponds>(`${process.env.DISCORD_API_ENDPOINT}/users/@me`, userAuthHeaders(token));
    return r.data;
}

export async function createUser(params: CreateUserParams) {
    const user: IUser = await UserModel.findOne({ id: params.id });
    if (user) return user;

    const newUser = new UserModel(params);
    await newUser.save().catch((e) => console.log(e));
    return newUser;
}

export async function removeUserByAccessToken(token: string) {
    await UserModel.deleteOne({ access_token: token });
}

export async function getRefreshToken(token: string) {
    const user = await UserModel.findOne({ refresh_token: token });
    return user || null;
}

export async function updateCredentials(params: CreateUserParams) {
    return await UserModel.findOneAndUpdate({ id: params.id }, {
        access_token: params.access_token,
        refresh_token: params.refresh_token,
        expires_in: params.expires_in
    }, { upsert: true });
}