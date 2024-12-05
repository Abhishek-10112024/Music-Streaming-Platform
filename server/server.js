import express from "express";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



