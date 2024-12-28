import { NextResponse } from 'next/server';

export function jsonResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
