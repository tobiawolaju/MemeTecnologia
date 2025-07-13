document.addEventListener('DOMContentLoaded', () => {
    const canvasArea = document.querySelector('.canvas-area');
    const canvasElement = document.getElementById('memeCanvas');
    let canvas = null; // Initialize canvas as null

    const imageUpload = document.getElementById('imageUpload');
    const addTextBtn = document.getElementById('addText');
    const textInput = document.getElementById('textInput');
    const textColorInput = document.getElementById('textColor');
    const fontSizeInput = document.getElementById('fontSize');
    const saveMemeBtn = document.getElementById('saveMeme');

    let currentImage = null;

    // Function to initialize/re-initialize canvas
    const initializeCanvas = () => {
        if (canvas) {
            canvas.dispose(); // Dispose of previous canvas instance if it exists
        }
        
        console.log('Initializing canvas:');
        console.log('canvasArea offsetWidth:', canvasArea.offsetWidth);
        console.log('canvasArea offsetHeight:', canvasArea.offsetHeight);

        // Ensure canvasElement has correct dimensions before creating Fabric.js canvas
        canvasElement.width = canvasArea.offsetWidth;
        canvasElement.height = canvasArea.offsetHeight;
        
        console.log('canvasElement width (after setting):', canvasElement.width);
        console.log('canvasElement height (after setting):', canvasElement.height);

        canvas = new fabric.Canvas('memeCanvas');
        canvas.renderAll();

        console.log('Fabric.js canvas width:', canvas.getWidth());
        console.log('Fabric.js canvas height:', canvas.getHeight());
    };

    // Listen for the custom event to initialize canvas
    document.addEventListener('editorShown', () => {
        initializeCanvas();
    });

    function setCanvasBackgroundImage(imgSrc) {
        const options = {};
        if (!imgSrc.startsWith('data:')) {
            options.crossOrigin = 'anonymous';
        }

        fabric.Image.fromURL(imgSrc, (img) => {
            if (img) {
                currentImage = img;
                canvas.clear();

                const canvasWidth = canvas.getWidth();
                const canvasHeight = canvas.getHeight();

                const scaleX = canvasWidth / img.width;
                const scaleY = canvasHeight / img.height;
                const scale = Math.min(scaleX, scaleY);

                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                    scaleX: scale,
                    scaleY: scale,
                    top: canvasHeight / 2,
                    left: canvasWidth / 2,
                    originX: 'center',
                    originY: 'center'
                });

                canvas.renderAll();
            } else {
                console.error('Fabric.js: Image object is null after loading from URL.');
            }
        }, options, (err) => {
            console.error('Fabric.js Image loading error:', err);
        });
    }

    document.addEventListener('editMeme', (e) => {
        setCanvasBackgroundImage(e.detail.imageUrl);
    });

    imageUpload.addEventListener('change', (e) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            setCanvasBackgroundImage(event.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    });

    addTextBtn.addEventListener('click', () => {
        if (!canvas) return; // Ensure canvas is initialized
        const text = new fabric.IText(textInput.value || 'New Text', {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            fill: textColorInput.value,
            fontSize: parseInt(fontSizeInput.value),
            originX: 'center',
            originY: 'center'
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        textInput.value = '';
        canvas.renderAll();
    });

    textColorInput.addEventListener('change', () => {
        if (!canvas) return; // Ensure canvas is initialized
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
            activeObject.set('fill', textColorInput.value);
            canvas.renderAll();
        }
    });

    fontSizeInput.addEventListener('input', () => {
        if (!canvas) return; // Ensure canvas is initialized
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'i-text') {
            activeObject.set('fontSize', parseInt(fontSizeInput.value));
            canvas.renderAll();
        }
    });

    saveMemeBtn.addEventListener('click', () => {
        if (!canvas || !currentImage) {
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