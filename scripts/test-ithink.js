require('dotenv').config({ path: '.env.local' });
// Using global fetch (Node 18+)
const myFetch = fetch;

const BASE_URL = process.env.ITHINK_BASE_URL || 'https://pre-alpha.ithinklogistics.com/api_v3';
const ACCESS_TOKEN = process.env.ITHINK_ACCESS_TOKEN;
const SECRET_KEY = process.env.ITHINK_SECRET_KEY;
const PICKUP_ID = process.env.ITHINK_PICKUP_ID;

console.log('Testing iThinkLogistics Configuration:');
console.log('URL:', BASE_URL);
console.log('Access Token Present:', !!ACCESS_TOKEN);
console.log('Secret Key Present:', !!SECRET_KEY);
console.log('Pickup ID:', PICKUP_ID);

async function testCreateShipment() {
    const orderDate = new Date().toISOString().split('T')[0];
    // Dummy Order Data mimicking Hanzala's order
    const payload = {
        data: {
            shipments: [
                {
                    waybill: "",
                    order: `TEST-${Date.now()}`, // Unique ID
                    sub_order: "A",
                    order_date: orderDate,
                    total_amount: 100,
                    name: "Hanzala Qureshi",
                    company_name: "NPlusOne Customer",
                    add: "Nana Varachha",
                    add2: "",
                    add3: "",
                    pin: "395006",
                    city: "Surat",
                    state: "Gujarat",
                    country: "India",
                    phone: "9824270999",
                    alt_phone: "",
                    email: "hanzalaq63@gmail.com",
                    is_billing_same_as_shipping: "yes",
                    billing_name: "Hanzala Qureshi",
                    billing_company_name: "NPlusOne Customer",
                    billing_add: "Nana Varachha",
                    billing_add2: "",
                    billing_add3: "",
                    billing_pin: "395006",
                    billing_city: "Surat",
                    billing_state: "Gujarat",
                    billing_country: "India",
                    billing_phone: "9824270999",
                    billing_alt_phone: "",
                    billing_email: "hanzalaq63@gmail.com",

                    products: [
                        {
                            product_name: "Test Product",
                            product_sku: "TEST-SKU-001",
                            product_quantity: "1",
                            product_price: "100",
                            product_tax_rate: "5",
                            product_hsn_code: "6204",
                            product_discount: "0"
                        }
                    ],

                    shipment_length: 30,
                    shipment_width: 20,
                    shipment_height: 5,
                    weight: 0.5,

                    shipping_charges: "0",
                    giftwrap_charges: "0",
                    transaction_charges: "0",
                    total_discount: "0",
                    first_attemp_discount: "0",
                    cod_charges: "0",
                    advance_amount: "0",
                    cod_amount: "100",
                    payment_mode: "COD",
                    reseller_name: "",
                    eway_bill_number: "",
                    gst_number: "",
                    return_address_id: PICKUP_ID
                }
            ],
            pickup_address_id: PICKUP_ID,
            access_token: ACCESS_TOKEN,
            secret_key: SECRET_KEY,
            logistics: "Delhivery",
            s_type: "",
            order_type: ""
        }
    };

    console.log('\nSending Payload...');
    try {
        const response = await myFetch(`${BASE_URL}/order/add.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const text = await response.text();
        console.log('Response Status:', response.status);
        console.log('Response Body:', text);
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testCreateShipment();
