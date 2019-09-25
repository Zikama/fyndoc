
//Accordions  	 
function Accordion(doc, panel, cb) {

    if (doc && !doc.length && doc[0] !== "init") {
        doc.addEventListener("click", function (e) {
            let that = e.target;
            let second = panel;
            if (panel && panel.style.display === "block") {
                if (cb)
                    cb(that, second)
                panel.style.display = "none";
            }
            else {
                if (cb)
                    cb(that, second)
                panel.style.display = "block";
            }
        })
    } else {
        if (doc && doc.length && doc[0] === "init") {
            let that = doc[1];
            let second = panel;
            if (panel && panel.style.display === "block") {
                if (cb)
                    cb(that, second)
                panel.style.display = "none";
            }
            else {
                if (cb)
                    cb(that, second)
                panel.style.display = "block";
            }

        }
    }
}
// Display the marked Active Accordion
(() => {
    const _active_ = document.querySelectorAll("._active");
    if (_active_) {
        for (let _active of _active_) {
            if (_active.classList.contains("_active")) {
                if (_active.style.display === "none") {
                    _active.style.display = "block";
                    _active.style.height = "auto";
                    let actV = _active.previousElementSibling;
                    if (actV) {
                        actV.classList.add("caret-up")
                    }
                } else {
                    if (_active.classList.contains("_active") && _active.classList.contains("caret-up")) {

                        _active.click()

                    } else {
                        _active.style.display = "block";
                        _active.style.height = "auto";
                        let actV = _active.previousElementSibling;
                        if (actV) {
                            actV.classList.add("caret-up")
                        }

                    }
                }
            }
        }
    }
})();

    // export default Accordion
