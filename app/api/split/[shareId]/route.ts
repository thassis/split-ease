import { NextResponse, NextRequest } from 'next/server';
import db from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const shareId = request.nextUrl.pathname.split('/').pop(); // or parse via URL pattern

    if (!shareId) {
      return NextResponse.json(
        { success: false, error: 'Missing shareId' },
        { status: 400 }
      );
    }

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
        ...splitData,
      },
    });
  } catch (error) {
    console.error('Error fetching split:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch split' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const shareId = request.nextUrl.pathname.split('/').pop();

    if (!shareId) {
      return NextResponse.json(
        { success: false, error: 'Missing shareId' },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    const updated = await db.updateSplit(shareId, updateData);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Split not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { updated: true },
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error updating split:', err);

    if (err instanceof SyntaxError && err.message.includes('JSON')) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update split' },
      { status: 500 }
    );
  }
}
