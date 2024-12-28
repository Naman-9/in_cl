import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || ''; 

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if(!token){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});

    }

    try {
        jwt.verify(token, JWT_SECRET);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.json({error: "Invalid Token"}, {status: 401});
        
    }
}

// apply middleware to specific routes

export const config = {
    matcher: ["/api/posts/:path"]
}