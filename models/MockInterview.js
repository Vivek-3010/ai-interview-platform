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

// Check if the model already exists to prevent recompilation
let MockInterview;
try {
  MockInterview = mongoose.model('MockInterview');
} catch {
  MockInterview = mongoose.model('MockInterview', MockInterviewSchema);
}

export default MockInterview;