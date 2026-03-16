# Google Calendar Setup for Personal Website

## What Are We Doing?

We're setting up **OAuth 2.0** credentials so your Personal Website can:
- **Read** your Google Calendar to check your availability
- **Create** calendar events when visitors book time with you

**Important**: Only YOU authenticate (not your visitors). Visitors just pick time slots - they never log in or see your calendar.

---

## Why Google Cloud Console?

Google Calendar is protected (like a locked door). To access it programmatically, we need:
1. **Permission from Google** - OAuth credentials (the "key")
2. **Your consent** - Tell Google it's okay for your app to access your calendar

This is standard security - same way apps like Calendly or Cal.com work.

---

## Step 1: Go to Google Cloud Console

Visit: https://console.cloud.google.com/

**What**: This is Google's control panel for developer APIs
**Why**: This is where you request permission to use Google Calendar API

---

## Step 2: Create/Select Project

- Click "Select a project" at the top
- Click "New Project"
- Name it: **"Personal Website"**
- Click "Create"
- Wait ~10 seconds for Google to create it

**What**: A "project" is like a folder that groups related Google APIs
**Why**: Keeps your credentials organized (you might have multiple projects)

---

## Step 3: Enable Google Calendar API

- In the search bar at top, type "Calendar API"
- Click "Google Calendar API"
- Click the blue "Enable" button
- Wait for it to enable

**What**: Turning on Calendar API for your project
**Why**: APIs are disabled by default - you explicitly enable what you need

---

## Step 4: Configure OAuth Consent Screen

⚠️ **This is the detailed step where you're currently stuck!**

### 4a. Start OAuth Setup
- Click "Credentials" in the left sidebar
- Click "CREATE CREDENTIALS" → "OAuth client ID"
- You'll see: "To create an OAuth client ID, you must first configure your consent screen"
- Click "CONFIGURE CONSENT SCREEN"

### 4b. Choose User Type
- Select **"External"** (allows anyone with a Google account, including you)
- Click "CREATE"

**What**: Choosing who can authenticate
**Why**: "External" lets you (with personal Gmail) authenticate. "Internal" is only for Google Workspace organizations.

### 4c. OAuth Consent Screen - App Information

**Fill out the form:**

1. **App name**: `Personal Website`
2. **User support email**: Select your email from dropdown
3. **App logo**: Skip (optional)
4. **Application home page**: Leave blank
5. **Application privacy policy link**: Leave blank
6. **Application terms of service link**: Leave blank
7. **Authorized domains**: Leave blank
8. **Developer contact information**: Type your email address

Click **"SAVE AND CONTINUE"** at bottom

**What**: This is info Google shows when you authorize the app
**Why**: If others used your app, they'd see this screen (but only you will use it)

### 4d. Scopes - Grant Permissions

Click **"ADD OR REMOVE SCOPES"** button

A sidebar opens. Now:

1. In the filter box, type: `calendar`
2. Find and check: `https://www.googleapis.com/auth/calendar`
   - Description: "See, edit, share, and permanently delete all calendars..."
3. Clear filter, type: `gmail`
4. Find and check: `https://mail.google.com/`
   - Description: "Read, compose, send, and permanently delete all your email..."
5. Click **"UPDATE"** at bottom of sidebar
6. Click **"SAVE AND CONTINUE"**

**What**: Scopes = specific permissions your app requests
**Why**: Calendar scope = read/write calendar. Gmail scope = send booking confirmation emails.

### 4e. Test Users

1. Click **"+ ADD USERS"**
2. Type YOUR email address (the one with your calendar)
3. Press Enter
4. Click **"SAVE AND CONTINUE"**

**What**: While in "testing mode", only these users can authorize
**Why**: You're the only one who needs to authorize (visitors don't log in)

### 4f. Summary

- Review the summary page
- Click **"BACK TO DASHBOARD"**

✅ **OAuth Consent Screen configured!**

## Step 5: Create OAuth Client
- Back to Credentials → "Create Credentials" → "OAuth client ID"
- Application type: "Web application"
- Name: "Scheduling System"
- Authorized redirect URIs → Add URI:
  - Development: `http://localhost:3000/api/calendar/oauth/callback`
  - Production: `https://yourdomain.com/api/calendar/oauth/callback`
- Click "Create"

## Step 6: Copy Credentials
- You'll see a popup with Client ID and Client Secret
- Copy both!

## Step 7: Add to .env
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 8: Restart Dev Server
```bash
npm run dev
```

## Step 9: Connect Calendar
1. Visit: `http://localhost:3000/schedule/admin`
2. Click "Settings" tab
3. Click "Connect Google Calendar"
4. Authorize with your Google account
5. Done! ✅

## Production Setup
When deploying:
1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add production redirect URI: `https://yourdomain.com/api/calendar/oauth/callback`
4. Update `.env`: `NEXT_PUBLIC_BASE_URL=https://yourdomain.com`
5. Reconnect calendar in production admin panel

That's it! Your calendar will now sync automatically. 🎉
