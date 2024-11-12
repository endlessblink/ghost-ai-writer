// Client-side utility functions for PDF generation
export async function generatePDF(elementId: string, filename: string = 'resume.pdf'): Promise<void> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Element not found')
    }

    // Make API call to server-side PDF generation endpoint
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: element.innerHTML,
        filename
      }),
    })

    if (!response.ok) {
      throw new Error('PDF generation failed')
    }

    // Download the PDF
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

// Preview PDF in new tab
export async function previewPDF(elementId: string): Promise<void> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Element not found')
    }

    // Make API call to server-side PDF generation endpoint
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: element.innerHTML,
        preview: true
      }),
    })

    if (!response.ok) {
      throw new Error('PDF preview failed')
    }

    // Open PDF in new tab
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error previewing PDF:', error)
    throw new Error('Failed to preview PDF')
  }
}


