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



            case 'trackOrder':
                result = await logistics.trackOrder(data.awbNumbers);
                break;

            case 'cancelOrder':
                result = await logistics.cancelOrder(data.awbNumbers);
                break;

            case 'printLabel':
                result = await logistics.printLabel(data.awbNumbers);
                break;

            case 'printManifest':
                result = await logistics.printManifest(data.awbNumbers);
                break;

            case 'printInvoice':
                result = await logistics.printInvoice(data.awbNumbers); // Using awbNumbers string/array handling in lib
                break;

            case 'syncOrder':
                result = await logistics.syncOrder(data.shipments);
                break;

            case 'updatePayment':
                result = await logistics.updatePayment(data.awb, data.codAmount, data.paymentType);
                break;

            case 'checkAWB':
                result = await logistics.checkAWB(data.fromDate, data.toDate);
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
