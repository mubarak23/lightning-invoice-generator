"use strict";
/**
 * Lightning Address Invoice Generator
 * Generates Lightning Network invoices from Lightning addresses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightningInvoiceGenerator = void 0;
exports.generateInvoice = generateInvoice;
class LightningInvoiceGenerator {
    /**
   * Fetches a Lightning invoice for the given Lightning address and amount
   * @param lightningAddress - Lightning address (e.g., user@domain.com)
   * @param amountSats - Amount in satoshis
   * @returns Lightning invoice (BOLT11 payment request)
   */
    async getInvoice(lightningAddress, amountSats) {
        // validate inputs
        this.validateLightningAddress(lightningAddress);
        this.validateAmount(amountSats);
        // Parse Lightning address
        const [username, domain] = lightningAddress.split('@');
        if (!username || !domain) {
            throw new Error('Invalid Lightning address format. Expected: user@domain.com');
        }
        try {
            // Fetch LNURL-pay endpoint
            const lnurlPayUrl = `https://${domain}/.well-known/lnurlp/${username}`;
            const lnurlResponse = await fetch(lnurlPayUrl);
            if (!lnurlResponse.ok) {
                throw new Error(`Failed to fetch LNURL endpoint: ${lnurlResponse.status}`);
            }
            const lnurlData = await lnurlResponse.json();
            const amountMillisats = amountSats * 1000;
            if (amountMillisats < lnurlData.minSendable) {
                throw new Error(`Amount too small. Minimum: ${lnurlData.minSendable / 1000} sats`);
            }
            if (amountMillisats > lnurlData.maxSendable) {
                throw new Error(`Amount too large. Maximum: ${lnurlData.maxSendable / 1000} sats`);
            }
            // Request invoice from callback
            const callbackUrl = new URL(lnurlData.callback);
            callbackUrl.searchParams.append('amount', amountMillisats.toString());
            const invoiceResponse = await fetch(callbackUrl.toString());
            if (!invoiceResponse.ok) {
                throw new Error(`Failed to fetch invoice: ${invoiceResponse.status}`);
            }
            const invoiceData = await invoiceResponse.json();
            if (!invoiceData.pr) {
                throw new Error('No payment request returned from Lightning address');
            }
            return invoiceData.pr;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Lightning invoice generation failed: ${error.message}`);
            }
            throw error;
        }
    }
    /**
     * Validates Lightning address format
    */
    validateLightningAddress(address) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(address)) {
            throw new Error('Invalid Lightning address format. Expected format: user@domain.com');
        }
    }
    /**
     * Validates amount is positive
     */
    validateAmount(amount) {
        if (!Number.isInteger(amount) || amount <= 0) {
            throw new Error('Amount must be a positive integer (satoshis)');
        }
    }
}
exports.LightningInvoiceGenerator = LightningInvoiceGenerator;
/**
 * Convenience function to generate a Lightning invoice
 * @param lightningAddress - Lightning address (e.g., user@domain.com)
 * @param amountSats - Amount in satoshis
 * @returns Lightning invoice (BOLT11 payment request)
 */
async function generateInvoice(lightningAddress, amountSats) {
    const generator = new LightningInvoiceGenerator();
    return generator.getInvoice(lightningAddress, amountSats);
}
