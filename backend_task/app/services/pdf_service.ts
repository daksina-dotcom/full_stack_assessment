// app/services/pdf_service.ts
import PDFDocument from 'pdfkit'
import QRCode from 'qrcode'
import Ticket  from '#models/ticket'
import Event  from '#models/event'
import fs from 'node:fs'
import path from 'node:path'
import  app  from '@adonisjs/core/services/app'

export default class PdfService {
  public static async generateTicket(ticket: Ticket, event: Event): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A6' })
        const fileName = `ticket_${ticket.ticketCode}.pdf`
        const filePath = path.join(app.tmpPath(), fileName)
        const stream = fs.createWriteStream(filePath)

        doc.pipe(stream)

        doc.fontSize(16).text(' MELINIA 2k26', { align: 'center' })
        doc.moveDown()
        doc.fontSize(12).text(`Event: ${event.title}`)
        doc.text(`Date: ${event.date.toFormat('ff')}`)
        doc.text(`Price: $${event.price}`)
        doc.moveDown()

        const qrDataURL = await QRCode.toDataURL(ticket.ticketCode)
        doc.image(qrDataURL, { fit: [100, 100], align: 'center' })

        doc.moveDown()
        doc.fontSize(8).text(`Ticket ID: ${ticket.ticketCode}`, { align: 'center' })

        doc.end()

        stream.on('finish', () => resolve(filePath))
        stream.on('error', (err) => reject(err))
      } catch (error) {
        reject(error)
      }
    })
  }
}