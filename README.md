# Business Nexus

A platform connecting entrepreneurs and investors — user management, business
listings, an interest-based recommendation engine, investment bidding, and
transaction tracking. Built with **Django REST Framework** (API) + **SQLite**
(database) on the backend and **React** on the frontend.

## Project structure

```
business_nexus/
├── backend/          Django project (API, models, admin)
│   ├── business_nexus/   settings, urls
│   ├── core/              app: models, views, serializers, urls
│   ├── db.sqlite3         pre-built SQLite database with demo data
│   ├── manage.py
│   ├── requirements.txt
│   └── seed.py            demo data seed script
└── frontend/          React app (JS, no bundler files included)
    ├── public/
    ├── src/
    │   ├── api/           axios client + auth context (JWT)
    │   ├── components/    Navbar
    │   └── pages/         Login, Register, Dashboard, Businesses,
    │                      BusinessDetail, Bids, Recommendations, Profile
    └── package.json
```

## Backend setup (Django + SQLite)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate        # DB already included, but safe to re-run
python manage.py runserver      # http://localhost:8000
```

The repo already ships a ready-to-use `db.sqlite3` with demo data and an
admin account, so `migrate` is optional unless you delete the DB file.

**Demo accounts** (all passwords are `password123`):
- `entre1` — entrepreneur, owns 2 sample businesses (AgriTech Solutions, FinPay)
- `invest1` — investor, interests: fintech, agritech, iot

**Django admin**: user `admin`, password `admin12345` → http://localhost:8000/admin/

To reset/reseed data at any point:
```bash
python manage.py shell < seed.py
```

### Key API endpoints (all under `/api/`)
| Endpoint | Method | Description |
|---|---|---|
| `auth/register/` | POST | Create account, returns JWT tokens |
| `auth/login/` | POST | Obtain JWT access/refresh tokens |
| `auth/refresh/` | POST | Refresh access token |
| `me/` | GET/PATCH | Current user profile |
| `investor-profile/` | GET/PATCH | Investor interests & investment range |
| `businesses/` | GET/POST | List/create businesses (`?search=`, `?industry=`) |
| `businesses/:id/` | GET/PATCH/DELETE | Business detail |
| `recommendations/` | GET | Tag-matched businesses for the logged-in investor |
| `bids/` | GET/POST | Investment bids |
| `bids/:id/respond/` | POST | Entrepreneur accepts/rejects a bid |
| `transactions/` | GET | Transactions generated from accepted bids |
| `messages/` | GET/POST | Direct messaging between users |

## Frontend setup (React)

```bash
cd frontend
npm install
npm start                       # http://localhost:3000
```

The frontend expects the API at `http://localhost:8000/api` by default
(see `src/api/client.js`). Override with an `.env` file:
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Notes

- Auth uses JWT (`djangorestframework-simplejwt`); tokens are stored in
  `localStorage` and auto-refreshed on 401s.
- The recommendation engine (`RecommendationListView`) does a simple
  tag-overlap match between an investor's `interests` and each verified
  business's `tags` — swap in a real ML model later without touching the
  frontend contract.
- CORS is pre-configured for `localhost:3000`.
- This is a starter scaffold meant to be extended — file uploads for
  business documents, a real payment gateway integration, and richer
  analytics/reporting were intentionally left as follow-up work per the
  project's scope.
