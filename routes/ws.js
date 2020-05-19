// The initials times the contract been visisted, default is 0
var times = 0;

module.exports = (_ws, request, websocket, norm_size, history, clients, clientsize, pars, fy, ) => {

    // Test WS
    web_socket.Server((ws, req, Websocket, normSize, HISTORY, CLIENS, clienSize) => {
        _ws = ws;
        request = req;
        websocket = Websocket;
        norm_size = normSize;
        history = HISTORY;
        clients = CLIENS;
        clientsize = clienSize;

        _ws.on('message', function incoming(message) {
            message = pars(message);
            if (message.type === 'keepAlive') {
                _ws.send(fy({
                    type: "keepAlive",
                    data: Date.now()
                }))
            }

            if (message.type === 'test') {
                console.log(message);
            }
            if (message.type === 'visits') {
                message.times = times++;
            }

            // Save contract to draft
            if (message.type === 'draft' && message.to === 'contract') {
                contract_draft.findOneAndUpdate({ auto: "true" }, {
                        data: message.data
                    })
                    .then(ress => {
                        if (ress) {
                            _ws.send(fy({
                                type: "draft",
                                to: "contract",
                                data: "Saved to draft"
                            }));
                        }
                    })
                    .catch(err => console.log(err));
            }

            // Save contract to draft
            if (message.type === 'save' && message.to === 'contract') {
                message._id = message._id || null;
                contract_draft.findById({ _id: message._id }).then(done => {
                    if (done) {
                        contract_draft.findOneAndUpdate({ auto: 'false' }, {...message }).then((done) => {
                            if (done) {
                                _ws.send(fy({
                                    type: "save",
                                    to: "contract",
                                    data: "updated"
                                }));
                            }
                        }).catch(err => console.log(err));
                    }
                }).catch(err => {

                    if (!err.value._id) {
                        let doc = new contract_draft({...message, auto: 'false' });
                        doc.save({ auto: 'false' }, ).then((done) => {
                            if (done) {
                                _ws.send(fy({
                                    type: "save",
                                    to: "contract",
                                    data: "Saved"
                                }));
                            }
                        }).catch(err => console.log(err));
                    } else
                        console.log(err);

                });

            }

            // Save proposal to draft
            if (message.type === 'draft' && message.to === 'proposal') {

                proposal_draft.findOneAndUpdate({ auto: "true" }, {
                        data: message.data
                    })
                    .then(ress => {
                        if (ress) {
                            _ws.send(fy({
                                type: "draft",
                                to: "proposal",
                                data: "Saved to draft"
                            }));
                        }
                    })
                    .catch(err => console.log(err));
            }

            // Save proposal to draft
            if (message.type === 'save' && message.to === 'proposal') {

                proposal_draft.findOneAndUpdate({ auto: 'false' }, {...message })
                    .then((done) => {
                        if (done) {
                            _ws.send(fy({
                                type: "save",
                                to: "proposal",
                                data: "Saved"
                            }));
                        }

                    }).catch(err => console.log(err));
            }

            // Send new Proposal
            let sendProposal = require('./proposals/send');
            new sendProposal(_ws, req, message, proposal_draft, proposal, Notify, randexp, shortCode, sendNotificationViaEmail);

            // Send Contract
            let sendContract = require('./contracts/send');
            new sendContract(_ws, req, message, contract_draft, contract, Notify, randexp, shortCode, sendNotificationViaEmail);
        });
    });

    return { _ws, request, websocket, norm_size, history, clients, clientsize, pars, fy };

};