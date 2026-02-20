import { DateTime } from 'luxon'
import { BaseModel, column,hasOne } from '@adonisjs/lucid/orm'
import Ticket from '#models/ticket'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionId: string

  @column()
  declare amount: number

  @column()
  declare status: 'pending'|'completed'|'failed'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @hasOne(()=>Ticket)
  declare ticket: HasOne<typeof Ticket>
}