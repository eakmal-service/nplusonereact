import { NextResponse } from 'next/server';

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
    
    // Mock validation logic: even pincodes are deliverable, odd are not
    const isDeliverable = parseInt(pincode) % 2 === 0;
    
    return NextResponse.json({
      available: isDeliverable,
      message: isDeliverable 
        ? 'Delivery available to your location' 
        : 'Sorry, delivery is not available in your area'
    });
  } catch (error) {
    console.error(`Error checking delivery for pincode:`, error);
    return NextResponse.json(
      { error: 'Failed to check delivery availability' },
      { status: 500 }
    );
  }
} 