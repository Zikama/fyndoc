class render {
    constructor(router, proposal, Capitalize, pathToTheRoot) {

        // Reader parameters
        const proposalReaderPR = {
            who: "client",
            title: { true: true, name: "Proposal" },
            original_css: true,
            header: `PROPOSAL: SADJA WEB SOLUTIONS - ANOTHER COMPANY`
        };
        let _viewTimes = 0;

        router.get("/proposal/:documentId/:shortUrl/:name", (req, res) => {
            let shortCode = req.params.shortUrl,
                ref = req.params.documentId,
                company = Capitalize(req.params.name, "_");

            proposalReaderPR.title.name = company + ' ' + proposalReaderPR.title.name;
            // Double check the url params exists in our database
            proposal.find({ shortCode, ref, company })
                .then((results) => {
                    if (results && results.length) {

                        results = results[0];
                        // Update viewTimes from db
                        if (results.more_details.viewTimes) {
                            _viewTimes = results.more_details.viewTimes + 1;
                        } else {
                            _viewTimes = _viewTimes + 1;
                        }

                        if (results.proposal_status === 'not-approved') {
                            proposal.findByIdAndUpdate({ _id: results._id }, {
                                    view_date: Date.now(),
                                    status: 'viewed',
                                    "more_details.viewTimes": _viewTimes
                                })
                                .then((rwa) => {
                                    // Doc updated
                                })
                                .catch(err => console.log(err));

                            let user_agent = req["headers"]["user-agent"];
                            proposalReaderPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                            proposalReaderPR.header = `PROPOSAL: ${results.from} - ${results.company}`;
                            proposalReaderPR.proposal = results.more_details.proposal;
                            proposalReaderPR.status = "not-approved";
                            proposalReaderPR.data = results;
                            res.render("reader_proposal", {
                                pathToTheRoot: (() => {
                                    proposalReaderPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                                    return proposalReaderPR.pathToTheRoot;
                                })(),
                                ...proposalReaderPR
                            });
                        } else {
                            // For already signed contract
                            if (results.proposal_status === 'approved' && results.more_details.visible_until !== new Date()) {
                                // res.redirect(`${pathToTheRoot(req._parsedOriginalUrl.path)}contract/signed/${shortCode}`)

                                let user_agent = req["headers"]["user-agent"];
                                proposalReaderPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                                proposalReaderPR.header = `PROPOSAL: ${results.from} - ${results.company}`;
                                proposalReaderPR.proposal = results.more_details.proposal;
                                proposalReaderPR.status = "approved";
                                proposalReaderPR.data = results;
                                res.render("reader_proposal", {
                                    pathToTheRoot: (() => {
                                        proposalReaderPR.pathToTheRoot = pathToTheRoot(req._parsedOriginalUrl.path);
                                        return proposalReaderPR.pathToTheRoot;
                                    })(),
                                    ...proposalReaderPR
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