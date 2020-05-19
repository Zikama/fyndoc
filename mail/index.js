class Art_mailer {
    constructor(nodemailer, user, pass) {
        this.nodemailer = nodemailer;
        this.user = user;
        this.pass = pass;
        // this.to;
        // this.subject;
        // this.text;
        // this.transporter;
        this.init();

    }
    init() {
        let hbs = require("nodemailer-express-handlebars");

        /*  hbs.create({
             helpers: {
                 ifEquals: function(arg1, arg2, options) {
                     return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                 },
                 ifNotEquals: function(arg1, arg2, options) {
                     return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
                 }
             }
         }); */

        const nodemailer = this.nodemailer,
            user = this.user,
            pass = this.pass;
        this.transporter = nodemailer.createTransport({
            // service: 'throneshoppers.com',smtpout.europe.secureserver.net, 
            host: "mail.alenzone.com",
            port: 465,
            auth: {
                user,
                pass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const handlebarOptions = {
            viewEngine: {
                extName: '.hbs',
                layoutsDir: __dirname + '/../views/templates/',
                defaultLayout: 'email.layout.hbs',
                partialsDir: __dirname + '/../views/templates/partials/',
            },
            viewPath: __dirname + '/../views/templates/',
            extName: '.hbs',
        };
        this.transporter.use('compile', hbs(handlebarOptions))
    }
    send(subject, text, to, from, attachments, context) {
        return new Promise((resolve, reject) => {
            function ourAttachments() {
                // for (let attach of attachments) {
                //     return attach

                // }
                return attachments;
            }

            const mailOptions = {
                from: from || '"noreply"<donotreply@throneshoppers.com>',
                to,
                subject,
                disposition: 'attachment',
                type: 'image/png',
                encoding: 'base64',
                contentType: 'image/png',
                // text: text,
                template: text,
                attachments: [{
                        filename: 'sadja.png',
                        path: './views/templates/sadja.png',
                        cid: 'logo.png',
                        contentType: 'image/png',
                        type: 'image/png',
                        encoding: 'base64',
                        disposition: 'attachment'
                    },
                    {
                        filename: 'twitter.png',
                        path: './views/templates/twitter.png',
                        cid: 'twitter.png',
                        contentType: 'image/png',
                        type: 'image/png',
                        encoding: 'base64',
                        disposition: 'attachment'
                    },
                    {
                        filename: 'facebook.png',
                        path: './views/templates/facebook.png',
                        cid: 'facebook.png',
                        contentType: 'image/png',
                        type: 'image/png',
                        encoding: 'base64',
                        disposition: 'attachment'
                    },
                    ...attachments
                ],
                context
            };

            this.transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    return reject(error);
                } else {
                    return resolve('Email sent: ' + info.response);
                }
            });
        });
    }
}

module.exports = Art_mailer;