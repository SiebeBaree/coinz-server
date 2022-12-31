// Environment Variables
import dotenv from "dotenv";
dotenv.config();

// Initialize Stripe
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET, {
    apiVersion: '2022-08-01',
});