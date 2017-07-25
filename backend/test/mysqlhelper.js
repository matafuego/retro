"use strict";

module.exports = {
    truncate(object, sequelize) {
        return sequelize
            .transaction()
            .then(function(t) {
                return sequelize
                    .query("SET FOREIGN_KEY_CHECKS = 0", {
                        raw: true,
                        transaction: t
                    })
                    .then(result => {
                        return object.truncate({ transaction: t });
                    })
                    .then(result => {
                        sequelize.query("SET FOREIGN_KEY_CHECKS = 1", {
                            raw: true,
                            transaction: t
                        });
                    })
                    .then(result => {
                        return t.commit();
                    })
                    .catch(error => {
                        t.rollback();
                        console.error(error);
                    });
            })
            .then(result => {
                return;
            });
    }
};
