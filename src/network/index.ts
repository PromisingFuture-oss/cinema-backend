import express, { Request, Response } from "express"
import authRouter from "./routes/auth.route"
import cors from "@/middleware/cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json());
app.use(cors);
app.use(express.json());
app.use(cookieParser());

const port = process.env.BACKEND_PORT || 4000;

app.use("/api", authRouter);
app.get("/", (request: Request, response: Response) => {
    response.json({ Message: "Cine Reservation System" });
})

app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});