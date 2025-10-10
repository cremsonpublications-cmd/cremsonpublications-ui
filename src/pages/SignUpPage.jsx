import React from "react";
import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import websiteLogo from "../assets/CP-Logo.png";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Website Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <img
              src={websiteLogo}
              alt="Cremson Publications"
              className="max-w-[150px] h-auto"
            />
          </Link>
        </div>

        {/* Clerk SignUp Component */}
        <div className=" p-8 pt-[20px]">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-red-500 hover:bg-red-600 text-white border-0 rounded-md",
                footerActionLink: "text-red-500 hover:text-red-600 font-medium",
                identityPreviewEditButton: "text-red-500 hover:text-red-600",
                formFieldInput:
                  "border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-md",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-sm",
                socialButtonsBlockButton:
                  "border-gray-300 hover:bg-gray-50 rounded-md",
                socialButtonsBlockButtonText: "text-gray-700",
                card: "shadow-none border-0",
                headerTitle: "text-gray-900 text-xl font-bold mb-2",
                headerSubtitle: "text-gray-600 text-sm mb-4",
                socialButtonsProviderIcon: "filter-none",
                formFieldLabel: "text-gray-700 font-medium",
                footerActionText: "text-gray-600",
              },
            }}
            redirectUrl={window.location.origin}
            afterSignUpUrl="/"
            signInUrl="/signin"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
