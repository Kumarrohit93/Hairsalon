const express  =require("express")
const router = express.Router()
const {superAdminLogin, loginPage} = require("../controllers/SuperAdminLoginController.js")

router.get("/loginPage", loginPage)
router.post("/login", superAdminLogin)

module.exports = router
