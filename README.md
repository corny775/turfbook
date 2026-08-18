
# TurfBook

> A full-stack, role-based facility reservation and management platform with dynamic pricing, availability validation, category-scoped administration, and analytics.

## Overview

**TurfBook** is a full-stack facility booking and management system designed to provide a centralized platform for discovering, reserving, and managing institutional facilities.

Although the project is named TurfBook, it is designed as a **generic facility reservation platform** rather than being limited to sports turfs. The system supports multiple facility categories including academics, sports, events, technology, dining, accommodation, health and wellness, recreation, and infrastructure.

Users can browse facilities, select booking dates and times, receive dynamically calculated pricing, make reservations, view their booking history, and cancel bookings.

Administrators have category-specific access to manage facilities, configure pricing rules, monitor bookings, and access analytics.

---

## Key Features

### 👤 User Management

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Persistent authentication state
- Separate customer and administrator workflows

### 🏢 Facility Management

- Browse available facilities
- View individual facility details
- Facility categorization
- Facility CRUD operations for administrators
- Facility-specific base rates
- Configurable pricing units
- Capacity management

### 📅 Booking System

- Date-based reservations
- Time-based reservations
- Quantity-based reservations
- Hourly facility bookings
- Daily/nightly bookings
- Event/person/session/item-based bookings
- Booking history
- Booking cancellation
- Past-date validation
- Overlapping booking detection

### 💰 Dynamic Pricing

The platform includes a dedicated pricing engine that can calculate the final booking price based on:

- Base facility rate
- Requested quantity
- Peak-hour pricing
- Weekend pricing
- Discounts
- Tax

The backend calculates the final price rather than trusting values supplied by the frontend.

### 🔐 Category-Based Administration

Administrators are associated with a specific facility category.

For example:

```text
Academic Admin
      ↓
Academic facilities only

Sports Admin
      ↓
Sports & Fitness facilities only

Events Admin
      ↓
Events & Conference facilities only
````

This prevents administrators from modifying facilities outside their assigned category.

### 📊 Analytics

The platform includes an analytics subsystem for administrators to examine booking and operational information.

### 🖥️ Admin Dashboard

Administrators can access dedicated interfaces for:

* Facility management
* Pricing rule management
* Booking management
* Analytics
* Category-specific operations

---

# Facility Categories

TurfBook currently supports the following categories:

| Category                   | Example Facilities                                       |
| -------------------------- | -------------------------------------------------------- |
| Academic                   | Classrooms, laboratories, study rooms                    |
| Sports & Fitness           | Football turfs, gym, swimming pool                       |
| Events & Conference        | Auditorium, conference halls, seminar halls              |
| Technology & Innovation    | Computer labs, innovation centres, maker spaces          |
| Food & Dining              | Cafeterias, canteens, food courts                        |
| Accommodation              | Guest houses, hostels, dormitories                       |
| Health & Wellness          | Medical centres, counselling rooms, first-aid facilities |
| Recreation & Culture       | Student clubs, music rooms, recreation spaces            |
| Transport & Infrastructure | Parking, buses, EV charging and utilities                |

---

# System Architecture

```text
                         TURFBOOK
                            │
             ┌──────────────┴──────────────┐
             │                             │
         CUSTOMER                       ADMIN
             │                             │
      ┌──────┴──────┐              ┌───────┴────────┐
      │             │              │                │
   Browse        Book          Facilities       Analytics
      │             │              │
      │             │              ├── Create
      │             │              ├── Update
      │             │              └── Delete
      │             │
      └─────────────┘
             │
             ▼
      Vue + Quasar
             │
          Pinia
             │
          Axios
             │
             ▼
       Express REST API
             │
      ┌──────┼──────────────┐
      │      │              │
     Auth  Bookings     Facilities
      │      │              │
      │      ├── Pricing    ├── CRUD
      │      ├── Validation └── Category Scope
      │      └── Availability
      │
      └──────────────┐
                     ▼
                   MySQL
                     │
       ┌─────────────┼─────────────┐
       │             │             │
      Users      Facilities      Bookings
                     │
                     ▼
               Pricing Rules
```

---

# Technology Stack

## Frontend

* **Vue.js**
* **Quasar Framework**
* **Pinia**
* **Vue Router**
* **Axios**

## Backend

* **Node.js**
* **Express.js**
* **JWT**
* **bcryptjs**
* **CORS**
* **dotenv**

## Database

* **MySQL**
* **mysql2**

---

# Project Structure

The project follows a separation between the frontend application and backend API.

```text
TurfBook/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing
│   │   │   ├── Login
│   │   │   ├── Signup
│   │   │   ├── Dashboard
│   │   │   ├── Facilities
│   │   │   ├── Bookings
│   │   │   ├── Booking History
│   │   │   ├── Admin
│   │   │   ├── Analytics
│   │   │   └── Pricing Rules
│   │   │
│   │   ├── components/
│   │   ├── router/
│   │   ├── stores/
│   │   │   └── auth
│   │   └── boot/
│   │
│   └── ...
│
├── backend/
│   ├── controllers/
│   │   ├── authController
│   │   ├── bookingController
│   │   ├── facilityController
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── authMiddleware
│   │   └── adminMiddleware
│   │
│   ├── routes/
│   │   ├── auth
│   │   ├── bookings
│   │   ├── facilities
│   │   ├── categories
│   │   ├── pricing-rules
│   │   ├── admin
│   │   └── analytics
│   │
│   ├── services/
│   │   └── pricingService
│   │
│   ├── database/
│   │   └── schema.sql
│   │
│   └── server.js
│
└── README.md
```

> Directory names may vary slightly depending on the current repository organization.

---

# Database Design

The core database entities include:

```text
users
categories
category_admin_invites
facilities
pricing_rules
bookings
```

The primary relationships are:

```text
Category
   │
   ├── Facilities
   │       │
   │       └── Pricing Rules
   │
   └── Category Administrators

User
   │
   └── Bookings
           │
           └── Facility
```

### Bookings

A booking contains information such as:

* User
* Facility
* Booking date
* Start time
* End time
* Quantity
* Amount
* Status

Booking status currently includes:

```text
Booked
Cancelled
```

---

# Booking Workflow

A typical booking follows this process:

```text
Login
  │
  ▼
Browse Categories
  │
  ▼
Select Facility
  │
  ▼
Choose Date / Time / Quantity
  │
  ▼
Calculate Price
  │
  ▼
Check Availability
  │
  ├───────────────┐
  │               │
Available       Conflict
  │               │
  ▼               ▼
Create          Reject
Booking         Request
  │
  ▼
Booking History
```

---

# Dynamic Pricing Engine

Pricing is handled on the backend through a dedicated pricing service.

The basic calculation begins with:

```text
Base Price = Base Rate × Quantity
```

The system can then apply:

```text
Base Price
     │
     ▼
Peak Hour Adjustment
     │
     ▼
Weekend Adjustment
     │
     ▼
Discount
     │
     ▼
Tax
     │
     ▼
Final Price
```

For example, a facility with:

```text
Base Rate = ₹800/hour
Quantity = 2 hours
```

starts with:

```text
₹800 × 2 = ₹1600
```

Additional pricing rules can then modify the amount before the final price is returned.

The pricing service also provides a breakdown of the calculation so that the frontend can display how the final amount was produced.

---

# Availability & Conflict Detection

TurfBook performs availability validation on the backend.

For hourly facilities, overlapping bookings are detected using the requested start and end times.

For example:

```text
Existing:
18:00 ───────── 20:00

Requested:
19:00 ───────── 21:00
```

The request is rejected because the time ranges overlap.

For daily/nightly facilities, the system performs date-range overlap checks.

This prevents multiple users from reserving the same resource for conflicting periods.

---

# Security

Security is handled at multiple levels.

### JWT Authentication

Authenticated requests use:

```text
Authorization: Bearer <JWT>
```

### Password Security

Passwords are hashed using bcrypt before being stored.

### Role-Based Authorization

Administrative operations require administrator privileges.

### Category Isolation

Administrators can only manage facilities belonging to their assigned category.

### Server-Side Price Calculation

Booking prices are recalculated on the server rather than trusting an amount supplied by the client.

### Booking Validation

The backend validates:

* Booking dates
* Booking times
* Booking quantities
* Facility availability
* Booking conflicts

---

# API Structure

The backend exposes REST-style endpoints grouped by functionality.

```text
/api/auth
/api/facilities
/api/bookings
/api/pricing-rules
/api/admin
/api/categories
/api/analytics
```

Examples of facility operations include:

```text
GET    /api/facilities
GET    /api/facilities/:id

POST   /api/facilities
PUT    /api/facilities/:id
DELETE /api/facilities/:id
```

Administrative facility operations are protected by authentication and admin authorization middleware.

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MySQL

---

## 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd TurfBook
```

---

## 2. Install backend dependencies

```bash
cd backend
npm install
```

---

## 3. Configure environment variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=turfbook

JWT_SECRET=your_jwt_secret
```

Use your own database credentials and secret values.

---

## 4. Set up the database

Create the MySQL database and execute the provided schema:

```bash
mysql -u root -p turfbook < schema.sql
```

The schema creates the required tables and includes development/sample data.

---

## 5. Start the backend

From the backend directory:

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

---

## 6. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 7. Start the frontend

```bash
npm run dev
```

The Quasar development server will provide the frontend URL.

---

# Example User Roles

### Customer

A customer can:

```text
Register
   ↓
Login
   ↓
Browse facilities
   ↓
Select facility
   ↓
Book
   ↓
View booking history
   ↓
Cancel booking
```

### Category Administrator

An administrator can:

```text
Login
   ↓
Access admin dashboard
   ↓
Manage category facilities
   ↓
Configure pricing rules
   ↓
Review bookings
   ↓
View analytics
```

---

# Design Philosophy

TurfBook is designed around the idea that a booking system should not be tied to a single resource type.

Instead of building separate systems for:

```text
Football Turfs
Classrooms
Auditoriums
Guest Houses
Computer Labs
```

the project models them all as **facilities**.

The facility's:

```text
category
base rate
pricing unit
capacity
pricing rules
```

determine how it behaves.

This makes the system extensible and allows new facility types to be introduced without redesigning the entire booking architecture.

---

# Future Improvements

Potential extensions include:

* Online payment integration
* Email/SMS booking confirmations
* QR-based booking verification
* Calendar integration
* Advanced availability calendars
* Recurring bookings
* Facility reviews and ratings
* Notifications
* More advanced analytics
* Revenue reports
* Environment-based admin invite configuration
* More granular permissions
* Audit logs
* Automated booking reminders

---

# Project Highlights

The main technical challenges addressed by TurfBook include:

* Designing a reusable facility model
* Implementing JWT authentication
* Implementing role-based authorization
* Restricting administrators by category
* Building a generic booking engine
* Supporting multiple pricing units
* Implementing dynamic pricing
* Preventing booking conflicts
* Keeping pricing calculations server-side
* Connecting a Vue frontend with a RESTful Express backend
* Designing relational database relationships for users, facilities, bookings and pricing

---

# Status

🚧 **Active Development**

TurfBook is currently a functional full-stack facility booking and management system with customer, administrative, booking, pricing, and analytics functionality.

---

# License

This project is intended for educational and development purposes.

Add an appropriate open-source license here if you plan to distribute the project publicly.

```

### A couple of things I'd change before you push it

I deliberately **didn't invent details** that weren't supported by the project files—for example, payment processing, email notifications, or specific analytics metrics. The README labels those as future improvements instead.

Also, I'd recommend putting a **short project screenshot/GIF immediately below the title** once you have one. For a GitHub portfolio project, that will make the README substantially stronger than a text-only README.
```
