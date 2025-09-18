

# SkillSwap

SkillSwap is a MERN (MongoDB, Express.js, React, Node.js) based web application that connects learners with people who can teach them new skills. Users can **sign up, log in, showcase their skills, request skills they want to learn, and connect with others**.

Link: https://skillswap-1-f4vs.onrender.com

---

## Features
- **Authentication** – Secure login/signup with JWT  
- **User Profiles** – Showcase your skills and location  
- **Skill Matching** – Find people who can teach you what you want to learn  
- **Requests** – Request skills from other users  
- **Dashboard** – Manage your skills and requests in one place  
- **Deployment** – Fully deployed on Render with MongoDB Atlas  

---

##  Tech Stack
- **Frontend:** React.js, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT (JSON Web Tokens)  
- **Deployment:** Render  

---

## Environment Variables
Create a `.env` file in the **backend** folder with the following:

```env
PORT=5000
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

