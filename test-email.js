// Simple test script to verify Brevo API key
// Run with: node test-email.js

/* eslint-env node */
/* global process */
import 'dotenv/config';

const testBrevoAPI = async () => {
  const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.VITE_BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY not found. Create a .env file with BREVO_API_KEY=...');
    return;
  }
  
  try {
    // Test 1: Check account info
    console.log('Testing Brevo API key...');
    const accountResponse = await fetch('https://api.brevo.com/v3/account', {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY
      }
    });
    
    if (!accountResponse.ok) {
      console.error('❌ API Key invalid:', await accountResponse.text());
      return;
    }
    
    const accountData = await accountResponse.json();
    console.log('✅ API Key valid! Account:', accountData.email);
    
    // Test 2: Send simple test email
    console.log('Sending test email...');
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Cremson Publications',
          email: 'info@cremsonpublications.com'
        },
        to: [{
          email: 'arjunanofficial21@gmail.com',
          name: 'Test User'
        }],
        subject: 'Test Email from Cremson Publications',
        htmlContent: '<h1>Test Email</h1><p>If you receive this, your Brevo API is working!</p>'
      })
    });
    
    const emailData = await emailResponse.json();
    
    if (emailResponse.ok) {
      console.log('✅ Test email sent successfully!', emailData);
    } else {
      console.error('❌ Failed to send email:', emailData);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testBrevoAPI();
