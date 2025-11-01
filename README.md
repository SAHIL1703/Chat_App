# 💬 Chat App (React + Firebase + Cloudinary)
This project is a real-time chat application built using React (Vite), Firebase, and Cloudinary.
It allows users to register, login, chat, update profiles, and upload images in a smooth and responsive interface.

## 🚀 Features
🔐 User Authentication (Signup, Login, Logout, Reset Password)

💭 Real-Time Chat using Firebase Firestore

👤 Profile Update with Cloudinary image upload

⚡ Instant Toast Notifications

🧠 Responsive UI for all devices

🔒 Environment Variables via .env

## 🧠 Tech Stack
Frontend: React + Vite

Backend / Database: Firebase (Auth + Firestore)

Image Storage: Cloudinary

Styling: CSS

Notifications: React Toastify

## 🗂️ Folder Structure

Chat_App/
│
├── src/
│   ├── assets/          # Images & icons
│   ├── components/      # Reusable React components
│   ├── config/          # Firebase configuration
│   ├── context/         # Global state (AppContext)
│   ├── lib/             # Utility functions (e.g. upload.js)
│   ├── pages/           # Main pages (Login, Signup, Chat, Profile)
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
│
├── .env                 # Environment variables (not committed)
├── .gitignore           # Ignored files/folders
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation


## ⚙️ Installation
### 1️⃣ Clone the Repository
    git clone https://github.com/SAHIL1703/Chat_App.git
    cd Chat_App

### 2️⃣ Install Dependencies
    npm install


### 3️⃣ Setup Environment Variables
    VITE_CLOUD_NAME="YOUR CLOUD NAME"
    VITE_UPLOAD_PRESET="YOUR CLOUD PRESENT NAME"

### 🔥 Firebase Setup
    In src/config/firebase.js, configure your Firebase project:
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

### ☁️ Cloudinary Setup
    In src/lib/upload.js:

    const upload = async (file) => {
        const cloudName = import.meta.env.VITE_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
        );

        const data = await response.json();
        return data.secure_url;
    };
    export default upload;

### 🧩 Available Scripts
    npm run dev

## 🧱 Key Functionalities
    Signup: Create user and store info in Firestore

    Login: Securely authenticate users

    Password Reset: Send reset email via Firebase

    Profile Update: Upload avatar, edit name & bio

    Logout: Secure sign out

    Last Seen: Tracks user online status

## 📱 Responsive Design
    Works smoothly on mobile, tablet, and desktop

    Uses CSS media queries for layout adjustments

    Clean, minimal, modern UI

## 🛡️ Security
    Sensitive data hidden in .env

    .env and node_modules are in .gitignore

    Firebase Auth ensures safe login & logout

    Cloudinary used for secure media storage

## 🤝 Contributing
    Fork this repo

    Create a new branch (feature/YourFeature)

    Commit your changes

    Push and create a pull request

## 👨‍💻 Author
    Sahil Pisal
    📧 GitHub
    💻 Full Stack Developer
    