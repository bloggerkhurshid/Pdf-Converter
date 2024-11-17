// Image to PDF Functionality
document.getElementById('convertToPdf').addEventListener('click', function () {
  const imageInput = document.getElementById('imageInput');
  const images = imageInput.files;

  if (images.length === 0) {
    alert('Please select at least one image.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  Array.from(images).forEach((image, index) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.height * imgWidth) / img.width;

        if (index !== 0) pdf.addPage();
        pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);

        if (index === images.length - 1) {
          pdf.save('converted.pdf');
        }
      };
    };
    reader.readAsDataURL(image);
  });
});

// Image Preview for Image to PDF
document.getElementById('imageInput').addEventListener('change', function () {
  const imagePreview = document.getElementById('imagePreview');
  imagePreview.innerHTML = '';

  Array.from(this.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.border = '1px solid #ccc';
      img.style.borderRadius = '5px';
      img.style.marginRight = '10px';
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// PDF to Image Functionality
document.getElementById('pdfInput').addEventListener('change', function () {
  const pdfPreview = document.getElementById('pdfPreview');
  pdfPreview.innerHTML = '';

  const file = this.files[0];
  if (!file) {
    alert('Please select a PDF file.');
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = function () {
    const pdfData = new Uint8Array(fileReader.result);
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });

    loadingTask.promise
      .then(pdf => {
        for (let i = 1; i <= pdf.numPages; i++) {
          pdf.getPage(i).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };

            page.render(renderContext).promise.then(() => {
              pdfPreview.appendChild(canvas);
            });
          });
        }
      })
      .catch(error => {
        console.error('Error loading PDF:', error);
        alert('Failed to process PDF.');
      });
  };

  fileReader.readAsArrayBuffer(file);
});
