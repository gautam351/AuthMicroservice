# AuthMicroserviceNode

A JWT-based authentication microservice built with Node.js, Express, TypeScript, and MongoDB. It provides user registration, login, 2FA verification, password reset, and token verification APIs.

---

## Table of Contents

- Features
- Project Structure
- Setup & Installation
- Environment Variables
- Running the Service
- API Endpoints
- User Model
- License

---

## Features

- User registration with email verification (2FA)
- Secure login with password hashing
- JWT-based authentication and authorization
- Password reset via email
- Token verification for backend services
- Logout and session management

---

## Project Structure

```
.
├── Controllers/
│   └── AuthController.ts
├── DB/
│   ├── Database.js
│   └── Models/
│       └── userModel.js
├── jwt/
│   └── Jwt.ts
├── Middlewares/
│   └── AuthMiddleWare.ts
├── Routes/
│   └── AuthRoutes.js
├── Services/
│   └── AuthServices.ts
├── server.js
├── package.json
├── tsconfig.json
└── .env
```

---

## Setup & Installation

1. **Clone the repository**

   ```sh
   git clone <repo-url>
   cd AuthMicroserviceNode
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values (see Environment Variables).

4. **Build the project**

   ```sh
   npm run build
   ```

5. **Start the server**

   ```sh
   npm start
   ```

   For development with hot-reload:

   ```sh
   npm run dev
   ```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
SENDGRID_API_KEY=<your-sendgrid-api-key>
EMAIL=<your-email>
PASSWORD=<your-email-app-password>
```

---

## Running the Service

- **Production:** `npm start`
- **Development:** `npm run dev`

The server will run on `http://localhost:<PORT>` (default: 8000).

---

## API Endpoints

All endpoints are prefixed with `/api`.

### 1. **User Registration**

**POST** `/api/signup`

- **Body:** `{ "email": "user@example.com", "password": "yourpassword" }`
- **Response:** User created, verification code sent to email.

---

### 2. **User Login**

**POST** `/api/login`

- **Body:** `{ "email": "user@example.com", "password": "yourpassword" }`
- **Response:** User logged in, verification code sent to email.

---

### 3. **Verify 2FA (Email Verification)**

**POST** `/api/verify2FA`

- **Body:** `{ "email": "user@example.com", "verificationCode": "123456" }`
- **Response:** Account verified, JWT token returned.

---

### 4. **Resend Verification Email**

**GET** `/api/resendEmail`

- **Query:** `?email=user@example.com`
- **Response:** Verification email resent.

---

### 5. **Logout**

**POST** `/api/logoutUser`

- **Headers:** `Authorization: Bearer <token>`
- **Response:** User logged out.

---

### 6. **Test Get Users (Protected)**

**GET** `/api/test`

- **Headers:** `Authorization: Bearer <token>`
- **Query:** `?email=user@example.com`
- **Response:** User details.

---

## User Model

The user schema includes:

- `email` (unique, required)
- `password` (hashed, required)
- `roles` (default: `user`)
- `isEmailVerified`
- `lastLogin`
- `failedLoginAttempts`
- `isAccountLocked`
- `passwordResetToken`
- `verificationCode`
- `is2FAVerified`
- `token` (JWT and expiry)

---

## License

This project is licensed under the ISC License.

---

**Note:**  
- All sensitive information (like passwords, secrets, and tokens) must be kept secure and never committed to version control.
- For production, ensure HTTPS and proper environment variable management.

---

**Contact:**  
For support, please open an issue or contact the maintainer.
