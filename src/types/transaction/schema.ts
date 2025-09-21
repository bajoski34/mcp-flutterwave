import { z } from 'zod';

export const TransactionSchema = {
    tx_id: z.string().min(1, 'Transaction ID is required').describe('Transaction ID'),
}