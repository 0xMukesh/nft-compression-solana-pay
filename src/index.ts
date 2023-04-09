import express from "express";
import "dotenv/config";

import { mintHandler } from "@/controllers";

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/mint", mintHandler);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`the server is running at ${port} port`);
});
