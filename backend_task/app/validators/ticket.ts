import vine from '@vinejs/vine'

export const bookTicketValidator = vine.compile(
  vine.object({
    quantity: vine.number().min(1).max(10).optional(),
  })
)

export const validateTicketValidator = vine.compile(
  vine.object({
    ticketCode: vine.string().uuid(),
  })
)