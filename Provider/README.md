# ♻️ Provider Module (Recycling Center Dashboard)

The **Provider Module** is designed for recycling centers, NGOs, and waste collectors to efficiently manage pickup requests and operations within the Sustainability Connect platform.

---

## 🚀 Features

* 🔐 **Authentication**

  * Secure Login for Providers
  * Access to personalized dashboard

* 📦 **Pickup Request Management**

  * View incoming waste pickup requests
  * Accept / Reject requests
  * Update pickup status:

    * Scheduled → Accepted → Collected → Completed

* 📊 **Dashboard Overview**

  * View all assigned pickups
  * Real-time status updates

* ⚙️ **Service Management**

  * Enable/Disable services
  * Manage operational availability

* 📍 **Center-based Filtering**

  * View only requests assigned to your center
  * Efficient request handling

---

## 🛠️ Tech Stack

* **Frontend:** React.js
* **State Management:** React Hooks
* **API Integration:** REST APIs (Node.js backend)
* **Styling:** CSS / Tailwind (if used)

---

## 📂 Folder Structure (Simplified)

```id="2g6gtp"
Provider/
│── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
│── public/
│── package.json
```

---

## 📸 Screenshots

### 📊 Dashboard & Login

<p align="center">
 <img src="./Screenshots/login.png" width="49%"/>
  <img src="./Screenshots/dashboard.png" width="50%" />
</p>

---

### 📦 Pickup Request Management

<p align="center">
  <img src="./Screenshots/request.png" width="100%" />
</p>

---

### ⚙️ Service Management

<p align="center">
  <img src="./Screenshots/service.png" width="100%" />
</p>

---

## ⚙️ Getting Started

### 1. Navigate to Provider module

```bash id="k3z82r"
cd Provider
```

### 2. Install dependencies

```bash id="n18cfs"
npm install
```

### 3. Run the application

```bash id="a6f4q4"
npm start
```

---

## 🔗 Backend Dependency

This module connects with:

* `sus-app-backend` (Node.js + Express)

Make sure the backend server is running for:

* Pickup requests
* Status updates
* Authentication

---

## 🔄 Workflow

```id="vr8d2o"
User schedules pickup
        ↓
Provider receives request
        ↓
Accept / Reject
        ↓
Mark as Collected
        ↓
Mark as Completed
```

---

## 🎯 Purpose

The Provider Module helps:

* Streamline waste collection ♻️
* Improve operational efficiency ⚙️
* Enable real-time tracking of pickups 📍

---

## 👨‍💻 Author

**[Anuj Raghuwanshi](https://github.com/AnujRaghuwanshi)**

---
