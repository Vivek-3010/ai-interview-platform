// File: app/dashboard/interview/[interviewId]/page.jsx

import connectMongoDB from '@/utils/db';
import MockInterview from '@/models/MockInterview';
import InterviewClient from './interviewClient';

export default async function InterviewPage({ params }) {
  await connectMongoDB();

  const interview = await MockInterview.findOne({ mockId: params.interviewId }).lean();

  if (!interview) {
    return <div>Interview not found</div>;
  }

  const serializedInterview = {
    ...interview,
    _id: interview._id.toString(),
    createdAt: interview.createdAt.toString(),
    updatedAt: interview.updatedAt.toString()
};

  return <InterviewClient interview={serializedInterview} />;
}
