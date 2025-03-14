/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Process a payment through Flutterwave
         * @description Initiates a payment process through Flutterwave using a unique transaction reference.
         */
        post: operations["createPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/{id}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve transaction details
         * @description Fetch the final status of a transaction using its transaction ID.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description The unique transaction ID. */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successfully retrieved transaction details. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example success */
                            status?: string;
                            /** @example Transaction fetched successfully */
                            message?: string;
                            data?: {
                                /** @example 4975363 */
                                id?: number;
                                /** @example 1710840858755-RND_83 */
                                tx_ref?: string;
                                /**
                                 * Format: float
                                 * @example 1000
                                 */
                                amount?: number;
                                /** @example NGN */
                                currency?: string;
                                /** @example successful */
                                status?: string;
                                /**
                                 * Format: date-time
                                 * @example 2024-03-19T09:34:27.000Z
                                 */
                                created_at?: string;
                            };
                        };
                    };
                };
                /** @description Bad request, invalid transaction ID. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example error */
                            status?: string;
                            /** @example Invalid Transaction ID */
                            message?: string;
                            data?: Record<string, never> | null;
                        };
                    };
                };
                /** @description Transaction not found. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example error */
                            status?: string;
                            /** @example Transaction not found */
                            message?: string;
                            data?: Record<string, never> | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/verify_by_reference": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve transaction details
         * @description Fetch the final status of a transaction using its transaction ID.
         */
        get: {
            parameters: {
                query: {
                    /** @description The unique transaction ID. */
                    tx_ref: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Successfully retrieved transaction details. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example success */
                            status?: string;
                            /** @example Transaction fetched successfully */
                            message?: string;
                            data?: {
                                /** @example 4975363 */
                                id?: number;
                                /** @example 1710840858755-RND_83 */
                                tx_ref?: string;
                                /**
                                 * Format: float
                                 * @example 1000
                                 */
                                amount?: number;
                                /** @example NGN */
                                currency?: string;
                                /** @example successful */
                                status?: string;
                                /**
                                 * Format: date-time
                                 * @example 2024-03-19T09:34:27.000Z
                                 */
                                created_at?: string;
                            };
                        };
                    };
                };
                /** @description Bad request, invalid transaction ID. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example error */
                            status?: string;
                            /** @example Invalid Transaction ID */
                            message?: string;
                            data?: Record<string, never> | null;
                        };
                    };
                };
                /** @description Transaction not found. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /** @example error */
                            status?: string;
                            /** @example Transaction not found */
                            message?: string;
                            data?: Record<string, never> | null;
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/{id}/resend-hook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resend failed webhook
         * @description Resend failed webhook
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description The unique transaction ID. */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: never;
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transactions/{id}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resend failed webhook.
         * @description Resend failed webhook.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description The unique transaction ID. */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: never;
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Transaction: Record<string, never>;
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    createPayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Payment data for the transaction */
        requestBody?: {
            content: {
                "application/json": {
                    /** @example txnref_djsdkjsnkdjvnsdfj */
                    tx_ref: string;
                    /** @example 7500 */
                    amount: string;
                    /** @example NGN */
                    currency: string;
                    /** @example https://example_company.com/success */
                    redirect_url: string;
                    customer: {
                        /** @example developers@flutterwavego.com */
                        email?: string;
                        /** @example Flutterwave Developers */
                        name?: string;
                        /** @example 09012345678 */
                        phonenumber?: string;
                    };
                    customizations: {
                        /** @example Flutterwave Standard Payment */
                        title?: string;
                    };
                };
            };
        };
        responses: never;
    };
}
