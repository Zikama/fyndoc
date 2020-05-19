//..... Open Tab function here ......

let active;
let tabState = localStorage.getItem('tabState') || 'active';

function updateLocalActiveTab(state) {
    state = getState(state);
    localStorage.setItem('tabState', String(state));

    tabState = localStorage.getItem('tabState');

    if (state == 'initial') {
        localStorage.setItem('tabState', 'active');
    }

    function getState(state) {
        if (state.classList.contains('tab')) {
            return state.getAttribute('tab-id');
        }
        if (state.classList.contains('art-tablink') && !state.classList.contains('tab') &&
            !state.classList.contains("art-no_tab")) {
            return state.getAttribute('art-tab-id');
        }
        if (state.classList.contains('art-tablink') && !state.classList.contains('tab') &&
            state.classList.contains("art-no_tab")) {
            return state.getAttribute('art-no-tab-id');
        }
        return state.getAttribute('art-tab-id');
    }
    return localStorage.getItem('tabState');
}


function initialTabs() {

    function tabs() {
        let tabs = document.querySelectorAll('.tab');
        if (tabs.length) {
            let counter = 0;
            for (let tab of tabs) {
                tab.setAttribute("tab-id", 'tab_' + counter++);
            }
        }
    }

    tabs();

    function tabLinks() {

        let tablinks = document.getElementsByClassName("art-tablink");
        for (let i = 0; i < tablinks.length; i++) {
            if (!tablinks[i].classList.contains("art-no_tab")) {
                tablinks[i].setAttribute("art-tab-id", 'art_tab_' + i);
            }
        }
    }

    tabLinks();

    function noTabLinks() {
        let no_tablinks = document.getElementsByClassName("art-no_tab");
        for (let i = 0; i < no_tablinks.length; i++) {
            if (!no_tablinks[i].classList.contains("tab")) {
                no_tablinks[i].setAttribute("art-no-tab-id", 'art_no_tab_' + i);
            }

        }
    }

    noTabLinks();
}

function openTab(evt, tabName, descDest, descTarget, cb) {
    let i, x, tablinks;
    let tabs = document.querySelectorAll('.tab');

    if (tabs.length) {
        let counter = 0;
        for (let tab of tabs) {
            tab.classList.remove('art-tab-active');
            tab.setAttribute("tab-id", 'tab_' + counter++);
        }
    }

    x = document.getElementsByClassName("art-tab", "");

    for (let i = 0; i < x.length; i++) {
        // x[i].classList.add('sm_animate_left');
        x[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("art-tablink");
    for (i = 0; i < x.length; i++) {
        if (!tablinks[i].classList.contains("art-no_tab")) {
            tablinks[i].classList.remove("active_tab");
            tablinks[i].setAttribute("art-tab-id", 'art_tab_' + i);
        }
    }
    let no_tablinks = document.getElementsByClassName("art-no_tab");
    for (i = 0; i < no_tablinks.length; i++) {
        if (!no_tablinks[i].classList.contains("tab")) {
            no_tablinks[i].classList.remove("active_tab");
            no_tablinks[i].setAttribute("art-no-tab-id", 'art_no_tab_' + i);
        }

    }

    if (document.getElementById(tabName)) {
        document.getElementById(tabName).style.display = "initial";
    }

    if (!evt.currentTarget.classList.contains("art-no_tab")) {
        evt.currentTarget.classList.add("active_tab");
    } else if (!evt.currentTarget.classList.contains("tab")) {
        evt.currentTarget.classList.add("active_tab");
    }

    updateLocalActiveTab(evt.currentTarget);

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
        cb();
    }
}

function playActive(active) {
    if (active) {
        setTimeout(() => {
            active.click();
        }, 100);
    }
    return 0;
}


let initV = 0;
loaded = false;

initV = setInterval(() => {
    if (document.readyState == "complete") {
        loaded = true;

        initialTabs();

        if (tabState === "active") {
            active = document.querySelector(".art-tablink.active");
            playActive(active);
        } else {
            active = document.querySelector("[tab-id='" + tabState + "']");

            if (!active) {
                active = document.querySelector("[art-tab-id='" + tabState + "']");
            }
            if (!active) {
                active = document.querySelector("[art-no-tab-id='" + tabState + "']");
            }
            playActive(active);
        }

        if (loaded) {
            clearInterval(initV);
        }
    }
}, 100);


//__________________________Open Tab End____________________________________________________