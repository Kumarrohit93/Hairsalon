require("dotenv").config();
console.log("PORT FROM ENV =", process.env.PORT);
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const dbUrl = process.env.MONGO_URL;
const SuperAdminRoute = require("./routes/AdminLoginRoute.js");
const AdminDashboard = require("./routes/AdminDashboardRoute.js");
const Logout = require("./routes/AdminLogoutRoute.js");
const serviceRoute = require("./routes/ServicesRoute.js");
const customerHomeRoute = require("./routes/CustomerHomeRoute.js");
const CustomerStatusRoute = require("./routes/CustomerStatusRoute");
const LiveQueueRoute = require("./routes/AdminLiveQueueRoute.js");
const AllCustomers = require("./routes/AdminAllCustomerRoute.js");
const AdminHistoryRoute = require("./routes/AdminHistoryRoute");
const AdminWalikinRoute = require("./routes/AdminWalkInRoute.js");
const PaymentRoute = require("./routes/PaymentRoute.js");
const AdminSettingRoute = require("./routes/AdminSettingRoute.js")
const AdminEditCustomerPayStatusRoute = require("./routes/AdminEditCustomerStatusRoute.js")
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use("/superadmin", SuperAdminRoute);
app.use("/admin", AdminDashboard);
app.use("/admin", Logout);
app.use("/admin", serviceRoute);
app.use("/customer", customerHomeRoute);
app.use("/", CustomerStatusRoute);
app.use("/admin", LiveQueueRoute);
app.use("/admin", AllCustomers);
app.use("/admin", AdminHistoryRoute);
app.use("/admin", AdminWalikinRoute);
app.use("/payment", PaymentRoute);
app.use("/admin", AdminSettingRoute)
app.use("/admin", AdminEditCustomerPayStatusRoute)
app.listen(port, () => {
  console.log("Server is listening at port " + port);
});
