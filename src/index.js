import * as htmlToImage from "html-to-image";

const saveCanvas = (event) => {
    const letter = event.target.attributes.alt.value;
    const dataUrl = event.target.toDataURL("image/png");

    const a = document.createElement("a");
    a.download = letter;
    a.href = dataUrl;
    a.click();
};

const resizeCanvas = (canvas, width, height) => {
    const img = new Image();
    img.addEventListener("load", () => {
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
    });
    img.setAttribute("src", canvas.toDataURL());
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
            // htmlToImageが正方形の画像を返さないので、トリミングする必要がある
            const size = parseInt(
                getComputedStyle(document.documentElement).getPropertyValue(
                    "--emoji-size"
                )
            );
            const scale = window.devicePixelRatio;
            const canvas = document.createElement("canvas");
            canvas.width = size * scale;
            canvas.height = size * scale;
            // 表示スケール200%の場合、256x2=512などになる
            // ここで正方形のcanvasを作り、画像を入れることで不要な部分をカットする
            const img = new Image();
            img.addEventListener("load", () => {
                canvas.getContext("2d").drawImage(img, 0, 0);
                // この時点で正方形の画像ができあがる。スケールによっては目標サイズより大きいのでリサイズする
                resizeCanvas(canvas, size, size);
                canvas.addEventListener("click", saveCanvas);
                canvas.setAttribute("alt", letter);
                outputNode.insertBefore(canvas, outputNode.firstChild);
            });
            img.setAttribute("src", dataUrl);
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
    document.documentElement.style.setProperty(
        "--emoji-color",
        event.target.value
    );
});
document.querySelector("#shapeSelector").addEventListener("change", (event) => {
    document.documentElement.style.setProperty(
        "--emoji-round-size",
        event.target.value === "circle" ? "50%" : "10%"
    );
});
