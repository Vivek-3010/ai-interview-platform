import connectMongoDB from "@/utils/db";
import MockInterview from "@/models/MockInterview";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    await connectMongoDB();

    const interviews = await MockInterview.find({ createdBy: email }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(interviews), { status: 200 });
  } catch (error) {
    console.error("Error fetching history:", error);
    return new Response("Failed to fetch history", { status: 500 });
  }
}
