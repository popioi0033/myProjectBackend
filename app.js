require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const loanRoute = require("./modules/loan/loan.route");
app.use("/api/loans", loanRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
