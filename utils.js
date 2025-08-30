// utils.js

export function clearPreview() {
  const preview = document.getElementById('preview');
  const loader = document.getElementById('loader');
  preview.style.display = 'none';
  preview.innerHTML = '';
  loader.style.display = 'none';
}

export function displayFile(file, previewElement) {
  const reader = new FileReader();
  const fileName = file.name;
  const fileType = file.type;
  const fileSize = (file.size / 1024).toFixed(2) + ' KB';

  // Mostrar loader
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
  previewElement.style.display = 'none';

  // Crear botón de cerrar
  const closeButton = document.createElement('button');
  closeButton.classList.add('close-btn');
  closeButton.innerHTML = '×';
  closeButton.setAttribute('aria-label', 'Cerrar archivo');
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    clearPreview();
    // Reiniciar input de archivo
    document.getElementById('fileInput').value = '';
  });

  // Encabezado
  const header = document.createElement('h2');
  header.textContent = `📄 ${fileName}`;

  const info = document.createElement('div');
  info.className = 'info';
  info.textContent = `Tipo: ${fileType || 'Desconocido'} | Tamaño: ${fileSize}`;

  const content = document.createElement('div');
  content.className = 'preview-content';

  // Limpiar y preparar vista previa
  previewElement.innerHTML = '';
  previewElement.appendChild(closeButton);
  previewElement.appendChild(header);
  previewElement.appendChild(info);
  previewElement.appendChild(content);

  // Manejo por tipo de archivo
  reader.onloadstart = () => {
    loader.style.display = 'block';
  };

  reader.onloadend = () => {
    loader.style.display = 'none';
  };

  reader.onerror = () => {
    loader.style.display = 'none';
    content.innerHTML = '<p style="color: #e53e3e;">Error al cargar el archivo.</p>';
    previewElement.style.display = 'block';
  };

  if (file.type.startsWith('text/') || file.name.endsWith('.json')) {
    reader.onload = () => {
      const pre = document.createElement('pre');
      pre.textContent = reader.result;
      content.appendChild(pre);
      previewElement.style.display = 'block';
    };
    reader.readAsText(file);
  }
  else if (file.type.startsWith('image/')) {
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.alt = fileName;
      content.appendChild(img);
      previewElement.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  else if (file.type.startsWith('audio/')) {
    reader.onload = () => {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = reader.result;
      content.appendChild(audio);
      previewElement.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  else if (file.type.startsWith('video/')) {
    reader.onload = () => {
      const video = document.createElement('video');
      video.controls = true;
      video.src = reader.result;
      content.appendChild(video);
      previewElement.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  else if (file.name.endsWith('.pdf')) {
    reader.onload = () => {
      const iframe = document.createElement('iframe');
      iframe.src = reader.result;
      iframe.style.width = '100%';
      iframe.style.height = '500px';
      iframe.style.border = 'none';
      content.appendChild(iframe);
      previewElement.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  else {
    reader.onload = () => {
      const p = document.createElement('p');
      p.textContent = 'Vista previa no disponible para este tipo de archivo.';
      content.appendChild(p);
      previewElement.style.display = 'block';
    };
    reader.readAsArrayBuffer(file);
  }
}