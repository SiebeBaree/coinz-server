import { Schema, model, InferSchemaType } from 'mongoose';

const User = new Schema({
    id: { type: String, required: true, index: true, unique: true },
    access_token: { type: String, required: true, index: true },
    refresh_token: { type: String, required: true, index: true },
    expires_in: { type: Number, default: Math.floor(Date.now() / 1000) + 604800 },
});

export type UserDocument = InferSchemaType<typeof User>;
export const UserModel = model('User', User, 'users');