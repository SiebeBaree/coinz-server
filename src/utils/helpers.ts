import { AxiosRequestConfig } from "axios";

export const convertObjectToURLSearchParams = (data: any) => {
    return new URLSearchParams(data);
}

export const userAuthHeaders = (token: string): AxiosRequestConfig => ({
    headers: {
        Authorization: `Bearer ${token}`,
    }
})