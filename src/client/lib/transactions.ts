import client from "../client.js";

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

export default {
    get,
    get_with_reference,
    timeline,
    send_failed_webhook
}