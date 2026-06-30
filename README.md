# 🎁 BASKETRIES – GiftPilot

> **AI-Powered Personalized Gift Recommendation System using React, Flask, Firebase, and Random Forest Machine Learning**

![React](https://img.shields.io/badge/React-19-blue)
![Flask](https://img.shields.io/badge/Flask-3.1-black)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![Python](https://img.shields.io/badge/Python-3.x-blue)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Random%20Forest-success)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Project Overview

**GiftPilot** is an AI-powered personalized gift recommendation system developed as a **Final Year Project**.

The system recommends suitable gift categories based on the recipient's information, gifting preferences, and personality traits. It uses a **Random Forest Classifier** trained on a custom dataset to generate personalized recommendations. The predicted gift categories are then matched with personalized gift basket templates stored in Firebase Firestore.

Users can customize their recommended basket, add it to the cart, and complete the purchase through an integrated shopping experience.

---

## ✨ Key Features

- User Authentication using Firebase Authentication
- Guest Questionnaire Access
- Personality-Based Recommendation Engine
- Random Forest Machine Learning Model
- Personalized Gift Basket Recommendations
- Budget-Based Recommendation Filtering
- Firestore Integration
- Shopping Cart & Checkout
- Favourite Products
- User Dashboard
- Admin Dashboard
- Inventory Management
- Responsive User Interface
- Firebase Hosting Deployment
- Render Backend Deployment

---

## 🛠 Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router DOM

### Backend

- Flask
- RESTful API
- Gunicorn

### Database

- Firebase Firestore
- Firebase Authentication

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Random Forest Classifier

### Deployment

- Firebase Hosting
- Render

---

## 🏗 System Architecture

```text
React Frontend
      │
      ▼
RESTful Flask API
      │
      ▼
Random Forest Model
      │
      ▼
Firebase Firestore
      │
      ▼
Personalized Basket Recommendation
```

---

## 🤖 Machine Learning Workflow

1. User completes the questionnaire.
2. Responses are sent to the Flask REST API.
3. Data is preprocessed into model features.
4. The Random Forest model predicts the most suitable gift categories.
5. Matching personalized basket templates are retrieved from Firestore.
6. Business rules filter templates based on:
   - Gender
   - Age Group
   - Occasion
   - Budget
   - Availability
7. The best recommendations are returned to the React frontend.

---

## 🚀 Live Deployment

### Frontend

https://final-year-project-a5669.web.app

### Backend API

https://giftpilot-api.onrender.com

---

## 📁 Project Structure

```
Final-Year-Project/
│
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── app.py
│   ├── train_model.py
│   ├── firebase.js
│   ├── requirements.txt
│   ├── gift_recommender_pipeline.pkl
│   └── target_encoder.pkl
│
├── cypress/
├── tests/
├── package.json
├── firebase.json
└── README.md
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Check backend server status |
| GET | `/api/personalized-templates` | Retrieve available personalized basket templates |
| POST | `/recommend` | Generate personalized gift recommendations |

---

## ⚙️ Installation Guide

### Clone Repository

```bash
git clone https://github.com/TalhaXcodes/Final-Year-Project.git
```

### Frontend Setup

```bash
npm install
npm start
```

### Backend Setup

```bash
pip install -r requirements.txt
python app.py
```

---

## 🧠 Machine Learning Model

The recommendation engine is powered by a **Random Forest Classifier** trained using Scikit-learn.

### Input Features

- Recipient Relationship
- Occasion
- Gender
- Age Group
- Budget
- Personality Responses
- Gift Preferences

### Output

- Recommended Gift Categories
- Confidence Scores
- Personalized Basket Templates

---

## 📸 Application Screenshots

> Screenshots will be added in a future update.

- Home Page
- Login
- Signup
- Questionnaire
- Recommendation Page
- Personalized Basket
- Shopping Cart
- Checkout
- User Dashboard
- Admin Dashboard

---

## 🔮 Future Enhancements

- Collaborative Filtering Recommendations
- Wishlist Sharing
- AI Chat Assistant
- Product Review System
- Online Payment Gateway Integration
- Order Tracking
- Mobile Application
- Multi-language Support

---

## 👨‍💻 Contributors

### Talha Shahbaz
- BS Computer Science
- The University of Lahore
- GitHub: https://github.com/TalhaXcodes

### Eman
- BS Computer Science
- The University of Lahore
- GitHub: https://github.com/eman-work

---

## 📄 License

This project is developed for academic purposes as a **Final Year Project** at **The University of Lahore**.

© 2026 Talha Shahbaz & Eman Nusrat. All Rights Reserved.
