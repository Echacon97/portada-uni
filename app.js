const { jsPDF } = window.jspdf;

class PDFGenerator {
  constructor() {
    this.doc = new jsPDF({ unit: "px", format: "letter" });
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margins = { top: 60, left: 60, right: 60, bottom: 60 };
    this.UNI_LOGO_SRC = "uni_logo.png";
    this.lineSpacing = 20;
  }

  async loadUniLogo() {
    const img = new Image();
    img.src = this.UNI_LOGO_SRC;
    await img.decode();
    return this.imageToBase64(img);
  }

  imageToBase64(img) {
    const canvas = document.createElement("CANVAS");
    const ctx = canvas.getContext("2d");
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }

  getNaturalDate(dateStr) {
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const [year, month, day] = dateStr.split("-");
    return `${day} de ${months[parseInt(month, 10) - 1]} de ${year}`;
  }

  writeCenteredText(text, y, maxWidth = this.pageWidth - this.margins.left - this.margins.right) {
    const lines = this.doc.splitTextToSize(text, maxWidth);
    const lineHeight = this.doc.getLineHeight() / this.doc.internal.scaleFactor;
    
    lines.forEach((line, i) => {
      const textWidth = this.doc.getTextWidth(line);
      const x = (this.pageWidth - textWidth) / 2;
      this.doc.text(line, x, y + (i * lineHeight));
    });
    
    return lines.length * lineHeight;
  }

  async generateSociologyCover() {
    const date = this.getNaturalDate(document.querySelector("#fecha").value);
    const location = document.querySelector("#lugar").value;
    const title = document.querySelector("#titulo").value;
    const subtitle = document.querySelector("#subtitulo").value;
    const teacher = document.querySelector("#docente").value;
    const students = document.querySelector("#estudiantes").value.split("\n");
    
    let currentY = this.margins.top;

    // Logo y encabezado institucional
    const logoBase64 = await this.loadUniLogo();
    this.doc.addImage(
      logoBase64,
      "PNG",
      (this.pageWidth - 100) / 2,
      currentY,
      100,
      65
    );
    currentY += 85;

    // Título principal
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(24);
    currentY += this.writeCenteredText(title.toUpperCase(), currentY);
    currentY += this.lineSpacing;

    // Subtítulo
    if (subtitle) {
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(18);
      currentY += this.writeCenteredText(subtitle, currentY);
      currentY += this.lineSpacing * 2;
    }

    // Sección de autores
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(16);
    currentY += this.writeCenteredText("Elaborado por:", currentY);
    currentY += this.lineSpacing / 2;

    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(14);
    students.forEach(student => {
      currentY += this.writeCenteredText(student.trim(), currentY);
    });
    currentY += this.lineSpacing;

    // Sección de docente
    this.doc.setFont("helvetica", "bold");
    currentY += this.writeCenteredText("Docente:", currentY);
    currentY += this.lineSpacing / 2;

    this.doc.setFont("helvetica", "normal");
    currentY += this.writeCenteredText(teacher, currentY);
    currentY += this.lineSpacing * 2;

    // Pie de página
    this.doc.setFont("helvetica", "italic");
    this.doc.setFontSize(12);
    currentY += this.writeCenteredText(location, currentY);
    currentY += this.lineSpacing / 2;
    this.writeCenteredText(date, currentY);

    // Guardar el documento
    this.doc.save(`Portada - ${title}.pdf`);
  }
}

// Uso:
const pdfGen = new PDFGenerator();
document.querySelector("#generarPDF").addEventListener("click", () => pdfGen.generateSociologyCover());
