import { transactionClient as client } from "../http/index.js";

/**
 * This endpoint helps you query the details of a transaction.
 * https://developer.flutterwave.com/reference/verify-transaction.
 * @param tx_id 
 * @returns 
 */
async function get(tx_id: string) {
    const { data, error } = await client.GET("/transactions/{id}/verify", {
        params: {
            path: { id: tx_id },
        },
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * This endpoint helps you query the details of a transaction using the transaction reference.
 * https://developer.flutterwave.com/reference/verify-transaction-with-tx_ref
 * @param tx_ref 
 * @returns 
 */
async function get_with_reference(tx_ref: string) {
    const { data, error } = await client.GET("/transactions/verify_by_reference", {
        params: {
            query: { tx_ref },
        },
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * This endpoint helps you resend webhooks from failed sending queues to your server.
 * https://developer.flutterwave.com/reference/resend-transaction-webhook
 */
async function send_failed_webhook(tx_id: string) {
    const { data, error } = await client.POST("/transactions/{id}/resend-hook", {
        params: {
            path: { id: tx_id },
        },
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Review the timeline for a transaction from initiation to completion.
 * https://developer.flutterwave.com/reference/get-transaction-events
 */
async function timeline(tx_id: string) {
    const { data, error } = await client.POST("/transactions/{id}/events", {
        params: {
            path: { id: tx_id },
        },
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

/**
 * Retry a failed transaction by creating a new transaction with the same details
 * This is a wrapper function that gets the original transaction and recreates it
 */
async function retry_transaction(tx_id: string) {
    try {
        // First get the original transaction details
        const original = await get(tx_id);
        
        if (!original || !original.data) {
            return {
                status: 'error',
                message: 'Could not retrieve original transaction details',
                data: null
            };
        }

        const txData = original.data;
        
        // Check if transaction is in a retriable state
        if (txData.status === 'successful') {
            return {
                status: 'error',
                message: 'Transaction is already successful, cannot retry',
                data: null
            };
        }

        return {
            status: 'info',
            message: 'Transaction retry initiated. Please create a new transaction with the same details.',
            data: {
                original_tx_ref: txData.tx_ref,
                amount: txData.amount,
                currency: txData.currency,
                customer_email: (txData as any).customer?.email,
                status: txData.status
            }
        };
        
    } catch (error) {
        console.error('Error retrying transaction:', error);
        return {
            status: 'error',
            message: 'Failed to retry transaction',
            data: null
        };
    }
}

export default {
    get,
    get_with_reference,
    timeline,
    send_failed_webhook,
    retry_transaction
}