# PharmaNex Backend (Node.js)

PharmaNex is a digital health platform that connects patients directly with licensed pharmacies through a seamless mobile app. This repository contains the backend services powering the PharmaNex platform, built with **Node.js**, **MongoDB**, **Socket.io**, **Firebase**.

---

## 🚀 Features
- Browse medicines offered by nearby pharmacies
- Place orders and track deliveries via Uber integration
- Upload and validate prescriptions
- Secure API endpoints for patient and pharmacy data
- Database management with versioned records

---

## 🛠️ Tech Stack
- **Node.js** (Express.js framework)
- **MongoDB**: (Core ORM)
- **Authentication**: JWT-based
- **Cloud**: AWS S3 for prescription uploads
- **Testing**: Jest for unit & integration tests

---

## 📂 Project Structure
pharmanex_backend/
- ── src/                # Platform source code
    - ─ controllers/    # Route handlers
    - models/         # Database models (e.g.Mongoose)
    - routes/         # API endpoints
    - services/       # Business logic
    - utils/          # Helper functions
- config/             # Environment configs (db, API keys)
- tests/              # Unit/integration tests
- .env.example        # Example environment variables
- .gitignore          # Ignore node_modules, secrets, logs
- package.json        # Dependencies and scripts
- README.md           # Documentation
- LICENSE             # License

---

## ⚙️ Setup & Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Pritchad25/Pharma_Nex.git
   cd  pharmanex_backend```

2. Install dependencies
```npm install```

3. Configure environment variables:
- Copy `.env.example` -> ``.env``
- Add your database credentials, JWT secret, and AWS keys.

4. Run the server
`npm run dev`


## Testing
``npm test``

## API Endpoints
Patient App API endpoints
| Method | Endpoint | Description |
| ------- | --------- | ----------- |
| POST   | /api/patients/login | Patient authentication |
| GET    | /api/pharmacies/nearby | Find pharmacies (geolocation) |
| POST   | /api/orders | Create new order |
| GET    | /api/orders/:id | Track specific order |
| POST   | /api/payments | Process payments | 

Pharmacy Portal API Endpoints
| Method | Endpoint | Description |
| ------- | --------- | ----------- |
| POST | /api/pharmacies/register | Pharmacy onboarding |
| GET | /api/orders | View incoming orders |
| PATCH | /api/orders/:id/status | Update order status |
| POST | /api/inventory | Add/update medicines |
| GET | /api/analytics | Dashboard data |

Driver API endpoints
| Method | Endpoint | Description |
| ------- | --------- | ---------- |
| POST | /api/drivers/register | Driver registration |
| GET | /api/deliveries/available | Get available deliveries |
| POST | /api/deliveries/:id/accept | Accept delivery |
| PATCH | /api/deliveries/:id/location | Update GPS location |
| POST | /api/deliveries/:id/complete | Mark delivered |

## Contributors
Pritchard Ncube - [pritchad25](https://www.github.com/Pritchad25/)

## License
This project is licensed under the MIT License.