const { jsPDF } = window.jspdf;

const doc = new jsPDF({
  unit: "px",
  format: "letter",
});

const pageWidth = doc.internal.pageSize.width;
const UNI_LOGO = new Image();
UNI_LOGO.src = "/uni_logo.png";
document.querySelector("#fecha").valueAsDate = new Date();

function getNaturalDate(dateStr) {
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const parts = dateStr.split("-");
  const year = parts[0];
  const month = parseInt(parts[1], 10) - 1;
  const day = parts[2];

  return `${day} de ${months[month]} de ${year}`;
}

function uniLogoToBase64() {
  const canvas = document.createElement("CANVAS");
  const ctx = canvas.getContext("2d");
  canvas.height = UNI_LOGO.naturalHeight;
  canvas.width = UNI_LOGO.naturalWidth;
  ctx.drawImage(UNI_LOGO, 0, 0);
  return canvas.toDataURL("image/png");
}

function writeCenteredDoc(text, y) {
  let textWidth = doc.getTextWidth(text);
  let x = (pageWidth - textWidth) / 2;
  doc.text(text, x, y);
}

function createDoc() {
  let line = 40;
  const date = getNaturalDate(document.querySelector("#fecha").value);
  const location = document.querySelector("#lugar").value;
  const faculty = document.querySelector("#facultad").value;
  const career = document.querySelector("#carrera").value;
  const classroom = document.querySelector("#clase").value;
  const homework = document.querySelector("#tarea").value;
  const teacher = document.querySelector("#docente").value;
  const students = document.querySelector("#estudiantes").value.split("\n");

  doc.setFont("times", "bold");
  doc.setFontSize(20);
  writeCenteredDoc("UNIVERSIDAD NACIONAL DE INGENIERIA", line);
  line += 20;
  writeCenteredDoc(faculty, line);
  line += 20;
  doc.setFont("times", "bold");
  writeCenteredDoc(career, line);
  line += 20;
  doc.addImage(uniLogoToBase64(), "PNG", (pageWidth - 163) / 2, line, 163, 104);
  line += 140;
  doc.setFontSize(18);
  writeCenteredDoc(classroom, line);
  doc.setFont("times", "italic");
  line += 20;
  writeCenteredDoc(homework, line);
  line += 40;
  doc.setFont("times", "bold");
  writeCenteredDoc("Elaborado por:", line);
  line += 20;
  doc.setFont("times", "normal");
  students.forEach((student) => {
    writeCenteredDoc(student, line);
    line += 16;
  });
  line += 20;
  doc.setFont("times", "bold");
  writeCenteredDoc("Docente:", line);
  line += 20;
  doc.setFont("times", "normal");
  writeCenteredDoc(teacher, line);
  line = 540;
  doc.setFont("times", "italic");
  writeCenteredDoc(location, line);
  line += 16;
  writeCenteredDoc(date, line);
  doc.save("documento.pdf");
}
