# tapNGo - Complete E-Wallet & Contactless Payment Ecosystem

A revolutionary multi-platform payment solution combining **Flutter mobile app** for tap-to-pay NFC transactions with a **MERN web dashboard** for merchants, drivers, customers, and admins.

**For autorickshaw transport, retail integration (DMart, Malls, Food Courts), and unified payment ecosystem.**

---

## 📚 Project Contents

### 1. **Flutter Mobile App** (`lib/`)
- NFC/BLE Tap-to-Pay integration
- Offline transaction queueing
- Smart fare calculation for rides
- Real-time wallet management
- Shared ride fare splitting
- Cyber-Urban UI design system

### 2. **Node.js/Express Backend** (`backend/`)
- RESTful API for all operations
- MongoDB database with Mongoose schemas
- JWT authentication system
- Role-based access control (Driver, Customer, Merchant, Admin)
- Transaction processing and validation
- Analytics and reporting endpoints

### 3. **React Web Dashboard** (`frontend/`)
- Driver earnings & analytics dashboard
- Customer wallet & transaction history
- Admin platform-wide monitoring
- Merchant sales & customer insights
- Real-time charts with Recharts
- Responsive design with Tailwind CSS

---

## 🚀 Quick Start Guide

### Prerequisites
```bash
✅ Node.js v18+
✅ MongoDB (local or Atlas)
✅ Flutter SDK (for mobile)
✅ Git
```

### 1️⃣ Backend Setup (5 minutes)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI and JWT secret
npm run dev
# ✅ Runs on http://localhost:5000
```

### 2️⃣ Frontend Setup (5 minutes)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# ✅ Runs on http://localhost:3000
```

### 3️⃣ Mobile App Setup (optional)
```bash
flutter create tapngo --org=com.tapngo.app
# Copy lib/ files into project
flutter pub get
flutter run
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Driver** | driver@tapngo.com | password123 |
| **Customer** | customer@tapngo.com | password123 |
| **Admin** | admin@tapngo.com | password123 |
| **Merchant** | merchant@tapngo.com | password123 |

---

## 📊 Core Features

### 🚗 Driver Dashboard
- Real-time earnings tracking (today/week/month)
- Ride history with passenger details
- Earnings reports with daily breakdown
- Performance analytics with charts
- Payment transaction log

### 👤 Customer Dashboard
- Wallet balance and top-up functionality
- Transaction history with filters
- Ride history and spending analytics
- Monthly expense breakdown
- Profile management

### 👨‍💼 Admin Dashboard
- Platform-wide user metrics
- User distribution pie chart
- Transaction audit log with filters
- User role management
- Revenue analytics

### 🏪 Merchant Dashboard
- Sales and transaction volume
- Customer transaction history
- Performance metrics
- Multi-location support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Mobile** | Flutter, Riverpod, Hive, NFC Manager |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Database** | MongoDB, Hive (mobile local) |
| **Auth** | JWT, bcryptjs |
| **UI Design** | Cyber-Urban aesthetic (Navy, Orange, Blue) |

---

## 📁 Project Structure

```
.
├── lib/                              # Flutter Mobile App
│   ├── config/
│   │   ├── theme.dart               # Cyber-Urban design
│   │   └── constants.dart
│   ├── models/                       # Data structures
│   ├── services/                     # Business logic
│   ├── providers/                    # Riverpod state
│   ├── screens/                      # UI screens
│   └── widgets/                      # Reusable components
│
├── backend/                          # Node.js Backend
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   ├── models/                       # Mongoose schemas
│   ├── controllers/                  # Business logic
│   ├── routes/                       # API endpoints
│   ├── middleware/                   # Auth & guards
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/                         # React Dashboard
    ├── src/
    │   ├── components/               # UI components
    │   ├── pages/                    # Page screens
    │   ├── services/                 # API layer
    │   ├── hooks/                    # Custom hooks
    │   ├── context/                  # Auth context
    │   ├── utils/                    # Utilities
    │   ├── App.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## 🎨 Design System

**Cyber-Urban Theme**
- **Deep Navy**: `#0F1419` - Background
- **Electric Orange**: `#FF6B35` - Primary actions
- **Electric Blue**: `#00D4FF** - Accents & highlights
- **Light Gray**: `#E8E8E8` - Text

**Components**
- Glassmorphic cards (blur effect)
- Animated buttons with haptic feedback
- Smooth transitions and micro-interactions
- Dark theme optimized for mobile

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register          → Create new account
POST   /api/auth/login             → Generate JWT token
POST   /api/auth/logout            → Clear session
GET    /api/auth/profile           → Fetch user details
PUT    /api/auth/profile           → Update profile
```

### Driver Routes (`/api/driver/`)
```
GET    /driver/dashboard           → Dashboard stats
GET    /driver/rides              → Ride history
GET    /driver/earnings           → Earnings breakdown
GET    /driver/analytics/:period  → Metrics (day/week/month/year)
GET    /driver/transactions       → Payment history
```

### Customer Routes (`/api/customer/`)
```
GET    /customer/wallet           → Wallet balance
POST   /customer/topup            → Add funds
GET    /customer/transactions     → Transaction history
GET    /customer/rides            → Ride history
GET    /customer/analytics        → Spending breakdown
```

### Admin Routes (`/api/admin/`)
```
GET    /admin/dashboard           → Platform stats
GET    /admin/users               → User list with search
PUT    /admin/users/:id/role      → Change user role
GET    /admin/transactions        → All transactions
GET    /admin/analytics           → Platform analytics
```

---

## 🧪 Testing

### Backend API Testing
```bash
cd backend
# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"driver@tapngo.com","password":"password123"}'
```

### Frontend Development
```bash
cd frontend
npm run dev  # Hot reload enabled
```

### Flutter Testing
```bash
cd lib  # Your Flutter project
flutter test
```

---

## 🚢 Deployment

### Backend (Heroku or Railway)
```bash
cd backend
heroku create tapngo-api
git push heroku main
# Set environment variables on Heroku
```

### Frontend (Vercel or Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
vercel deploy
```

### Mobile (Google Play Store)
```bash
flutter build apk --release
# Upload .apk to Play Store
```

---

## 📈 Features Roadmap

### ✅ Implemented (MVP)
- User auth & roles
- Wallet & transactions
- Ride tracking & fare calculation
- NFC payment integration
- Offline mode
- Dashboard analytics
- Admin panel

### 🔄 In Progress
- Real-time WebSocket updates
- SMS/Email notifications
- PDF/CSV export

### 🔮 Planned
- iOS release
- Card payment integration
- Dispute resolution
- AI fraud detection
- Multi-language support

---

## 🤝 Contributing

1. Fork repo
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m 'Add YourFeature'`
4. Push: `git push origin feature/YourFeature`
5. Open Pull Request

---

## 📝 License

MIT - See LICENSE file

---

## 📞 Support

- **Issues**: Create GitHub issue
- **Email**: support@tapngo.com
- **Docs**: Check README files in each directory

---

**Built with ❤️ for seamless urban transport payments** 🚀