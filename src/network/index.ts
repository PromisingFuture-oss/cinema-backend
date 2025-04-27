import express, { Request, Response } from "express"

const app = express()
const port = process.env.BACKEND_PORT || 4000;

app.get("/", (request: Request, response: Response) => {
    response.json({ Message: "Ticket Reservation" });
})

app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
