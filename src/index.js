import * as htmlToImage from "html-to-image";

const convert = () => {
    console.log();
    const letter = document.querySelector(".input").value[0] || "乳";
    const node = document.querySelector(".wrapper");
    const outputNode = document.querySelector(".output");
    node.querySelector(".letter").innerText = letter;
    htmlToImage
        .toPng(node)
        .then((dataUrl) => {
            var img = new Image();
            img.src = dataUrl;
            outputNode.insertBefore(img, outputNode.firstChild);
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

document.querySelector("button.convert").addEventListener("click", (event) => {
    convert();
});

document.querySelector("button.clear").addEventListener("click", (event) => {
    clear();
});
