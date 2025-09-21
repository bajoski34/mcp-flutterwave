export type Options = {
    tools?: string[];
    apiKey?: string;
};

export type CheckoutPayload = {
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