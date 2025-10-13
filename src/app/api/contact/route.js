import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || 'Failed to submit form' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while submitting the form' },
            { status: 500 }
        );
    }
}