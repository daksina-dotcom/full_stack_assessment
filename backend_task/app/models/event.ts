import { DateTime } from 'luxon'
import { BaseModel, column,hasMany } from '@adonisjs/lucid/orm'
import type {  HasMany } from '@adonisjs/lucid/types/relations'
import Ticket from '#models/ticket'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare description: string
  
  @column()
  declare capacity: number

  @column()
  declare price: number

  @column.dateTime()
  declare date: DateTime

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>
}