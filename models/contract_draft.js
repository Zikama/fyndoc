const mongoose = require("mongoose");
const contract_draft = new mongoose.Schema({
    data: {
        type: String,
        default: ""
    },
    _date: {
        type: Date,
        default: Date.now
    },
    date: {
        type: Date,
        default: Date.now
    },
    auto: {
        type: String,
        default: 'true'
    },
    more_details: {
        type: Object,
        default: null
    }
});
mongoose.set('useFindAndModify', false);
let contract_draft_ = mongoose.model("contract_draft", contract_draft);

contract_draft_.find({}, (err, results) => {
    if (err) throw err;
    if (results.length) {
        return
    } else {
        data = [{ auto: "true" }]

        let total = data.length,
            result = [];

        function saveAll() {
            let doc;
            doc = new contract_draft_(data.pop());

            doc.save(function(err, saved) {
                if (err) throw err; //handle error

                result.push(saved[0]);

                if (--total) saveAll();
            })
        }

        saveAll();
        /* let p = new contract_draft_({ auto: "true" });
        // Finally save new user to DB
        p.save() //Finally save
            .then(user => {
                console.log("an empty draft");
            })
            .catch(err => console.log(err)); */
    }
})
module.exports = contract_draft_;