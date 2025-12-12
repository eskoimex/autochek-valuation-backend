
# **Autochek Vehicle Valuation & Financing Backend**  
Backend API built using **NestJS**, **TypeORM**, **SQLite (in-memory)**, and **TypeScript** to power Autochek-like vehicle valuation, loan processing, offers, and associated services.  
Includes authentication, RBAC, rate limiting, external API integration, seeding, logging, validation, and Swagger documentation.

---

## **🚀 Features**
### **Core Modules**
- **Vehicles**
  - VIN ingestion (make, model, year, mileage)
  - External valuation integration (RapidAPI VIN lookup or mocked provider)

- **Valuation**
  - Generates estimated vehicle value
  - Caches valuations for performance

- **Loans**
  - Loan application submission
  - Basic eligibility rules
  - Loan status workflow (pending → approved → rejected → funded)

- **Offers**
  - Auto-generated financing & valuation offers (optional)

### **System Features**
- **JWT Authentication & Authorization**
  - Login / Register
  - Role-based access control (Admin, User)
  - Protected controllers

- **Rate Limiting**
  - Default middleware to protect public endpoints

- **Input Sanitization & Validation**
  - DTO-level class-validator + custom sanitizers

- **Secure Secrets Management**
  - `.env` based configuration
  - ConfigModule + schema validation

- **Structured Logging**
  - NestJS logger + optional Pino/Winston integration

- **Error Handling**
  - Global exception filter
  - Meaningful HTTP error codes
  - External API call fallback handling

- **Swagger Documentation**
  - Protected by JWT
  - `/docs` route

- **Tests**
  - Unit tests for services
  - e2e tests for endpoints (Supertest)

- **Setup**
1. npm install
2. copy .env.example to .env and edit if needed
3. npm run start:dev

| Action                 | URL                                                      |
| ---------------------- | -------------------------------------------------------- |
| **API Base URL**       | [http://localhost:3000](http://localhost:3000)           |
| **Swagger Docs**       | [http://localhost:3000/docs](http://localhost:3000/docs) |
| **Auth Example**       | /api/viauth/login, /api/v1/auth/register                              |
| **Protected Resource** | all edpoints are protectd with role base enabled                                                |


## Useful scripts
# E2e Test
- npm run test

Endpoints:
Swagger available at /docs after starting server.


---

# **⚙️ Environment Variables**
Copy `.env.example` to `.env`:

```bash
cp .env.example .env


❗ Notes

SQLite runs in-memory by default; change DB_FILE=dev.sqlite for persistence.

Rate limiting can be disabled via .env.

External valuation APIs can be mocked if no API key is provided.

Easily portable to PostgreSQL by replacing the TypeORM config.
