"use strict";

const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");

const User = require("../models").User;

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: "siVisPacemParaBellum",
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt")
};

module.exports = {
    getStrategy() {
        return new Strategy(params, function(payload, next) {
            console.log("payload received", payload);

            return User.findById(payload.id).then(user => {
                if (user) {
                    next(null, user);
                } else {
                    next(null, false);
                }
            });
        });
    },

    getToken(user) {
        const payload = { id: user.id };
        return jwt.sign(payload, params.secretOrKey);
    },

    authenticate() {
        return passport.authenticate("jwt", { session: false });
    }
};
