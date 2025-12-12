import { createUIResource } from "@mcp-ui/server";

type URI = `ui://${string}`;

// Flutterwave brand colors
const COLORS = {
    primary: '#F5A623',
    dark: '#1E1E1E',
    success: '#00C853',
    error: '#D32F2F',
    warning: '#FFA726',
    text: '#333333',
    textLight: '#666666',
    background: '#FFFFFF',
    border: '#E0E0E0',
};

// Base styles for all UI components
const baseStyles = `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: ${COLORS.background};
            padding: 20px;
            color: ${COLORS.text};
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, ${COLORS.primary} 0%, #FF8C00 100%);
            color: white;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 24px;
        }
        .info-grid {
            display: grid;
            gap: 16px;
        }
        .info-item {
            padding: 16px;
            background: #F9FAFB;
            border-radius: 8px;
            border-left: 4px solid ${COLORS.primary};
        }
        .info-label {
            font-size: 12px;
            color: ${COLORS.textLight};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 16px;
            font-weight: 600;
            color: ${COLORS.text};
            word-break: break-word;
        }
        .status {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status.success {
            background: ${COLORS.success};
            color: white;
        }
        .status.pending {
            background: ${COLORS.warning};
            color: white;
        }
        .status.failed {
            background: ${COLORS.error};
            color: white;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: ${COLORS.primary};
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .button:hover {
            background: #E59612;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(245, 166, 35, 0.3);
        }
        .footer {
            padding: 20px 24px;
            background: #F9FAFB;
            border-top: 1px solid ${COLORS.border};
            text-align: center;
            font-size: 12px;
            color: ${COLORS.textLight};
        }
        .amount {
            font-size: 32px;
            font-weight: 700;
            color: ${COLORS.primary};
            margin: 16px 0;
        }
        .link-box {
            background: ${COLORS.dark};
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
    </style>
`;

export interface TransactionUIData {
    status: string;
    amount: number;
    currency: string;
    tx_id: string;
    customer?: {
        name?: string;
        email?: string;
    };
    created_at?: string;
}

export interface CheckoutUIData {
    link: string;
    customer: {
        name: string;
        email: string;
    };
    amount: number;
    currency: string;
}

export interface TransferUIData {
    reference: string;
    amount: number;
    currency: string;
    beneficiary: {
        name?: string;
        account_number?: string;
        bank_name?: string;
    };
    status: string;
}

export function createTransactionUI(data: TransactionUIData) {
    const statusClass = data.status.toLowerCase() === 'successful' ? 'success' : 
                       data.status.toLowerCase() === 'pending' ? 'pending' : 'failed';
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transaction Details</title>
            ${baseStyles}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💳 Transaction Details</h1>
                    <p>Flutterwave Payment</p>
                </div>
                <div class="content">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div class="status ${statusClass}">${data.status}</div>
                    </div>
                    <div class="amount" style="text-align: center;">
                        ${data.currency} ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Transaction ID</div>
                            <div class="info-value">${data.tx_id}</div>
                        </div>
                        ${data.customer?.name ? `
                        <div class="info-item">
                            <div class="info-label">Customer Name</div>
                            <div class="info-value">${data.customer.name}</div>
                        </div>
                        ` : ''}
                        ${data.customer?.email ? `
                        <div class="info-item">
                            <div class="info-label">Customer Email</div>
                            <div class="info-value">${data.customer.email}</div>
                        </div>
                        ` : ''}
                        ${data.created_at ? `
                        <div class="info-item">
                            <div class="info-label">Created At</div>
                            <div class="info-value">${new Date(data.created_at).toLocaleString()}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="footer">
                    Powered by Flutterwave
                </div>
            </div>
        </body>
        </html>
    `;

    const uiResource = createUIResource({
        uri: `ui://transaction/${data.tx_id}` as URI,
        content: {
            type: 'rawHtml',
            htmlString: html,
        },
        encoding: 'text',
    });

    return uiResource.resource;
}

export function createCheckoutUI(data: CheckoutUIData) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Link Created</title>
            ${baseStyles}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔗 Payment Link Created</h1>
                    <p>Share this link with your customer</p>
                </div>
                <div class="content">
                    <div class="amount" style="text-align: center;">
                        ${data.currency} ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Customer Name</div>
                            <div class="info-value">${data.customer.name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Customer Email</div>
                            <div class="info-value">${data.customer.email}</div>
                        </div>
                    </div>
                    <div class="link-box">
                        ${data.link}
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="${data.link}" target="_blank" class="button">
                            Open Payment Link →
                        </a>
                    </div>
                </div>
                <div class="footer">
                    Powered by Flutterwave
                </div>
            </div>
        </body>
        </html>
    `;

    const uiResource = createUIResource({
        uri: `ui://checkout/${Date.now()}` as URI,
        content: {
            type: 'rawHtml',
            htmlString: html,
        },
        encoding: 'text',
    });

    return uiResource.resource;
}

export function createTransferUI(data: TransferUIData) {
    const statusClass = data.status.toLowerCase() === 'successful' ? 'success' : 
                       data.status.toLowerCase() === 'pending' ? 'pending' : 'failed';
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transfer Details</title>
            ${baseStyles}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💸 Transfer Details</h1>
                    <p>Flutterwave Transfer</p>
                </div>
                <div class="content">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div class="status ${statusClass}">${data.status}</div>
                    </div>
                    <div class="amount" style="text-align: center;">
                        ${data.currency} ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Reference</div>
                            <div class="info-value">${data.reference}</div>
                        </div>
                        ${data.beneficiary.name ? `
                        <div class="info-item">
                            <div class="info-label">Beneficiary Name</div>
                            <div class="info-value">${data.beneficiary.name}</div>
                        </div>
                        ` : ''}
                        ${data.beneficiary.account_number ? `
                        <div class="info-item">
                            <div class="info-label">Account Number</div>
                            <div class="info-value">${data.beneficiary.account_number}</div>
                        </div>
                        ` : ''}
                        ${data.beneficiary.bank_name ? `
                        <div class="info-item">
                            <div class="info-label">Bank Name</div>
                            <div class="info-value">${data.beneficiary.bank_name}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="footer">
                    Powered by Flutterwave
                </div>
            </div>
        </body>
        </html>
    `;

    const uiResource = createUIResource({
        uri: `ui://transfer/${data.reference}` as URI,
        content: {
            type: 'rawHtml',
            htmlString: html,
        },
        encoding: 'text',
    });

    return uiResource.resource;
}

export function createTimelineUI(tx_id: string, timeline: any) {
    // Format timeline data into HTML items
    let timelineItems = '';
    
    if (Array.isArray(timeline)) {
        timelineItems = timeline.map((item: any) => {
            const time = item.created_at || item.timestamp || item.time || 'N/A';
            const event = item.event || item.action || item.status || 'Event';
            const details = item.message || item.description || '';
            
            return `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-time">${new Date(time).toLocaleString()}</div>
                        <div class="timeline-event">${event}</div>
                        ${details ? `<div style="font-size: 14px; color: #666; margin-top: 4px;">${details}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } else if (typeof timeline === 'object' && timeline !== null) {
        // If timeline is an object, convert it to an array of entries
        timelineItems = Object.entries(timeline).map(([key, value]: [string, any]) => {
            return `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-event">${key}</div>
                        <div style="font-size: 14px; color: #666; margin-top: 4px;">${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        // Fallback to displaying the raw data
        timelineItems = `
            <div class="timeline-item">
                <div class="timeline-content">
                    <pre style="margin: 0; font-size: 12px; overflow-x: auto;">${JSON.stringify(timeline, null, 2)}</pre>
                </div>
            </div>
        `;
    }

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transaction Timeline</title>
            ${baseStyles}
            <style>
                .timeline {
                    position: relative;
                    padding-left: 30px;
                }
                .timeline-item {
                    position: relative;
                    padding-bottom: 24px;
                }
                .timeline-item:before {
                    content: '';
                    position: absolute;
                    left: -30px;
                    top: 8px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: ${COLORS.primary};
                    border: 3px solid white;
                    box-shadow: 0 0 0 2px ${COLORS.primary};
                }
                .timeline-item:after {
                    content: '';
                    position: absolute;
                    left: -24px;
                    top: 20px;
                    width: 2px;
                    height: calc(100% - 12px);
                    background: ${COLORS.border};
                }
                .timeline-item:last-child:after {
                    display: none;
                }
                .timeline-content {
                    background: #F9FAFB;
                    padding: 16px;
                    border-radius: 8px;
                }
                .timeline-time {
                    font-size: 12px;
                    color: ${COLORS.textLight};
                    margin-bottom: 8px;
                }
                .timeline-event {
                    font-weight: 600;
                    color: ${COLORS.text};
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 Transaction Timeline</h1>
                    <p>${tx_id}</p>
                </div>
                <div class="content">
                    <div class="timeline">
                        ${timelineItems}
                    </div>
                </div>
                <div class="footer">
                    Powered by Flutterwave
                </div>
            </div>
        </body>
        </html>
    `;

    const uiResource = createUIResource({
        uri: `ui://timeline/${tx_id}` as URI,
        content: {
            type: 'rawHtml',
            htmlString: html,
        },
        encoding: 'text',
    });

    return uiResource.resource;
}
