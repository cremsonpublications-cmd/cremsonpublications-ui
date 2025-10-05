# Google OAuth Setup Instructions

## How to Set Up Google Sign-In

1. **Go to Google Developers Console**
   - Visit: https://console.developers.google.com/

2. **Create a New Project** (or select existing)
   - Click "New Project"
   - Enter project name: "Cremson Publications"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Name: "Cremson Publications Web Client"
   - Add authorized origins:
     - `http://localhost:5177`
     - `http://localhost:3000`
     - Your production domain

5. **Copy Client ID**
   - Copy the Client ID that's generated
   - Paste it in your `.env.local` file:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here
   ```

6. **Restart Development Server**
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

## Features Implemented

✅ **Google Sign-In Modal**
- Clean UI matching the provided design
- Google OAuth integration
- Email fallback option

✅ **User Authentication**
- User data stored in localStorage
- Persistent sign-in across page refreshes
- User profile display in navbar

✅ **Integration**
- Sign-in button in navbar and footer
- User dropdown with sign-out option
- Profile picture display

## How to Test

1. Click the User icon in the navbar or footer
2. Modal opens with Google sign-in option
3. For demo: Use email input for quick testing
4. For production: Set up Google Client ID and use Google button

## User Data Structure

The following user data is stored in localStorage:

```json
{
  "id": "user-id",
  "name": "Full Name",
  "email": "user@example.com",
  "picture": "profile-picture-url",
  "given_name": "First Name",
  "family_name": "Last Name",
  "signInMethod": "google|email",
  "signInTime": "2024-01-01T00:00:00.000Z"
}
```