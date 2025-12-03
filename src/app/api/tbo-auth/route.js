import { getAuthToken } from "@/server/utils/tboAuth";

export async function GET() {
  try {
    const authData = await getAuthToken();
    return Response.json({
      success: true,
      data: authData,
    });
  } catch (error) {
    console.error("TBO Auth Error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to authenticate with TBO API",
      },
      { status: 500 }
    );
  }
}
