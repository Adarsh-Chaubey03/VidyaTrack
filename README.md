# 📚 VidyaTrack – Learn. Grow. Connect.

VidyaTrack is a full-stack educational platform designed to centralize learning resources, mentorship, and community support. It empowers students with accessible tools and educators with opportunities to teach and earn, fostering a unified learning ecosystem.

## ✅ Features

- **Curated Course Library**: A collection of structured, high-quality courses tailored to student needs.
- **Expert Mentorship Program**: One-on-one guidance from industry professionals.
- **Resume Review Service**: Expert feedback and optimization for resumes.
- **Educational Blog Hub**: Insightful articles and updates on learning trends.
- **Resume Template Gallery**: Professionally designed templates for job applications.
- **Referral Network**: Opportunities to connect with peers and professionals.
- **Book Donation/Exchange System**: A platform for sharing and requesting study materials.
- **Course Creation Tool**: Enables educators to design and sell their own courses.
- **Mentorship Marketplace**: Allows educators to offer paid mentorship services.
- **Earning Mechanism**: Verified profiles for educators to earn through teaching.
- **Resource Sharing Platform**: Facilitates peer-to-peer exchange of books and materials.
- **Student Dashboard**: Personalized tracking of learning progress and activities.
- **Educator Dashboard**: Monitors earnings, course performance, and mentorship sessions.
- **Chatbot Integration**: Real-time assistance and support for users via an interactive chatbot.

## 🚀 Deployment Links

- **Frontend**: [https://vidya-track.netlify.app/](https://vidya-track.netlify.app/) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [![Netlify Status](https://api.netlify.com/api/v1/badges/02d95b97-a97e-4ac4-94cd-3a9d0fb64e7e/deploy-status)](https://app.netlify.com/projects/vidya-track/deploys)  
- **Backend**: [https://vidyatrack-backend.vercel.app/](https://vidyatrack-backend.vercel.app/)

*Replace `#` with actual deployment URL for the backend.*

## 🛠 Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Adarsh-Chaubey03/VidyaTrack.git
cd VidyaTrack
```

### 2. Run Backend
```bash
cd backend
npm install
npm start
```
Ensure a `.env` file in `/backend` with:
```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

## ⚙ Technologies Used

| Category         | Technologies                              |
|-------------------|-------------------------------------------|
| **Frontend**     | React.js, Tailwind CSS, Axios, HTML, CSS, JavaScript |
| **Backend**      | WebRTC, Socket.io, Node.js, Express.js, MongoDB, Cloudinary |
| **Security**     | Bcrypt (password hashing), Jsonwebtoken (JWT for authentication) |
| **Third Party APIs** | Razorpay, Gemini |

## 🔮 Future Scope

- AI-driven mentorship recommendations
- Mobile app (React Native/Flutter)
- Admin dashboard for analytics
- Certificate generation and badges
- Live discussion forums
- Enhanced chatbot capabilities

## 🙌 Closing Note

VidyaTrack aims to unify learning and mentorship, empowering students and educators through a collaborative platform.  
> “Empowering minds, one connection at a time.”
