import * as htmlToImage from "html-to-image";

const saveCanvas = (event) => {
    const letter = event.target.attributes.alt.value;
    const dataUrl = event.target.toDataURL("image/png");

    const a = document.createElement("a");
    a.download = letter;
    a.href = dataUrl;
    a.click();
};

const convert = () => {
    console.log();
    const letter = document.querySelector(".input").value[0] || "乳";
    const node = document.querySelector(".wrapper");
    const outputNode = document.querySelector(".output");
    node.querySelector(".letter").innerText = letter;
    htmlToImage
        .toPng(node)
        .then((dataUrl) => {
            const size = parseInt(
                getComputedStyle(document.documentElement).getPropertyValue(
                    "--emoji-size"
                )
            );
            const canvas = document.createElement("canvas");
            canvas.addEventListener("click", saveCanvas);
            canvas.setAttribute("alt", letter);
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                context.drawImage(img, 0, 0);
                outputNode.insertBefore(canvas, outputNode.firstChild);
            };
            img.src = dataUrl;
        })
        .catch((error) => {
            console.error(error);
        });
};

const clear = () => {
    const out = document.querySelector(".output");
    while (out.firstChild) {
        out.removeChild(out.firstChild);
    }
    document.querySelector(".input").value = null;
    document.querySelector(".letter").innerText = null;
};

document.querySelector("input.input").addEventListener("keypress", () => {
    if (event.keyCode === 13) {
        convert();
    }
});
document.querySelector("button.convert").addEventListener("click", convert);

document.querySelector("button.clear").addEventListener("click", clear);

document.querySelector("#colorSelector").addEventListener("change", (event) => {
    document.documentElement.style.setProperty("--emoji-color", event.target.value);
});
