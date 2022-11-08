import { Schema, model } from 'mongoose';

export interface IGuild {
    id: string;
    premium: boolean;
    airdropStatus: boolean;
    airdropChannel: string;
    airdropNext: number;
}

const GuildSchema = new Schema<IGuild>({
    id: { type: String, required: true, unique: true, index: true },
    premium: { type: Boolean, default: false },
    airdropStatus: { type: Boolean, default: false },
    airdropChannel: { type: String, default: "" },
    airdropNext: { type: Number, default: 0 }
});

export const Guild = model<IGuild>('Guild', GuildSchema, 'guilds');