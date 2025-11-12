# 🌾 Fasal Mitra - AI-Powered Crop Disease Detection Platform<h1 align="center">Fasal-Mitra App</h1>



<div align="center"><div align="center">

  <img width="200px" src="https://github.com/FASAL-MITRA-SIH-22/Fasal-mitra-frontend/blob/main/frontend/public/android-chrome-512x512.png" alt="Fasal Mitra Logo"/>

  

  <p><strong>Your Crop Guardian - AI-powered crop disease detection made easy</strong></p><a href="https://github.com/FASAL-MITRA-SIH-22/Fasal-Mitra"><img width=200px src="https://github.com/FASAL-MITRA-SIH-22/Fasal-mitra-frontend/blob/main/frontend/public/android-chrome-512x512.png"  alt="Project logo"/></a>

   

  [![Video Demo](https://img.youtube.com/vi/gDaStPFfytY/maxresdefault.jpg)](https://youtu.be/gDaStPFfytY)</div>

</div>

<br/>

---

[![Watch the video](https://img.youtube.com/vi/gDaStPFfytY/maxresdefault.jpg)](https://youtu.be/gDaStPFfytY)

## 📋 Table of Contents

<br/>

- [About](#-about)

- [Features](#-features)[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#-table-of-contents)

- [Tech Stack](#-tech-stack)

- [Architecture](#-architecture)This folder contains most of the backend. The backend follows a microservice architecture, there are many microservices nd these services communicate with each other through HTTP requests and the fronend communicates with the frontend via an API-gateway. The authentication service uses mongoDB and redis cache for user authentication. THe dl service uses ResNet9 as Deep Learning Model and flask server for deploying this model into an API, while the nginx acts as an API gateway.

- [Installation](#-installation)

- [Environment Variables](#-environment-variables)The system architecture for the application is as followed:

- [Usage](#-usage)

- [API Documentation](#-api-documentation)<a href="https://github.com/FASAL-MITRA-SIH-22/Fasal-mitra-frontend"><img width="auto" src="https://github.com/FASAL-MITRA-SIH-22/Fasal-Mitra/blob/main/AboutProject/ArchitectureDiagram.svg"  alt="System Architecture"/></a>
- [User Roles](#-user-roles)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About

**Fasal Mitra** is a comprehensive AI-powered platform designed to help Indian farmers detect crop diseases, access treatment information, and connect with agricultural experts. The platform addresses the critical problem of crop losses due to diseases, pests, and weeds, which costs Indian farmers up to ₹90,000 crores annually.

### Problem Statement

- 10-30% of crop production is lost due to diseases, pests, and weeds
- Many farmers lack technological literacy to research crop diseases independently
- Farmers are often exploited by traders selling unnecessary chemicals and pesticides
- Lack of access to expert consultation in rural areas

### Solution

Fasal Mitra provides:
- **AI-powered disease detection** using ResNet9 deep learning model
- **Real-time treatment recommendations** with organic and chemical solutions
- **Teleconsulting** with agricultural experts via video calls
- **Community forum** for knowledge sharing among farmers
- **Multi-language support** (English, Hindi, Marathi)
- **Expert dashboard** for monitoring disease trends and analytics

---

## ✨ Features

### 🔍 Disease Detection
- Upload plant images for instant AI-powered disease diagnosis
- 99.2% accuracy using ResNet9 model
- Real-time treatment recommendations
- Downloadable PDF reports with complete disease information
- Live weather and location data integration

### 👨‍🌾 User Features
- Multi-language interface (EN, HI, MR)
- Personal dashboard with detection history
- Disease trends and statistics visualization
- Downloadable treatment guides (PDF)

### 👨‍💼 Expert Dashboard
- View all user detections across the platform
- Analytics and insights on disease trends
- Most common diseases visualization
- User management and support

### 👥 Admin Panel
- Complete user management (Farmers, Experts, Admins)
- User type modification
- Password reset functionality
- User statistics and analytics
- Account creation and deletion

### 💬 Community Forum
- Create and share posts about agricultural issues
- Like and comment on community posts
- Real-time updates
- Knowledge sharing platform

### 📹 Teleconsulting
- WebRTC-based video calling with experts
- Real-time audio/video communication
- Screen sharing capabilities
- Secure peer-to-peer connections

---

## 🛠 Tech Stack

### Frontend
- **React.js** 17.0.2 - UI framework
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **D3.js** - Data visualization
- **React Simple Maps** - India map visualization
- **React Hook Form** - Form validation
- **Yup** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Redis** - Caching layer
- **JWT** - Authentication
- **Mongoose** - ODM

### Deep Learning
- **Python** - Programming language
- **Flask** - API server
- **PyTorch** - Deep learning framework
- **ResNet9** - CNN architecture
- **PIL** - Image processing

### PDF Generation
- **Python** - Programming language
- **ReportLab** - PDF library
- **Flask** - API server

### Teleconsulting
- **WebRTC** - Video calling
- **Socket.io** - Real-time communication
- **Simple Peer** - WebRTC wrapper

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy & load balancer

---

## 🏗 Architecture

The application follows a **microservices architecture** with the following services:

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│                    http://localhost:8080                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (API Gateway)                       │
└──────┬──────────┬──────────┬──────────┬─────────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│   Auth   │ │   DL   │ │  PDF   │ │  WebRTC  │
│ Service  │ │Service │ │Service │ │  Server  │
│  :8081   │ │ :5000  │ │ :5050  │ │  :3001   │
└────┬─────┘ └────────┘ └────────┘ └──────────┘
     │
     ▼
┌──────────┐  ┌────────┐
│ MongoDB  │  │ Redis  │
│  :27017  │  │ :6379  │
└──────────┘  └────────┘
```

### Service Details

**Auth Service (Port 8081)**
- User authentication (JWT)
- User management (CRUD operations)
- Admin panel API
- Forum API
- Expert dashboard API
- Detection history management
- Uses MongoDB for data storage
- Uses Redis for session caching

**DL Service (Port 5000)**
- Deep learning model inference
- Image preprocessing
- Disease classification (38+ plant diseases)
- Returns disease details and confidence scores
- Uses ResNet9 PyTorch model

**PDF Service (Port 5050)**
- Generates detailed disease reports
- Includes symptoms, causes, treatments
- Downloadable PDF format
- Uses ReportLab library

**WebRTC Server (Port 3001)**
- Video call signaling
- Peer-to-peer connection establishment
- Socket.io for real-time communication

**Frontend (Port 8080)**
- React SPA served by Nginx
- Routes API requests to backend services
- Responsive design for mobile/desktop

---

## 📦 Installation

### Prerequisites

- Docker & Docker Compose
- Git
- Node.js 16+ (for local development)
- Python 3.8+ (for local development)

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Fasal-Mitra-main.git
cd Fasal-Mitra-main/app
```

2. **Set up environment variables**
```bash
# Create .env file in app/auth directory
cp app/auth/.env.example app/auth/.env

# Edit the .env file with your configuration
nano app/auth/.env
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Check service status**
```bash
docker-compose ps
```

5. **Access the application**
- Frontend: http://localhost:8080
- Auth API: http://localhost:8081
- DL API: http://localhost:5000
- PDF API: http://localhost:5050
- WebRTC: http://localhost:3001

### Manual Installation (Development)

#### Auth Service
```bash
cd app/auth
npm install
node index.js
```

#### DL Service
```bash
cd app/dl
pip install -r requirements.txt
python run.py
```

#### PDF Service
```bash
cd app/pdf-service
pip install -r requirements.txt
python app.py
```

#### Frontend
```bash
cd app/frontend-nginx/frontend
npm install
npm start
```

#### WebRTC Server
```bash
cd app/webrtc
npm install
node server.js
```

---

## 🔐 Environment Variables

### Auth Service (.env)

```env
# MongoDB Configuration
MONGODB_URI=mongodb://mongodb:27017/test
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_DATABASE=test

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=8080
NODE_ENV=development

# Cookie Configuration
COOKIE_SECRET=your-cookie-secret-here
```

### Frontend (.env)

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_WEBRTC_URL=http://localhost:3001
```

---

## 🚀 Usage

### Creating an Admin User

1. **Access MongoDB container**
```bash
docker exec -it mongodb mongosh test
```

2. **Create admin user**
```javascript
db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@fasal-mitra.com",
  password: "$2b$10$hashed_password_here",
  phone: "1234567890",
  type: "admin",
  detectionHistory: [],
  createdAt: new Date()
})
```

3. **Login** at http://localhost:8080/auth with admin credentials

### User Registration

1. Navigate to http://localhost:8080/auth
2. Click "Signup"
3. Fill in details:
   - First Name, Last Name
   - Email, Phone
   - Password
   - Select role: Farmer or Expert
4. Submit registration

### Disease Detection Flow

1. **Login** as a farmer
2. Navigate to **Disease Detection** page
3. **Upload** plant image (JPG, PNG)
4. Click **Detect Disease**
5. View results:
   - Disease name
   - Confidence score
   - Symptoms
   - Treatment recommendations
6. **Download PDF** report (optional)
7. Detection saved to history automatically

### Expert Dashboard

1. **Login** as expert/admin
2. Navigate to **Expert Dashboard**
3. View analytics:
   - Total detections across platform
   - Most common diseases (pie chart)
   - Recent detection history (table)
   - Disease trends over time

### Admin Panel

1. **Login** as admin
2. Navigate to **Admin Panel**
3. Manage users:
   - View all users (farmers/experts)
   - Change user types
   - Reset passwords
   - Delete accounts
   - Create new users

### Forum Usage

1. **Login** (any user type)
2. Navigate to **Forum**
3. Create post:
   - Write title and description
   - Submit post
4. Interact:
   - Like posts
   - Comment on discussions
   - View community contributions

### Teleconsulting

1. **Login** (farmer or expert)
2. Navigate to **Teleconsulting**
3. **Copy your ID** to share
4. **Enter peer ID** to call
5. Click **Call** to start video session
6. Use controls:
   - Mute/Unmute microphone
   - Enable/Disable video
   - End call

---

## 📡 API Documentation

### Authentication APIs

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "type": "farmer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/account
Cookie: accessToken=<jwt_token>
```

### Detection APIs

#### Save Detection (Authenticated)
```http
POST /api/detection/save-my-detection
Content-Type: application/json
Cookie: accessToken=<jwt_token>

{
  "plant": "Tomato",
  "disease": "Early Blight"
}
```

#### Detect Disease (DL Service)
```http
POST /dl/detection
Content-Type: multipart/form-data

image: <file>
```

### Expert Dashboard APIs

#### Get Analytics
```http
GET /api/expert/analytics
Cookie: accessToken=<jwt_token>
```

Response:
```json
{
  "totalDetections": 150,
  "totalUsers": 45,
  "topDiseases": [
    { "disease": "Early Blight", "count": 25 },
    { "disease": "Late Blight", "count": 20 }
  ]
}
```

#### Get Detection History
```http
GET /api/expert/detection-history
Cookie: accessToken=<jwt_token>
```

### Admin APIs

#### Get All Users
```http
GET /api/admin/users
Cookie: accessToken=<jwt_token>
```

#### Update User Type
```http
PATCH /api/admin/users/:userId/type
Content-Type: application/json
Cookie: accessToken=<jwt_token>

{
  "type": "expert"
}
```

#### Reset User Password
```http
PATCH /api/admin/users/:userId/password
Content-Type: application/json
Cookie: accessToken=<jwt_token>

{
  "password": "newpassword123"
}
```

#### Delete User
```http
DELETE /api/admin/users/:userId
Cookie: accessToken=<jwt_token>
```

### Forum APIs

#### Create Post
```http
POST /api/forum/posts
Content-Type: application/json
Cookie: accessToken=<jwt_token>

{
  "title": "Post title",
  "description": "Post content"
}
```

#### Get All Posts
```http
GET /api/forum/posts
Cookie: accessToken=<jwt_token>
```

#### Like Post
```http
POST /api/forum/posts/:postId/like
Cookie: accessToken=<jwt_token>
```

---

## 👥 User Roles

### 👨‍🌾 Farmer
- Upload images for disease detection
- View personal detection history
- Download PDF reports
- Participate in forum
- Video call with experts
- Access to dashboard with personal stats

### 👨‍💼 Expert
- All farmer features
- View expert dashboard (all detections)
- Access analytics and insights
- View disease trends
- Provide consultation to farmers

### 👨‍💻 Admin
- All expert features
- Access admin panel
- Manage all users
- Create/delete accounts
- Change user roles
- Reset passwords
- System-wide statistics

---

## 🗄 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  type: String (enum: ['farmer', 'expert', 'admin']),
  detectionHistory: [ObjectId] (ref: 'Disease'),
  createdAt: Date
}
```

### Disease Collection
```javascript
{
  _id: ObjectId,
  plant: String,
  disease: String,
  userId: ObjectId (ref: 'User'),
  name: String,
  symptoms: String,
  trigger: String,
  organic: String,
  chemical: String,
  createdAt: Date
}
```

### Post Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  authorId: ObjectId (ref: 'User'),
  authorName: String,
  authorEmail: String,
  likes: [ObjectId] (ref: 'User'),
  comments: [{
    userId: ObjectId (ref: 'User'),
    userName: String,
    text: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **ResNet9 Model** - Deep learning architecture for image classification
- **Indian Farmers** - For providing valuable feedback and testing
- **Smart India Hackathon 2022** - For the problem statement and inspiration

---

## 📧 Contact

For questions, suggestions, or support:

- **Project Link**: [https://github.com/FASAL-MITRA-SIH-22/Fasal-Mitra](https://github.com/FASAL-MITRA-SIH-22/Fasal-Mitra)
- **Video Demo**: [Watch on YouTube](https://youtu.be/gDaStPFfytY)

---

<div align="center">
  <p>Made with ❤️ for Indian Farmers</p>
  <p>© 2025 Fasal Mitra. All rights reserved.</p>
</div>
