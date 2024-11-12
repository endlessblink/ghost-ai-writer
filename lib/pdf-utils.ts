import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(element: HTMLElement): Promise<void> {
  // Calculate dimensions
  const pageWidth = 595.28 // A4 width in points
  const pageHeight = 841.89 // A4 height in points
  const margin = 40 // margins in points
  
  const canvas = await html2canvas(element, {
    scale: 3, // Higher resolution
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    allowTaint: true,
    imageTimeout: 15000,
    removeContainer: true,
    letterRendering: true,
  })

  // Create PDF with A4 dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  })

  // Calculate scaling to fit content within margins
  const availableWidth = pageWidth - 2 * margin
  const availableHeight = pageHeight - 2 * margin
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight)

  // Calculate centered position
  const x = (pageWidth - imgWidth * ratio) / 2
  const y = (pageHeight - imgHeight * ratio) / 2

  // Add image with high quality settings
  const imgData = canvas.toDataURL('image/jpeg', 1.0)
  pdf.addImage(imgData, 'JPEG', x, y, imgWidth * ratio, imgHeight * ratio, '', 'FAST')

  pdf.save('resume.pdf')
}
