import { Schema, model } from 'mongoose';

export interface ICustomer {
    id: string;
    customerId: string;
}

const CustomerSchema = new Schema<ICustomer>({
    id: { type: String, required: true, index: true, unique: true },
    customerId: { type: String, required: true, index: true },
});

export const User = model<ICustomer>('User', CustomerSchema, 'users');