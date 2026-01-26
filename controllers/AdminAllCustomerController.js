const customerModel = require("../models/customer.js")
const allCustomerPage = async(req, res) => {
    const allCustomers = await customerModel.find({});
    res.render("Admins/AllCustomers.ejs", {allCustomers, user: req.session.user, 
    page: "Customers"})
}

module.exports = allCustomerPage