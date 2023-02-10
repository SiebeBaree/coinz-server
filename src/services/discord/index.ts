import axios from "axios";
import Member, { IMember } from "../../models/Member";
import Premium, { IPremium } from "../../models/Premium";
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

export async function getMemberService(id: string): Promise<IMember> {
    const member = await Member.findOne({ id: id });
    return !member ? new Member({ id: id }) : member;
}

export async function getPremiumService(id: string): Promise<IPremium> {
    const premium = await Premium.findOne({ id: id });
    return !premium ? new Premium({ id: id }) : premium;
}