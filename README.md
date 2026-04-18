# 🛡️ Transparent Donation Management System (TDMS)

![Django Stack](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green) ![React JS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white) 

The Transparent Donation Management System (TDMS) is a professional-grade, full-stack web application meticulously designed to digitize and secure the lifecycle of NGO charity operations.

It solves the "black box" problem of traditional charities by providing a verifiable, real-time "paper trail" for clothes, toys, and monetary contributions—ensuring every physical item and dollar is tracked from the moment of pledge directly to the final delivery to a beneficiary.

---

## ✨ System Features

### 1. Role-Based Access Control (RBAC)
- **Donors**: Submit item pledges, make secure financial contributions, and track status timelines.
- **Volunteers**: Centralized dashboard to view required pickups and verify physical donation conditions.
- **Admins**: High-level platform oversight via dedicated dashboards to manage all moving parts.

### 2. End-to-End Transparency Timeline
Every physical donation generates an immutable timeline logging its transition (e.g., *Pending → Verified → Picked Up → Delivered*), complete with modification timestamps and operator IDs, restoring absolute confidence in the donor.

### 3. Automated Emails & PDF Receipts
- Automatically dispatches status updates to donors when physical goods change hands.
- Employs **ReportLab** to generate beautiful, formal PDF tax/receipt documents in-memory and attaches them to dynamically customized "Thank You" confirmation emails for all verified monetary donations.

### 4. Advanced Frontend Aesthetics
The entire user interface operates on a meticulously handcrafted **glassmorphism-inspired CSS architecture** and is enhanced with Tailwind utility-driven styling for faster layout composition and responsive design. It delivers a premium "Deep Space" visual experience with dynamic gradients, responsive viewports, and modern hover states.

### 5. Automated CI Testing
Engineered with rigorous Django `TestCase` integrations covering auth logic, API permissions, timeline constraints, and mocked Razorpay endpoint validations.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Pure semantic Vanilla CSS (Glassmorphism architecture)
- **Backend API**: Python, Django, Django REST Framework
- **Relational Database**: PostgreSQL (or local SQLite)
- **Payment Gateway**: Razorpay Integration
- **PDF Generation**: ReportLab
- **Orchestration**: Docker, docker-compose
- **Production Server**: Gunicorn, WhiteNoise

---

## 🛠️ Local Development Setup

### 1. Backend (Django)
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # (Windows) or 'source venv/bin/activate' (Mac/Linux)
pip install -r requirements.txt
```

**Environment Variables**
Create a `.env` file in the `/backend` directory. Use `backend/.env.example` as a starting point:
```env
SECRET_KEY=your_django_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

For the frontend, create `frontend/.env` from `frontend/.env.example` if you need a custom API URL.

**Database & Server**
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend (React + Vite)
Open a new terminal session.
```bash
cd frontend
npm install
npm run dev
```
Access the platform at `http://localhost:5173`.

---

## 🐳 Production Deployment (Docker)

TDMS is fully containerized and production-ready.

1. Ensure your `.env` is fully populated.
2. Run the master orchestration file from the root directory:
```bash
docker-compose up --build -d
```
This single command builds the Frontend Node image, the Backend Python image, and instantiates a hardened PostgreSQL 15 database instance alongside them, linking the REST framework to React automatically.
