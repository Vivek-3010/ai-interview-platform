// models/UserAnswer.js
import mongoose from 'mongoose';

const UserAnswerSchema = new mongoose.Schema(
  {
    mockIdRef: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    correctAns: {
      type: String,
      required: true,
    },
    userAns: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    userEmail: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: null,
    }
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
  }
);

// Add index for better performance
UserAnswerSchema.index({ mockIdRef: 1, createdAt: 1 });

export default mongoose.models.UserAnswer || mongoose.model('UserAnswer', UserAnswerSchema);