import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(element: HTMLElement): Promise<void> {
  // A4 size in points (72 points per inch)
  const pageWidth = 595.28
  const pageHeight = 841.89
  const margin = 30

  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = `${pageWidth - 2 * margin}px`
  document.body.appendChild(clone)

  try {
    const canvas = await html2canvas(clone, {
      scale: 2, // Balance between quality and performance
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      imageTimeout: 30000,
      letterRendering: true,
      foreignObjectRendering: true, // Better text rendering
      scrollX: 0,
      scrollY: 0,
      windowWidth: pageWidth,
      windowHeight: pageHeight,
      onclone: (doc) => {
        // Ensure proper font rendering
        const style = doc.createElement('style')
        style.innerHTML = `
          * { -webkit-font-smoothing: antialiased; }
          body { margin: 0; padding: 0; }
        `
        doc.head.appendChild(style)
      }
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      compress: true
    })

    // Calculate dimensions to maintain aspect ratio
    const imgWidth = pageWidth - 2 * margin
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add image with improved quality
    const imgData = canvas.toDataURL('image/png', 1.0)
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST')

    pdf.save('resume.pdf')
  } finally {
    // Clean up
    document.body.removeChild(clone)
  }
}
