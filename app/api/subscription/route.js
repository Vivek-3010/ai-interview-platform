// app/api/user/subscription/route.js
import connectMongoDB from "@/utils/db";
import UserSubscription from "@/models/UserSubscription";

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
        userId: email, // You might want to use Clerk's userId here
        isSubscribed: false,
        projectCount: 0
      });
    }

    return new Response(JSON.stringify(subscription), { status: 200 });
  } catch (error) {
      console.error("Error fetching subscription:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch subscription" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
  });

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

    return new Response(JSON.stringify(subscription), { status: 200 });
  } catch (error) {
      console.error("Error updating subscription:", error);
      return new Response(JSON.stringify({ error: "Failed to update subscription" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
  });

  }
}