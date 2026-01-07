import React from 'react';
import Image from 'next/image';

interface InvoiceProps {
    order: any;
    items: any[];
    user: any;
}

const InvoiceTemplate: React.FC<InvoiceProps> = ({ order, items, user }) => {
    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // --- GST Calculation Logic (Inclusive) ---
    // Formula: Base = Inclusive / (1 + Rate/100)
    const calculateBreakdown = (item: any) => {
        const inclusivePrice = item.price_per_unit;
        const gstRate = item.gst_percentage || 5; // Default to 5% if missing

        // Derived values
        const basePrice = inclusivePrice / (1 + gstRate / 100);
        const taxAmountPerUnit = inclusivePrice - basePrice;

        const totalBase = basePrice * item.quantity;
        const totalTax = taxAmountPerUnit * item.quantity;
        const totalInclusive = inclusivePrice * item.quantity;

        return {
            basePrice,
            taxAmountPerUnit,
            totalBase,
            totalTax,
            totalInclusive
        };
    };

    // Calculate totals
    let invoiceSubtotalBase = 0;
    let invoiceTotalTax = 0;

    const processedItems = items.map(item => {
        const breakdown = calculateBreakdown(item);
        invoiceSubtotalBase += breakdown.totalBase;
        invoiceTotalTax += breakdown.totalTax;
        return { ...item, ...breakdown };
    });

    const shippingCost = Number(order.shipping_cost) || 0;
    // Shipping typically also has GST, but we'll treat it simple or as inclusive if needed.
    // For now, adding it directly to the total check.

    // Grand Total from Order (which is truth)
    const grandTotal = Number(order.total_amount);

    return (
        <div className="text-black p-8 font-sans print:p-0">

            {/* 1. Header with Logo & Title */}
            <div className="flex justify-between items-center mb-0">
                {/* Logo */}
                <div className="relative w-[300px] h-[120px] flex-shrink-0">
                    <Image
                        src="/images/NPlusOne logo.svg"
                        alt="NPlusOne Fashion"
                        fill
                        className="object-contain object-left"
                    />
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-extrabold text-black tracking-wider border-b-2 border-black pb-1 inline-block">TAX INVOICE</h2>
                    <div className="mt-2 text-sm font-semibold">
                        <p>Invoice No: <span className="font-mono">INV-{order.id.slice(0, 8).toUpperCase()}</span></p>
                        <p>Date: {formatDate(order.created_at)}</p>
                    </div>
                </div>
            </div>

            {/* MAIN BOX CONTAINER */}
            <div className="border-2 border-black">

                {/* 2. Addresses Row (Sold By / Ship To) */}
                <div className="flex border-b-2 border-black divide-x-2 divide-black">

                    {/* SOLD BY (Company Details) */}
                    <div className="w-1/2 p-4">
                        <h3 className="font-bold text-black uppercase mb-3 text-lg underline decoration-2 underline-offset-4">SOLD BY</h3>
                        <div className="text-sm font-medium space-y-1 text-black leading-snug">
                            <p className="font-bold text-base uppercase">NPLUSONE FASHION</p>
                            <p className="whitespace-pre-line">First Floor, Plot No. 17, Hariichcha Ind Co-Op Hou Soc Ltd,<br />Opp Patco Ceramic Road No. 24,<br />Udhana Magdalla Road, Surat,<br />SURAT, GUJARAT, IN, 394210</p>
                            <div className="mt-3 space-y-1">
                                <p>GSTIN: <span className="font-bold">24JMPPS6289M1ZQ</span></p>
                                <p>Phone: +91 8329208323</p>
                                <p>Email: nplusonefashion@gmail.com</p>
                                <p>Website: www.nplusonefashion.com</p>
                            </div>
                        </div>
                    </div>

                    {/* SHIP TO (Customer Details) */}
                    <div className="w-1/2 p-4">
                        <h3 className="font-bold text-black uppercase mb-3 text-lg underline decoration-2 underline-offset-4">SHIP TO</h3>
                        <div className="text-sm font-medium space-y-1 text-black leading-snug">
                            <p className="font-bold text-base uppercase">{order.shipping_address?.fullName}</p>
                            <p>{order.shipping_address?.address}</p>
                            {order.shipping_address?.streetAddress && <p>{order.shipping_address?.streetAddress}</p>}
                            <p>{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.zip || order.shipping_address?.postalCode}</p>
                            <p className="mt-2 text-black">Email: {order.shipping_address?.email}</p>
                            <p>Phone: {order.shipping_address?.contact || order.shipping_address?.phoneNumber}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Product Table */}
                <div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-xs font-bold uppercase tracking-wider text-black border-b-2 border-black">
                                <th className="pt-0 pb-2 px-3 border-r border-black w-[35%]">ITEM DESCRIPTION</th>
                                <th className="pt-0 pb-2 px-3 border-r border-black text-center w-[10%]">HSN</th>
                                <th className="pt-0 pb-2 px-3 border-r border-black text-center w-[15%]">DETAILS</th>
                                <th className="pt-0 pb-2 px-3 border-r border-black text-center w-[10%]">QTY</th>
                                <th className="pt-0 pb-2 px-3 border-r border-black text-right w-[15%]">UNIT PRICE<br /><span className="text-[10px]">(BASE)</span></th>
                                <th className="pt-0 pb-2 px-3 text-right w-[15%]">TOTAL<br /><span className="text-[10px]">(BASE)</span></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-black divide-y divide-black">
                            {processedItems.map((item, index) => (
                                <tr key={index} className="divide-x divide-black">
                                    <td className="py-3 px-3 align-top">
                                        <p className="font-bold">{item.product_name}</p>
                                        <p className="text-xs text-gray-600 mt-1">{item.brand_name || 'NPlusOne'}</p>
                                    </td>
                                    <td className="py-3 px-3 text-center align-top font-mono">
                                        {item.hsn_code || '6204'}
                                    </td>
                                    <td className="py-3 px-3 text-center align-top">
                                        {item.selected_size && <div className="text-xs"><span className="font-semibold">Size:</span> {item.selected_size}</div>}
                                        {item.selected_color && <div className="text-xs"><span className="font-semibold">Color:</span> {item.selected_color}</div>}
                                    </td>
                                    <td className="py-3 px-3 text-center align-top font-bold">
                                        {item.quantity}
                                    </td>
                                    <td className="py-3 px-3 text-right align-top">
                                        {formatCurrency(item.basePrice)}
                                    </td>
                                    <td className="py-3 px-3 text-right align-top font-bold">
                                        {formatCurrency(item.totalBase)}
                                    </td>
                                </tr>
                            ))}
                            {/* Empty rows filler if needed, but keeping it clean for now */}
                        </tbody>
                    </table>
                </div>

                {/* 4. Payment Breakdown & Footer Area */}
                <div className="flex border-t-2 border-black divide-x-2 divide-black">

                    {/* Left Side: Term & Conditions / Sign */}
                    <div className="w-[60%] p-4 flex flex-col justify-between">
                        <div className="text-xs text-gray-600">
                            <p className="font-bold text-black mb-1 underline">Terms & Conditions:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Goods once sold will not be taken back unless defective.</li>
                                <li>Subject to Surat Jurisdiction only.</li>
                                <li>This is a computer-generated invoice.</li>
                            </ul>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="font-bold text-black border-t border-black inline-block px-8 pt-1">Authorized Signatory</p>
                        </div>
                    </div>

                    {/* Right Side: Totals */}
                    <div className="w-[40%]">
                        <div className="divide-y divide-gray-300">
                            <div className="flex justify-between px-4 py-2 text-sm">
                                <span>Subtotal (Excl. Tax):</span>
                                <span className="font-medium">{formatCurrency(invoiceSubtotalBase)}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 text-sm">
                                <span>Shipping Charges:</span>
                                <span className="font-medium text-green-700">{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2 text-sm bg-gray-50">
                                <span>Total GST (Tax):</span>
                                <span className="font-medium">{formatCurrency(invoiceTotalTax)}</span>
                            </div>
                            <div className="flex justify-between px-4 py-3 text-lg font-bold bg-black text-white print:bg-gray-800 print:text-white">
                                <span>Grand Total:</span>
                                <span>{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>
                        <div className="px-4 py-2 text-center text-[10px] text-gray-500 italic border-t border-gray-300">
                            (Inclusive of all taxes)
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-8 text-center text-xs text-gray-500 print:hidden">
                <p>Thank you for shopping with NPlusOne Fashion!</p>
            </div>

        </div>
    );
};

export default InvoiceTemplate;
