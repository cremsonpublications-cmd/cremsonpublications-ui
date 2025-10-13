/* eslint-env node */
/* global process */
import "dotenv/config";
// Check email delivery status in Brevo
const checkEmailStatus = async () => {
  const VITE_BREVO_API_KEY = process.env.VITE_BREVO_API_KEY;
  if (!VITE_BREVO_API_KEY) {
    console.error(
      "VITE_BREVO_API_KEY not found. Create a .env file with VITE_BREVO_API_KEY=..."
    );
    return;
  }
  const messageId = "202510090340.10463531267@smtp-relay.mailin.fr"; // Your message ID

  try {
    // Get email events/logs
    console.log("Checking email delivery status...");

    // Check recent email events
    const eventsResponse = await fetch(
      "https://api.brevo.com/v3/smtp/statistics/events?limit=50&offset=0",
      {
        headers: {
          accept: "application/json",
          "api-key": VITE_BREVO_API_KEY,
        },
      }
    );

    if (eventsResponse.ok) {
      const events = await eventsResponse.json();
      console.log("Recent email events:", JSON.stringify(events, null, 2));

      // Look for your specific email
      const yourEmail = events.events?.find(
        (event) =>
          event.email === "arjunanofficial21@gmail.com" ||
          event.messageId?.includes("202510090340")
      );

      if (yourEmail) {
        console.log("Found your email event:", yourEmail);
        console.log("Status:", yourEmail.event);
        console.log("Reason:", yourEmail.reason || "No reason provided");
      } else {
        console.log("Email event not found in recent events");
      }
    } else {
      console.error("Failed to get events:", await eventsResponse.text());
    }

    // Check account sending statistics
    console.log("\nChecking account statistics...");
    const statsResponse = await fetch(
      "https://api.brevo.com/v3/smtp/statistics/aggregatedReport?startDate=2025-10-09&endDate=2025-10-09",
      {
        headers: {
          accept: "application/json",
          "api-key": VITE_BREVO_API_KEY,
        },
      }
    );

    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log("Today's email statistics:", JSON.stringify(stats, null, 2));
    }
  } catch (error) {
    console.error("Error checking email status:", error);
  }
};

checkEmailStatus();
