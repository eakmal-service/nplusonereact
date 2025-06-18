import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // In production, validate against your database
    const user = { id: 1, email, role: 'user' };
    
    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}