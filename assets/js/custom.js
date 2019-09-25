
// Javascript is my favorite Juice
// Athor : Nemie
customCheckBox_and_Radio("checkboxes");

function customCheckBox_and_Radio(m_check,m_radio) {/* initializing...*/let styleTemp = `.radios,.checkboxes {display: flex;flex-direction: column;flex-wrap: nowrap;align-content:'center'}.label, label {cursor: pointer;font-size: 1rem;line-height: 1.5rem;user-select:none;}.checkbox,.radio {border: 0;clip: rect(0 0 0 0);height: 1px;margin: -1px;overflow: hidden;padding: 0;position: absolute;width: 1px;}.checkbox + label, .checkbox + .label, .radio + label, .radio + .label {position: relative;padding: 4px 0 0 2.4pc;margin-bottom: 1rem;user-select: none;}.checkbox + label:before,.checkbox + .label:before,.radio + label:before ,.radio + .label:before{content: "";position: absolute;top: 0;left: 0;width: 1.75rem;height: 1.75rem;    border: 2px solid rgb(3, 169, 244);border-radius: 0.45rem;background: #fff;text-align: center;transition: background 200ms ease-out;}.checkbox + label:after,.checkbox + .label:after,.radio + label:after,.radio + .label:after{content: "";position: absolute;transform: scale(0);transition: transform 200ms ease-out;}.checkbox + label:after,.checkbox + .label:after{background-color: transparent;content: "";display: block;position: absolute;left: 0.81rem;top: 1.9px;width: 0.5rem;height: 1.25rem;opacity: 0.0; border-bottom: 3px solid #03a9f4;border-right: 3px solid #03a9f4;transform: rotate(45deg);transition: border-color 0.3s ease;}.checkbox:checked + label:before,.checkbox:checked + .label:before{content: "";}.checkbox:checked + label:after,.checkbox:checked + .label:after{content: "";opacity: 1;}.radio + label:before, .radio + label:after,.radio + .label:before, .radio + .label:after{border-radius: 50%;}.radio + label:after,.radio + .label:after{left: 0.35rem;top: 0.35rem;width: 1rem;height: 1rem;}.radio:checked + label:before ,.radio:checked + .label:before{animation: borderscale 300ms ease-in;}.radio:checked + label:after ,.radio:checked + .label:after{background: #e900ff;transform: scale(1);}`;
	let styleTag = document.querySelector("head style");
	if(styleTag){
		styleTag.insertAdjacentText("beforeEnd",styleTemp) ;
	}else{
		styleTag = document.createElement("style");
		let head = document.querySelector("head");
		let body = document.querySelector("body");
		if (!head && body) {
			head = document.createElement("head");
			body.appendChild(head);
		}
		if (head)
			head.appendChild(styleTag);
		else if (body)body.appendChild(styleTag);styleTag.insertAdjacentText("beforeEnd",styleTemp) ;
	}if (m_check) {
		let mainCheckes = document.querySelectorAll(`.${m_check}`);
		if (mainCheckes) {
			for (mainCheck of mainCheckes){
				var customs = mainCheck.querySelectorAll("[type='checkbox']");
				if(customs){
					for ( let custom of customs ){
						custom.classList.add("checkbox")
					}
				}
			}
		}
	}else{
		const customs = document.querySelectorAll("[type='checkbox']");if(customs)for ( custom of customs )custom.classList.add("checkbox")
	}
	if (m_radio) {
		let mainRadios = document.querySelectorAll(`.${m_radio}`);
		if (mainRadios.length) {
			for ( mainRadio of mainRadios ){
				var customs = mainRadio.querySelectorAll("[type='radio']");
				if(customs.length){
					for ( let custom of customs ){
						custom.classList.add("radio")
					}
				}
			}
		}
		
	}else{
		const customs = document.querySelectorAll("[type='radio']");if(customs)for ( custom of customs )custom.classList.add("radio")
	}
}

