# Full-Stack Inventory & Order Management System

A full-stack, containerized web application for managing products, customers, orders, and tracking inventory levels. Built with a modern tech stack and designed to be robust and highly responsive.

## 🚀 Live Demo

- **Frontend**: [https://ethara-ai-assessment-9gg730ynf-tamanna-s-projects3.vercel.app/](https://ethara-ai-assessment-9gg730ynf-tamanna-s-projects3.vercel.app/)
- **Backend API Docs**: [https://ethara-ai-assessment-production-4266.up.railway.app/docs](https://ethara-ai-assessment-production-4266.up.railway.app/docs)

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Lucide Icons, plain CSS with glassmorphism UI
- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Deployment**: Vercel (Frontend), Railway (Backend & DB)

## ✨ Features

- **Product Management**: Add, update, view, and delete products. Enforces unique SKUs.
- **Customer Management**: Add, view, and delete customers. Enforces unique email addresses.
- **Order Management**: Create new orders, linking customers to multiple products. 
- **Inventory Tracking**: 
  - Automatically calculates total order amount based on product quantities.
  - Automatically reduces product stock upon successful order creation.
  - Prevents order creation if product stock is insufficient.
- **Responsive Dashboard**: Beautiful UI providing quick insights into total metrics and low-stock alerts.

## 🐳 Running Locally (Docker)

The easiest way to run the application locally is using Docker Compose.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tamanna2311/Ethara-AI-assessment.git
   cd Ethara-AI-assessment
   ```

2. **Start the containers**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend UI: `http://localhost`
   - Backend API Docs (Swagger): `http://localhost:8000/docs`

## 📁 Project Structure

- `/frontend` - React SPA (Single Page Application).
- `/backend` - FastAPI application (Controllers, Models, Schemas).
- `docker-compose.yml` - Orchestrates the frontend, backend, and postgres database services.
