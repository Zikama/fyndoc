const mongoose = require("mongoose"),
    shortCode = require("shortid"),
    bcrypt = require("bcryptjs"),
    RandExp = require('randexp');
randexp = new RandExp(/\d\d\d\d\d/);
randexp.defaultRange.add(32, new Date());
const MenuSchema = new mongoose.Schema({
    menu: {
        type: Object,
        required: true
    },
    container: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.set('useFindAndModify', false);
let Menu = mongoose.model("Menu", MenuSchema);
Menu.find({}, (err, results) => {
    if (err) throw err;
    if (results.length) {
        return 0;
    } else {
        let data = [{
                menu: {
                    title: "Contract Document",
                    classes: ['art-dop_down', ' io_aro', ' caret-up', 'lis', '_active'],
                    id: "contract_document"
                },
                container: [{
                        title: "Create a contract",
                        classes: ['li', 'tex_no_deco'],
                        classesB: ['art-btn-a', 'art-tablink', 'active']
                    },
                    {
                        title: "Send a contract",
                        classes: ['li', 'tex_no_deco'],
                        classesB: ['art-btn-a', 'art-tablink']
                    }
                ]
            },
            {
                menu: { title: "Proposal document", classes: ['art-dop_down', ' io_aro', ' caret-up', 'lis'], id: "proposal_document" },
                container: [{
                    title: "Send a proposal",
                    classes: ['li', 'tex_no_deco'],
                    classesB: ['art-btn-a', 'art-tablink']
                }, {
                    title: "Create a proposal",
                    classes: ['li', 'tex_no_deco'],
                    classesB: ['art-btn-a', 'art-tablink']
                }]
            }
        ];

        let total = data.length,
            result = [];

        function saveAll() {
            let doc;
            doc = new Menu(data.pop());

            doc.save(function(err, saved) {
                if (err) throw err; //handle error

                result.push(saved[0]);

                if (--total) saveAll();
            })
        }

        saveAll();

        /*let p = new Menu(data); 

        p.save() //Finally save
            .then(user => { })
            .catch(err => console.log(err)); */

    }
});
module.exports = Menu;