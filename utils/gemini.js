"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Generates mock interview questions
export async function testGemini(jobRole, jobDesc, jobExperience) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Generate 5 JSON objects. Each object should contain:
- "question": a technical or behavioral interview question
- "answer": a concise sample answer

The questions must be relevant to:
- Role: ${jobRole}
- Description: ${jobDesc}
- Experience: ${jobExperience}

Only output a JSON array like:
[
  {
    "question": "...",
    "answer": "..."
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "");
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini Error:", err);
  }
}

// Generates feedback & rating for the answer
export async function generateFeedback(question, answer) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//   const prompt = `
// You're an interview coach. Given a question and candidate's spoken answer, give feedback and a rating.

// Question: ${question}
// Answer: ${answer}

// Respond ONLY in this strict JSON format:
// {
//   "feedback": "constructive feedback (3-5 sentences)",
//   "rating": number (1 to 5, where 5 is excellent)
// }
// `;

  const prompt = `
    You are a kind and supportive interview coach.

    Given a question and a candidate's answer, provide:
    1. **Constructive feedback** (be honest but positive in tone).
    2. **A fair rating** between 1 to 5:
      - 5 = Excellent and complete
      - 4 = Good, minor improvements possible
      - 3 = Average, partially correct
      - 2 = Needs improvement, lacks depth or clarity
      - 1 = Attempted but lacks understanding or relevance

    ✨ Please consider clarity, effort, relevance, and partial correctness. Avoid being overly harsh. Give some credit even if the answer is brief.

    Question: ${question}
    Answer: ${answer}

    Now return your response ONLY in this strict JSON format:

    {
      "feedback": "Helpful, encouraging feedback (3-5 sentences)",
      "rating": number (1 to 5)
    }
    `;


  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini Feedback Error:", err);
    return null;
  }
}
