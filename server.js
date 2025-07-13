import express from "express";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import { swaggerUi, swaggerSpec } from './swagger.js';

const app=express();

app.use(express.json());

await connectDB();

app.use('/users',userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(3000,()=>{
    console.log("Server running")
})