// iThinkLogistics API Helper
// Handles Pincode check and Order Creation (Prepaid & COD)

const BASE_URL = process.env.ITHINK_BASE_URL || 'https://pre-alpha.ithinklogistics.com/api_v3';
const ACCESS_TOKEN = process.env.ITHINK_ACCESS_TOKEN;
const SECRET_KEY = process.env.ITHINK_SECRET_KEY;
const PICKUP_ID = process.env.ITHINK_PICKUP_ID;

// Helper to check config
const checkConfig = () => {
    if (!ACCESS_TOKEN || !SECRET_KEY || !PICKUP_ID) {
        console.error("❌ iThinkLogistics Credentials Missing in .env.local");
        return false;
    }
    return true;
};

// 1. Check Pincode
export const checkPincodeServiceability = async (pincode: string) => {
    if (!checkConfig()) return { status: 'error', message: 'Config missing' };

    try {
        const payload = {
            data: {
                pincode: pincode,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/pincode/check.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        return await response.json();
    } catch (error) {
        console.error('Logistics API Error (Pincode):', error);
        return { status: 'error', message: 'Connection failed' };
    }
};

// 2. Create Shipment (Common for Razorpay & COD)
export const createShipment = async (order: any, paymentMode: 'Prepaid' | 'COD') => {
    if (!checkConfig()) return null;

    try {
        const orderDate = new Date().toISOString().split('T')[0];
        const isCOD = paymentMode === 'COD';

        // Address Parsing (Robustness for DB stored JSON vs Objects)
        let address = order.shipping_address;
        if (typeof address === 'string') {
            try {
                address = JSON.parse(address);
            } catch (e) {
                console.error("Failed to parse shipping address string:", e);
                // Fallback: if it's a string but fails parse, maybe used as is? Unlikely but safe to keep obj
            }
        }

        // Map Items (Handle both DB 'order_items' snake_case and Frontend 'cart' camelCase if needed)
        // DB: product_name, price_per_unit, quantity, product_id
        // Frontend: name, price, quantity, id
        const products = (order.items || []).map((item: any) => ({
            product_name: item.product_name || item.name || "Apparel Item",
            product_sku: item.product_id || item.id || 'SKU-GENERIC',
            product_quantity: item.quantity,
            product_price: item.price_per_unit || item.price || 0,
            product_tax_rate: 5,
            product_hsn_code: '6204',
            product_discount: 0
        }));

        const totalAmount = order.total_amount || order.total || 0;

        const payload = {
            data: {
                shipments: [
                    {
                        waybill: "",
                        order: order.id,
                        sub_order: "",
                        order_date: orderDate,
                        total_amount: totalAmount,
                        name: address.fullName || address.name || "Customer",
                        company_name: "NPlusOne Customer",
                        add: address.addressLine1 || address.street || address.address || "",
                        add2: address.addressLine2 || "",
                        add3: "",
                        pin: address.pincode || address.zip || address.pin || "",
                        city: address.city || "",
                        state: address.state || "",
                        country: "India",
                        phone: address.phoneNumber || address.phone || address.mobile || "",
                        alt_phone: "",
                        email: address.email || "support@nplusonefashion.com",
                        is_cod: isCOD,
                        payment_mode: paymentMode,
                        cod_amount: isCOD ? totalAmount : 0, // Only set if COD
                        products: products,

                        // Hardcoded Fashion Dimensions (as per user snippet)
                        shipment_length: 30,
                        shipment_width: 20,
                        shipment_height: 5,
                        shipment_weight: 0.5,

                        pickup_address_id: PICKUP_ID,
                        access_token: ACCESS_TOKEN,
                        secret_key: SECRET_KEY
                    }
                ],
                pickup_address_id: PICKUP_ID,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY
            }
        };

        console.log(`📦 Logistics Payload (${paymentMode}):`, JSON.stringify(payload, null, 2));

        const response = await fetch(`${BASE_URL}/order/add.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log(`📦 Logistics Response (${paymentMode}):`, JSON.stringify(result));
        return result;

    } catch (error) {
        console.error('Logistics Create Shipment Error:', error);
        return null;
    }
};

// Backwards compatibility alias if needed
export const checkPincode = checkPincodeServiceability;
