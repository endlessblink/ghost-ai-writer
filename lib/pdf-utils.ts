import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(element: HTMLElement): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2, // Increase resolution
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  })

  const imgData = canvas.toDataURL('image/jpeg', 1.0)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  })

  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height, '', 'FAST')
  pdf.save('resume.pdf')
}
