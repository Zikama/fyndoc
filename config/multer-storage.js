storage = (dst, name, multer, path) => {
    return multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, dst !== null ? dst : "/assets/temp/uploads")
        },
        filename: function(req, file, cb) {

            if (typeof req.body.fileName !== "undefined" && req.body.fileName !== "") {
                name = req.body.fileName;
                if (name.includes("proposal")) {
                    name = "sadja-proposal";
                    file.filename = "sadja-proposal" + path.extname(file.originalname);
                    cb(null, name !== null ? `${name}${path.extname(file.originalname)}` : Date.now() + '-' + file.originalname)
                } else if (name.includes("contract")) {
                    name = "sadja-contract";
                    file.filename = "sadja-proposal" + path.extname(file.originalname);
                    cb(null, name !== null ? `${name}${path.extname(file.originalname)}` : Date.now() + '-' + file.originalname)
                } else {
                    cb(null, name !== null ? `${name}${path.extname(file.originalname)}` : Date.now() + '-' + file.originalname)
                }
            } else {
                if (typeof req.body.fileName !== "undefined" && req.body.fileName === "contract" || req.body.fileName === "proposal") {
                    name = "sadja-" + req.body.fileName;
                    file.filename = "sadja-proposal" + req.body.fileName + path.extname(file.originalname);
                    cb(null, name !== null ? `${name}${path.extname(file.originalname)}` : Date.now() + '-' + file.originalname)
                } else {
                    if (dst.includes("proposal")) {
                        name = "sadja-proposal";
                        file.filename = "sadja-proposal" + path.extname(file.originalname);
                        cb(null, name !== null ? `${name}${path.extname(file.originalname)}` : Date.now() + '-' + file.originalname)
                    } else if (dst.includes("contract")) {
                        name = "sadja-contract";
                        file.filename = "sadja-proposal" + path.extname(file.originalname);
                        cb(null, name !== null ? `${name}${path.extname(file.originalname)}` : Date.now() + '-' + file.originalname)
                    } else {
                        cb(null, name !== null ? `${name}${path.extname(file.originalname)}` : Date.now() + '-' + file.originalname)
                    }
                }
            }
        }
    })
};
module.exports = storage