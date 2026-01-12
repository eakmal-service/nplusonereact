import { NextResponse } from 'next/server';
import { checkPincodeServiceability } from '@/lib/logistics';


export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Add a small delay to simulate a real API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get search parameters
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');

    if (!pincode) {
      return NextResponse.json(
        { error: 'Pincode is required' },
        { status: 400 }
      );
    }

    // Simple validation for demo purposes
    // In a real implementation, you would check against a database of valid pincodes
    const isValidFormat = pincode.length === 6 && /^\d+$/.test(pincode);

    if (!isValidFormat) {
      return NextResponse.json({
        available: false,
        message: 'Please enter a valid 6-digit pincode'
      });
    }

    // Check serviceability using real logistics API
    const logisticsResult = await checkPincodeServiceability(pincode);

    // Prepare log data
    const logData = {
      event_type: 'PINCODE_CHECK',
      url: request.url,
      request_data: { pincode },
      response_data: logisticsResult,
      user_agent: request.headers.get('user-agent') || 'unknown'
    };

    if (logisticsResult?.status === 'success' && logisticsResult?.data?.[pincode]) {
      const cityData = logisticsResult.data[pincode];
      const couriers = Object.values(cityData);
      const isAvailable = couriers.some((courier: any) =>
        courier.prepaid === 'Y' || courier.cod === 'Y'
      );

      // Log Success
      // Note: We use fetch here or redundant supabaseAdmin call. 
      // Since this is server-side, importing supabaseAdmin is better than fetch if available.
      // But let's reuse supabaseAdmin since we might not have `logger` setup for server-side nicely yet.
      const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
      await supabaseAdmin.from('system_logs').insert([{
        ...logData,
        status: isAvailable ? 'SUCCESS' : 'FAILURE',
        message: isAvailable ? 'Delivery Available' : 'No Courier Serviceable'
      }]);

      return NextResponse.json({
        available: isAvailable,
        message: isAvailable
          ? 'Delivery available to your location'
          : 'Sorry, delivery is not available in your area',
        details: cityData
      });
    }

    // Log Failure (API Error or Invalid Response)
    const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
    await supabaseAdmin.from('system_logs').insert([{
      ...logData,
      status: 'FAILURE',
      message: 'Logistics API returned invaild/no data'
    }]);

    return NextResponse.json({
      available: false,
      message: 'Sorry, delivery is not available in your area'
    });

  } catch (error) {
    console.error(`Error checking delivery for pincode:`, error);

    // Log Exception
    const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
    await supabaseAdmin.from('system_logs').insert([{
      event_type: 'PINCODE_CHECK',
      status: 'FAILURE',
      message: error instanceof Error ? error.message : 'Unknown Exception',
      request_data: { pincode: new URL(request.url).searchParams.get('pincode') },
      user_agent: request.headers.get('user-agent') || 'unknown'
    }]);

    return NextResponse.json(
      { error: 'Failed to check delivery availability' },
      { status: 500 }
    );
  }
}