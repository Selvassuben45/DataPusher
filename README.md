# Data Pusher - Node.js Express Assessment

## Overview

You are required to create a Node.js Express web application that receives JSON
data for an account and forwards it to various destinations using webhook URLs.
---

## Features

- **Account Management:** CRUD operations with search and filtering support.
- **Destination Management:** HTTP methods, and headers with advanced filters.
- **Logs:** Store and retrieve logs with search/filter capabilities.
- **Optimized Queries:** Avoid N+1 problems using Sequelize joins.
- **Caching:** Redis caching for frequently accessed data to improve performance.
- **Database Indexing:** Indexed frequently queried fields for optimized database performance.
- **Rate Limiting:** Protect `/server/incoming_data` endpoint with per-account rate limiting (5 requests/sec).
- **Testing:** Unit and integration tests using Mocha, Chai, Jest, and Supertest.

---

## Tech Stack

- Node.js & Express.js
- Sequelize ORM with MySQL
- Redis for caching
- express-rate-limit for rate limiting
- Mocha/Chai, Jest, Supertest for testing

---

## Getting Started

### Prerequisites

- Node.js 
- MySQL Database
- Redis Server
- npm or yarn package manager

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/data-pusher.git
   cd data-pusher
