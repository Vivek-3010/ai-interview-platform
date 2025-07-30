import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Branding Side */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-10 bg-gradient-to-br from-blue-800 to-gray-900">
        <img
          src="https://static.vecteezy.com/system/resources/previews/011/483/738/non_2x/podcast-logo-design-studio-table-microphone-with-broadcast-icon-design-free-vector.jpg"
          alt="IntervuX Logo"
          className="w-24 h-24 mb-6"
        />
        <h1 className="text-4xl font-bold text-white mb-4">Welcome Back to IntervuX</h1>
        <p className="text-lg text-blue-100 text-center max-w-md">
          Resume your AI-powered interview prep and boost your confidence for real interviews.
        </p>
        <img
          src="https://mir-s3-cdn-cf.behance.net/projects/404/e36b47225831127.Y3JvcCwxNjE2LDEyNjQsMCww.png"
          alt="AI Interview Illustration"
          className="w-80 mt-10"
        />
      </div>

      {/* Sign In Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-gray-100">
        <SignIn
          appearance={{
            elements: {
              card: "shadow-lg border rounded-xl bg-white p-6 w-full max-w-md",
              headerTitle: "text-2xl font-bold text-gray-800",
              headerSubtitle: "text-sm text-gray-600",
              formFieldInput:
                "w-full rounded-md border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              formButtonPrimary:
                "w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700",
              footerActionText: "text-sm text-gray-600",
              footerActionLink: "text-blue-600 hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}
