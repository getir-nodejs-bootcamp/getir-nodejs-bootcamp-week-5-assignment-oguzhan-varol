const express = require("express")
const {index,create,login,resetPassword,deleteUser,updateUser,changePassword} = require("../controllers/Users")
const schemas = require("../validations/Users")
const validate = require("../middlewares/validate")
const authenticate = require("../middlewares/authenticate");
const autheticateAdmin = require("../middlewares/authenticateAdmin")

const router = express.Router()








router.route("/register").post(validate(schemas.createUser,"body"),create);
router.route("/login").post(validate(schemas.loginValidation,"body"),login);
router.route("/createAdminUser").post(autheticateAdmin,validate(schemas.createAdminUser,"body"),create);
router.route("/reset-password").post(validate(schemas.resetPasswordValidation),resetPassword);
router.route("/:id").delete(autheticateAdmin,deleteUser)
router.route("/:id").patch(authenticate, validate(schemas.updateUser,"body"),updateUser);
router.route("/change-password").post(authenticate,validate(schemas.changePassword),changePassword)


router.route("/").get(autheticateAdmin,index);











module.exports = router;