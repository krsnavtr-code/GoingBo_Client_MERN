import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to forward cookies from the client to the backend
function getForwardedHeaders(request) {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  
  // Forward cookies from the client request
  const cookie = request.headers.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }
  
  // Forward other necessary headers
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers.set('authorization', authHeader);
  }
  
  return headers;
}

export async function GET(request) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/profile`, {
      method: 'GET',
      headers: getForwardedHeaders(request),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Backend error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch profile' },
        { status: response.status }
      );
    }

    // If the response has a data property, use that, otherwise use the entire response
    const profileData = data.data || data;
    
    // Return the profile data directly, not wrapped in a data property
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/profile`, {
      method: 'PATCH',
      headers: getForwardedHeaders(request),
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to update profile',
          error: data.error
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
