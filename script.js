// Switch between tabs
function showTab(tabId) {
  // Hide all tab contents
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active class from all tabs
  const allTabButtons = document.querySelectorAll('.tab');
  allTabButtons.forEach(tabButton => {
    tabButton.classList.remove('active');
  });

  // Show the selected tab
  document.getElementById(tabId).classList.add('active');

  // Set active class to the clicked tab
  const activeTab = document.querySelector(`button[onclick="showTab('${tabId}')"]`);
  activeTab.classList.add('active');
}

// Convert image to PDF
document.getElementById('convertToPdf').addEventListener('click', function () {
  const imageInput = document.getElementById('imageInput');
  const images = imageInput.files;
  
  if (images.length === 0) {
    alert('Please select an image first!');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  Array.from(images).forEach((image, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      doc.addImage(e.target.result, 'JPEG', 10, 10, 180, 250);
      if (index < images.length - 1) {
        doc.addPage();
      } else {
        doc.save('converted.pdf');
      }
    };
    reader.readAsDataURL(image);
  });
});

// Convert PDF to Image (show only download buttons)
document.getElementById('pdfInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file || file.type !== 'application/pdf') {
    alert('Please upload a PDF file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const pdfData = new Uint8Array(e.target.result);
    pdfjsLib.getDocument(pdfData).promise.then(function (pdf) {
      const numPages = pdf.numPages;
      const previewContainer = document.getElementById('pdfPreview');
      previewContainer.innerHTML = '';

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        pdf.getPage(pageNum).then(function (page) {
          const scale = 1.5;
          const viewport = page.getViewport({ scale: scale });

          // No canvas or image, just the download button
          const downloadButton = document.createElement('button');
          downloadButton.textContent = `Download Image`;
          downloadButton.classList.add('download-button');
          
          downloadButton.onclick = function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };

            page.render(renderContext).promise.then(function () {
              const img = canvas.toDataURL();
              const link = document.createElement('a');
              link.href = img;
              link.download = `page-${pageNum}.png`;
              link.click();
            });
          };

          previewContainer.appendChild(downloadButton);
        });
      }
    });
  };
  reader.readAsArrayBuffer(file);
});
