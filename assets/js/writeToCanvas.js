class WriteToCanvas {
    constructor(x, y, ctx) {
        this.y = y - 8;
        this.x = x;
        this.ctx = ctx;
        let input = document.querySelector("#textes");
        input.style.left = this.x + "px";
        input.style.top = this.y + "px";
        input.style.display = "block";
        input.focus();
    }

    writeText(event, x, y) {
        const curentCanvas = event.target || event;
        x = this.x;
        y = this.y;

        this.ctx.font = "15pt Arial";
        this.ctx.fillStyle = "blue";

        this.ctx.fillText(curentCanvas.value, x, y + 10);
        let input = document.querySelector("#textes");
        input.style.display = "none";
        input.value = "";
    }
}

function init_(cmd) {
    let writeToCanvas,
        canvases = document.querySelectorAll("canvas");
    if (cmd === true) {

        for (let canvas_ of canvases) {
            canvas_.style.cursor = "text";
            canvas_.style.position = "relative";
            canvas_.addEventListener("click", function(e) {
                console.log(e.clientX);
                writeToCanvas = new WriteToCanvas(
                    e.clientX,
                    e.clientY,
                    e.target.getContext("2d")
                );
            });

        }

        let input = document.querySelector("#textes");
        input.addEventListener("blur", function(e) {
            writeToCanvas.writeText(this);
        });
        return 0
    }
    for (let canvas_ of canvases) {
        canvas_.style.cursor = "inherit";
    }

}

let writeTocan = document.querySelector("#writeTocan");
if (writeTocan) {
    writeTocan.addEventListener("click", function() {
        this.classList.toggle("writting");
        if (this.classList.contains("writting")) {
            return init_(false);
        }
        init_(true);
    });
}