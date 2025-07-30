// app/api/interview/route.js
import MockInterview from "@/models/MockInterview";
import UserSubscription from "@/models/UserSubscription";
import connectMongoDB from "@/utils/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      mockId,
      jobPosition,
      jobDesc,
      jobExperience,
      jsonMockResp,
      createdBy,
    } = body;

    await connectMongoDB();

    // Check user's subscription status
    const subscription = await UserSubscription.findOne({ email: createdBy });
    
    if (!subscription?.isSubscribed && subscription?.projectCount >= 5) {
      return new Response(
        JSON.stringify({ 
          error: "Free project limit reached (5 projects). Please upgrade to premium." 
        }), 
        { status: 403 }
      );
    }

    const saved = await MockInterview.create({
      mockId,
      jobPosition,
      jobDesc,
      jobExperience,
      jsonMockResp,
      createdBy,
    });

    // Increment project count if user is not subscribed
    if (!subscription?.isSubscribed) {
      await UserSubscription.findOneAndUpdate(
        { email: createdBy },
        { $inc: { projectCount: 1 } },
        { new: true }
      );
    }

    return new Response(JSON.stringify({ mockId: saved.mockId }), { status: 201 });
  } catch (err) {
    console.error("DB Save Error:", err);
    return new Response(
      JSON.stringify({ error: "Error saving to DB" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    ); 
  }
}
