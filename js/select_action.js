document.addEventListener('DOMContentLoaded', function () {
    const processType = document.getElementById('processType');
    const optionsDivs = document.querySelectorAll('.options');

    const showOptions = (type) => {
        optionsDivs.forEach((div) => div.style.display = 'none');

        switch (type) {
            case 'resize':
                document.getElementById('resizeOptions').style.display = 'block';
                break;
            case 'rotate':
                document.getElementById('rotateOptions').style.display = 'block';
                break;
            case 'blur':
                document.getElementById('blurOptions').style.display = 'block';
                break;
            case 'brightness':
                document.getElementById('brightnessOptions').style.display = 'block';
                break;
            case 'contrast':
                document.getElementById('contrastOptions').style.display = 'block';
                break;
            case 'crop':
                document.getElementById('cropOptions').style.display = 'block';
                break;
        }
    };

    processType.addEventListener('change', (e) => {
        showOptions(e.target.value);
    });

    showOptions(processType.value);
});