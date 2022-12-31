import { AxiosRequestConfig } from "axios";
import { NextFunction, Request, Response } from "express";

export const convertObjectToURLSearchParams = (data: any) => {
    return new URLSearchParams(data);
}

export const userAuthHeaders = (token: string): AxiosRequestConfig => ({
    headers: {
        Authorization: `Bearer ${token}`,
    }
})

export function runAsync(callback: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        callback(req, res, next).catch(next);
    };
}