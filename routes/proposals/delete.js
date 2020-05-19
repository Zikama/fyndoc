class Delete {
    constructor(_ws, req, message, proposal_draft, proposalTemp, Notify, randexp, shortCode, sendNotificationViaEmail) {

        // JSON parse
        function pars(e) {
            return JSON.parse(e);
        }
        // JSON stringify
        function fy(e) {
            return JSON.stringify(e);
        }
        // Check if type of message is send and is to proposal
        if (message.type === 'delete' && message.to === 'proposal') {


            proposalTemp.findByIdAndDelete({ _id: message.id } /* , { new: true } */ )
                .then(res => {
                    if (res) {

                        _ws.send(fy({
                            type: 'delete',
                            to: 'proposal',
                            status: "successful",
                            data: res.data
                        }));
                    }
                })
                .catch(err => console.log(err));
        }
    }
}
module.exports = Delete;