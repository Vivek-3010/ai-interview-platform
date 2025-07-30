// app/api/userAnswer/get/route.js
import connectMongoDB from "@/utils/db";
import UserAnswer from "@/models/UserAnswer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mockId = searchParams.get("mockId");

    if (!mockId) {
      return new Response("Missing mockId parameter", { status: 400 });
    }

    await connectMongoDB();

    // Sort by createdAt (oldest first)
    const answers = await UserAnswer.find({ mockIdRef: mockId })
      .sort({ createdAt: 1 });

    return new Response(JSON.stringify(answers), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch feedback", 
      details: error.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}