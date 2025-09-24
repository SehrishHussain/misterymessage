#  MisteryMessage - Video Streaming Platform (Backend)

A Node.js + MongoDB backend for a YouTube-like video streaming platform.  
This backend provides authentication, video uploads, subscriptions, and token-based session management.

---

##  Tech Stack
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT (Access & Refresh Tokens), Cookies
- **File Handling:** Multer for file uploads
- **Debugging:** Custom middleware + error handling
- **Testing API:** Postman

---

##  Features
- **User Management**
  - User registration & login with JWT
  - Access & refresh token handling
  - Secure cookie-based sessions
  - Password hashing & Mongoose hooks

- **Video Management**
  - Upload videos with Multer
  - Store metadata in MongoDB
  - Aggregation pipelines for analytics
  - Sub-pipelines for subscriptions and recommendations

- **Subscriptions**
  - Subscription schema & controllers
  - Aggregated subscriber counts
  - Fetch videos from subscribed channels

- **API Structure**
  - RESTful routes (HTTP methods: GET, POST, PUT, DELETE)
  - Controllers for user, video, and subscription logic
  - Middleware for authentication, error handling, and debugging
  - Custom API response format for consistency

---

##  Project Structure
```
src/
┣ controllers/ # Route handlers (User, Video, Subscription)
┣ models/ # MongoDB models with Mongoose
┣ middleware/ # Auth, error handling, debugging
┣ routes/ # Express routers
┣ utils/ # Custom helpers (API response, JWT, etc.)
┗ server.js # App entry point

```

##  Authentication Flow
- Register/Login → JWT generated
- **Access Token**: short-lived, stored in cookies
- **Refresh Token**: long-lived, used to regenerate access token
- Middleware validates tokens and attaches user info to `req.user`

---

##  Data Models
- **User Model**
  - Schema with hooks (password hashing, token generation)
- **Video Model**
  - Video metadata, upload path, likes/dislikes
- **Subscription Model**
  - Linking subscribers with creators
- **Tokens**
  - Access & refresh tokens handled with cookies

---
##  API Endpoints & Examples

###  Auth
#### Register
`POST /api/auth/register`
```json
// Request
{
  "username": "sehrish",
  "email": "sehrish@example.com",
  "password": "mypassword123"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "64c5b7...",
    "username": "sehrish",
    "email": "sehrish@example.com"
  }
}
```

## Login
* POST /api/auth/login

```json
// Request
{
  "email": "sehrish@example.com",
  "password": "mypassword123"
}

// Response (cookies set with tokens)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
  }
}

```
## Videos
* POST /api/videos/upload
* (Form-Data: file → video file, title, description)

```json
// Response
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "id": "64c5c1...",
    "title": "My Travel Vlog",
    "description": "Trip to Hunza",
    "fileUrl": "/uploads/1693234-video.mp4",
    "uploadedBy": "64c5b7..."
  }
}

```
## Get Video by ID
* GET /api/videos/:id

```json
// Response
{
  "success": true,
  "data": {
    "id": "64c5c1...",
    "title": "My Travel Vlog",
    "views": 102,
    "likes": 10,
    "dislikes": 1,
    "uploadedBy": {
      "id": "64c5b7...",
      "username": "sehrish"
    }
  }
}
```
## Subscriptions
* Subscribe to a User
* POST /api/subscriptions/:channelId

```json
// Response
{
  "success": true,
  "message": "Subscribed successfully",
  "data": {
    "subscriberId": "64c5b7...",
    "channelId": "64c5b8..."
  }
}

```
## Get Subscribed Videos
* GET /api/subscriptions/videos

```json
// Response
{
  "success": true,
  "data": [
    {
      "title": "Cooking Show",
      "channel": "Foodie123",
      "views": 1500
    },
    {
      "title": "Coding Tutorial",
      "channel": "DevWorld",
      "views": 3200
    }
  ]
}

```
## Token Refresh
* POST /api/auth/refresh-token

```json
// Request
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "new-access-token..."
  }
}

```
##  API Testing
Used **Postman** collections for:
- Register/Login
- Upload video
- Subscribe/Unsubscribe
- Token refresh
- Error scenarios

---

##  Error Handling
- Centralized error middleware
- Custom API response format
- Debugging logs for development

---

## Installation
```bash
# Clone repo
git clone https://github.com/SehrishHussain/misterymessage.git
cd misterymessage

# Install dependencies
npm install

# Create .env file
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret
PORT=5000

# Start server
npm run dev
```
## Future Improvements
- Add video streaming with chunks
- Implement comments & likes
- Improve subscription recommendations
- Deploy on cloud (Heroku, Render, etc.)
