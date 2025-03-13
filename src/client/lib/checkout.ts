import { checkoutClient as client } from "../http/index.js";

type CheckoutPayload = {
    tx_ref: string,
    amount: string,
    currency: string,
    redirect_url: string,
    customer: {
        email: string,
        name: string,
        phonenumber: string,
    },
    customizations: {
        title: string,
    },
    configurations: {
        session_duration: number,
        max_retry_attempt: number
    },
}

/**
 * This checkout create paymrnt.
 * https://developer.flutterwave.com/docs/flutterwave-standard-1
 * 
*/
async function create(payment_data: CheckoutPayload) : Promise<{ data: {
    data: any; link: string 
}, status: number } | undefined> {
    const { data, error } = await client.POST("/payments", {
        body: {
            ...payment_data
        }
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

// {
//     "status": "success",
//     "message": "LINK DISABLED",
//     "data": true
// }

/**
 * Disable a checkout link.
 * https://developer.flutterwave.com/docs/flutterwave-standard-1#how-to-disable-a-payment-link-via-api
 * @param payment_link 
 * @returns 
 */
async function disable(payment_link: string): Promise<{
    status: string;
    message: string;
    data: null;
} | undefined> {
    const { data, error } = await client.POST("/payments/link/disable", {
        body:{
            link: payment_link
        }
    });

    if (error) {
        console.error(error);
        return;
    }

    return data;
}

export default {
    create,
    disable_link: disable
}