import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Ticket from '#models/ticket'
import Payment from '#models/payment'
import { v4 as uuidv4 } from 'uuid'
import PdfService from '#services/pdf_service'
import path from 'node:path'
import { validateTicketValidator } from '#validators/ticket'

export default class TicketController {
  async bookTicket({ auth, response, params }: HttpContext) {
    const user = auth.getUserOrFail()
    const eventId = params.id

    try{
        
        const event = await Event.query().where('id', eventId).withCount('tickets').firstOrFail()
    
        if (event.$extras.tickets_count >= event.capacity) {
          return response.badRequest({ 
            message: 'This event is full!' 
        })
        }
    
        const payment = await Payment.create({
          transactionId: `PAY-${uuidv4().split('-')[0].toUpperCase()}`,
          amount: event.price,
          status: 'completed'
        })
    
        const ticket = await Ticket.create({
          ticketCode: uuidv4(),
          userId: user.id,
          eventId: event.id,
          paymentId: payment.id,
          status: 'valid'
        })
    
        const filePath = await PdfService.generateTicket(ticket, event)

        return response.created({
        message: 'Booking successful!',
        ticketCode: ticket.ticketCode,
        downloadLink: `/tickets/download/${path.basename(filePath)}`
        })

    }catch(e){
        return response.internalServerError({
            message: "Unable to book ticket",
            error: e.message
        })
    }
  }

  async validateTicket({request,auth,response}:HttpContext){
    const { ticketCode } = await request.validateUsing(validateTicketValidator)
    // const {ticketCode} = request.only(['ticketCode'])
    const user = auth.getUserOrFail()

    if(user.role!=='admin' && user.role!=='organiser'){
                return response.forbidden("Unauthorised")
            }
    const ticket = await Ticket.query().where('ticket_code',ticketCode).first()

    if(!ticket){
        return response.notFound({
            message:"Ticket not found!"
        })

    }else if(ticket.status == 'used'){
        return response.badRequest({
            message: "Cannot use a used ticket!"
        })
    }

    ticket.status = 'used'

    await ticket.save()
    return response.ok({
        message: "Participant checked in successfully!"
    })


  }
}