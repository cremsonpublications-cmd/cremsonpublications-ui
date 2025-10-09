import { Button } from "@/components/ui/button";
import InputGroup from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "sonner";

const NewsLetterSection = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      const scriptURL = "https://script.google.com/macros/s/AKfycbyfjBrM7Nu4sqVB1VHJySUT7XnR85WMLv5JaS4qWajhslSfJP57n_D6ApS0qbV5bA9K/exec";
      
      const payload = {
        email: email,
      };

      const formBody = new URLSearchParams(payload).toString();

      try {
        console.log("Sending email:", email);
        console.log("Form body:", formBody);
        
        const response = await fetch(scriptURL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody,
        });

        console.log("Response status:", response.status);
        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (response.ok && responseText === "Success") {
          toast.success("Successfully subscribed to newsletter!");
          setEmail("");
          setErrors({});
        } else {
          toast.error("Failed to subscribe. Please try again.");
          console.error("Response not successful:", responseText);
        }
      } catch (error) {
        console.error("Error sending data:", error);
        toast.error("Something went wrong! Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 py-9 md:py-11 px-6 md:px-16 max-w-frame mx-auto bg-black rounded-[20px]">
      <p
        className={cn([
          integralCF.className,
          "font-bold text-[32px] md:text-[40px] text-white mb-9 md:mb-0",
        ])}
      >
        STAY UP TO DATE ABOUT OUR LATEST OFFERS
      </p>
      <div className="flex items-center">
        <form onSubmit={handleNewsletterSubmit} className="flex flex-col w-full max-w-[349px] mx-auto">
          <InputGroup className="flex bg-white mb-[14px]">
            <InputGroup.Text>
              <img
                src="/icons/envelope.svg"
                alt=""
                className="min-w-5 min-h-5"
              />
            </InputGroup.Text>
            <InputGroup.Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="bg-transparent placeholder:text-black/40 placeholder:text-sm sm:placeholder:text-base"
            />
          </InputGroup>
          {errors.email && (
            <p className="text-red-400 text-sm mb-2 px-2">{errors.email}</p>
          )}
          <Button
            variant="secondary"
            className="text-sm sm:text-base font-medium bg-white h-12 rounded-full px-4 py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
            aria-label="Subscribe to Newsletter"
            type="submit"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe to Newsletter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewsLetterSection;
