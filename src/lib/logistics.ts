import axios from 'axios';

// Interfaces for Type Safety
interface LogisticsConfig {
    baseUrl: string;
    accessToken: string;
    secretKey: string;
    pickupId: string;
}

const config: LogisticsConfig = {
    baseUrl: process.env.ITHINK_BASE_URL!,
    accessToken: process.env.ITHINK_ACCESS_TOKEN!,
    secretKey: process.env.ITHINK_SECRET_KEY!,
    pickupId: process.env.ITHINK_PICKUP_ID!,
};

// Helper to format date
const formatDate = (date: Date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

export async function checkPincode(pincode: string) {
    try {
        const response = await axios.post(`${config.baseUrl}/pincode/check.json`, {
            data: {
                pincode: pincode,
                access_token: config.accessToken,
                secret_key: config.secretKey,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Logistics: Pincode Check Error', error);
        return null;
    }
}

export async function createShipment(order: any) {
    try {
        // 1. Prepare Order Items
        // Ensure items are loaded. If using 'create-order', they might be in a different structure.
        // The snippet assumes 'order.items' is populated.
        const orderItems = order.items || [];

        // Calculate total weight (Fallback to 0.5kg if unknown)
        const totalWeight = orderItems.reduce((acc: number, item: any) => acc + (item.quantity * 0.5), 0); // Placeholder weight logic

        // Calculate Product Value and Tax
        // This logic depends on your tax rules. Simplified here.
        const productValue = order.total_amount;

        // Address Parsing
        // order.shipping_address could be JSON object or string
        let address = order.shipping_address;
        if (typeof address === 'string') {
            try {
                address = JSON.parse(address);
            } catch (e) {
                console.error("Failed to parse shipping address", e);
                return null;
            }
        }

        const payload = {
            data: {
                shipments: [
                    {
                        // Core Auth
                        access_token: config.accessToken,
                        secret_key: config.secretKey,

                        // Order Details
                        waybill: "", // Empty for auto-generate
                        order: order.id,
                        sub_order: "",
                        order_date: formatDate(new Date(order.created_at || Date.now())),
                        total_amount: order.total_amount,
                        name: address.fullName || address.name,
                        company_name: "NPlusOne Fashion",
                        add: address.addressLine1 || address.street,
                        add2: address.addressLine2 || "",
                        add3: "",
                        pin: address.pincode || address.zip,
                        city: address.city,
                        state: address.state,
                        country: "India",
                        phone: address.phone || address.mobile,
                        alt_phone: "",
                        email: address.email,

                        // Shipment Details
                        is_cod: order.payment_method === 'COD' ? "yes" : "no",
                        cod_amount: order.payment_method === 'COD' ? order.total_amount : 0,
                        weight: totalWeight,
                        quantity: orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
                        products_desc: "Apparel", // Generic description

                        // Pickup Details
                        pickup_address_id: config.pickupId,

                        // Return Address (Optional/Same as Pickup)
                        // r_add: ...

                        // Products List
                        products: orderItems.map((item: any) => ({
                            product_name: item.product_name || item.product?.title || "Item",
                            product_qty: item.quantity,
                            product_price: item.price_per_unit || item.product?.salePrice || 0,
                            product_tax_rate: 0, // Set tax rate if available
                            product_hsn_code: "", // Set HSN if available
                            product_discount: 0
                        }))
                    }
                ],
                pickup_address_id: config.pickupId,
                access_token: config.accessToken,
                secret_key: config.secretKey,
            }
        };

        console.log("Logistics: Creating Shipment Payload", JSON.stringify(payload, null, 2));

        const response = await axios.post(`${config.baseUrl}/order/add.json`, payload);

        console.log("Logistics: Response", response.data);

        // Parse response
        // iThinkLogistics returns { status: 'success', data: { ... } }
        // If multiple shipments, data might be an object with keys as reference numbers?
        // Snippet assumes: const shipmentData = shippingResult.data?.[1] || {};

        return response.data;

    } catch (error) {
        console.error('Logistics: Create Shipment Error', error);
        return null;
    }
}
