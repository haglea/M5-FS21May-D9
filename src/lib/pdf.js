import PdfPrinter from "pdfmake" 
import { encodeImageUrl } from "./imageuri.js"
import { convertHtml } from "./htmlconvert.js"

const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  }

export const getPDFReadableStream = async (data) => {
    const printer = new PdfPrinter(fonts)
    const blogposturl = await encodeImageUrl(data.cover) 
    const blogpostcontent = convertHtml(data.content)
    const docDefinition = {
        content: [ 
            {
                text: data.author.name, 
                style: "header",
            },
            { 
                text: data.title, 
                style: "title"
            },
            { 
                image: blogposturl,
                width: 500
            },
            { 
                text: blogpostcontent, 
                style: "blogcontent" 
            }
        ],            
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 20, 0, 20]
            },
            title: {
                fontSize: 15, bold: true, margin: [0, 20, 0, 20] 
            },
            blogcontent: {
                fontSize: 17, margin: [0, 20, 0, 20], alignment: "justify"
            }                           
        }
      }
      const options = {}
      const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
    
      pdfReadableStream.end()
      return pdfReadableStream
}