# 🏪 CUNGA

A role-based shop management system built with **NestJS**, **Prisma ORM**, and **PostgreSQL**.  
This application helps manage products, inventory, sales, and product requests within a shop environment.

---

## 📌 Overview

CUNGA is designed for small to medium businesses that require structured management of:

- Products
- Inventory
- Sales
- Product Requests
- Role-based User Access

The system supports **three main roles**:

1. **Business Owner**
2. **Shop Keeper**
3. **Stock Manager**

Each role has specific permissions and responsibilities.

---

## 👥 User Roles & Responsibilities

### 🧑‍💼 Business Owner
- View all sales
- Monitor inventory
- Approve product requests
- Manage users
- View reports

### 🛒 Shop Keeper
- Sell products
- View available inventory
- Create product requests (if stock is low)

### 📦 Stock Manager
- Add new products
- Update inventory
- Manage stock levels
- Process product requests

---

## 🛠 Tech Stack

- **Backend Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **Password Hashing:** bcrypt
- **Package Manager:** pnpm / npm

---

## 📂 Project Structure

src/
│
├── auth/ # Authentication (JWT, login)
├── users/ # User management
├── products/ # Product management
├── inventory/ # Inventory management
├── sales/ # Selling logic
├── product-request/ # Product request handling
├── prisma/ # Prisma service
│
└── main.ts


