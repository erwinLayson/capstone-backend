import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// database connection
import { checkDBConnection } from './config/database';

// Router 
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import studentRouter from "./routes/student";
import schoolRouter from "./routes/school";
import classroomRouter from "./routes/classroom";
import teacherRouter from "./routes/teachers";
import subjectRouter from "./routes/subject";
import TSARouter from "./routes/teacherSubjectAssignment";
import classTeacherRouter from "./routes/classTeacher";
import classSubjectRouter from "./routes/classSubject";
import enrollmentRouter from "./routes/enrollments";
import classStudentRouter from "./routes/classStudent";

// Test Routes
import TestingRoutes from "./routes/testRoutes";

// Error handler
import errorHandler from "./middleware/ErrorHandler";

checkDBConnection();

const app: Express = express(); 

// middlewaere
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', "PATCH", 'PUT', 'DELETE'],
  credentials: true
}))

// use Routes
app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', studentRouter);
app.use('/api', schoolRouter);
app.use('/api', classroomRouter);
app.use('/api', teacherRouter);
app.use('/api', subjectRouter);
app.use('/api', TSARouter);
app.use('/api', classTeacherRouter);
app.use('/api', classSubjectRouter);
app.use('/api', enrollmentRouter);
app.use('/api', classStudentRouter);

// test routes
app.use('/api', TestingRoutes);

// // Error middleware
app.use(errorHandler);

export default app;