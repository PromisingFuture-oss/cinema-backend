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
                    role: "user"
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
        const { email, password } = request.body;

        try {
            const user = await prisma.users.findUnique({
                where: { email: email }
            });

            if (!user) {
                response.status(404).json({ mesage: 'User does not exist.' });
                return;
            }

            const isPasswordValid = bcrypt.comparePassword(password, user.password);
            if (!isPasswordValid) {
                response.status(404).json({ message: 'Invalid credentials' });
                return;
            }

            response.json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }catch(error) {
            console.error(error);
            response.status(500).json({ error: 'Login failed' });
        }
    };
}

export default new AuthController;
