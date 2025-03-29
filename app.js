const { jsPDF } = window.jspdf;

class PDFGenerator {
    constructor() {
        this.doc = new jsPDF({ 
            unit: "px", 
            format: "letter",
            compress: true  // Compresión para optimizar el PDF
        });
        this.pageWidth = this.doc.internal.pageSize.width;
        this.pageHeight = this.doc.internal.pageSize.height;
        this.margins = {
            left: 40,
            right: 40,
            top: 40,
            bottom: 40
        };
        this.lineHeight = 1.2; // Espaciado entre líneas
    }

    /**
     * Escribe texto con autoajuste de tamaño de fuente
     * @param {string} text - Texto a escribir
     * @param {number} y - Posición vertical inicial
     * @param {number} maxWidth - Ancho máximo disponible
     * @param {number} initialSize - Tamaño inicial de fuente
     * @param {string} [style='normal'] - Estilo de fuente (normal/bold/italic)
     * @returns {number} Nueva posición Y después del texto
     */
    writeAutoFit(text, y, maxWidth, initialSize = 20, style = 'normal') {
        if (!text || text.trim() === '') return y;
        
        const font = 'helvetica';
        let fontSize = initialSize;
        let textWidth;
        let lines;
        
        // Ajuste progresivo del tamaño de fuente
        do {
            this.doc.setFont(font, style);
            this.doc.setFontSize(fontSize);
            lines = this.doc.splitTextToSize(text, maxWidth);
            textWidth = this.doc.getTextWidth(lines[0]);
            
            if (textWidth > maxWidth && fontSize > 8) {
                fontSize -= 1;
            }
        } while (textWidth > maxWidth && fontSize > 8);
        
        // Escribir cada línea
        lines.forEach((line, index) => {
            const x = (this.pageWidth - this.doc.getTextWidth(line)) / 2;
            this.doc.text(line, x, y + (index * fontSize * this.lineHeight));
        });
        
        return y + (lines.length * fontSize * this.lineHeight);
    }

    /**
     * Genera el PDF con los datos del formulario
     */
    async generate() {
        try {
            // Obtener datos del formulario
            const title = document.getElementById("titulo").value || "Sin título";
            const students = document.getElementById("estudiantes").value.split("\n").filter(s => s.trim());
            const teacher = document.getElementById("docente").value || "Docente no especificado";
            
            let y = this.margins.top;
            
            // 1. Título (con autoajuste)
            this.doc.setFont("helvetica", "bold");
            y = this.writeAutoFit(title, y, this.pageWidth - this.margins.left - this.margins.right, 24, 'bold') + 20;
            
            // 2. Lista de estudiantes
            this.doc.setFont("helvetica", "normal");
            this.doc.setFontSize(14);
            this.doc.text("Elaborado por:", this.margins.left, y);
            y += 20;
            
            students.forEach(student => {
                if (student.trim()) {
                    this.doc.text(student.trim(), this.margins.left + 10, y);
                    y += 15;
                }
            });
            
            // 3. Información del docente
            y += 10;
            this.doc.setFont("helvetica", "bold");
            this.doc.text("Docente:", this.margins.left, y);
            this.doc.setFont("helvetica", "normal");
            this.doc.text(teacher, this.margins.left + 40, y);
            
            // 4. Pie de página (fecha)
            const today = new Date();
            const dateStr = today.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            this.doc.setFontSize(12);
            this.doc.text(`Generado el ${dateStr}`, this.margins.left, this.pageHeight - 20);
            
            // Guardar el PDF
            this.doc.save(`Portada - ${title.substring(0, 20)}...pdf`);
            
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            alert("Ocurrió un error al generar el PDF. Por favor verifica los datos.");
        }
    }
}

// Inicialización
const pdfGen = new PDFGenerator();
document.getElementById("generarPDF").addEventListener("click", () => {
    // Validación básica
    if (!document.getElementById("titulo").value) {
        alert("Por favor ingresa al menos un título");
        return;
    }
    pdfGen.generate();
});
