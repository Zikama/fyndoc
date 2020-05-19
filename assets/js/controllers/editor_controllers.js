function editTitleClick(e) {
    let target = window.event.target || e.target;
    target = target || e;
    target.removeAttribute('readonly');
    target.classList.add('leg-title_edit');
}

function editTitle_blur(e) {
    let target = window.event.target || e.target;
    target = target || e;
    target.setAttribute('readonly', '');
    target.classList.remove('leg-title_edit');
}

let title_edit_ = document.querySelectorAll('.leg-title');
if (title_edit_ && title_edit_.length) {
    for (let title_edit of title_edit_) {
        title_edit.addEventListener('click', editTitleClick);
        title_edit.addEventListener('blur', editTitle_blur);
    }
}

function toggleEditorOptions(e) {
    let target = window.event.target || e.target;
    target = target || e;
    let container1 = target.parentElement;
    let container = container1.querySelector('.container__');

    function onShowElement() {
        container.style.maxHeight = 'initial';
        container.style.overflow = 'initial';
        container.classList.add('opened');
    }

    function onhideElement() {
        container.style.maxHeight = '0';
        container.style.overflow = 'hidden';
        container.classList.remove('opened');
    }

    function autoHideAnywhere(e) {
        let doc = window.event.target || e.target;
        doc = doc || e;
        if (doc !== target) {
            if (container && container.classList.contains('opened')) {
                onhideElement();
            }
            document.removeEventListener('click', autoHideAnywhere);
            return;
        }
    }

    if (container && !container.classList.contains('opened')) {
        onShowElement();
        document.addEventListener('click', autoHideAnywhere);
        return;
    }
    onhideElement();
    document.removeEventListener('click', autoHideAnywhere);
}

let under_more_options = document.querySelectorAll('.under_more');
if (under_more_options && under_more_options.length) {
    for (let under_more_option of under_more_options) {
        under_more_option.addEventListener('click', toggleEditorOptions);
    }
}

hidePreviewModal();

// Hide the preview modal
function hidePreviewModal() {
    let prev_modal_ = document.querySelector(".modal_");
    let prev_modal_layer_ = document.querySelector(".modal_layer_");
    prev_modal_layer_.addEventListener('click', () => {
        prev_modal_.classList.add("hidden");
    });
}

// keep The Input Length Size While Typing
function keepTheLength() {
    // Get all the elements in the DOM that requires this functionality.
    // NOTE: Every element of type input with the class editor_input this functionality will 
    // take action to it
    let inp = document.querySelectorAll(".editor_input");
    if (typeof inp != "undefined" && inp.length) {
        for (const _in of inp) {
            if (_in) {
                _in.addEventListener("keyup", () => {
                    let lwgth = _in.value.length - 2 <= 0 ? 1 : _in.value.length - 2;
                    lwgth = _in.value.length - 3 <= 3 ? 3 : _in.value.length - 3;
                    lwgth = _in.value.length - 5 <= 5 ? 6 : _in.value.length - 5;
                    _in.setAttribute("size", lwgth);
                });
            }
        }
    }
}