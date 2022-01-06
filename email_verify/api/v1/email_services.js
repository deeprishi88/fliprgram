const { Email } = require('./email_model');
const { v4: uuid } = require('uuid');
const { transporter } = require('./database/transporter');
const { BASEURL } = require("../../config/config");

// sending email
 async function sendEmail(to, subject, text) {
    await transporter.sendMail({
        to,
        subject: subject,
        text,
    });
    return;
}

// deletes the document as per verification code
async function findOneAndDeleteByCode(code) {
    const document = await Email.findOneAndDelete({ verificationCode: code }).exec();
    return document;
}

// deletes the document as per id
async function deleteOneById(id) {
    const document = await Email.deleteOne({ _id: id });
    return document;
}


// creates an event to send email
async function createOne(eventName, associatedUser) {
    const unique_code = await uuid();  // creates a unique code

    const document = await Email.create({
        verificationCode: unique_code,
        eventName,
        associatedUser,
    });
    return document;
}


// sends the required email
async function sendEventEmail(eventName, email, username, code, id) {
    try {
        let message = "";
        let subject = "";
        if (eventName === "verificationemail") {   // send email for verification of account
            let url = BASEURL + "/api/v1/user";
            subject = "For verification of the user account";
            message = `
            Hello,
            Please click the link below to confirm your account creation with username ${username}
            ${url}/email_verify/${code}
            `;
        } else if (eventName === "forgotpasswordemail") {    // send email to getforgot password code
            subject = `Update Password Link For Username ${username}`;
            message = `
            Hello,
            For updating the password add this token as code:[token] and send password both in the body
            If not requested then ignore this mail .You can login through your old password
            
            ${code}
            `;
        }
        await sendEmail(email, subject, message);
        return true;
    } catch (e) {
        console.log("Email sending failed due to ", e.message, "docid - ", id);
        return false;
    }
}

// change the send status of email
async function changeSendStatus(id) {
    return await Email.findByIdAndUpdate(id, { failed: true }).exec();
}
module.exports = {
    createOne,
    changeSendStatus,
    deleteOneById,
    findOneAndDeleteByCode,
    sendEmail,
    sendEventEmail,
};
