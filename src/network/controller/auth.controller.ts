import {
    validationResult,
    matchedData
} from "express-validator"
import { Request, Response } from "express"
import Controller from "@/lib/controller"
import bcrypt from "@/lib/bcrypt"
import prisma from "@/lib/prisma"

class AuthController extends Controller {
    public Signup = async (request: Request, response: Response) => {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            const validationErrors: ValidationResultError = {};

            errors.array().map((error) => {
                if (error.type === 'field') {
                    validationErrors[error.path] = [error.msg];
                }
            });

            response.status(422).json({
                errors: validationErrors
            });
            return
        }

        const { name, email, password } = matchedData(request);
        try {

            const hashedPassword = bcrypt.hashPassword(password);

            const user = await prisma.users.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: "employee"
                }
            })
            response.status(200).json({
                signup: {
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        }catch(error) {
            response.status(500).json({ error: 'Signup failed' });
        }
    };
    public Login = async (request: Request, response: Response) => {
        try {
            const user = await prisma.users.findFirst({
                where: {
                    email: request.body.email
                }
            });

            if (!user) {
                response.status(401).json({ error: 'Invalid email or password' });
                return;
            }
            const isPasswordValid = bcrypt.comparePassword(request.body.password, user.password);
            if (!isPasswordValid) {
                response.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            response.json({ user: user});
        }catch(error) {
            response.status(500).json({ error: 'Login failed' });
        }
    };

    public SessionToken = (request: Request, response: Response) => {

    };

    public SessionLogout = (request: Request, response: Response) => {

    };
}

export default new AuthController;