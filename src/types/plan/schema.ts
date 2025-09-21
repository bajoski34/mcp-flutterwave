import { z } from 'zod';

export const CreatePlanPayloadSchema = {
    name: z.string().min(1, "Name is required"),
    amount: z.number().positive("Amount must be a positive number"),
    interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).refine(val => ['daily', 'weekly', 'monthly', 'yearly'].includes(val), { message: "Interval must be one of 'daily', 'weekly', 'monthly', 'yearly'" }),
    duration: z.number().int().positive("Duration must be a positive integer"),
};

export const GetPlansFiltersSchema = {
    name: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    interval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    status: z.enum(['active', 'inactive']).optional(),
    from: z.string().optional(),
    to: z.string().optional(),
};