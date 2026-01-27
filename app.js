require("dotenv").config();

const errorMiddleware = require ("./middleware/error.middleware.js")
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);

const loanRoute = require("./modules/loan/loan.route");
app.use("/api/loans", loanRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
