const customerModel = require("../models/customer.js")

const editPage = async (req, res) => {
  const customer = await customerModel.findOne({ publicToken: req.params.id })

  if (!customer) {
    return res.send("Customer not found")
  }

  res.render("Admins/EditCustomer.ejs", {
    user: req.session.user,
    page: "edit customer",
    customer
  })
}

const updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body

  const updated = await customerModel.findOneAndUpdate(
    { publicToken: req.params.id },
    { $set: { paymentStatus: paymentStatus } },
    { new: true }
  )

  console.log("UPDATED:", updated)

  if (!updated) {
    return res.send("Update failed – customer not found")
  }

  res.redirect("/admin/allCustomers")
}

const deleteCustomer = async(req, res) => {
  await customerModel.findByIdAndDelete({_id: req.params.id})
  res.redirect("/admin/allCustomers")
}

module.exports = { editPage, updatePaymentStatus, deleteCustomer }
