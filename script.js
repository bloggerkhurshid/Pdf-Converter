// Import jsPDF from jspdf
const { jsPDF } = window.jspdf;

// Image to PDF
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const convertToPdfButton = document.getElementById('convertToPdf');

let images = [];

// Preview Images
imageInput.addEventListener('change', (e) => {
  images = [];
  imagePreview.innerHTML = '';
  Array.from(e.target.files).forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.alt = `Image ${index + 1}`;
      img.className = 'w-24 h-24 object-cover border rounded';
      imagePreview.appendChild(img);
      images.push(event.target.result);
    };
    reader.readAsDataURL(file);
  });
});

// Convert to PDF
convertToPdfButton.addEventListener('click', () => {
  if (images.length === 0) {
    alert('Please upload at least one image.');
    return;
  }

  const pdf = new jsPDF();
  images.forEach((image, index) => {
    if (index > 0) pdf.addPage();
    pdf.addImage(image, 'JPEG', 10, 10, 180, 150);
  });
  pdf.save('converted.pdf');
});

// PDF to Image
const pdfInput = document.getElementById('pdfInput');
const pdfPreview = document.getElementById('pdfPreview');

pdfInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const pdfData = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    pdfPreview.innerHTML = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      pdfPreview.appendChild(canvas);
    }
  };
  fileReader.readAsArrayBuffer(file);
});
