# 🚗 VroomTrack – Vehicle Rental Booking App

VroomTrack is a full-stack car rental and booking platform built for second-year Web development coursework. The app allows users to register, log in, browse available vehicles, and make rental bookings. It is designed with a clean UI and secure backend, using modern web technologies and best practices.

## ✨ Features

- 🔐 **User Authentication** (JWT-based)
- 🚘 **Vehicle Listings** (with images, fuel type, pricing)
- 📅 **Booking System** (select date ranges, real-time availability)
- 🧾 **User Dashboard** (booking history, profile updates)
- ⚙️ **Admin Panel** (manage users, cars, and stats)
- 🌐 **Responsive Design** (mobile-first)

---

## 🧑‍💻 Tech Stack

### 💻 Frontend
- React.js
- Axios
- CSS (modular)

### 🔧 Backend
- Node.js
- Express.js
- JWT for authentication
- Bcrypt for password encryption
- Multer for image upload

### 🛢️ Database
- PostgreSQL
- Sequelize ORM

### ☁️ Tools
- Postman (API Testing)
- pgAdmin (DB GUI)
- GitHub (Version Control)
- Figma (UI Prototyping)
- Visual Studio Code

---

## 📂 Folder Structure

/client → React frontend
/server → Express backend
├── models
├── controllers
├── routes
├── uploads
├── middleware
└── config



---

## 🚀 How to Run the Project

### Clone the repository

```bash
git clone https://github.com/your-username/vroomtrack.git
cd vroomtrack
Backend Setup
bash
Copy
Edit
cd server
npm install
npm run dev
Set environment variables in a .env file:

ini
Copy
Edit
PORT=5000
DB_URL=your_postgres_url
JWT_SECRET=siddhartha
Frontend Setup
bash
Copy
Edit
cd client
npm install
npm start
🧪 Testing
✅ Unit tests for user registration, login, and booking

✅ API testing with Postman

✅ Manual UI walkthrough and validation

📸 Screenshots
Include some UI screenshots or link to a Figma prototype

🎓 Academic Purpose
VroomTrack is developed as part of the second-year software engineering coursework. The goal is to demonstrate understanding of full-stack development, database integration, and RESTful API design.

📌 Future Improvements
Google OAuth login

Email notifications

Review and ratings for cars

Payment gateway integration

Mobile app (React Native)

📄 License
MIT License - For academic and non-commercial use.

🤝 Contributors
Siddhartha Bhattarai – Full Stack Developer
