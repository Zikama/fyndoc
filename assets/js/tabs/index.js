//..... Open Tab function here ......
let active;

function openTab(evt, tabName, descDest, descTarget, cb) {
    let i, x, tablinks;
    x = document.getElementsByClassName("art-tab", "");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("art-tablink");
    for (i = 0; i < x.length; i++) {
        if (!tablinks[i].classList.contains("art-no_tab")) { tablinks[i].classList.remove("active_tab"); }
    }
    if (document.getElementById(tabName)) {
        document.getElementById(tabName).style.display = "initial";
    }
    if (!evt.currentTarget.classList.contains("art-no_tab")) { evt.currentTarget.classList.add("active_tab"); }
    if (typeof descTarget !== "undefined" && descTarget !== null) {
        descTarget = evt.currentTarget.getAttribute("custom-desc");
    }
    if (typeof descDest !== "undefined" && descDest !== null) {
        descDest == "undefined" ? descDest : descDest = "desc";
        var Descdest = document.querySelector(`#${descDest}`);
        if (Descdest) {
            Descdest.innerText = descTarget;
        }
    }
    if (typeof cb !== "undefined" && cb !== null) {
        cb()
    }


}
(() => {
    active = document.querySelector(".art-tablink.active");
    if (active) {
        setTimeout(() => {

            active.click()
        }, 100);
    }


})();

//__________________________Open Tab End____________________________________________________