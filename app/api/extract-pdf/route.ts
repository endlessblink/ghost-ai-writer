import { NextRequest, NextResponse } from 'next/server'
import { PdfReader } from 'pdfreader'

export async function POST(req: NextRequest) {
  try {
    // Clone the request to avoid the "body used already" error
    const clonedReq = req.clone()
    const formData = await clonedReq.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new NextResponse(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a promise to handle the asynchronous PDF parsing
    const extractText = () => new Promise((resolve, reject) => {
      const pages: { [page: number]: { [y: number]: { [x: number]: string } } } = {}
      let currentPage = 0

      new PdfReader().parseBuffer(buffer, (err: any, item: any) => {
        if (err) {
          console.error('PDF parsing error:', err)
          reject(err)
          return
        }

        if (!item) {
          // End of file - process all pages
          const text = processAllPages(pages)
          resolve(text)
          return
        }

        if (item.page) {
          currentPage = item.page
          if (!pages[currentPage]) {
            pages[currentPage] = {}
          }
        } else if (item.text) {
          // Store text with both x and y coordinates
          const y = Math.round(item.y * 10) / 10 // Round to 1 decimal place
          const x = Math.round(item.x * 10) / 10 // Round to 1 decimal place
          
          if (!pages[currentPage][y]) {
            pages[currentPage][y] = {}
          }
          pages[currentPage][y][x] = item.text
        }
      })
    })

    // Helper function to process all pages
    const processAllPages = (pages: { [page: number]: { [y: number]: { [x: number]: string } } }): string => {
      let fullText = ''
      
      // Process each page
      Object.keys(pages).sort((a, b) => Number(a) - Number(b)).forEach(pageNum => {
        const page = pages[Number(pageNum)]
        
        // Process each line (y-coordinate)
        Object.keys(page).sort((a, b) => Number(a) - Number(b)).forEach(y => {
          const line = page[Number(y)]
          
          // Process each text item in the line (x-coordinate)
          const lineText = Object.keys(line)
            .sort((a, b) => Number(a) - Number(b))
            .map(x => line[Number(x)])
            .join('')
            
          // Add line if it's not empty
          if (lineText.trim()) {
            fullText += lineText + '\\n'
          }
        })
        
        // Add page break
        fullText += '\\n'
      })

      // Clean up the text
      return cleanText(fullText)
    }

    // Helper function to clean up text
    const cleanText = (text: string): string => {
      return text
        .replace(/\\n/g, '\n') // Replace placeholder newlines with actual newlines
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/(\w)\s+(\w)/g, '$1 $2') // Ensure single space between words
        .replace(/\s*\n\s*/g, '\n') // Clean up spaces around newlines
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .trim()
    }

    try {
      const text = await extractText()
      return new NextResponse(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('PDF text extraction error:', error)
      return new NextResponse(JSON.stringify({ error: 'PDF text extraction failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

  } catch (error) {
    console.error('PDF text extraction failed:', error)
    return new NextResponse(JSON.stringify({ error: 'PDF text extraction failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
