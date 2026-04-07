# 🔥 SCEMAS – Fire Risk Detection & Alert System

SCEMAS (Smart City Environmental Monitoring and Alert System) is a full-stack system designed to detect fire risks in urban environments, analyze sensor data, and notify relevant stakeholders in real time.

Built for SE 3A04 – Software Design II (Large System Design).

# 📌 Overview
SCEMAS combines:
🌡️ Real-time sensor data (temperature, smoke, humidity)
🔥 Fire risk analysis (real-time + historical data)
🚨 Alert system for fire departments
🗺️ Visualization via maps and heatmaps
Goal: early fire detection + faster response + safer cities

# 🏗️ Architecture
Hybrid architecture:
PAC (Presentation–Abstraction–Control) → modular UI + multiple user roles
Blackboard (Data-Centered) → shared data space for real-time decision-making
Chosen to handle uncertainty, real-time data, and multiple cooperating components

# 🧩 Key Features
🔐 User authentication (login / register / RBAC)
🌡️ Sensor data ingestion & validation
🔥 Fire risk prediction
🚨 Alert generation & notification
🗺️ Interactive maps + heatmaps
👥 Multi-role support (public, firefighters, engineers)

# 🧱 Tech Stack
Frontend
Expo (React Native + Web)
TypeScript
Expo Router
Backend
Java 17
Spring Boot (WebMVC)
Maven

# 🔄 Example Flow
Sensor sends data
System evaluates fire risk
Threshold exceeded
Alert sent to fire services

# 🚀 Getting Started
Frontend
cd frontend
npm install
npm run start
Backend
cd backend
mvn spring-boot:run

# 📊 Design Docs
Deliverable 1 → Requirements (SRS)
Deliverable 2 → Architecture (PAC + Blackboard)
Deliverable 3 → Detailed Design (state charts, sequence diagrams)

#👨‍💻 Team
SE 3A04 Group Project
Anas Abdur Rahman · Marco Dava · Owen Johnson · Nathan Hum · Tamunoemi Membere
