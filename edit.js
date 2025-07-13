document.addEventListener('DOMContentLoaded', () => {
    const canvasArea = document.querySelector('.canvas-area');
    const canvas = new fabric.Canvas('memeCanvas');
    const imageUpload = document.getElementById('imageUpload');
    const addTextBtn = document.getElementById('addText');
    const textInput = document.getElementById('textInput');
    const textColorInput = document.getElementById('textColor');
    const fontSizeInput = document.getElementById('fontSize');
    const saveMemeBtn = document.getElementById('saveMeme');

    let currentImage = null;

    function setCanvasBackgroundImage(imgSrc) {
        fabric.Image.fromURL(imgSrc, (img) => {
            currentImage = img;
            canvas.clear();

            const containerWidth = canvasArea.offsetWidth;
            const containerHeight = canvasArea.offsetHeight;

            let newWidth = img.width;
            let newHeight = img.height;

            const imgAspectRatio = img.width / img.height;
            const containerAspectRatio = containerWidth / containerHeight;

            if (imgAspectRatio > containerAspectRatio) {
                newWidth = containerWidth;
                newHeight = containerWidth / imgAspectRatio;
            } else {
                newHeight = containerHeight;
                newWidth = containerHeight * imgAspectRatio;
            }

            const padding = 20;
            newWidth = Math.min(newWidth, containerWidth - padding * 2);
            newHeight = Math.min(newHeight, containerHeight - padding * 2);

            canvas.setWidth(newWidth);
            canvas.setHeight(newHeight);

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: newWidth / img.width,
                scaleY: newHeight / img.height
            });

            canvas.renderAll();

        }, { crossOrigin: 'anonymous' });
    }

    document.addEventListener('editMeme', (e) => {
        setCanvasBackgroundImage(e.detail.imageUrl);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const imageUrlFromParam = urlParams.get('imageUrl');
    if (imageUrlFromParam) {
        setCanvasBackgroundImage(decodeURIComponent(imageUrlFromParam));
    } else {
        canvas.setWidth(canvasArea.offsetWidth - 40);
        canvas.setHeight(canvasArea.offsetHeight - 40);
        canvas.renderAll();
    }

    imageUpload.addEventListener('change', (e) => {

    addTextBtn.addEventListener('click', () => {
        const text = new fabric.IText(textInput.value || 'New Text', {
            left: 50,
            top: 50,
            fill: textColorInput.value,
            fontSize: parseInt(fontSizeInput.value)
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        textInput.value = '';
    });

    textColorInput.addEventListener('change', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
            activeObject.set('fill', textColorInput.value);
            canvas.renderAll();
        }
    });

    fontSizeInput.addEventListener('input', () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
            activeObject.set('fontSize', parseInt(fontSizeInput.value));
            canvas.renderAll();
        }
    });

    saveMemeBtn.addEventListener('click', () => {
        if (!currentImage) {
            alert('Please upload an image first!');
            return;
        }
        const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'my-meme.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});