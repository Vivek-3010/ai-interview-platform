# IntervuX – AI-Based Mock Interview SaaS Platform

IntervuX is a full-stack, subscription-based SaaS application that simulates real-world mock interviews using AI. It combines speech recognition, video recording, and payment gating to provide personalized interview practice and feedback.

## 🚀 Features

- 🔐 **User Authentication** with Clerk
- 🎤 **Voice-to-Text Conversion** via `react-speech-recognition`
- 📹 **Video Recording & Storage** using Supabase
- 💬 **AI-Powered Q&A** and personalized feedback using Gemini API
- 🧠 **Dynamic Question Generation** based on user's job role, tech stack, and experience
- ⭐ **Per-Question & Overall Feedback Rating**
- 📊 **Interview History Dashboard** with ability to view feedback and delete sessions
- 💳 **Stripe Integration** for managing monthly and yearly subscription plans
  - Free users: Limited to 5 interviews
  - Paid users: Unlimited access
- 📱 Responsive design using Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React.js, Next.js, Tailwind CSS
- **Auth**: Clerk.dev
- **AI Integration**: Google Gemini API
- **Speech Recognition**: react-speech-recognition
- **Video & Storage**: Supabase
- **Payments**: Stripe + Webhooks
- **Database**: Supabase Postgres / Firebase / MongoDB (as used)
- **Deployment**: Vercel / Netlify

## 🧪 How It Works

1. Users sign up/sign in using Clerk.
2. Fill in job role, tech stack, and experience to begin.
3. Get 5 AI-generated interview questions.
4. Speak answers (converted to text), and video is recorded and stored.
5. After completion, AI gives detailed feedback and ratings.
6. Users can view and manage past interview sessions.
7. Subscription plans unlock more features using Stripe.

## 📸 Screenshots

> _[Add a few screenshots or GIFs here for visual impact]_

## 🧾 License

MIT License

## 📫 Contact

For questions or collaboration: vivekpandey6676@gmail.com


## ⚙️ Installation & Setup

1. Clone the repo  
```bash
git clone https://github.com/your-username/intervux.git
cd ai-interview

Install dependencies

npm install
# or
yarn install

Create .env.local file in root and add the following:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
NEXT_PUBLIC_GEMINI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
STRIPE_SECRET_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
WEBHOOK_SECRET=your_key

Run the development server

npm run dev