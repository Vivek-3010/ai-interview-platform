// app/api/mock/save/route.js
import connectMongoDB from "@/utils/db";
import MockInterview from "@/models/MockInterview";
import UserSubscription from "@/models/UserSubscription";

export async function POST(req) {
  try {
    // First establish the database connection
    await connectMongoDB();
    
    const body = await req.json();
    const {
      mockId,
      jobPosition,
      jobDesc,
      jobExperience,
      jsonMockResp,
      createdBy,
    } = body;

    // Validate required fields
    if (!mockId || !jobPosition || !jobDesc || !jobExperience || !jsonMockResp || !createdBy) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check user's subscription status
    let subscription = await UserSubscription.findOne({ email: createdBy });
    
    // Create subscription record if it doesn't exist
    if (!subscription) {
      subscription = await UserSubscription.create({
        email: createdBy,
        isSubscribed: false,
        projectCount: 0,
        subscriptionType: 'free'
      });
    }
    
    if (!subscription.isSubscribed && subscription.projectCount >= 5) {
      return new Response(
        JSON.stringify({ 
          error: "Free project limit reached (5 projects). Please upgrade to premium.",
          projectCount: subscription.projectCount,
          limit: 5
        }), 
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the mock interview
    const saved = await MockInterview.create({
      mockId,
      jobPosition,
      jobDesc,
      jobExperience,
      jsonMockResp,
      createdBy,
    });

    // Increment project count if user is not subscribed
    if (!subscription.isSubscribed) {
      await UserSubscription.findOneAndUpdate(
        { email: createdBy },
        { $inc: { projectCount: 1 } },
        { new: true, upsert: true }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        mockId: saved.mockId,
        message: "Mock interview created successfully"
      }), 
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("API Error Details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });

    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      return new Response(
        JSON.stringify({ 
          error: "Validation error", 
          details: err.message 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (err.code === 11000) {
      return new Response(
        JSON.stringify({ 
          error: "Mock interview with this ID already exists" 
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}