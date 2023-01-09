import axios from "axios";
import WebUser from "../../models/WebUser";
import { User } from "../../utils/types";

export async function getUserService(id: string) {
    const user = await WebUser.findById(id);
    if (!user) throw new Error("User not found");

    return axios.get<User>(process.env.DISCORD_API_ENDPOINT + "/users/@me", {
        headers: {
            Authorization: `Bearer ${user.accessToken}`,
        },
    });
}