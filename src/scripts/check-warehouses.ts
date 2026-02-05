
// Scripts to check warehouses
import { getWarehouses } from '../lib/logistics';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

async function main() {
    console.log("Fetching Warehouses...");
    const result = await getWarehouses();

    if (result && result.data) {
        console.log("\n✅ Valid Warehouses Found:");
        result.data.forEach((w: any) => {
            console.log(`--------------------------------`);
            console.log(`ID:       ${w.warehouse_id}  <-- USE THIS ID`);
            console.log(`Name:     ${w.warehouse_name}`);
            console.log(`Address:  ${w.warehouse_address}`);
            console.log(`City:     ${w.warehouse_city}`);
            console.log(`Phone:    ${w.warehouse_phone}`);
        });
    } else {
        console.error("❌ Failed to fetch warehouses:", JSON.stringify(result, null, 2));
    }
}

main().catch(console.error);
