class render {
    constructor(_ws, router, sendNotificationViaEmail, contract, Capitalize, pathToTheRoot) {

        // Reader parameters
        const readerPR = {
            who: "client",
            title: { true: true, name: "Contract" },
            original_css: true,
            header: `CONTRACT AGREEMENT BETWEEN: SADJA WEB SOLUTIONS - ANOTHER COMPANY`
        };

        // Reader parameters
        const _404PR = {
            who: "error",
            title: { true: true, name: "Sadja | Error" },
            original_css: true,
            header: `Error`
        };
        let viewTimes = 0;

        // Contract Reading link route
        router.get("/:shortUrl/:documentId/:name", (req, res) => {
            let shortCode = req.params.shortUrl,
                ref = req.params.documentId,
                company = Capitalize(req.params.name, "_");

            readerPR.title.name = '';
            readerPR.title.name = company + ' Contract';
            // Double check the url params exists in our database
            contract.find({ shortCode, /* ref, company */ company: { $regex: '.*' + company + '.*' } })
                .then((results) => {
                    if (results && results.length) {

                        results = results[0];
                        // Update viewTimes from db
                        if (results.more_details.viewTimes) {
                            viewTimes = results.more_details.viewTimes + 1;
                        } else {
                            viewTimes = viewTimes + 1;
                        }

                        if (results.contract_status == 'not-signed') {
                            contract.findByIdAndUpdate({ _id: results._id }, {
                                    view_date: Date.now(),
                                    status: 'viewed',
                                    "more_details.viewTimes": viewTimes
                                }, { new: true })
                                .then((rwa) => {
                                    // Doc updated
                                    // Notify the main sadja web solutions' email
                                    sendNotificationViaEmail('index', "Contract viewed [" + rwa.more_details.viewTimes + " time(s)]", 'melisa@sadjawebsolutions.com', 'saphira@sadjawebtools.com', [{
                                            filename: 'contract-agreement.png',
                                            path: './views/templates/output.png',
                                            cid: 'output.png',
                                            contentType: 'image/png'
                                        }], {
                                            name: `The Proposal ID is : ${rwa.ref}`,
                                            title: `${rwa.company}, has successfully seen the Contract`,
                                            regards: `Sadja WebSolutions LTD`,
                                            _no: 'no display'
                                        })
                                        .then(sent => {
                                            // Mail sent
                                        }).catch((err) => console.log(err))

                                })
                                .catch(err => console.log(err));

                            let user_agent = req["headers"]["user-agent"];
                            readerPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                            readerPR.header = `CONTRACT AGREEMENT BETWEEN: ${results.from} - ${results.company}`;
                            readerPR.contract = results.more_details.contract;
                            readerPR.status = "not-signed";
                            readerPR.data = results;
                            // Get the proposal
                            /* proposal.findOne({ ref: ref }).then((propos) => {
                                readerPR.ARTroposal = propos.more_details.proposal;
                                readerPR.proposal_data = propos; */
                            res.render("reader", {
                                pathToTheRoot: (() => {
                                    readerPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                                    return readerPR.pathToTheRoot;
                                })(),
                                ...readerPR
                            });

                            // }).catch((err) => console.log(err))
                        } else {
                            // For already signed contract
                            if (results.contract_status == 'signed' && results.more_details.visible_until !== new Date()) {
                                // res.redirect(`${pathToTheRoot(req._parsedOriginalUrl.path)}contract/signed/${shortCode}`)

                                let user_agent = req["headers"]["user-agent"];
                                readerPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                                readerPR.header = `CONTRACT AGREEMENT BETWEEN: ${results.from} - ${results.company}`;
                                readerPR.contract = results.more_details.contract;
                                readerPR.status = "signed";
                                readerPR.data = results;
                                res.render("reader", {
                                    pathToTheRoot: (() => {
                                        readerPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                                        return readerPR.pathToTheRoot;
                                    })(),
                                    ...readerPR
                                });
                            } else {
                                res.render('404', {
                                    status: 404,
                                    url: req.url,
                                    pathToTheRoot: (() => {
                                        _404PR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                                        return _404PR.pathToTheRoot;
                                    })(),
                                    ..._404PR
                                });
                            }
                        }
                    } else {

                        res.render('404', {
                            status: 404,
                            url: req.url,
                            pathToTheRoot: (() => {
                                _404PR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                                return _404PR.pathToTheRoot;
                            })(),
                            ..._404PR
                        });
                    }
                })
                .catch(err => {
                    res.render('404', {
                        status: 404,
                        url: req.url,
                        pathToTheRoot: (() => {
                            _404PR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                            return _404PR.pathToTheRoot;
                        })(),
                        ..._404PR
                    });
                })
        });

    }

}
module.exports = render