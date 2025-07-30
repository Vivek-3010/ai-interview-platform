
import connectMongoDB from '@/utils/db';
import MockInterview from '@/models/MockInterview';
import ClientStartInterviewWrapper from './ClientStartInterviewWrapper';

export default async function StartInterviewPage({ params }) {
  await connectMongoDB();

  const interview = await MockInterview.findOne({ mockId: params.interviewId }).lean();

  if (!interview) {
    return <div>Interview not found</div>;
  }

  const serializedInterview = {
    ...interview,
    _id: interview._id.toString(),
    createdAt: interview.createdAt.toString(),
    updatedAt: interview.updatedAt.toString(),
  };

  return <ClientStartInterviewWrapper interview={serializedInterview} />;
}
