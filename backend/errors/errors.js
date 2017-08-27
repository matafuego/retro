"use strict";

module.exports = {
    badRequest(name, message) {
        var badRequest = new Error(message);
        badRequest.name = name;
        badRequest.statusCode = 400;
        return badRequest;
    },

    notFound(name, message) {
        var notFound = new Error(message);
        notFound.name = name;
        notFound.statusCode = 404;
        return notFound;
    },

    unauthorized(name, message) {
        var unauthorized = new Error(message);
        unauthorized.name = name;
        unauthorized.statusCode = 401;
        return unauthorized;
    },

    conflict(name, message) {
        var conflict = new Error(message);
        conflict.name = name;
        conflict.statusCode = 409;
        return conflict;
    }
};
