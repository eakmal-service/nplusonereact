import { NextResponse } from 'next/server';
import * as logistics from '@/lib/logistics';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, data } = body;

        if (!action) {
            return NextResponse.json({ status: 'error', message: 'Action is required' }, { status: 400 });
        }

        let result;

        switch (action) {
            case 'checkPincode':
                result = await logistics.checkPincodeServiceability(data.pincode);
                break;

            case 'getRate':
                result = await logistics.getRate(data); // data contains from_pincode, weight, etc.
                break;

            case 'getWarehouses':
                result = await logistics.getWarehouses();
                break;

            case 'addWarehouse':
                result = await logistics.addWarehouse(data);
                break;

            case 'getNDR':
                result = await logistics.getNDR(data.fromDate, data.toDate);
                break;

            case 'addReattemptRTO':
                result = await logistics.addReattemptRTO(data);
                break;

            case 'getRemittance':
                result = await logistics.getRemittance(data.date);
                break;

            case 'getStore':
                result = await logistics.getStore(data.storeId);
                break;

            default:
                return NextResponse.json({ status: 'error', message: `Invalid action: ${action}` }, { status: 400 });
        }

        return NextResponse.json(result || { status: 'error', message: 'Operation failed' });

    } catch (error) {
        console.error('Admin Logistics API Error:', error);
        return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
    }
}
