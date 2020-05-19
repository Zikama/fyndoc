const mongoose = require("mongoose"),
    db = require("./keys").mongoURI,

    // Connect to mongodb
    conn = mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true });
// Connect to mongodb
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((e) => {
        // e.connections[0].dropDatabase(err => { if (err) throw err; });
        console.log("mongoDB connected...");
    })
    .catch(err => console.log(err));
module.exports = conn;