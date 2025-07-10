# Node.js JWT Auth API with Express & TypeScript

This project is a **Node.js RESTful API** built with **Express** and **TypeScript**, implementing **JWT-based authentication** for secure access. It follows a modular structure and includes various middleware for improving **security**, **performance**, and **developer experience**.

The project also supports **database migration and seeding** using Sequelize, ensuring easy setup and reproducibility of the database schema across environments.

---


## ✨ Features

This application delivers a simple yet robust JWT-based authentication flow, with PostgreSQL as the primary datastore. Below is an overview of the core features:

### 🔐 JWT Authentication

- Full **JWT authentication** system: 
  - Protects API endpoints using **JSON Web Tokens (JWT)**.
  - All secured requests must include a valid JWT in the `Authorization` header (`Bearer <token>`).
  - The token is verified before any processing happens, and requests with missing or invalid tokens receive a `401 Unauthorized` response.
  - Ensure only authenticated users can interact with the transaction API.
  - Helps trace and attribute transactions to specific authenticated consumers or services.

- **Authentication Endpoints**:
  - `POST /auth/login` — Authenticates user with `username` and `password`, returns, returns:
    - `AccessToken`
    - `RefreshToken`
    - `ExpirationAt`
    - `TokenType`
  - `POST /auth/refresh-token` — Accepts a valid `RefreshToken` and issues a new `AccessToken`.

- **RSA key pairs** are used to sign and verify tokens (more secure than symmetric secrets)
  - Stored in `/keys` directory: `privateKey.pem` and `publicKey.pem`
  - Keys are generated using `OpenSSL`


### 🛡️ Security & Middleware

The service is designed with security and extensibility in mind, using several middlewares:

- **Logger Middleware**: Logs incoming requests and outgoing responses, including method, URL, status code, and response time. Helpful for debugging and monitoring.

- **Helmet**: Sets secure HTTP headers to protect the app from common web vulnerabilities (e.g., XSS, clickjacking, MIME sniffing).

- **CORS (Cross-Origin Resource Sharing)**: Enables or restricts requests from different origins, allowing secure interaction with frontend applications.

- **Body Parser (express.json)**: Parses JSON request bodies and makes the data available on `req.body`.

- **HTTP Parameter Pollution Detection**: Validates query parameters to prevent duplicate parameters, protecting against HTTP parameter pollution attacks.

- **Request ID Generator**: Assigns a unique `X-Request-Id` to every request, enabling precise tracking and tracing across distributed systems.

- **Response Compression**: Compresses responses using GZIP to reduce payload size and improve performance.

- **Content-Type Validator**: Enforces `application/json` for incoming requests to maintain consistency and prevent malformed requests.

- **Rate Limiting**: Protects sensitive endpoints (`/auth` and `/api`) from brute force and abuse by limiting request rates.

- **404 Not Found Handler**: Captures and gracefully handles requests to undefined routes, returning a proper 404 response.

- **Centralized Error Handling**: Catches and formats errors consistently throughout the application for easier debugging and API reliability.


### 📦 Database Migration & Seeding

Leverages Sequelize's migration system to version-control database schema and seed essential data into tables. Simplifies environment setup and promotes reproducibility


---


## 🤖 Tech Stack

This project leverages a modern and secure **Node.js-based** stack to build a scalable, maintainable, and secure REST API. Below is an overview of the core technologies and tools used:

| **Component**          | **Description**                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------|
| Language               | **TypeScript** — statically typed superset of JavaScript for safer and scalable development              |
| Runtime                | **Node.js** — JavaScript runtime built on Chrome’s V8 engine                                             |
| Web Framework          | **Express.js** — minimalist and flexible web application framework                                       |
| ORM                    | **Sequelize** — promise-based Node.js ORM for Postgres with support for migrations and seeders           |
| Database               | **PostgreSQL** — powerful, open-source relational database                                               |
| Authentication         | **JSON Web Tokens (JWT)** — secure and stateless user authentication                                     |
| Security Middleware    | **Helmet, CORS, Parameter Pollution Detector** — HTTP header hardening, origin control, and protection   |
| Logging                | **Custom Logger Middleware** — structured HTTP request/response logging                                  |
| Rate Limiting          | **Express-rate-limit** — limits repeated requests to public APIs to prevent abuse                        |
| Validation             | **Zod** — TypeScript-first schema declaration and validation library                                     |
| Compression            | **compression** — reduces response sizes for improved performance                                        |
| Migration & Seeding    | **Sequelize CLI** — for database schema generation and initial data population                           |
| Containerization       | **Docker** — containerized environment for app and database with Docker Compose support                  |


---

## 🧱 Architecture Overview

The project follows a modular and layered folder structure for maintainability, scalability, and separation of concerns. Below is a high-level overview of the folder architecture:

```
📁node-express-auth-demo/
├── 📁docker/
│   ├── 📁app/                # Dockerfile and setup for Node.js app container
│   └── 📁postgres/           # PostgreSQL Docker setup with init scripts or volumes
├── 📁keys/                   # RSA key pairs used for signing and verifying JWT tokens
├── 📁logs/                   # Directory for application and HTTP logs
├── 📁migrations/             # Sequelize migrations and seeders
├── 📁src/                    # Application source code
│   ├── 📁config/             # Configuration files (DB, environment, Sequelize)
│   ├── 📁controllers/        # Express route handlers, business logic endpoints
│   ├── 📁dtos/               # Data Transfer Objects for validation and typing
│   ├── 📁exceptions/         # Custom error classes for centralized error handling
│   ├── 📁middlewares/        # Express middlewares (security, logging, rate limiters, etc.)
│   ├── 📁models/             # Sequelize models representing DB entities
│   ├── 📁routes/             # API route definitions and registration
│   ├── 📁services/           # Business logic and service layer between controllers and models
│   ├── 📁types/              # Custom global TypeScript type definitions
│   └── 📁utils/              # Utility functions (e.g., token generation, logger)
├── .env                    # Environment variables for configuration (DB credentials, secrets, etc.)
├── .sequelizerc            # Sequelize CLI configuration
├── entrypoint.sh           # Script executed at container startup (wait-for-db, run migrations, start app)
├── package.json            # Node.js project metadata and scripts
├── sequelize.config.js     # Wrapper to load TypeScript Sequelize config via ts-node
├── tsconfig.json           # TypeScript compiler configuration
└── README.md               # Project documentation
```

This structure promotes clean separation of concerns and makes it easy to scale features independently as the application grows.

---

## 🛠️ Installation & Setup  

Follow the instructions below to get the project up and running in your local development environment. You may run it natively or via Docker depending on your preference.  
### ✅ Prerequisites

Make sure the following tools are installed on your system:

| **Tool**                                                    | **Description**                                    |
|-------------------------------------------------------------|----------------------------------------------------|
| [Node.js](https://nodejs.org/)                              | JavaScript runtime environment (v20+)              |
| [npm](https://www.npmjs.com/)                               | Node.js package manager (bundled with Node.js)     |
| [Make](https://www.gnu.org/software/make/)                  | Build automation tool (`make`)                     |
| [PostgreSQL](https://www.postgresql.org/)                   | Relational database system (v14+)                  |
| [Docker](https://www.docker.com/)                           | Containerization platform (optional)               |
| [OpenSSL](https://www.openssl.org/)                         | Tool to generate RSA key pairs for JWT             |

### 🔁 Clone the Project  

Clone the repository:  

```bash
git clone https://github.com/yoanesber/NodeJs-Express-API-with-JWT.git
cd NodeJs-Express-API-with-JWT
```

### ⚙️ Configure `.env` File  

Set up your **database** and **JWT configuration** in `.env` file. Create a `.env` file at the project root directory:  

```properties
# Application Configuration
PORT=4000
# development, production, test
NODE_ENV=development

# Logging Configuration
LOG_LEVEL=info
LOG_DIRECTORY=../../logs

# Postgre Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=P@ssw0rd
DB_NAME=nodejs_demo

# JWT Configuration
JWT_SECRET=a-string-secret-at-least-256-bits-long
JWT_EXPIRES_IN=1d
JWT_ISSUER=http://localhost:3000/auth/login
# RS256 atau HS256
JWT_ALGORITHM=HS256
# 30 days in hours
REFRESH_TOKEN_EXPIRATION_HOURS=720

# Paths for JWT keys
JWT_PRIVATE_KEY_PATH=./keys/privateKey.pem
JWT_PUBLIC_KEY_PATH=./keys/publicKey.pem

```

### 🔑 Generate RSA Key for JWT (If Using `RS256`)  

If you are using `JWT_ALGORITHM=RS256`, generate the **RSA key** pair for **JWT signing** by running this file:  
```bash
./generate-jwt-key.sh
```

- **Notes**:  
  - On **Linux/macOS**: Run the script directly
  - On **Windows**: Use **WSL** to execute the `.sh` script

This will generate:
  - `./keys/privateKey.pem`
  - `./keys/publicKey.pem`


These files will be referenced by your `.env`:
```properties
JWT_ALGORITHM=RS256
JWT_PRIVATE_KEY_PATH=./keys/privateKey.pem
JWT_PUBLIC_KEY_PATH=./keys/publicKey.pem
```

### 👤 Create Dedicated PostgreSQL User (Recommended)

For security reasons, it's recommended to avoid using the default postgres superuser. Use the following SQL script to create a dedicated user (`appuser`) and assign permissions:

```sql
-- Create appuser and database
CREATE USER appuser WITH PASSWORD 'app@123';

-- Allow user to connect to database
GRANT CONNECT, TEMP, CREATE ON DATABASE nodejs_demo TO appuser;

-- Grant permissions on public schema
GRANT USAGE, CREATE ON SCHEMA public TO appuser;

-- Grant all permissions on existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO appuser;

-- Grant all permissions on sequences (if using SERIAL/BIGSERIAL ids)
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO appuser;

-- Ensure future tables/sequences will be accessible too
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO appuser;

-- Ensure future sequences will be accessible too
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO appuser;
```

Update your `.env` accordingly:
```properties
DB_USER=appuser
DB_PASS=app@123
```

---


## 🚀 Running the Application  

This section provides step-by-step instructions to run the application either **locally** or via **Docker containers**.

- **Notes**:  
  - All commands are defined in the `Makefile`.
  - To run using `make`, ensure that `make` is installed on your system.
  - To run the application in containers, make sure `Docker` is installed and running.
  - Ensure you have `NodeJs` and `npm` installed on your system

### 📦 Install Dependencies

Make sure all dependencies are properly installed:  

```bash
make install
```

### 🔧 Run Locally (Non-containerized)

Ensure PostgreSQL is running locally, then:

```bash
make dev
```

This command will run the application in development mode, listening on port `4000` by default.

### Run Migrations and Seed Initial Data

To create the database schema and seed initial data, run:

```bash
make refresh-migrate-seed
```

This will execute all pending migrations and seed the database with initial data.

### 🐳 Run Using Docker

To build and run all services (PostgreSQL and NodeJs app):

```bash
make docker-up
```

To stop and remove all containers:

```bash
make docker-down
```

- **Notes**:  
  - Before running the application inside Docker, make sure to update your environment variables `.env`
    - Change `DB_HOST=localhost` to `DB_HOST=node-jwt-postgres`.

### 🟢 Application is Running

Now your application is accessible at:
```bash
http://localhost:4000
```

---

## 🧪 Testing Scenarios  

This section outlines various test scenarios to validate the functionality of the application, including authentication, token management, and middleware behavior. Each scenario includes the expected request and response formats.

### 🔐 Login API

**Endpoint**: `POST https://localhost:4000/auth/login`

#### ✅ Scenario 1: Successful Login

**Request**:

```json
{
  "username": "admin",
  "password": "P@ssw0rd"
}
```

**Response**: Get a `200 OK` response with tokens.

```json
{
  "message": "Login successful",
  "error": null,
  "path": "/auth/login",
  "data": {
    "accessToken": "<JWT>",
    "refreshToken": "<UUID>",
    "expirationAt": "2025-05-25T12:58:00Z",
    "tokenType": "Bearer"
  },
  "timestamp": "2025-05-23T12:58:00Z"
}
```

#### ❌ Scenario 2: Invalid Credentials

**Request with invalid user**:
```json
{
  "username": "invalid_user",
  "password": "P@ssw0rd"
}
```

**Response**: Get a `401 Unauthorized` response.
```json
{
    "message": "Invalid username or password",
    "error": "User not found",
    "data": null,
    "path": "/auth/login",
    "timestamp": "2025-07-08T11:42:20.623Z"
}
```

**Request with invalid password**:
```json
{
  "username": "admin",
  "password": "invalid_password"
}
```

**Response**: Get a `401 Unauthorized` response.
```json
{
    "message": "Invalid username or password",
    "error": "Password does not match",
    "data": null,
    "path": "/auth/login",
    "timestamp": "2025-07-08T11:42:53.187Z"
}
```

#### 🚫 Scenario 3: Disabled User

Precondition:
```sql
UPDATE users SET isEnabled = false WHERE id = 2;
```

**Request**:
```json
{
  "username": "userone",
  "password": "P@ssw0rd"
}
```

**Response**: Get a `403 Forbidden` response.
```json
{
    "message": "Account is disabled",
    "error": "User account is not enabled. Please contact support.",
    "data": null,
    "path": "/auth/login",
    "timestamp": "2025-07-08T11:43:55.948Z"
}
```


### 🔄 Refresh Token API

**Endpoint**: `POST https://localhost:4000/auth/refresh-token`

#### ✅ Scenario 1: Successful Refresh Token

**Request**:
```json
{
  "refreshToken": "<valid_uuid_refresh_token>"
}
```

**Response**: Get a `200 OK` response with new tokens.
```json
{
    "message": "Refresh token successful",
    "error": null,
    "data": {
        "newTokens": {
            "accessToken": "<JWT_TOKEN>",
            "refreshToken": "<NEW_UUID>",
            "expirationAt": "2025-07-09T11:47:44.000Z",
            "tokenType": "Bearer"
        }
    },
    "path": "/auth/refresh-token",
    "timestamp": "2025-07-08T11:47:44.728Z"
}
```

#### ❌ Scenario 2: Invalid Refresh Token

**Request**:
```json
{
  "refreshToken": "<invalid_refresh_token>"
}
```

**Response**: Get a `401 Unauthorized` response.
```json
{
    "message": "Invalid or expired refresh token",
    "error": "Refresh token not found",
    "data": null,
    "path": "/auth/refresh-token",
    "timestamp": "2025-07-08T11:48:40.919Z"
}
```

#### 🔁 Scenario 3: Expired Refresh Token (Auto Regenerate)

**Request**:
```json
{
  "refreshToken": "<expired_refresh_token>"
}
```

**Response**: Get a `401 Unauthorized` response.
```json
{
    "message": "Expired refresh token",
    "error": "Refresh token has expired",
    "data": null,
    "path": "/auth/refresh-token",
    "timestamp": "2025-07-08T11:49:33.385Z"
}
```

### 👨‍👩‍👧‍👦 API with JWT

#### Scenario 1: Get data notes with valid JWT

Send a `GET` request to `/api/notes`.

**Endpoint**: 
```http
GET http://localhost:4000/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc
```

**Precondition**: User already logged in and obtained a valid JWT

Include the JWT in the `Authorization` header: `Bearer <token>`.
```http
Authorization: Bearer <valid_token>
```

**Response**: Get a `200 OK` response with the notes data.
```json
{
    "message": "Notes fetched successfully",
    "error": null,
    "data": [
        {
            "id": "29ab24d6-c897-4954-91e5-a1af496604c8",
            "title": "Iste caelestis modi.",
            "content": "Abundans ea toties demoror aperte....",
            "createdAt": "2025-07-07T16:34:01.616Z",
            "updatedAt": "2025-07-07T16:34:01.616Z"
        },
        {
            "id": "806ca81e-4422-4636-8f09-732515114fb9",
            "title": "Adsuesco acidus solio.",
            "content": "Alo appono verus trepide pariatur suppellex ....",
            "createdAt": "2025-07-07T16:34:01.616Z",
            "updatedAt": "2025-07-07T16:34:01.616Z"
        }
    ],
    "path": "/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc",
    "timestamp": "2025-07-08T11:53:09.348Z"
}
```

#### Scenario 2: Get data notes without JWT

Send a `GET` request to `/api/notes` without `Authorization` header.

**Endpoint**: 
```http
GET http://localhost:4000/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc
```

**Precondition**: No JWT token is provided.

**Response**: Get a `401 Unauthorized` response.
```json
{
    "message": "Missing or invalid Authorization header",
    "error": "Authorization header must start with 'Bearer '",
    "data": null,
    "path": "/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc",
    "timestamp": "2025-07-08T11:57:19.792Z"
}
```

#### Scenario 3: Get data notes with invalid JWT

Send a `GET` request to `/api/notes` with `Authorization: Bearer invalidtoken`.

**Endpoint**: 
```http
GET http://localhost:4000/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc
```

**Precondition**: JWT token is malformed or expired.
```http
Authorization: Bearer <malformed_token>
```

**Response**: Get a `401 Unauthorized` response.
```json
{
    "message": "Invalid token",
    "error": "jwt malformed",
    "data": null,
    "path": "/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc",
    "timestamp": "2025-07-08T11:59:01.994Z"
}
```


### 🧪 Middleware Test Scenarios

#### Scenario 1: Logger Middleware

Send a `GET` request to `/api/notes`.

**Endpoint**: 
```http
GET http://localhost:4000/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc
```

**Precondition**: API is running and a request is made.

**Expected Log Output**: See the log output in the log file `logs/combined.log`.
```plaintext
2025-07-08T11:53:09.350Z [INFO]: GET /api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc 200 - 34ms {"requestId":"c183abc5-f4f1-4a39-bf4c-4a6b77843215","method":"GET","url":"/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc","statusCode":200,"duration":34,"ip":"::1","userAgent":"PostmanRuntime/7.44.1"}
2025-07-08T11:57:19.793Z [INFO]: GET /api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc 401 - 2ms {"requestId":"eba3c1b4-f999-46e9-8f9c-718d0faa4b3c","method":"GET","url":"/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc","statusCode":401,"duration":2,"ip":"::1","userAgent":"PostmanRuntime/7.44.1"}
```

#### Scenario 2: Helmet Middleware

Send a `GET` request to `/api/notes`.

**Endpoint**: 
```http
GET http://localhost:4000/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc
```

**Precondition**: A request is made.

**Inspect response headers**:

```http
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 0
```

#### Scenario 3: CORS Middleware

Send a `GET` request to `/api/notes` from a different origin (e.g., using cURL or a frontend app).

**Endpoint**: 
```http
GET http://localhost:4000/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc
```

**Precondition**: The request is made from a different origin.
```bash
curl -X GET "http://localhost:4000/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc" -H "Origin: http://example.com" -v
```

**Expected Result**: Get a `403 Forbidden` response due to CORS policy.
```bash
< HTTP/1.1 403 Forbidden
< Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
< Cross-Origin-Opener-Policy: same-origin
< Cross-Origin-Resource-Policy: same-origin
< Origin-Agent-Cluster: ?1
< Referrer-Policy: no-referrer
< Strict-Transport-Security: max-age=31536000; includeSubDomains
< X-Content-Type-Options: nosniff
< X-DNS-Prefetch-Control: off
< X-Download-Options: noopen
< X-Frame-Options: SAMEORIGIN
< X-Permitted-Cross-Domain-Policies: none
< X-XSS-Protection: 0
< Content-Type: application/json; charset=utf-8
< Content-Length: 242
< ETag: W/"f2-+40wiTUWr3CX65KsDKc4rARV8Z4"
< Date: Tue, 08 Jul 2025 12:35:56 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"message":"Forbidden","error":"CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.","data":null,"path":"/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc","timestamp":"2025-07-08T12:35:56.994Z"}* Connection #0 to host localhost left intact
```

#### Scenario 4: Invalid Content-Type

Send a `POST` request to `/api/notes` with a JSON body.

**Endpoint**: 
```http
POST http://localhost:4000/api/notes
Content-Type: text/plain
```

**Request Body**:
```json
{
    "title": "New Note",
    "content": "This is a new note."
}
```

**Expected Response**: Get a `400 Bad Request` response due to invalid `Content-Type`.
```json
{
    "message": "Invalid Content-Type",
    "error": "Invalid Content-Type. Expected 'application/json', but received: 'text/plain'.",
    "data": null,
    "path": "/api/notes",
    "timestamp": "2025-07-08T12:46:19.563Z"
}
```

#### Scenario 5: HTTP Parameter Pollution Detection

Send a `GET` request to `/api/notes` with duplicate query parameters.
```http
GET http://localhost:4000/api/notes?page=1&page=2&limit=2&sortBy=createdAt&sortOrder=desc
```

**Expected Response**: Get a `400 Bad Request` response due to HTTP parameter pollution.
```json
{
    "message": "Parameter Pollution Detected",
    "error": "The following parameters were detected with multiple values: {\"page\":[\"1\",\"2\"]}",
    "data": null,
    "path": "/api/notes?page=1&page=2&limit=2&sortBy=createdAt&sortOrder=desc",
    "timestamp": "2025-07-08T12:55:13.984Z"
}
```

#### Scenario 6: Request ID Generation

Send a `POST` request to `/api/notes` to create a new note.
```http
POST http://localhost:4000/api/notes
Content-Type: application/json
```

**Request Body**:
```json
{
    "title": "New Note",
    "content": "This is a new note."
}
```

**Expected Result**: The response should include a unique `X-Request-Id` header for tracking the request.
```http
X-Request-Id: <generated_request_id>
```

#### Scenario 7: Response Compression

Send a `GET` request to `/api/notes`.
```http
GET http://localhost:4000/api/notes?page=1&limit=2&sortBy=createdAt&sortOrder=desc
```

**Inspect Request Headers**: Check if the request includes `Accept-Encoding: gzip, deflate, br`.
```http
Accept-Encoding: gzip, deflate, br
```

**Inspect Response Headers**: Check if the response is compressed.
```http
Content-Encoding: br
```

Response is compressed using Brotli (br), reducing the payload size for faster transmission.


#### Scenario 8: Not Found Route

Send a `GET` request to an undefined route.
```http
GET http://localhost:4000/api/undefined-route
```

**Expected Response**: Get a `404 Not Found` response.
```json
{
    "message": "Resource not found",
    "error": "The requested resource at '/api/undefined-route' could not be found.",
    "data": null,
    "path": "/api/undefined-route",
    "timestamp": "2025-07-08T13:12:44.488Z"
}
```

#### Scenario 9: Centralized Error Handling

Send a `GET` request to an endpoint that throws an error.
```http
GET http://localhost:4000/api/notes/invalid-endpoint
```

**Expected Response**: Get a `400 Bad Request` response due to an invalid Note ID.
```json
{
    "message": "Invalid note ID format",
    "error": "Note ID must be a valid UUID",
    "data": null,
    "path": "/api/notes/invalid-endpoint",
    "timestamp": "2025-07-08T13:13:35.741Z"
}
```

#### Scenario 10: Rate Limiting

Send a `GET` request to `/api/notes` multiple times to trigger rate limiting.
```http
GET http://localhost:4000/api/notes
```

**Expected Response**: Get a `429 Too Many Requests` response due to rate limiting.
```json
{
    "message": "Too many requests. Please wait and try again.",
    "error": {
        "timeWindowInSeconds": 3600,
        "limit": 5,
        "remaining": "0",
        "retryAfter": "3596"
    },
    "data": null,
    "path": "/api/notes?page=1&limit=10&sortBy=createdAt&sortOrder=desc",
    "timestamp": "2025-07-08T13:17:44.587Z"
}
```
---
