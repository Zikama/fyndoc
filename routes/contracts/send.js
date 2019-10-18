class send {
    constructor(_ws, req, message, contract_draft, contract, Notify, randexp, shortCode, sendNotificationViaEmail) {

        // JSON parse
        function pars(e) {
            return JSON.parse(e)
        }
        // JSON stringify
        function fy(e) {
            return JSON.stringify(e)
        }
        // Check if type of message is send and is to contract
        if (message.type === 'send' && message.to === 'contract') {
            // Quickly respond back
            if (typeof _ws !== 'undefined') {
                // We can now send an email 
                _ws.send(fy({
                    type: 'sent',
                    to: 'contract',
                    status: "successful"
                }));
            }
            // Find the saved contract in db
            // NOTE: The saved contract draft is saved with auto: false so it can not be modified until 
            // it's saved
            // contract_draft.findOne({ auto: "false" }).then(contracts => {
            // We don;t send empty contract
            // As default, we initialize it with an empty string
            if (message.data.contract && message.data.contract !== "") {
                message.contract = message.data.contract
                let data = {
                    documentID: message.data.proposal_id,
                    ref: message.data.proposal_id,
                    company: message.data.company,
                    person: message.data.person,
                    email: message.data.email,
                    message: message.data.msg,
                    shortCode: shortCode.worker(8).generate(),
                    more_details: message,
                    from: "Sadja Web Solutions LTD"
                };

                // Create a link
                data.link = `${data.shortCode}/${data.ref.replace("#", '')}/${data.company.split(" ").join("_").toLowerCase()}`;
                // Initialize the contract title
                data.contract = `${data.from.replace('LTD', '')} - ${data.company}`;

                let newContract = new contract(data);
                newContract.save()
                    .then((results) => {
                        //#############done#################
                        if (results) {
                            // We can send an email to client
                            sendNotificationViaEmail('index', "New Contract for proposal ID: " + results.ref, results.email, 'saphira@sadjawebtools.com', [{
                                    filename: 'contract-agreement.png',
                                    path: './views/templates/output.png',
                                    cid: 'output.png',
                                    contentType: 'image/png'
                                }], {
                                    name: `${results.message}`,
                                    title: `Hi ${results.person.split(" ")[0]},`,
                                    regards: `Kind regards: Saphira`,
                                    url: `${req.headers['origin'] + '/' + results.link}`
                                })
                                .then(sent => {
                                    // make sure the mail was accepted for delivery
                                    // This fights agains wrong or misspelled email address
                                    if (sent && sent.match(/accepted/)) {
                                        if (typeof _ws !== 'undefined') {
                                            // We can now send an email 
                                            /* _ws.send(fy({
                                                type: 'sent',
                                                to: 'contract',
                                                status: "successful",
                                                title: `You've successfully sent a new Contract to ${results.email} with a proposal ID: #${results.ref}`
                                            })); */
                                        }
                                        // Store Notification
                                        let newNotify = new Notify({
                                            title: 'New Contract',
                                            message: `You've successfully sent an new Contract to ${results.email} with a proposal ID: #${results.ref}`,
                                            ref: `${results._id}`,
                                            link: "/contracts/" + results.ref
                                        });
                                        newNotify.save().then((_done) => {
                                            // Notify the admin
                                            // if() socket is open
                                            _done.status = "successful";
                                            if (typeof _ws !== 'undefined') {
                                                _ws.send(fy(_done))
                                            }

                                        })
                                    } else {
                                        // An error occured
                                        if (typeof _ws !== 'undefined') {
                                            _ws.send(fy({
                                                type: 'sent',
                                                to: 'contract',
                                                status: "failed",
                                                title: `There was a problem sending a Contract to ${done.email} with a proposal ID: #${done.ref}, please try again`
                                            }))
                                        }
                                        // Store Notification
                                        let newNotify = new Notify({
                                            title: 'Failed Sending Contract',
                                            message: `There was a problem sending a Contract to ${done.email} with a proposal ID: #${done.ref}, error : ${err}, please try again`,
                                            ref: `${done._id}`,
                                            link: "/contracts/failure" + done.ref
                                        });
                                        newNotify.save().then((_done) => {
                                            // Notify the admin
                                            // if() socket is open
                                            _done.status = "failure";
                                            if (typeof _ws !== 'undefined') {
                                                _ws.send(fy(_done));
                                            }

                                        }).catch((err) => {
                                            console.log(err);
                                        })
                                    }

                                }).catch(err => {
                                    console.log(err);

                                    // An error occured
                                    if (typeof _ws !== 'undefined') {
                                        _ws.send(fy({
                                            type: 'sent',
                                            to: 'contract',
                                            status: "failed",
                                            title: `There was a problem sending a Contract to ${done.email} with a proposal ID: #${done.ref}, please try again`
                                        }))
                                    }
                                    // Store Notification
                                    let newNotify = new Notify({
                                        title: 'Failed Sending Contract',
                                        message: `There was a problem sending a Contract to ${done.email} with a proposal ID: #${done.ref}, error : ${err}, please try again`,
                                        ref: `${done._id}`,
                                        link: "/contracts/failure" + done.ref
                                    });
                                    newNotify.save().then((_done) => {
                                        // Notify the admin
                                        // if socket is open
                                        _done.status = "failure";
                                        if (typeof _ws !== 'undefined') {
                                            _ws.send(fy(_done))
                                        }

                                    }).catch((err) => console.log(err))
                                });
                        } else {
                            console.log("Empty contracts Error");
                        }

                    }).catch((err) => console.log(err))
            }



            // });
        }
    }
}
module.exports = send