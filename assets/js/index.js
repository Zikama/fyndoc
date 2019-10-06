window.onload = () => {
    [g, gA] = [k => document.querySelector(k), k => document.querySelectorAll(k)];

    useTemplate();

    function useTemplate() {
        let template = g("#template");
        let commanded_by_templates = gA(".commanded_by_template");

        let template_proposal = g("#template_proposal");
        let commanded_by_templates_proposal = gA(".commanded_by_template_proposal");

        // template Listener for handling the Do not use template fields
        if (template) {
            template.addEventListener('change', function() {
                let this_val = this.value;

                if (this_val == "Do Not use Tamplate") {
                    for (let commanded_by_template of commanded_by_templates) {
                        commanded_by_template.classList.remove("hidden");
                    }
                } else {
                    for (let commanded_by_template of commanded_by_templates) {
                        commanded_by_template.classList.add("hidden");
                    }
                }
            });
        }
        if (template_proposal) {
            template_proposal.addEventListener('change', function() {
                let this_val = this.value;

                if (this_val == "Do Not use Tamplate") {
                    for (let commanded_by_template of commanded_by_templates_proposal) {
                        commanded_by_template.classList.remove("hidden");
                    }
                } else {
                    for (let commanded_by_template of commanded_by_templates_proposal) {
                        commanded_by_template.classList.add("hidden");
                    }
                }
            });
        }
    }

    function applyLoadingOnBtn() {
        let loaderTemplate = `<img src="../../assets/img/loading.gif" class="click_load hiden" />`;
        let under_submit_forms = gA(".under_submit_form");
        for (let under_submit_form of under_submit_forms) {
            if (under_submit_form) {
                under_submit_form.addEventListener('submit', (e) => {
                    let under_submit = under_submit_form.querySelector(".under_submit");
                    under_submit.classList.add("disabled");
                    under_submit.setAttribute("disabled", "");
                    under_submit.insertAdjacentHTML("beforeEnd", loaderTemplate);
                })
            }
        }
    }
    applyLoadingOnBtn();
};
//Window loaded succesful