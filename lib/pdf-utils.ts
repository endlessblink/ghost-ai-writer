import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Client-side utility functions for PDF generation

export async function generatePDF(elementId: string, filename: string = 'cv.pdf'): Promise<void> {

  try {

    const element = document.getElementById(elementId)

    if (!element) {

      throw new Error('Element not found')

    }



    // Convert to canvas

    const canvas = await html2canvas(element, {

      scale: 2,

      useCORS: true,

      logging: false

    })



    // Initialize PDF

    const pdf = new jsPDF({

      orientation: 'portrait',

      unit: 'px',

      format: 'a4'

    })



    const imgData = canvas.toDataURL('image/jpeg', 1.0)

    const pageWidth = pdf.internal.pageSize.getWidth()

    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = canvas.width

    const imgHeight = canvas.height

    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)



    pdf.addImage(

      imgData, 

      'JPEG', 

      0, 

      0, 

      imgWidth * ratio, 

      imgHeight * ratio

    )



    pdf.save(filename)

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



interface PDFResponse {
  ok: boolean;
  blob(): Promise<Blob>;
}
