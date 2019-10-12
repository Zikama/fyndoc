class send {
    constructor(_ws, req, message, proposal_draft, proposal, Notify, randexp, shortCode, sendNotificationViaEmail) {

        // JSON parse
        function pars(e) {
            return JSON.parse(e)
        }
        // JSON stringify
        function fy(e) {
            return JSON.stringify(e)
        }
        // Check if type of message is send and is to proposal
        if (message.type === 'send' && message.to === 'proposal') {
            // Find the saved proposal in db
            // NOTE: The saved proposal draft is saved with auto: false so it can not be modified until 
            // it's saved
            // For quick response, we can fake done, then curry the task in the background
            /* _ws.send(fy({
                type: 'sent',
                to: 'proposal',
                status: "successful"
            })); */
            proposal_draft.findOne({ auto: "false" })
                .then(proposals => {
                    // We don;t send empty proposal
                    // As default, we initialize it with an empty string
                    if (proposals && proposals.data !== "") {
                        message.proposal = proposals.data; // Assign data to the proposal property
                        // Data to be saved in db
                        let data = {
                            company: message.data.company,
                            person: message.data.person,
                            email: message.data.email,
                            message: message.data.msg,
                            more_details: message,
                            ref: randexp.gen(),
                            documentID: randexp.gen(),
                            shortCode: shortCode.worker(8).generate(),
                            from: "Sadja Web Solutions LTD"
                        };

                        // Create a link
                        data.link = `proposal/${data.ref.replace("#", '')}/${data.shortCode}/${data.company.split(" ").join("_").toLowerCase()}`;
                        // Initialize the proposal title
                        data.proposal = `${data.from.replace('LTD', '')} - ${data.company}`;

                        // Time to store the data now
                        let newProposal = new proposal(data);
                        // Save the stored data to the db
                        newProposal.save()
                            .then((done) => {
                                //#############done#################
                                if (done) {
                                    // We can send an email
                                    sendNotificationViaEmail('index', "New Proposal from Sadja WebSolutions", done.email, 'saphira@sadjawebtools.com', [{
                                            filename: 'contract-agreement.png',
                                            path: './views/templates/output.png',
                                            cid: 'output.png',
                                            contentType: 'image/png'
                                        }], {
                                            name: `${done.message}`,
                                            title: `Hi ${done.person.split(" ")[0]},`,
                                            regards: `Kind regards: Nemie`,
                                            url: `${req.headers['origin'] + '/' + done.link}`,
                                            _view: 'View Proposal'
                                        })
                                        .then(sent => {
                                            if (sent && sent.match(/accepted/)) {
                                                // We can now send an email 
                                                if (typeof _ws !== 'undefined') {
                                                    _ws.send(fy({
                                                        type: 'sent',
                                                        to: 'proposal',
                                                        status: "successful"
                                                    }))
                                                }
                                                // Store Notification
                                                let newNotify = new Notify({
                                                    title: 'New Proposal',
                                                    message: `You've successfully sent an new Proposal to ${done.email} with a proposal ID: #${done.ref}`,
                                                    ref: `${done._id}`,
                                                    link: "/proposals/" + done.ref
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
                                                        to: 'proposal',
                                                        status: "failed",
                                                        title: `There was a problem sending a Proposal to ${done.email} with a proposal ID: #${done.ref}, please try again`
                                                    }));
                                                }
                                                // Store Notification
                                                let newNotify = new Notify({
                                                    title: 'Failed Sending Proposal',
                                                    message: `There was a problem sending a Proposal to ${done.email} with a proposal ID: #${done.ref}, error : ${err}, please try again`,
                                                    ref: `${done._id}`,
                                                    link: "/proposals/failure" + done.ref
                                                });
                                                newNotify.save().then((_done) => {
                                                    // Notify the admin
                                                    // if() socket is open
                                                    _done.status = "failure";
                                                    if (typeof _ws !== 'undefined') {
                                                        _ws.send(fy(_done))
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
                                                    to: 'proposal',
                                                    title: 'There was a problem sending a Proposal to ${done.email} with a proposal ID: #${done.ref}, please try again',
                                                    status: "failed"
                                                }))
                                            }
                                            // Store Notification
                                            let newNotify = new Notify({
                                                title: 'Failed Sending Proposal',
                                                message: `There was a problem sending a Proposal to ${done.email} with a proposal ID: #${done.ref}, error : ${err}, please try again`,
                                                ref: `${done._id}`,
                                                link: "/proposals/failure" + done.ref
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
                                }
                            })
                            .catch((err) => console.log(err))

                    } else {
                        console.log("Empty proposal Error");
                    }

                }).catch((err) => console.log(err));
        }
    }
}
module.exports = send