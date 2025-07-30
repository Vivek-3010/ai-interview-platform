// app/api/user/subscription/route.js
import connectMongoDB from "@/utils/db";
import UserSubscription from "@/models/UserSubscription";
import { NextResponse } from "next/server"; // ✅ ADD THIS

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    await connectMongoDB();

    let subscription = await UserSubscription.findOne({ email });

    if (!subscription) {
      // Create a new subscription record if it doesn't exist
      subscription = await UserSubscription.create({
        email,
        userId: email, // Replace with Clerk userId if needed
        isSubscribed: false,
        projectCount: 0,
        subscriptionType: "None", // Add default type if not set
      });
    }

    return NextResponse.json(subscription); // ✅ PROPER JSON RESPONSE
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { email, isSubscribed, subscriptionType, stripeCustomerId } = await req.json();

    await connectMongoDB();

    const subscription = await UserSubscription.findOneAndUpdate(
      { email },
      { isSubscribed, subscriptionType, stripeCustomerId },
      { new: true, upsert: true }
    );

    return NextResponse.json(subscription); // ✅ PROPER JSON RESPONSE
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
