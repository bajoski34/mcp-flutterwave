import { z } from 'zod';

export const CheckoutPayloadSchema = {
    tx_ref: z.string().min(1, "Transaction reference is required"),
    amount: z.string().min(1, "Amount is required"),
    currency: z.string().min(1, "Currency is required"),
    redirect_url: z.string().url("Redirect URL must be a valid URL"),
    customer: z.object({
        email: z.string().email("Invalid email address"),
        name: z.string().min(1, "Customer name is required"),
        phonenumber: z.string().min(1, "Customer phone number is required"),
    }),
    customizations: z.object({
        title: z.string().min(1, "Title is required"),
    }),
    configurations: z.object({
        session_duration: z.number().int().positive("Session duration must be a positive integer"),
        max_retry_attempt: z.number().int().nonnegative("Max retry attempt must be a non-negative integer")
    }),
};

export const DisableCheckoutSchema = {
    link: z.string().url("Checkout link must be a valid URL"),
};