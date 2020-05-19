const mongoose = require("mongoose");
const proposal_draft = new mongoose.Schema({
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
        default: "true"
    },
    more_details: {
        type: Object,
        default: null
    }
});
mongoose.set('useFindAndModify', false);
let proposal_draft_ = mongoose.model("proposal_draft", proposal_draft);

proposal_draft_.find({}, (err, results) => {
    if (err) throw err;
    if (results.length) {
        return;
    } else {

        data = [{ auto: "true" }];

        let total = data.length,
            result = [];

        function saveAll() {
            let doc;
            doc = new proposal_draft_(data.pop());

            doc.save(function(err, saved) {
                if (err) throw err; //handle error

                result.push(saved[0]);

                if (--total) saveAll();
            });
        }

        saveAll();
    }
})
module.exports = proposal_draft_;