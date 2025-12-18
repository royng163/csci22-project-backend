# CSCI2720 Project Backend - Group CSCI22

## 1. Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express.js
- Database: MongoDB
- ODM: Mongoose
- Authentication: JSON Web Tokens (JWT)
- Data Processing: xml2js
- Development Tools: nodemon, ts-node, Prettier

## 2. Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- MongoDB Server

## 3. Installation & Configuration

1. Clone the Project or Unzip the project file.
2. Open a terminal in the project root directory.
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following content:
   ```
   MONGO_URI=mongodb://localhost:27017/csci2720_project
   JWT_SECRET=your_jwt_secret_key_here
   MAP_API_KEY=your_map_api_key_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=Admin1234!
   USER_USERNAME=testuser
   USER_PASSWORD=Test1234!
   ```

## 4. Server Start Commands

Development Mode (with hot-reloading):

```
npm run dev
```

Production Mode:

```
npm run build
npm start
```

Note: On the very first run, the server will automatically fetch XML data from the LCSD API and populate the MongoDB database with initial venues and events.

## 5. Project Structure

```
src/
├── config/         # Database connection
├── controllers/    # Request logic (Auth, Events, Venues, Users, Comments)
├── middleware/     # Access mode validation
├── models/         # Mongoose Schemas (User, Venue, Event, Comment)
├── routes/         # API Route definitions
├── utils/          # Helper functions
└── server.ts       # App entry point
```

## 6. Development Guidelines

- TypeScript: Clearly define interface and type for every variable.
- Formatting: Please install Prettier to format code. The `.prettierrc` config file standardize the formatting rules.
