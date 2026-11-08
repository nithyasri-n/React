StayEase – Hotel Management System

A full-stack hotel management web application built using React.js, Redux Toolkit, Node.js, Express.js and PostgreSQL. StayEase provides an intuitive interface to manage hotel listings, upload property images, search and filter hotels, and view hotel locations on an interactive map.

Features

- Hotel Management: Add, view, edit and delete hotel listings.
- Image Upload: Upload hotel images with an instant preview.
- Search: Search hotels by name.
- Price Filter: Filter hotels based on their price.
- Pagination: Server-side pagination for efficient hotel listing.
- Hotel Details: View complete hotel information.
- Interactive Map: Display hotel locations using latitude and longitude.
- Form Validation: Validate hotel information before submission.
- Notifications: Display success and error toast notifications.
- SEO: Dynamic page metadata using React Helmet Async.
- Responsive UI: Clean and user-friendly interface.

Technologies Used
Frontend

- React.js
- Redux Toolkit
- React Router DOM
- Axios
- HTML5
- CSS3
- React Helmet Async
- Leaflet

Backend

- Node.js
- Express.js
- PostgreSQL
- Multer
- pg (PostgreSQL Node.js client)
- CORS
- dotenv

Project Structure

```text
hotel-management/
│
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
│
├── backend/
│   ├── config/
│   ├── routes/
│   ├── uploads/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

Installation and Setup

Prerequisites

Make sure you have installed:

- Node.js and npm
- PostgreSQL
- Git

1.  Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd hotel-management
```

2.  Install Frontend Dependencies

```bash
npm install
```

3. Install Backend Dependencies

```bash
cd backend
npm install
```

4.  Configure Environment Variables

Create a `.env` file inside the `backend` folder using the `.env.example` file as a reference.

Configure your own PostgreSQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stayease_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

Note: Use your own PostgreSQL credentials. Never upload your actual `.env` file to GitHub.

5.  Create the PostgreSQL Database

Create a database named:

```sql
CREATE DATABASE stayease_db;
```

Connect to `stayease_db` and execute:

```sql
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

6.  Start the Backend Server

From the `backend` directory:

```bash
npm run dev
```

The backend server runs at:

`http://localhost:5000`

7.  Start the Frontend

Open another terminal in the main project directory:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| GET    | `/hotels`     | Retrieve hotel listings |
| GET    | `/hotels/:id` | Retrieve a hotel by ID  |
| POST   | `/hotels`     | Add a new hotel         |
| PUT    | `/hotels/:id` | Update hotel details    |
| DELETE | `/hotels/:id` | Delete a hotel          |

The GET endpoint supports search, price filtering and pagination through query parameters.

Example:

text
/api/hotels?search=Grand&maxPrice=3000&limit=6&offset=0

Image Storage

Hotel images are uploaded using Multer and stored on the backend server in the `backend/uploads/` directory. The image filename is stored in the PostgreSQL database.

Security

- Database credentials are stored in environment variables.
- Actual `.env` files are excluded from version control.
- Parameterized SQL queries are used for database operations.
- Uploaded image files are validated by type and size.

Project Information

Project Name: StayEase – Hotel Management System

Project Type: Full-Stack Web Application

Purpose: To provide a simple and efficient platform for managing hotel listings and property information.
