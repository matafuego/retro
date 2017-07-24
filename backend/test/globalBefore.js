var db = require('../models');

before(function (done) {
    console.log(" -x- resetting database -x-")
    db.sequelize.sync({ force: true }).then(result => {
        console.log("-x- database reset -x-")
        done();
    })
}) 