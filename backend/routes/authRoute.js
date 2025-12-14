import { Router } from 'express';
import { check } from 'express-validator';
import { loginUser, registerUser } from '../controllers/authController.js';

const router = Router();

router.post('/register', 
    [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Email is required"),
    check("password").notEmpty().withMessage("Password is required"),
] ,
registerUser);

router.post('/login', [
    check("email").notEmpty().withMessage("Email required"),
    check("password").notEmpty().withMessage("Enter your password")
], loginUser);

export default router;