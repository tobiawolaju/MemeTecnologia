document.addEventListener('DOMContentLoaded', () => {
    const canvasArea = document.querySelector('.canvas-area'); // Reference to the container div
    const canvas = new fabric.Canvas('memeCanvas');
    const imageUpload = document.getElementById('imageUpload');
    const imageUrlInput = document.getElementById('imageUrl');
    const loadImageFromUrlBtn = document.getElementById('loadImageFromUrl');
    const dropArea = document.getElementById('dropArea');
    const topText = document.getElementById('topText');
    const bottomText = document.getElementById('bottomText');
    const saveMemeBtn = document.getElementById('saveMeme');

    let currentImage = null;

    // Function to set canvas background image and resize canvas
    function setCanvasBackgroundImage(imgSrc) {
        fabric.Image.fromURL(imgSrc, (img) => {
            currentImage = img;
            canvas.clear();

            // Get the dimensions of the parent container for the canvas
            const containerWidth = canvasArea.offsetWidth;
            const containerHeight = canvasArea.offsetHeight;

            let newWidth = img.width;
            let newHeight = img.height;

            // Calculate scaling factor to fit image within container while maintaining aspect ratio
            const imgAspectRatio = img.width / img.height;
            const containerAspectRatio = containerWidth / containerHeight;

            if (imgAspectRatio > containerAspectRatio) {
                // Image is wider than container, scale by width
                newWidth = containerWidth;
                newHeight = containerWidth / imgAspectRatio;
            } else {
                // Image is taller than container, scale by height
                newHeight = containerHeight;
                newWidth = containerHeight * imgAspectRatio;
            }

            // Ensure the canvas doesn't exceed the container's padding (adjust as needed)
            const padding = 20; 
            newWidth = Math.min(newWidth, containerWidth - padding * 2);
            newHeight = Math.min(newHeight, containerHeight - padding * 2);

            canvas.setWidth(newWidth);
            canvas.setHeight(newHeight);

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: newWidth / img.width,
                scaleY: newHeight / img.height
            });

            // Re-position text objects if they exist (optional, but good for consistency)
            if (topTextObject) {
                topTextObject.set({ left: canvas.width / 2 });
                canvas.bringToFront(topTextObject);
            }
            if (bottomTextObject) {
                bottomTextObject.set({ left: canvas.width / 2, top: canvas.height - bottomTextObject.height - 20 });
                canvas.bringToFront(bottomTextObject);
            }
            canvas.renderAll();

        }, { crossOrigin: 'anonymous' }); // crossOrigin is important for images from other domains
    }

    // Check for imageUrl in URL parameters on page load
    const urlParams = new URLSearchParams(window.location.search);
    const imageUrlFromParam = urlParams.get('imageUrl');
    if (imageUrlFromParam) {
        setCanvasBackgroundImage(decodeURIComponent(imageUrlFromParam));
    } else {
        // Set initial canvas size if no image is loaded from URL
        canvas.setWidth(canvasArea.offsetWidth - 40);
        canvas.setHeight(canvasArea.offsetHeight - 40);
        canvas.renderAll();
    }

    // Image Upload via file input
    imageUpload.addEventListener('change', (e) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            setCanvasBackgroundImage(event.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    // Image Upload via URL
    loadImageFromUrlBtn.addEventListener('click', () => {
        const url = imageUrlInput.value.trim();
        if (url) {
            setCanvasBackgroundImage(url);
        } else {
            alert('Please enter an image URL.');
        }
    });

    // Drag and Drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
    });

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCanvasBackgroundImage(event.target.result);
            };
            reader.readAsDataURL(files[0]);
        }
    }, false);

    function addOrUpdateText(textObject, textContent, position) {
        if (textObject) {
            textObject.set({ text: textContent });
        } else {
            textObject = new fabric.Text(textContent, {
                left: canvas.width / 2,
                fill: 'white',
                stroke: 'black',
                strokeWidth: 2,
                fontSize: 40,
                fontFamily: 'Impact',
                textAlign: 'center',
                originX: 'center',
                shadow: 'rgba(0,0,0,0.5) 2px 2px 4px'
            });
            canvas.add(textObject);
        }

        if (position === 'top') {
            textObject.set({ top: 20 });
        } else if (position === 'bottom') {
            textObject.set({ top: canvas.height - textObject.height - 20 });
        }
        canvas.renderAll();
        return textObject;
    }

    let topTextObject = null;
    let bottomTextObject = null;

    topText.addEventListener('input', (e) => {
        topTextObject = addOrUpdateText(topTextObject, e.target.value, 'top');
    });

    bottomText.addEventListener('input', (e) => {
        bottomTextObject = addOrUpdateText(bottomTextObject, e.target.value, 'bottom');
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