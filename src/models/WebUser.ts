import { Schema, model } from "mongoose";

export interface IWebUser {
    id: string;
    accessToken: string;
    refreshToken: string;
}

const webUserSchema = new Schema<IWebUser>({
    id: { type: String, required: true, unique: true, index: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
}, { timestamps: true });

export default model<IWebUser>("WebUser", webUserSchema);