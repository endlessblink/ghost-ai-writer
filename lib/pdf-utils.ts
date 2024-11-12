import { jsPDF } from 'jspdf'

export async function generatePDF(element: HTMLElement): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16
  })

  const margin = 40
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const contentWidth = pageWidth - (2 * margin)
  
  // Configure PDF document
  pdf.setFont('helvetica')
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)

  let yPosition = margin
  const lineHeight = 16

  // Process the markdown content
  const sections = element.children
  Array.from(sections).forEach((section) => {
    const text = section.textContent || ''
    const tag = section.tagName.toLowerCase()

    // Handle different heading levels
    if (tag.startsWith('h')) {
      const level = parseInt(tag.charAt(1))
      pdf.setFontSize(level === 1 ? 24 : level === 2 ? 18 : 14)
      pdf.setFont('helvetica', 'bold')
      
      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage()
        yPosition = margin
      }
      
      pdf.text(text, margin, yPosition)
      yPosition += lineHeight * 1.5
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
    } 
    // Handle paragraphs and lists
    else if (tag === 'p' || tag === 'li') {
      const words = text.split(' ')
      let line = ''
      
      words.forEach((word) => {
        const testLine = line + (line ? ' ' : '') + word
        const testWidth = pdf.getTextWidth(testLine)
        
        if (testWidth > contentWidth) {
          // Check if we need a new page
          if (yPosition + lineHeight > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
          }
          
          pdf.text(line, margin, yPosition)
          yPosition += lineHeight
          line = word
        } else {
          line = testLine
        }
      })
      
      if (line) {
        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - margin) {
          pdf.addPage()
          yPosition = margin
        }
        
        pdf.text(line, margin, yPosition)
        yPosition += lineHeight * 1.2
      }
    }
  })

  // Save with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  pdf.save(`resume-${timestamp}.pdf`)
}
