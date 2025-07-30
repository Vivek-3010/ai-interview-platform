import connectMongoDB from "@/utils/db";
import MockInterview from "@/models/MockInterview";
import UserAnswer from "@/models/UserAnswer";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mockId = searchParams.get("mockId");

    await connectMongoDB();

    // Delete the mock interview
    await MockInterview.deleteOne({ mockId });

    // Delete all associated answers
    await UserAnswer.deleteMany({ mockIdRef: mockId });

    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response("Failed to delete interview", { status: 500 });
  }
}
