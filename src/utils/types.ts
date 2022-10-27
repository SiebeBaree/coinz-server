export type OAuth2ExchangeRequestParams = {
    client_id: string;
    client_secret: string;
    grant_type: string;
    code: string;
    redirect_uri: string;
}

export type OAuth2ExchangeRefreshRequestParams = {
    client_id: string;
    client_secret: string;
    grant_type: string;
    refresh_token: string;
}

export type OAuth2RevokeTokenRequestParams = {
    client_id: string;
    client_secret: string;
    token: string;
}

export type DiscordOAuth2CredentialsResponds = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    code?: number;
    error?: string;
}

export type DiscordOAuth2UserResponds = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string | null;
    accent_color?: number | null;
    locale?: string;
    verified?: boolean;
    email?: string | null;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
}

export type CreateUserParams = {
    id: string;
    access_token: string;
    refresh_token: string;
    expires_in?: number;
}