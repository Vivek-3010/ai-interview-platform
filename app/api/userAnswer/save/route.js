import connectMongoDB from "@/utils/db";
import UserAnswer from "@/models/UserAnswer";

export async function POST(req) {
  try {
    const body = await req.json();
    
    console.log("Received data in API:", body);
    
    const {
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      userEmail,
      videoUrl,
      questionIndex 
    } = body;

    if (!mockIdRef || !question || !userAns || !feedback || rating === undefined || !userEmail) {
      console.error("Missing required fields:", {
        mockIdRef: !!mockIdRef,
        question: !!question,
        userAns: !!userAns,
        feedback: !!feedback,
        rating: rating !== undefined,
        userEmail: !!userEmail
      });
      return new Response("Missing required fields", { status: 400 });
    }

    await connectMongoDB();

    const safeQuestionIndex = questionIndex !== undefined ? Number(questionIndex) : 0;

    const dataToSave = {
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating: Number(rating),
      userEmail,
      videoUrl: videoUrl || null,
      questionIndex: safeQuestionIndex
    };

    console.log("Data to save:", dataToSave);

    const saved = await UserAnswer.create(dataToSave);
    
    console.log("Successfully saved:", saved);

    return new Response(JSON.stringify({ 
      id: saved._id, 
      message: "Answer saved successfully",
      questionIndex: saved.questionIndex 
    }), { 
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (err) {
    console.error("UserAnswer Save Error:", err);
    return new Response(JSON.stringify({ 
      error: "Failed to save answer", 
      details: err.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}