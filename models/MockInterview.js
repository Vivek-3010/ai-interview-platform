import mongoose from 'mongoose';

const MockInterviewSchema = new mongoose.Schema({
  jsonMockResp: {
    type: String,
    required: true,
  },
  jobPosition: {
    type: String,
    required: true,
  },
  jobDesc: {
    type: String,
    required: true,
  },
  jobExperience: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  mockId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true 
});

export default mongoose.models.MockInterview || mongoose.model('MockInterview', MockInterviewSchema);
