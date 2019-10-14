class Agree {
    constructor(_ws, router, contract, Notify, converted_client, sendNotificationViaEmail) {
        let { agreement } = require('../upload');


        // Agree on the contract
        router.post("/agree", (req, res) => {

            agreement(req, res, err => {
                if (err) {
                    console.log(err);
                };
                if (req.file) {
                    let temp = req.file,
                        _data = {
                            path: temp.path,
                            destination: temp.destination,
                            filename: temp.filename,
                            originalname: temp.originalname,
                            mimetype: temp.mimetype
                        };
                    //.substr(0,d.length-12)

                    let data = { names: 'null', id: _data.path, date_of_birth: new Date(), email: req.body.email, position: 'null', ref: req.body.ref, more_details: { contract: req.body.more_details, link: req.body.link, company: req.body.company, _data } };
                    // Agree template with signature 
                    let signTemp = `<p><h3><span style="font-size:larger;">US</span></h3><p><span style="font-size: 19.2px;">Signature</span><span style="font-size: larger;">: <b class="_sign">BarakaKalumba</b></i</span></p><p>Signed By: <b>Baraka Samuel</b><span style="font-size: larger;"><b class="_sign"><br></b></span></p> <p><span style="font-size: larger;" class="">Date: <b class='custom_in'>${new Date().toLocaleDateString()} </b></span></p><h3><span style="font-size: larger;">YOU</span></h3><p>Signature: <b class="custom_in _sign">${data.names}</b><br></p> <p>Signed By: <span><b class='custom_in'>${data.names}</b></span></p> <p>Position: <span><b class='custom_in'>${data.position}</b></span></p> <p>Date: <span><b class='custom_in'>${new Date().toLocaleDateString()} </b></span></p></p>`;

                    //  data.more_details.contract = data.more_details.contract;
                    let newConvertedClent = new converted_client(data);
                    newConvertedClent.save()
                        .then((saved) => {
                            if (saved) {
                                // Visible date
                                var visibleDate = new Date().setDate(saved.date.getDate() + 30);
                                let shortCodeFromLink = saved.more_details.link.split("/")[0];

                                contract.findOneAndUpdate({ shortCode: shortCodeFromLink }, {
                                        status: 'signed',
                                        contract_status: "signed",
                                        signed_date: saved.date,
                                        'more_details.contract': data.more_details.contract,
                                        'more_details.visible_until': new Date(visibleDate)
                                    })
                                    .then((done) => {
                                        // We can send an email to the client
                                        sendNotificationViaEmail('index', "Contract successfully Signed", saved.email, 'saphira@sadjawebtools.com', [{
                                                filename: 'contract-agreement.png',
                                                path: './views/templates/output.png',
                                                cid: 'output.png',
                                                contentType: 'image/png'
                                            }], {
                                                name: `You can follow the button bellow to download your copy, Please Note that the bellow link/button is available for 4 days from the signed date.
                                Your Proposal ID is : ${saved.ref}`,
                                                title: `Hello ${done.person.split(" ")[0]}, Sadja WebSolutions thank you for successfully signing the Contract`,
                                                regards: `Kind regards: Sadja WebSolutions`,
                                                url: `${req['header']('origin') + '/' + saved.more_details.link}`
                                            })
                                            .then(sent => {
                                                // Mail sent
                                            }).catch((err) => console.log(err))

                                        // Notify the main sadja web solutions' email
                                        sendNotificationViaEmail('index', "Contract successfully Signed", 'zikama.sadja@gmail.com', 'saphira@sadjawebtools.com', [{
                                                filename: 'contract-agreement.png',
                                                path: './views/templates/output.png',
                                                cid: 'output.png',
                                                contentType: 'image/png'
                                            }, {
                                                filename: 'attachment.png' /* saved.more_details._data.originalname */ ,
                                                path: saved.more_details._data.destination + '/' + saved.more_details._data.filename,
                                                cid: 'attachment.png',
                                            }], {
                                                name: `The Proposal ID is : ${saved.ref}`,
                                                title: `${done.person}, has successfully signed the Contract`,
                                                regards: `Sadja WebSolutions LTD`,
                                                url: `${req['header']('origin') + '/' + saved.more_details.link}`
                                            })
                                            .then(sent => {
                                                // Mail sent
                                            }).catch((err) => console.log(err))

                                        // Company with the position of the ${saved.position} 
                                        let newNotify = new Notify({
                                            title: 'New Contract Signed',
                                            message: `${done.person} from ${saved.more_details.company}, has successfully signed the contract of the proposal ID : ${saved.ref}`,
                                            ref: `${saved.ref}`,
                                            link: "/converted/" + saved.ref
                                        })
                                        newNotify.save((err, resu) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            resu.status = "signed"; //___
                                            // Send live notification
                                            if (typeof _ws !== 'undefined') {
                                                _ws.send(fy(resu));
                                            }
                                        })
                                    }).catch((err) => console.log(err));
                            }
                        }).catch((err) => console.log(err))

                    // Or update if issue rises
                    // converted_client.update({}, {})
                    res.redirect(data.more_details.link);
                }
            })
        });

    }
}
module.exports = Agree