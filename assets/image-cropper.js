document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('custom-image-upload');
    const cropperModal = document.getElementById('cropper-modal');
    const cropperImage = document.getElementById('image-to-crop');
    const textInput = document.getElementById('image-text');
    const leftRotateBtn = document.getElementById('rotate-left');
    const rightRotateBtn = document.getElementById('rotate-right');
    const cropBtn = document.getElementById('crop-image');
    const saveBtn = document.getElementById('save-image');
    const cancelBtn = document.getElementById('cancel');
    const previewCanvas = document.getElementById('live-preview-canvas');

    let cropper;

    function updatePreview() {
        if(cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            if(!croppedCanvas) return;

            const previewCtx = previewCanvas.getContext('2d');
            previewCtx.clearRect(0,0,previewCanvas.width, previewCanvas.height);
            previewCtx.drawImage(croppedCanvas, 0,0, previewCanvas.width, previewCanvas.height);
        }
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            cropperImage.src = e.target.result;
            cropperModal.classList.remove('hidden');

            if(cropper) cropper.destroy();
            cropper = new Cropper(cropperImage, {
                viewMode: 1,
                autoCrop: false,
                autoCropArea: 1,
                minCropBoxWidth: 100,
                minCropBoxHeight: 100,
                crop: updatePreview,
            })
            cropperImage.onload = updatePreview;
        }
        reader.readAsDataURL(file);
    })

    leftRotateBtn.addEventListener('click', () => {
        if(cropper){
            cropper.rotate(-90);
            updatePreview();
        }
    })

    rightRotateBtn.addEventListener('click', () => {
        if(cropper){
            cropper.rotate(90);
            updatePreview();
        }
    })

    cropBtn.addEventListener('click', () => {
        if(cropper) {
            cropper.crop();
            updatePreview();
        }
    })

    textInput.addEventListener('input', () => {
        updatePreview();
    })
})