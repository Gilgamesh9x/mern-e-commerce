# MERN E-COMMERCE APP

A full-stack MERN E-COMMERCE app for shopping including payment with PayPal.

## Features

- Full featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- PayPal / credit card integration
- Database seeder (products & users)
- Products pictures uploaded to Cloudinary

## Usage

### 1. Setup MongoDB
- Create a MongoDB database using [MongoDB Atlas](https://www.mongodb.com/atlas/database) or a local MongoDB instance.
- Obtain your MongoDB URI.
- Create a PayPal account and obtain your `Client ID` - [PayPal Developer](https://developer.paypal.com/)

### 2. Environment Variables
Create a `.env` file in the root of your project and populate it with the following variables:

```
NODE_ENV=development
MONGO_URL=your_mongodb_uri
JWT_SECRET=abc123
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
```

Replace the placeholders with your actual values.

### 3. Install Dependencies
Run the following command to install the required dependencies for both the client and server:

```
npm run setup-project
```

### 4. Run the Application
Start the development environment with the following command:

```
npm run client | npm run server
```

This will start both the client (React frontend) and the server (Node.js backend).

### 5. Build & Deploy
To build and deploy the application, use the following command:

```
npm run build
node server.js
```

## Tech Stack

- **Frontend**: React, React Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas or local instance)
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary


