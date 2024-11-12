import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(req: NextRequest) {
  try {
    const { html, filename = 'resume.pdf', preview = false } = await req.json()

    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    
    const wrappedHtml = `
      <html>
        <head>
          <style>
            /* Base fixes */
            * {
              line-height: 1.5;
              margin-bottom: 8px;
            }

            body {
              max-width: 8.5in;
              margin: 0.75in;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 11px;
              color: #000000;
            }

            /* Header */
            .header-name {
              font-size: 18px;
              font-weight: bold;
              margin: 20px 0 10px 0;
            }

            /* Section headers */
            .section-header {
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              margin: 25px 0 15px 0;
              border-bottom: 1px solid black;
            }

            /* List items */
            ul {
              margin-left: 20px;
              margin-bottom: 15px;
            }

            li {
              margin-bottom: 8px;
              padding-left: 10px;
            }

            /* Experience entries */
            .experience-entry {
              margin-bottom: 20px;
            }

            .company-name {
              font-weight: bold;
              margin: 15px 0 5px 0;
            }

            /* Skills section */
            .skills-list {
              margin-bottom: 15px;
            }

            .skill-item {
              margin-bottom: 8px;
            }

            /* Print Optimization */
            @media print {
              body {
                margin: 0.5in;
              }
              
              @page {
                margin: 0.5in;
              }
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `
    
    await page.setContent(wrappedHtml, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { 
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    })

    await browser.close()

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    if (!preview) {
      headers.set('Content-Disposition', `attachment; filename="${filename}"`)
    }

    return new NextResponse(pdf, { status: 200, headers })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }
} 