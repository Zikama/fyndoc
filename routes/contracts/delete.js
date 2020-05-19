class Delete {
    constructor(_ws, req, message, contract_draft, contractTemp, Notify, randexp, shortCode, sendNotificationViaEmail) {

        // JSON parse
        function pars(e) {
            return JSON.parse(e);
        }
        // JSON stringify
        function fy(e) {
            return JSON.stringify(e);
        }

        // Check if type of message is delete and is to contract
        if (message.type === 'delete' && message.to === 'contract') {
            // Quickly respond back
            if (typeof _ws !== 'undefined') {
                // We can now delete the contract 

                contractTemp.findByIdAndDelete({ _id: message.id } /* , { new: true } */ )
                    .then(res => {
                        if (res) {
                            let data = res.id;

                            _ws.send(fy({
                                type: 'delete',
                                to: 'contract',
                                status: "successful",
                                data
                            }));
                        }
                    })
                    .catch(err => console.log(err));

            }


        }

    }
}
module.exports = Delete;