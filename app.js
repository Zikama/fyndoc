const express = require("express");
const webSocket = require("./websocketServer");
const fetch = require('node-fetch');
const app = express(),
    flash = require("connect-flash"),
    session = require("express-session"),

    MongoDBStore = require('connect-mongodb-session')(session),
    {
        mongoURI,
        sessionsURI,
        dbname
    } = require("./config/keys"),
    sess_store = new MongoDBStore({
            uri: sessionsURI || mongoURI,
            // databaseName: sessions,
            collection: dbname,
            useNewUrlParser: true

        },
        function(error) {
            if (error) {
                console.log(error);
            }
        }),

    expressLayouts = require("express-ejs-layouts"),

    passport = require("passport"),

    pdfLib = require('./assets/js/pdf-lib.min.js'),
    { degrees, PDFDocument, rgb, StandardFonts } = pdfLib;


// Serve stastics
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/assets_", express.static(__dirname + "/node_modules"));
app.use("/favicon", express.static(__dirname + "/favicon.ico"));

// Passport config
require("./config/passport")(passport);

// BodyParser
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

// Session
app.use(session({
    secret: 'fdferedsdweferewedwrersdfs484',
    cookie: {
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    },
    store: sess_store,
    resave: true,
    saveUninitialized: true
}));

// Passport init 
app.use(passport.initialize());
// Passport session
app.use(passport.session());

// Connect flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.art_p_success_msg = req.flash("art_p_success_msg");
    res.locals.art_p_error_msg = req.flash("art_p_error_msg");
    res.locals.error = req.flash("error");
    next()
})

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// App port
PORT = process.env.PORT || 5002;
let server = app.listen(PORT, () => {
    console.log("app listening to " + PORT);
});
// Web socket
let ws = new webSocket(server);
global.web_socket = ws;

// routes
app.use("/", require("./routes/index"));
app.use("/send", require("./routes/send"));
app.use("/upload", require("./routes/upload").router);
// handle 404
app.use(function(req, res, next) {

    // Get the real path to the root
    // This helps to go to statics on front-end with easy
    // Expample [path = '/this/is/a/pth/df/fdf/dsd/fdf/fdf] = hard to read and replacing it with ../../etc is hard
    // So better path the rootPath to pathToTheRoot so we can get the ../../etc for front-end
    function pathToTheRoot(params) {
        let rootPath = params,
            rPath = [];
        rootPath = rootPath.split("");
        for (let rootPath_ of rootPath) {
            if (rootPath_ === "/") { // make sure the contains have the [/]
                rPath.push(".." + rootPath_) // append the ..[dots] to each [/]
            }
        };
        return rPath.join(""); ///return the real path [now this is like ../../etc]
    }

    // the status option, or res.statusCode = 404
    // are equivalent, however with the option we
    // get the "status" local available as well
    // Reader parameters
    const _404PR = {
        who: "error",
        title: { true: true, name: "Sadja | Error" },
        original_css: true,
        header: `Error`
    };
    res.render('404', {
        status: 404,
        url: req.url,
        pathToTheRoot: (() => {
            _404PR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
            return _404PR.pathToTheRoot;
        })(),
        ..._404PR
    });
    next()
});


require("./config/db");