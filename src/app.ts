import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cookieParser from "cookie-parser";

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

// Error handler
import errorHandler from "./middleware/ErrorHandler";

checkDBConnection();

const app: Express = express(); 

// middlewaere
app.use(express.json());
app.use(cookieParser());

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

// // Error middleware
app.use(errorHandler);

export default app;