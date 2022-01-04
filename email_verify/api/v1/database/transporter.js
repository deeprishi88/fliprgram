const nodemailer = require('nodemailer');

    const transporterEthereal = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: 'domingo.fritsch17@ethereal.email',
            pass: 'z78KGRUEXEAAuChQPH'
        },
    });
    module.exports.transporter = transporterEthereal;