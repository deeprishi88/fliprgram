const axios = require("axios");
const { EMAILSERVICEBASEURL } = require("../../../config/configs");

// sends email
exports.sendEmailrequest = async (to, subject, text) => {
    try {
        let config = {
            method: "post",
            url: `${EMAILSERVICEBASEURL}/send_email`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                to,
                subject,
                text,
            },
        };
        let res = await axios(config);
        return {
            success: true,
            status: res.status,
            data: res.data,
        };
    } catch (e) {
        return {
            success: false,
            status: e.response && e.response.status,
            data: e.response && e.response.data,
        };
    }
};

// to create an email entry
exports.createEmailEntryRequest = async (
    email,
    eventName,
    userId,
    username,
) => {
    try {
        let config = {
            method: "post",
            url: `${EMAILSERVICEBASEURL}/`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                email,
                eventName,
                userId,
                username,
            },
        };

        let res = await axios(config);
        console.log(res);
        return {
            success: true,
            status: res.status,
            data: res.data,
        };
    } catch (e) {
        return {
            success: false,
            status: e.response && e.response.status,
            data: e.response && e.response.data,
        };
    }
};

// deletes the record by providing emailId
exports.deleteEmailEntryRequest = async (emailId) => {
    try {
        let config = {
            method: "delete",
            url: `${EMAILSERVICEBASEURL}/${emailId}`,
        };

        let res = await axios(config);
        return {
            success: true,
            status: res.status,
            data: res.data,
        };
    } catch (e) {
        return {
            success: false,
            status: e.response && e.response.status,
            data: e.response && e.response.data,
        };
    }
};

// gets the email entry object code
exports.getEmailEntryBycodeRequest = async (code) => {
    try {
        const config = {
            method: "post",
            url: `${EMAILSERVICEBASEURL}/getbycode`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                code,
            },
        };
        let res = await axios(config);
        return {
            success: true,
            status: res.status,
            data: res.data,
        };
    } catch (e) {
        return {
            success: false,
            status: e.response && e.response.status,
            data: e.response && e.response.data,
        };
    }
};