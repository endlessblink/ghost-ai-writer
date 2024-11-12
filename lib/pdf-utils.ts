import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(element: HTMLElement): Promise<void> {
  // A4 size in points (72 points per inch)
  const pageWidth = 595.28
  const pageHeight = 841.89
  const margin = 40

  // Create a container with specific dimensions
  const container = document.createElement('div')
  container.style.width = `${pageWidth - 2 * margin}px`
  container.style.position = 'absolute'
  container.style.top = '-9999px'
  container.style.left = '-9999px'
  container.style.backgroundColor = '#ffffff'
  
  // Clone and prepare content
  const clone = element.cloneNode(true) as HTMLElement
  container.appendChild(clone)
  document.body.appendChild(container)

  try {
    // Wait for fonts to load
    await document.fonts.ready

    // Add print-specific styles
    const styleSheet = document.createElement('style')
    styleSheet.textContent = `
      @media print {
        body { margin: 0; padding: 0; }
        * { -webkit-font-smoothing: antialiased; }
        p, h1, h2, h3, h4, h5, h6 { margin-bottom: 0.5em; }
        pre, code { white-space: pre-wrap; }
      }
    `
    container.appendChild(styleSheet)

    // Render to canvas with improved settings
    const canvas = await html2canvas(container, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      imageTimeout: 0, // No timeout
      letterRendering: true,
      foreignObjectRendering: false, // Better compatibility
      removeContainer: false, // We'll handle cleanup
      scrollX: 0,
      scrollY: 0,
      width: pageWidth - 2 * margin,
      height: Math.min(container.offsetHeight, pageHeight - 2 * margin),
      onclone: (clonedDoc) => {
        Array.from(clonedDoc.getElementsByTagName('*')).forEach(el => {
          const element = el as HTMLElement
          if (element.style) {
            element.style.textRendering = 'optimizeLegibility'
            element.style.fontSmoothing = 'antialiased'
          }
        })
      }
    })

    // Create PDF with improved settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      compress: true,
      hotfixes: ['px_scaling']
    })

    // Calculate dimensions maintaining aspect ratio
    const imgWidth = pageWidth - 2 * margin
    const imgHeight = Math.min(
      (canvas.height * imgWidth) / canvas.width,
      pageHeight - 2 * margin
    )

    // Convert to high-quality PNG
    const imgData = canvas.toDataURL('image/png', 1.0)

    // Add image with better quality settings
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST')

    // Save with a timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    pdf.save(`resume-${timestamp}.pdf`)
  } catch (error) {
    console.error('PDF generation failed:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  } finally {
    // Cleanup
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }
}
