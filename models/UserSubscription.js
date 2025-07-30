// models/UserSubscription.js
import mongoose from 'mongoose';

const UserSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String,
    enum: ['monthly', 'yearly', null],
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  projectCount: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.UserSubscription || mongoose.model('UserSubscription', UserSubscriptionSchema);