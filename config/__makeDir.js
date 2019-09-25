
const __makeDir = (...dirs) => new Promise((resolve, reject) => {
    let fs = require("fs");
    for (let dir of dirs) {

        if (fs.existsSync(dir)) {
            /* Return solved if we have the file path */
            return resolve(dir)
        } else {
            // RETURN REJECT AND MAKE THE FILEPATH
            return (async () => {
                // Make a directory since is not there 
                dir = await fs.mkdirSync(dir);
                // return the dir variable
                return reject(dir)
            })()
        }
    }
    return dir
});
module.exports = __makeDir