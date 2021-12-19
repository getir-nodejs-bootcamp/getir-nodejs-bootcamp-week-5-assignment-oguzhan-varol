const express = require("express");

const {index,create,addComment,update} = require("../controllers/Products")
const schemas = require("../validations/Products");
const validate = require("../middlewares/validate")

const authenticate = require("../middlewares/authenticate");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

const router = express.Router();

router.route("/").get(index);
router.route("/:id/add-comment").patch(authenticate,validate(schemas.addComment,"body"),addComment);


router.route("/").post(authenticateAdmin,validate(schemas.createProduct,"body"),create);
router.route("/:id").patch(authenticateAdmin, validate(schemas.updateProduct,"body"),update);

module.exports = router;