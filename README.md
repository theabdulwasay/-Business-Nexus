<div align="center">

# 🔗 Business Nexus

### Where Entrepreneurs Meet Investors

*A full-stack platform for discovery, recommendations, and investment deal flow*

![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-3-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-REST%20API-A30000?style=for-the-badge&logo=django&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 📖 About

**Business Nexus** connects entrepreneurs and investors on a single platform —
matching business listings to investor interests, handling investment bids
end-to-end, and giving admins visibility into platform activity. Built as a
Computer Science capstone project with a production-shaped architecture:
**Django REST Framework** API on **SQLite**, and a **React** single-page
frontend talking to it over JWT-authenticated JSON.

> *"Fostering collaboration and informed decision-making between entrepreneurs, investors, and businesses."*

<br>

<div align="center">

| 🧑‍💼 For Entrepreneurs | 💰 For Investors | 🛡️ For Admins |
|:---:|:---:|:---:|
| List & showcase your business | Discover matched opportunities | Monitor all activity |
| Review & respond to bids | Place investment bids | Verify business credibility |
| Track funding progress | Manage a personal portfolio | Ensure platform trust |

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — secure register/login with auto-refreshing tokens
- 🏢 **Business Listings** — entrepreneurs showcase businesses with tags, industry, and funding needs
- 🎯 **Smart Recommendations** — tag-based matching engine surfaces relevant businesses to each investor
- 💵 **Investment Bidding** — investors bid, entrepreneurs accept/reject, transactions auto-generate
- 📊 **Transaction Tracking** — every accepted bid becomes a trackable transaction record
- 💬 **Direct Messaging** — built-in messaging between users
- 🧑‍🎨 **Role-Based Experience** — distinct entrepreneur / investor / admin views throughout
- 🛠️ **Django Admin** — full back-office control out of the box

---

## 🏗️ Architecture

```
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   (localhost:3000)  │
                    │                     │
                    │  Login · Register   │
                    │  Dashboard          │
                    │  Businesses         │
                    │  Bids · Profile     │
                    └──────────┬──────────┘
                               │  Axios + JWT
                               ▼
                    ┌─────────────────────┐
                    │  Django REST API    │
                    │   (localhost:8000)  │
                    │                     │
                    │  /api/auth/*        │
                    │  /api/businesses/   │
                    │  /api/bids/         │
                    │  /api/recommend.../ │
                    └──────────┬──────────┘
                               │  Django ORM
                               ▼
                    ┌─────────────────────┐
                    │   SQLite Database   │
                    │     db.sqlite3      │
                    └─────────────────────┘
```

---

## 📁 Project Structure

```
business_nexus/
│
├── backend/                     🐍 Django + DRF + SQLite
│   ├── business_nexus/          ⚙️  Project settings & root URLs
│   ├── core/                    📦 Main app
│   │   ├── models.py            🗄️  User, Business, Bid, Transaction...
│   │   ├── serializers.py       🔄 DRF serializers
│   │   ├── views.py             🎛️  API views & viewsets
│   │   ├── urls.py              🔗 API routes
│   │   └── admin.py             🛡️  Django admin config
│   ├── db.sqlite3               💾 Pre-seeded database
│   ├── seed.py                  🌱 Demo data script
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                    ⚛️  React SPA
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   ├── client.js         🌐 Axios instance + token refresh
        │   └── AuthContext.js    🔑 Auth state provider
        ├── components/
        │   └── Navbar.js
        └── pages/
            ├── Login.js  · Register.js
            ├── Dashboard.js
            ├── Businesses.js  · BusinessDetail.js
            ├── Bids.js
            ├── Recommendations.js
            └── Profile.js
```

---

## 🚀 Quick Start

### 1️⃣ Backend — Django + SQLite

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows → venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate          # DB is pre-built, but safe to re-run
python manage.py runserver
```

> 🟢 API now live at **http://localhost:8000/api/**

### 2️⃣ Frontend — React

```bash
cd frontend
npm install
npm start
```

> 🟢 App now live at **http://localhost:3000**

---

## 🔑 Demo Accounts

| Role | Username | Password | Notes |
|:---|:---|:---|:---|
| 🧑‍💼 Entrepreneur | `entre1` | `password123` | Owns *AgriTech Solutions* & *FinPay* |
| 💰 Investor | `invest1` | `password123` | Interests: `fintech, agritech, iot` |
| 🛡️ Admin | `admin` | `admin12345` | Full access at `/admin/` |

Reset or regenerate demo data anytime:

```bash
python manage.py shell < seed.py
```

---

## 🔌 API Reference

<details>
<summary><strong>Click to expand full endpoint list</strong></summary>

<br>

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---:|
| `POST` | `/api/auth/register/` | Create account, returns JWT tokens | ❌ |
| `POST` | `/api/auth/login/` | Obtain JWT access/refresh tokens | ❌ |
| `POST` | `/api/auth/refresh/` | Refresh access token | ❌ |
| `GET / PATCH` | `/api/me/` | Current user profile | ✅ |
| `GET / PATCH` | `/api/investor-profile/` | Investor interests & range | ✅ |
| `GET / POST` | `/api/businesses/` | List / create businesses | 🔓 read · ✅ write |
| `GET / PATCH / DELETE` | `/api/businesses/:id/` | Business detail | 🔓 read · ✅ write |
| `GET` | `/api/recommendations/` | Tag-matched businesses | ✅ |
| `GET / POST` | `/api/bids/` | Investment bids | ✅ |
| `POST` | `/api/bids/:id/respond/` | Accept / reject a bid | ✅ |
| `GET` | `/api/transactions/` | Transactions from accepted bids | ✅ |
| `GET / POST` | `/api/messages/` | Direct messaging | ✅ |

**Query params:** `businesses/?search=fintech` · `businesses/?industry=Agriculture`

</details>

---

## 🎯 Recommendation Engine

The matching logic lives in `RecommendationListView` — a lightweight,
explainable **tag-overlap scorer**:

```python
score = len(investor.interests ∩ business.tags)
```

It's intentionally simple so it's easy to swap in a real ML model later
(collaborative filtering, embeddings, etc.) **without changing the frontend
contract** — `/api/recommendations/` always returns the same shape.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| **Frontend** | React 18 · React Router · Axios |
| **Backend** | Django 5 · Django REST Framework |
| **Auth** | Simple JWT |
| **Database** | SQLite |
| **CORS** | django-cors-headers |
| **Images** | Pillow |

</div>

---

## 🗺️ Roadmap

- [ ] File uploads for pitch decks / business documents
- [ ] Real payment gateway integration for the Investment Exchange module
- [ ] ML-based recommendation model (beyond tag overlap)
- [ ] Analytics dashboard for admins (platform-wide trends)
- [ ] Real-time messaging via WebSockets
- [ ] Docker Compose for one-command startup

---

## 📄 License

This project is provided as an academic/starter scaffold under the **MIT License**.
Feel free to fork, extend, and build on it.

<div align="center">

---

**Built for entrepreneurs, investors, and everyone in between.** 🚀

</div>
