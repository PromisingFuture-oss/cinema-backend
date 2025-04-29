import { Router } from "express"
import authController from "@/network/controller/auth.controller";
import authValidation from "@/validators/auth.validation";

const router = Router();

router.post("/signup", authValidation.SignupSchema, authController.Signup);
router.post("/login", authValidation.LoginSchema, authController.Login);
export default router;
