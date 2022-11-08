// Environment Variables (Stripe API Key)
import { config } from "dotenv"
if (process.env.NODE_ENV !== 'production') {
    config();
}


// Connect to MongoDB
import { connect } from 'mongoose'
connect(process.env.DATABASE_URI, {
    dbName: process.env.NODE_ENV === 'production' ? 'coinz' : 'coinz_beta',
    maxPoolSize: 100,
    minPoolSize: 5,
    family: 4,
    heartbeatFrequencyMS: 30000,
    keepAlive: true,
    keepAliveInitialDelay: 300000
}).then(() => console.log('Connected to MongoDB'));

// Initialize Stripe
// import Stripe from 'stripe';
// export const stripe = new Stripe(process.env.STRIPE_SECRET, {
//     apiVersion: '2022-08-01',
// });

// Start the API with Express
import app from './api';

const port = process.env.PORT || 3300;
app.listen(port, () => console.log(`API available on http://localhost:${port}`));

const ignoredErrors = [];
process.on('uncaughtException', (err: Error) => {
    if (!ignoredErrors.includes(`${err.name}: ${err.message}`)) {
        console.error(err.stack);
    }
});

process.on('unhandledRejection', (err: Error) => {
    if (!ignoredErrors.includes(`${err.name}: ${err.message}`)) {
        console.error(err.stack);
    }
});