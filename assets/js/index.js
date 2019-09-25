window.onload = () => {
    [g, gA] = [k => document.querySelector(k), k => document.querySelectorAll(k)];
    let agreed = g("#agreed");
    if (agreed) { agreed.addEventListener("click", agreedForm); }

    let change = g("#change");

    if (change) {
        change.addEventListener("click", changesForm);
    }

    function agreedForm() {
        displayModal("flex", function () {
            writeToHeader("write", function (placeHolder) {
                placeHolder.innerHTML = "<h1>Agreement - </h1><p>Tell us more about you and your position in your company</p>";
            });
            writeToBody("write", function (placeHolder) {
                placeHolder.innerHTML = `<form method="post" class="art-mo-form">

                                <div class="art_inps">
                                    <label for="full_name"> Names</label>
                                    <div class="art_inp_co">
                                        <input type="text" class="art_inp" placeholder="Your full name as shown on your ID/Passport" id="full_name" name="full_name" required>
                                    </div>
                                </div>

                                <div class="art_inps">
                                    <label for="passport"> National ID/Passport Number</label>
                                    <div class="art_inp_co">
                                        <input type="text" class="art_inp" placeholder="Enter your national ID/Passport number" id="passport" name="passport" required>
                                    </div>
                                </div>

                                <div class="art_inps">
                                    <label for="date_of_birth"> Date Of Birth </label>
                                    <div class="art_inp_co">
                                        <input type="date" class="art_inp" placeholder="Date Of birth" id="date_of_birth" value="1099-02-01" name="date_of_birth" required>
                                    </div>
                                </div>

                                <div class="art_inps">
                                    <label for="email"> Email</label>
                                    <div class="art_inp_co">
                                        <input type="text" class="art_inp" placeholder="Your business Email address" id="email" name="email" required>
                                    </div>
                                </div>
                                
                                    <div class="art_inps">
                                        <label for="position"> Position</label>
                                        <div class="art_inp_co">
                                            <input type="text" class="art_inp" placeholder="What is your position in your company ?" id="position" name="position" required>
                                        </div>
                                    </div>
                                </form>`
            });
        })
    }

    function changesForm() {
        displayModal("flex", function () {
            writeToHeader("write", function (placeHolder) {
                placeHolder.innerHTML = "<h1>Tell us about the changes you need</h1>"
            });
            writeToBody("write", function (placeHolder) {
                placeHolder.innerHTML = `<form method="post" class="art-mo-form">

                                <div class="art_inps">
                                    <label for="full_name"> Names</label>
                                    <div class="art_inp_co">
                                        <input type="text" class="art_inp" placeholder="Your full name as shown on your ID/Passport" id="full_name" name="full_name" required>
                                    </div>
                                </div>

                                <div class="art_inps">
                                    <label for="email"> Email</label>
                                    <div class="art_inp_co">
                                        <input type="text" class="art_inp" placeholder="Your business Email address" id="email" name="email" required>
                                    </div>
                                </div>
                                
                                    <div class="art_inps">
                                        <label for="changes"> Changes </label>
                                        <div class="art_inp_co">
                                            <textarea class="art_inp_area" placeholder="What are the changes would you like to be made ?" id="changes" name="changes" required></textarea>
                                        </div>
                                    </div>
                                </form>`;
            });
        });
    }

    useTemplate();
    function useTemplate() {
        let template = g("#template");
        let commanded_by_templates = gA(".commanded_by_template");

        let template_proposal = g("#template_proposal");
        let commanded_by_templates_proposal = gA(".commanded_by_template_proposal");

        // template Listener for handling the Do not use template fields
        if (template) {
            template.addEventListener('change', function () {
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
            template_proposal.addEventListener('change', function () {
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
    } applyLoadingOnBtn();
};
    //Window loaded succesful
