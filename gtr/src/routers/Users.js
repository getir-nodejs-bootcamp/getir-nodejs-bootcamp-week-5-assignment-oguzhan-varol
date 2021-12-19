const express = require("express")
const {index,create,login,resetPassword} = require("../controllers/Users")
const schemas = require("../validations/Users")
const validate = require("../middlewares/validate")
const authenticate = require("../middlewares/authenticate");
const autheticateAdmin = require("../middlewares/authenticateAdmin")

const router = express.Router()








router.route("/register").post(validate(schemas.createUser,"body"),create);
router.route("/login").post(validate(schemas.loginValidation,"body"),login);
router.route("/createAdminUser").post(autheticateAdmin,validate(schemas.createAdminUser,"body"),create);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation),resetPassword);



router.route("/").get(autheticateAdmin,index);











module.exports = router;