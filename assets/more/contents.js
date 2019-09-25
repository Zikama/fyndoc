content = async() => {
    doc = "./assets/docs/download.pdf" /* "https://pdf-lib.js.org/assets/with_update_sections.pdf" */ ;
    // const existingPdfBytes = await fetch(doc).then(res => res.arrayBuffer());

    // const pdfDoc = await PDFDocument.load(doc);
    fs.readFile(doc, async(err, data) => {
        if (err) throw err;
        const pdfDoc = await pdfLib.PDFDocument.load(data);
        const pages = pdfDoc.getPages();
        // console.log(pages[0].doc.computePages().length);
        // console.log(pages[0].getContentStream().computeContents());
        console.log(pages[0].getContentsSize());
    });

};
content();


// Basic node example that prints document metadata and text content.
// Requires single file built version of PDF.js--please run `gulp singlefile`
// before running the example.


// Run `gulp dist-install` to generate 'pdfjs-dist' npm package files.
var pdfjsLib = require('pdfjs-dist');

// Loading file from file system into typed array
var pdfPath = process.argv[2] || './assets/docs/download.pdf';

// Will be using promises to load document, pages and misc data instead of
// callback.
var loadingTask = pdfjsLib.getDocument(pdfPath);
loadingTask.promise.then(function(doc) {
    var numPages = doc.numPages;
    console.log('# Document Loaded');
    console.log('Number of Pages: ' + numPages);
    console.log();

    var lastPromise; // will be used to chain promises
    lastPromise = doc.getMetadata().then(function(data) {
        console.log('# Metadata Is Loaded');
        console.log('## Info');
        console.log(JSON.stringify(data.info, null, 2));
        console.log();
        if (data.metadata) {
            console.log('## Metadata');
            console.log(JSON.stringify(data.metadata.getAll(), null, 2));
            console.log();
        }
    });

    var loadPage = function(pageNum) {
        return doc.getPage(pageNum).then(function(page) {
            console.log('# Page ' + pageNum);
            var viewport = page.getViewport({ scale: 1.0, });
            console.log('Size: ' + viewport.width + 'x' + viewport.height);
            console.log();
            // console.log(page);

        });
    };
    // Loading of the first page will wait on metadata and subsequent loadings
    // will wait on the previous pages.
    for (var i = 1; i <= numPages; i++) {
        lastPromise = lastPromise.then(loadPage.bind(null, i));
    }
    return lastPromise;
}).then(function() {
    console.log('# End of Document');
}, function(err) {
    console.error('Error: ' + err);
});