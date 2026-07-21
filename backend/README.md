# GharConnect Backend (Render)

This is the backend server for GharConnect SOS notifications, built with Express and TypeScript, designed to be deployed on Render.com.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3000
# Optional: For local development, you can set FIREBASE_SERVICE_ACCOUNT_KEY to your Firebase service account JSON string
# FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

### 3. Firebase Setup
For local development:
- Download your Firebase service account JSON file from the Firebase Console
- You can either set the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable to the JSON string, or save it as `serviceAccountKey.json` in the backend directory (make sure to add it to .gitignore!)

For Render deployment:
- Add your Firebase service account JSON as a Secret Environment Variable in Render's dashboard (named `FIREBASE_SERVICE_ACCOUNT_KEY`)

### 4. Run the Server
```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### POST /api/sos
Send an SOS alert to family members
- **Headers**: `Authorization: Bearer <Firebase ID Token>`
- **Body**:
  ```json
  {
    "familyId": "string",
    "latitude": 123.456,
    "longitude": 789.012,
    "message": "string (optional)"
  }
  ```

### POST /api/device/register
Register a device's FCM token
- **Headers**: `Authorization: Bearer <Firebase ID Token>`
- **Body**:
  ```json
  {
    "token": "string",
    "platform": "ios|android (optional)"
  }
  ```

### POST /api/sos/cancel
Cancel an active SOS alert
- **Headers**: `Authorization: Bearer <Firebase ID Token>`
- **Body**:
  ```json
  {
    "familyId": "string",
    "alertId": "string"
  }
  ```

## Deploying to Render
1. Push your code to GitHub (make sure the `backend` directory is part of your repo)
2. Go to [Render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repo
4. Set the Root Directory to `backend`
5. Set the Build Command to `npm install && npm run build`
6. Set the Start Command to `npm start`
7. Add your Firebase service account key as a Secret Environment Variable named `FIREBASE_SERVICE_ACCOUNT_KEY`
8. Deploy!
