// Simulador de Jardim Vertical
const inputFoto = document.getElementById('inputFoto');
const fotoAmbiente = document.getElementById('fotoAmbiente');
const jardimVertical = document.getElementById('jardimVertical');
const estiloJardim = document.getElementById('estiloJardim');
const btnSimular = document.getElementById('btnSimular');
let dragging = false, offsetX = 0, offsetY = 0;

// Imagens de jardins verticais por estilo
const jardins = {
    moderno: 'assets/img/jardim-moderno.png',
    tropical: 'assets/img/jardim-tropical.png',
    minimalista: 'assets/img/jardim-minimalista.png',
    colorido: 'assets/img/jardim-colorido.png'
};

estiloJardim.addEventListener('change', function() {
    jardimVertical.src = jardins[estiloJardim.value];
});

inputFoto.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            fotoAmbiente.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Simular botão (apenas garante que a imagem do jardim aparece)
btnSimular.addEventListener('click', function() {
    jardimVertical.style.display = 'block';
});

// Drag and drop do jardim vertical
jardimVertical.addEventListener('mousedown', function(e) {
    dragging = true;
    const rect = jardimVertical.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
});
document.addEventListener('mousemove', function(e) {
    if (dragging) {
        const container = document.getElementById('previewContainer');
        const contRect = container.getBoundingClientRect();
        let x = e.clientX - contRect.left - offsetX;
        let y = e.clientY - contRect.top - offsetY;
        jardimVertical.style.left = x + 'px';
        jardimVertical.style.top = y + 'px';
        jardimVertical.style.position = 'absolute';
    }
});
document.addEventListener('mouseup', function() {
    dragging = false;
});
