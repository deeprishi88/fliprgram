const email_route = require("express").Router();
const emailcontroller = require("./email_controller");

email_route.post("/send_email", emailcontroller.sendEmail);

email_route.post("/", emailcontroller.createEmailEntry);

email_route.delete("/:id", emailcontroller.deleteOnebyId);

email_route.post("/getbycode", emailcontroller.getOneByCode);

module.exports = email_route;