'use strict';

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

}