import { NextResponse } from 'next/server';
import db from '../../lib/mongodb';

export async function POST() {
  try {
    const result = await db.createNewSplit();
    
    return NextResponse.json({ 
      success: true, 
      data: result
    });
  } catch (error) {
    console.error('Error creating split:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create split' },
      { status: 500 }
    );
  }
}
