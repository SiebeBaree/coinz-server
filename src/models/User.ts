import { Schema, model } from 'mongoose';

export interface IUser {
    id: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

const UserSchema = new Schema<IUser>({
    id: { type: String, required: true, index: true, unique: true },
    access_token: { type: String, required: true, index: true },
    refresh_token: { type: String, required: true, index: true },
    expires_in: { type: Number, default: Math.floor(Date.now() / 1000) + 604800 },
});

export const User = model<IUser>('User', UserSchema, 'users');