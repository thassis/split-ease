import { NextResponse } from 'next/server';
import db from '../../../lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { shareId: string } }
) {
  try {
    const { shareId } = await params;
    const split = await db.getSplitByShareId(shareId);
    
    if (!split) {
      return NextResponse.json(
        { success: false, error: 'Split not found' },
        { status: 404 }
      );
    }
    
    const { _id, ...splitData } = split;
    
    return NextResponse.json({ 
      success: true, 
      data: { 
        id: _id.toString(),
        ...splitData
      } 
    });
  } catch (error) {
    console.error('Error fetching split:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch split' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { shareId: string } }
) {
  try {
    const { shareId } = await params;
    const updateData = await request.json();
    
    const updated = await db.updateSplit(shareId, updateData);
    
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Split not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { updated: true } 
    });
  } catch (error) {
    console.error('Error updating split:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update split' },
      { status: 500 }
    );
  }
}
