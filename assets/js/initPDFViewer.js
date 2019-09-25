

(function () {
    let currentPageIndex = 0;
    let pageMode = 1;
    let cursorIndex = Math.floor(currentPageIndex / pageMode);
    let pdfInstance = null;
    let totalPagesCount = 0,
        viewportWrapper;
    const input = document.querySelector("#page-mode input");

    // Get the view port
    let viewport = document.querySelector("#viewporter");
    // initialize the Pdf Viewer
    window.initPDFViewer = function (pdfURL, viewPort, ViewportWrapper) {
        viewportWrapper = ViewportWrapper;
        // View port ; our html or document for viewing our pdf pages
        // @params [ID or Class selectors]: recommended is ID of the doc or Html element
        if (viewPort) {
            viewport = document.querySelector(viewPort) || viewPort;
        }

        pdfjsLib.getDocument(pdfURL).then(pdf => {
            pdfInstance = pdf;
            totalPagesCount = pdf.numPages;
            pageMode = totalPagesCount;
            // initPager();
            initPageMode();
            render();
        });
    };

    /* 
    /* @funtionalities [change the page on viewer acording to the event took action]: this works closely with the initPager function for the buttons 
    /* next and prev under the container [#pager]
    */

    function onPagerButtonsClick(event) {
        if (input) {
            const action = event.target.getAttribute("data-pager");
            if (action === "prev") {
                input.value = currentPageIndex;
                if (currentPageIndex === 0) {
                    input.value = currentPageIndex + 1;
                    return;
                }
                currentPageIndex -= pageMode;
                if (currentPageIndex < 0) {
                    currentPageIndex = 0;
                    input.value = currentPageIndex;
                }
                render();

            }

            if (action === "next") {
                if (input) {
                    input.value = currentPageIndex + 2;
                    if (currentPageIndex === totalPagesCount - 1) {
                        input.value = currentPageIndex + 1;
                        return;
                    }
                    currentPageIndex += pageMode;
                    if (currentPageIndex > totalPagesCount - 1) {
                        currentPageIndex = totalPagesCount - 1;
                        input.value = currentPageIndex;
                    }
                }
                render();
            }
        }
    }

    /* 
    /* Init pager. this reffers to the next and prev buttons under the pager document wrapper or container
    /* @Funtion [onPagerButtonsClick], the onPagerButtonsClick is used to change the switch page accordingly on the button events [ if for next;the current 
    /* page move one step ahead, and for prev otherwise ]
    */

    function initPager() {
        const pager = document.querySelector("#pager");
        if (pager) {
            pager.addEventListener("click", onPagerButtonsClick);
            return () => {
                pager.removeEventListener("click", onPagerButtonsClick);
            };
        }
    }

    /* 
    /* Page View Mode 
    /* @Params[ even ], you can pass the function to a document event to work as a reference for changing the page view mode
    /* the argument [event] will be used the grab the value of the document the function passed to as an event function
    /* and use the document's value for changing the page view.
    */
    function onPageModeChange(event) {
        if (event.target) {
            pageMode = Number(event.target.value);
        } else {
            pageMode = Number(event)
        }
        render();
    }

    function initPageMode() {
        if (input) {
            input.setAttribute("max", totalPagesCount);
            input.addEventListener("change", onPageModeChange);
            return () => {
                input.removeEventListener("change", onPageModeChange);
            };
        }
    }

    function render() {
        cursorIndex = Math.floor(currentPageIndex / pageMode);
        const startPageIndex = cursorIndex * pageMode;
        const endPageIndex =
            startPageIndex + pageMode < totalPagesCount ?
                startPageIndex + pageMode - 1 :
                totalPagesCount - 1;

        const renderPagesPromises = [];
        for (let i = startPageIndex; i <= endPageIndex; i++) {
            renderPagesPromises.push(pdfInstance.getPage(i + 1));
        }

        Promise.all(renderPagesPromises).then(pages => {
            function wrapperHtml() {
                if (typeof viewportWrapper != "undefined" && viewportWrapper != "") {
                    return viewportWrapper
                }
                return `<div style="width:100%"><canvas></canvas></div>`
            }
            const pagesHTML = wrapperHtml().repeat(pages.length);
            viewport.insertAdjacentHTML("afterBegin", pagesHTML);
            pages.forEach(renderPage);

            let rendCanvas = document.querySelectorAll("canvas");
            rendCanvas.forEach(canva => {
                if (document.querySelector("#page-mode input:nth-child(2)")) {
                    document.querySelector("#page-mode input:nth-child(2)").value = rendCanvas.length;
                }
                canva.addEventListener("contextmenu", (e) => {
                    alert("Document is protected");
                    e.preventDefault()
                })
            })

        });
    }

    function renderPage(page) {
        let pdfViewport = page.getViewport(1, { scale: .8 });

        const container =
            viewport.children[page.pageIndex - cursorIndex * pageMode];
        pdfViewport = page.getViewport(container.offsetWidth / pdfViewport.width);


        // const canvas = container.children[0];
        const canvas = container.querySelector("canvas");
        const context = canvas.getContext("2d");
        canvas.height = pdfViewport.height;
        canvas.width = pdfViewport.width;
        context.imageSmoothingEnabled = false;
        // context.font= "15px times";
        // context.translate(-100,-100);
        // context.scale(1.26,1.2);

        var e = page.render({
            canvasContext: context,
            viewport: pdfViewport,
            font: context.font
        });
        console.log(context.strokeStyle);



    }
})();