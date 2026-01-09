# Lightning Invoice Generator

Generate Lightning Network invoices from Lightning addresses.

## Installation
```bash
npm install lightning-invoice-generator
```

## Usage
```typescript
import { generateInvoice } from 'lightning-invoice-generator';

const invoice = await generateInvoice('user@getalby.com', 1000);
console.log('Invoice:', invoice);
```

## API

### `generateInvoice(lightningAddress: string, amountSats: number): Promise<string>`

Returns a BOLT11 Lightning invoice.

## License

MIT