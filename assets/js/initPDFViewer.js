(function() {
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
    window.initPDFViewer = function(pdfURL, viewPort, ViewportWrapper) {
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
            render();
        });
    };


    function wrapperHtml() {
        if (typeof viewportWrapper != "undefined" && viewportWrapper != "") {
            return viewportWrapper
        }
        return `<div class="post">
                    <div class="p_body" id="p_body">
                    </div>
                    </div>`
    }

    const pagesHTML = wrapperHtml() /* .repeat(pages.length) */ ;
    document.querySelector("#viewport").insertAdjacentHTML("afterBegin", pagesHTML);


    let p_body_content = document.querySelectorAll("#p_body");
    let i = 0;

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

            pages.forEach(renderPage);

            let rendCanvas = document.querySelectorAll("svg");
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
        // Set scale (zoom) level
        var scale = 2;

        // Get viewport (dimensions)
        var viewport = page.getViewport({ scale: 554 });

        // Get div#the-svg
        var container = document.querySelectorAll('.p_body_content');
        container = [];

        // SVG rendering by PDF.js
        page.getOperatorList()
            .then(function(opList) {

                var svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
                return svgGfx.getSVG(opList, viewport);
            })
            .then((svg) => {
                p_body_content[0].appendChild(svg)


            })

    }
})();