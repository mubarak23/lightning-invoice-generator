/**
 * Lightning Address Invoice Generator
 * Generates Lightning Network invoices from Lightning addresses
 */
interface LnurlPayResponse {
    callback: string;
    maxSendable: number;
    minSendable: number;
    tag: string;
    metadata: string;
}
interface InvoiceResponse {
    pr: string;
    routes: [];
}
export declare class LightningInvoiceGenerator {
    /**
   * Fetches a Lightning invoice for the given Lightning address and amount
   * @param lightningAddress - Lightning address (e.g., user@domain.com)
   * @param amountSats - Amount in satoshis
   * @returns Lightning invoice (BOLT11 payment request)
   */
    getInvoice(lightningAddress: string, amountSats: number): Promise<string>;
    /**
     * Validates Lightning address format
    */
    private validateLightningAddress;
    /**
     * Validates amount is positive
     */
    private validateAmount;
}
/**
 * Convenience function to generate a Lightning invoice
 * @param lightningAddress - Lightning address (e.g., user@domain.com)
 * @param amountSats - Amount in satoshis
 * @returns Lightning invoice (BOLT11 payment request)
 */
export declare function generateInvoice(lightningAddress: string, amountSats: number): Promise<string>;
export type { LnurlPayResponse, InvoiceResponse };
