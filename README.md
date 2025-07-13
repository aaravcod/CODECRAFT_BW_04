# ⚡ Redis Caching API with Node.js and MongoDB

This project demonstrates how to implement **Redis caching** in a **Node.js + Express** API connected to **MongoDB** to improve performance for frequently accessed data. 

## 🛠 Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **Redis** for caching
- **Postman**  for API testing
-  **Swagger** for API documentation

---

## 🚀 Features

✅ Fetch all users with Redis caching  
✅ Invalidate cache when user data is added, updated, or deleted  
✅ Set cache expiration (TTL)  
✅ Measure performance improvement using console logs  
✅ Clean and modular structure  
✅ Swagger UI for API documentation  

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/redis-caching-api.git
   cd redis-caching-api
 ```

 2. Install dependencies
```bash
npm install
```

 3. Start Redis
```bash
redis-server
```

 4. Start the app
```bash
nodemon server.js
```

### 📂 API Endpoints

| Method | Route        | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | `/users`     | Fetch all users (cached)    |
| POST   | `/users`     | Add a new user (invalidate) |
| PUT    | `/users/:id` | Update user (invalidate)    |
| DELETE | `/users/:id` | Delete user (invalidate)    |

### 🧪 Measuring Performance
- Each GET /users request prints the time it takes in the console:
-First request: fetch from MongoDB (~1000ms)
- Subsequent requests: fetch from Redis (~1ms)