# Authentication Setup Guide for VidyaTrack

## Overview
VidyaTrack uses Clerk for authentication. The login/signup functionality requires proper environment variable configuration.

## Issues Found
1. **Missing Environment Variables**: Clerk publishable key is not configured
2. **Incorrect Signup Button**: Signup button was calling `openSignIn()` instead of `openSignUp()`
3. **Server Authentication**: Backend Clerk configuration may be missing

## Setup Instructions

### 1. Create Environment Files

#### Client Environment (client/.env)
Create a `.env` file in the `client` directory with:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Stripe Configuration (if using payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Currency
VITE_CURRENCY=USD
```

#### Server Environment (server/.env)
Create a `.env` file in the `server` directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5174

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_JWT_KEY=your_clerk_jwt_key_here
CLER_WEBHOOK_SECRET=whsec_your_clerk_webhook_secret_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/vidyatrack

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
```

### 2. Clerk Setup

1. **Create a Clerk Account**: Go to [clerk.com](https://clerk.com) and create an account
2. **Create a New Application**: Create a new application in Clerk dashboard
3. **Get Your Keys**: 
   - Go to API Keys in your Clerk dashboard
   - Copy the Publishable Key and Secret Key
   - Add them to your environment files

### 3. Fixes Applied

#### Fixed Signup Button
The signup button in `client/src/components/student/Navbar.jsx` was calling `openSignIn()` instead of `openSignUp()`. This has been fixed.

#### Updated Imports
Added `openSignUp` to the Clerk imports in the Navbar component.

### 4. Testing Authentication

1. **Start the Development Server**:
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm install
   npm start

   # Terminal 2 - Start frontend
   cd client
   npm install
   npm run dev
   ```

2. **Test Login/Signup**:
   - Open your browser to `http://localhost:5174`
   - Click the "Login" or "Signup" buttons
   - You should see Clerk's authentication modal

### 5. Troubleshooting

#### If authentication still doesn't work:

1. **Check Console Errors**: Open browser dev tools and check for errors
2. **Verify Environment Variables**: Ensure all Clerk keys are properly set
3. **Check Network Tab**: Look for failed API requests
4. **Verify Clerk Configuration**: Ensure your Clerk app is properly configured

#### Common Issues:

- **"Missing Publishable Key"**: Check that `VITE_CLERK_PUBLISHABLE_KEY` is set in client/.env
- **"Not authorized, no token"**: Check that `CLERK_SECRET_KEY` is set in server/.env
- **CORS Errors**: Ensure `CORS_ORIGIN` matches your frontend URL

### 6. Production Deployment

For production, update the environment variables with your production Clerk keys and ensure all URLs are updated to your production domain.

## Current Status

✅ **Fixed**: Signup button now calls correct function  
✅ **Fixed**: Added proper Clerk imports  
⚠️ **Required**: Environment variables need to be configured  
⚠️ **Required**: Clerk account and application setup needed

Once you configure the environment variables with your Clerk keys, the authentication should work properly. 