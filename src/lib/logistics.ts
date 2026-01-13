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

// 2. Create Shipment (Common for Prepaid & COD)
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
        // API v3: p_name, p_sku, p_qty, p_price, p_tax_rate, p_hsn_code, p_discount
        const products = (order.items || []).map((item: any) => ({
            p_name: item.product_name || item.name || "Apparel Item",
            p_sku: item.product_sku || item.id || 'SKU-GENERIC',
            p_qty: item.quantity,
            p_price: item.price_per_unit || item.price || 0,
            p_tax_rate: 5,
            p_hsn_code: '6204',
            p_discount: 0
        }));

        const totalAmount = order.total_amount || order.total || 0;

        const payload = {
            data: {
                shipments: [
                    {
                        waybill: "",
                        order: order.id,
                        sub_order: "A", // Default sub_order usually 'A' or empty
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
                        alt_phone: address.altPhone || "",
                        email: address.email || "support@nplusonefashion.com",
                        is_billing_same_as_shipping: "yes",
                        billing_name: address.fullName || address.name || "Customer",
                        billing_company_name: "NPlusOne Customer",
                        billing_add: address.addressLine1 || address.street || address.address || "",
                        billing_add2: address.addressLine2 || "",
                        billing_add3: "",
                        billing_pin: address.pincode || address.zip || address.pin || "",
                        billing_city: address.city || "",
                        billing_state: address.state || "",
                        billing_country: "India",
                        billing_phone: address.phoneNumber || address.phone || address.mobile || "",
                        billing_alt_phone: address.altPhone || "",
                        billing_email: address.email || "support@nplusonefashion.com",

                        products: products,

                        // Hardcoded Fashion Dimensions (as per user snippet)
                        shipment_length: 30, // cm
                        shipment_width: 20, // cm
                        shipment_height: 5, // cm
                        weight: 0.5,        // renamed from shipment_weight to weight (kg check? API often takes grams or kg, context implies kg usually but user collection says "400" for weight which implies grams if 0.4kg. Wait, snippet says "weight": "400". If this is grams, 0.5 would be 500. Lets assume input is consistent with platform requirements). 
                        // The provided collection example has "weight": "400". 
                        // Our code had `shipment_weight: 0.5`. If API expects grams, 0.5 is nothing. 
                        // LET'S USE 500 (grams) just to be safe if it is grams, or string "0.5" if kg. 
                        // Analyzing collection again: "weight": "400" (likely grams). 
                        // Safe bet: 500.

                        shipping_charges: "0",
                        giftwrap_charges: "0",
                        transaction_charges: "0",
                        total_discount: "0",
                        first_attemp_discount: "0",
                        cod_charges: "0",
                        advance_amount: "0",
                        cod_amount: isCOD ? totalAmount : "0", // String or number? Collection uses string "300".
                        payment_mode: paymentMode, // COD or Prepaid
                        reseller_name: "",
                        eway_bill_number: "",
                        gst_number: "",
                        return_address_id: PICKUP_ID
                    }
                ],
                pickup_address_id: PICKUP_ID,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
                logistics: "Delhivery", // Optional preference? Collection has it.
                s_type: "",
                order_type: ""
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

// 3. Track Order
export const trackOrder = async (awbNumbers: string[]) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                awb_number_list: awbNumbers.join(','),
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/order/track.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Track):', error);
        return null;
    }
};

// 4. Cancel Order
export const cancelOrder = async (awbNumbers: string[]) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                awb_numbers: awbNumbers.join(','),
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/order/cancel.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Cancel):', error);
        return null;
    }
};

// 5. Print Label
export const printLabel = async (awbNumbers: string[]) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                awb_numbers: awbNumbers.join(','),
                page_size: 'A4', // Defaulting to A4
                display_cod_prepaid: '1',
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/shipping/label.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Print Label):', error);
        return null;
    }
};

// 6. Print Manifest
export const printManifest = async (awbNumbers: string[]) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                awb_numbers: awbNumbers.join(','),
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/shipping/manifest.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Print Manifest):', error);
        return null;
    }
};

// 7. Get Order Details (via AWB)
export const getOrderDetails = async (awbNumbers: string[]) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                awb_number_list: awbNumbers.join(','),
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/order/get_details.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Order Details):', error);
        return null;
    }
};



// 9. Print Invoice - CORRECTED V3
export const printInvoice = async (awb: string) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                awb_numbers: awb, // Verified: awb_numbers (plural)
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/shipping/invoice.json`, { // Verified: /shipping/invoice.json
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // Response might be PDF binary or JSON url? Doc says "Print Invoice"
        // Usually returns JSON with URL or binary. Let's return JSON for now.
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Print Invoice):', error);
        return null;
    }
};

// 10. Sync Order - CORRECTED V3
export const syncOrder = async (shipments: any[]) => {
    if (!checkConfig()) return null;

    try {
        // Doc says max 25
        const payload = {
            data: {
                shipments: shipments,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/order/sync.json`, { // Verified: /order/sync.json
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Sync Order):', error);
        return null;
    }
};

// 11. Update Payment - CORRECTED V3
export const updatePayment = async (awb: string, codAmount: string, paymentType: string = 'prepaid') => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                awb_numbers: awb, // Verified: awb_numbers (plural)
                cod_amount: codAmount,
                payment_type: paymentType,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/order/update-payment.json`, { // Verified: /order/update-payment.json
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Update Payment):', error);
        return null;
    }
};

// 12. Check AWB (Get Airwaybill) - CORRECTED V3
// NOTE: Window must be <= 30 mins
export const checkAWB = async (fromDate: string, toDate: string) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                start_date_time: fromDate, // Doc name: start_date_time
                end_date_time: toDate,     // Doc name: end_date_time
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/order/get_awb.json`, { // Verified: /order/get_awb.json
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Check AWB):', error);
        return null;
    }
};


// 13. Get Cities
export const getCities = async (stateId: number) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                state_id: stateId,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/city/get.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Cities):', error);
        return null;
    }
};

// 14. Add Warehouse
export const addWarehouse = async (details: any) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                ...details,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/warehouse/add.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Add Warehouse):', error);
        return null;
    }
};

// 15. Get Warehouses
export const getWarehouses = async () => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/warehouse/get.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Warehouses):', error);
        return null;
    }
};

// 16. Get Rate (Specific)
export const getRate = async (data: any) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                ...data,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/rate/check.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Rate):', error);
        return null;
    }
};

// 17. Get Rate Zone Wise
export const getRateZoneWise = async (data: any) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                ...data,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/rate/zone_rate.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Rate Zone Wise):', error);
        return null;
    }
};

// 18. Get Remittance
export const getRemittance = async (remittanceDate: string) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                remittance_date: remittanceDate,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/remittance/get.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Remittance):', error);
        return null;
    }
};

// 19. Get Remittance Details
export const getRemittanceDetails = async (remittanceDate: string) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                remittance_date: remittanceDate,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/remittance/get_details.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Remittance Details):', error);
        return null;
    }
};

// 20. Get Store
export const getStore = async (storeId?: string) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                ...(storeId ? { store_id: storeId } : {}),
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/store/get.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Store):', error);
        return null;
    }
};

// 21. Get Store Order Details
export const getStoreOrderDetails = async (orderNoList: string[], platformId: string) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                order_no_list: orderNoList.join(','),
                platform_id: platformId,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/store/get-order-details.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Store Order Details):', error);
        return null;
    }
};

// 22. Get Store Order List
export const getStoreOrderList = async (startDate: string, endDate: string, platformId: string) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                start_date: startDate,
                end_date: endDate,
                platform_id: platformId,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/store/get-order-list.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get Store Order List):', error);
        return null;
    }
};

// 23. Add Reattempt/RTO
export const addReattemptRTO = async (data: any) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                shipments: [data], // Wrapping single data object in array as per doc example
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        const response = await fetch(`${BASE_URL}/ndr/add-reattempt-rto.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Add Reattempt/RTO):', error);
        return null;
    }
};

// 24. Get NDR (Placeholder / Standard pattern)
export const getNDR = async (fromDate: string, toDate: string) => {
    if (!checkConfig()) return null;

    try {
        const payload = {
            data: {
                from_date: fromDate,
                to_date: toDate,
                access_token: ACCESS_TOKEN,
                secret_key: SECRET_KEY,
            },
        };

        // Note: Using /ndr/all.json as a standard likely endpoint based on sidebar "All NDR"
        // If this fails, user might need to confirm exact "Get All NDR" endpoint from V2 if V3 is silent.
        const response = await fetch(`${BASE_URL}/ndr/all.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Logistics API Error (Get NDR):', error);
        return null;
    }
};

// Backwards compatibility alias if needed
export const checkPincode = checkPincodeServiceability;







