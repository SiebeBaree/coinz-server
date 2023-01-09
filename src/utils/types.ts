export type Shard = {
    id: number;
    cluster: number;
    ping: number;
    guildcount: number;
    cpu: number;
    ram: number;
}

export type User = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
}