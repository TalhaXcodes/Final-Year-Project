# Firestore Profile Persistence - Debugging Guide

## 🔍 What I've Done

Added **comprehensive logging** to all Firestore operations in profileService.js:
- ✅ `initializeUserProfile()` - Creates profile on signup/login
- ✅ `updateUserProfile()` - Updates existing profiles  
- ✅ `fetchUserProfile()` - Fetches profile data
- ✅ `syncAuthProfile()` - Syncs displayName to both Auth and Firestore

Each function now logs:
- 📝 Step-by-step progress
- 📊 Data being written
- 🎯 Firestore path (e.g., `users/{uid}`)
- ❌ Detailed error messages with codes

## 🐛 How to Debug

### Step 1: Open Browser Console
1. Go to your Basketries app
2. Press **F12** (or right-click → Inspect → Console)
3. You'll see detailed logs of what's happening

### Step 2: Trigger a Signup
1. Click "Sign Up"
2. Create a new account with email
3. **Watch the Console** for logs like:
   ```
   👤 AuthContext: User logged in/signed up: abc123xyz
   🔄 AuthContext: Attempting to initialize user profile...
   🔍 initializeUserProfile: Checking for existing profile for user: abc123xyz
   📝 initializeUserProfile: Creating new profile for user: abc123xyz
   📊 Profile data to be written: { displayName: "...", email: "..." }
   ✅ SUCCESS: Profile document created in Firestore for user: abc123xyz
   🎯 Firestore Path: users/abc123xyz
   ```

### Step 3: Check Firestore Console

If you see ✅ SUCCESS logs but NO document in Firestore:
**→ You have a Security Rules issue** (see below)

If you see ❌ ERROR logs:
**→ Check the error code** (see troubleshooting)

## 🔒 Firestore Security Rules Setup (Most Common Issue)

The most likely problem: **Firestore security rules are blocking writes**.

### To Check/Fix Your Rules:

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select project: **final-year-project-a5669**

2. **Navigate to Firestore Rules**
   - Left sidebar → Firestore Database
   - Click the **Rules** tab (next to Data)

3. **Check Current Rules**
   - If it says "Deny all requests" or nothing allows writes → That's the problem
   - Default rules often deny all writes

4. **Replace with These Rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own profile
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Allow authenticated users to read most data
       match /catalogue/{document=**} {
         allow read: if request.auth != null;
       }
       
       match /questionnaireResponses/{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

5. **Publish the Rules**
   - Click the **Publish** button at bottom right
   - Wait for confirmation (usually takes 30 seconds)

6. **Test Again**
   - Go back to your app
   - Sign up again
   - Check console for ✅ SUCCESS

## 📋 Error Troubleshooting

### "permission-denied"
- **Cause**: Firestore security rules blocking write
- **Fix**: Update rules (see section above)

### "No authenticated user found"
- **Cause**: User not logged in
- **Fix**: Make sure auth works before profile creation
- Check: Are you signed in? Does Firebase Auth work?

### "Missing userId or authUser"
- **Cause**: auth.currentUser is null
- **Fix**: Same as above - ensure user is authenticated

### Blank/No Logs at All
- **Cause**: Code not being executed
- **Fix**: 
  - Check browser console (F12 → Console tab)
  - Try signing up fresh (not logging in)
  - Refresh the page (Ctrl+Shift+R for hard refresh)

## ✅ Verification Checklist

Run this in your browser console after logging in:

```javascript
// Import the debug service
import { debugFirestoreWrite } from './src/services/firestore/debugService.js';

// Run the test
debugFirestoreWrite();
```

It will:
1. Try to write test data to Firestore
2. Show success/error messages
3. Provide exact fix instructions if it fails

## 📊 What Logs to Expect

**On Successful Signup:**
```
👤 AuthContext: User logged in/signed up: def456uvw
🔄 AuthContext: Attempting to initialize user profile...
🔍 initializeUserProfile: Checking for existing profile
📝 initializeUserProfile: Creating new profile
✅ SUCCESS: Profile document created
🎯 Firestore Path: users/def456uvw
```

**On Profile Update:**
```
📝 updateUserProfile: Updating profile for user: def456uvw
✅ SUCCESS: Profile updated for user
```

## 🎯 Expected Firestore Structure

After successful signup, you should see in Firebase Console:

```
Firestore Database
└── users (collection)
    └── {userId} (document)
        ├── displayName: "John Doe"
        ├── email: "john@example.com"
        ├── phoneNumber: ""
        ├── address: ""
        ├── city: ""
        ├── postalCode: ""
        ├── country: ""
        ├── provider: "Email"
        ├── createdAt: (timestamp)
        └── updatedAt: (timestamp)
```

## 🔄 Next Steps

1. **Check Firestore Rules First** (most common issue)
2. **Sign up with a test account**
3. **Watch browser console for logs**
4. **Verify document appears in Firestore**
5. **Test profile updates**

If you're still having issues after these steps, share:
- Screenshot of browser console errors (F12 → Console)
- Screenshot of Firestore Rules tab
- Screenshot of Firestore Data tab
