"use strict";

const bcrypt = require("bcrypt");

module.exports = {
    validatePassword(user, password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, function(error, areEqual) {
                if (error) {
                    reject(error);
                } else {
                    resolve(areEqual);
                }
            });
        });
    },

    hashPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function(error, hash) {
                if (error) {
                    reject(error);
                } else {
                    resolve(hash);
                }
            });
        });
    }
};
