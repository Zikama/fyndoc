class render {
    constructor(router, contract, Capitalize, pathToTheRoot) {

        // Reader parameters
        const readerPR = {
            who: "client",
            title: { true: true, name: "Contract" },
            original_css: true,
            header: `CONTRACT AGREEMENT BETWEEN: SADJA WEB SOLUTIONS - ANOTHER COMPANY`
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
            contract.find({ shortCode, /*  ref, */ company })
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
                                })
                                .then((rwa) => {
                                    // Doc updated
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
                                res.redirect(`${pathToTheRoot(req._parsedOriginalUrl.path)}notfound`)
                            }
                        }
                    }
                })
                .catch(err => console.log(err))
        });

    }

}
module.exports = render