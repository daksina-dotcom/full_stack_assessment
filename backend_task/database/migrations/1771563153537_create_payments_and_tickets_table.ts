import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName1 = 'payments'
  protected tableName2 = 'tickets'
  

  async up() {
    this.schema.createTable(this.tableName1, (table) => {
      table.increments('id').primary()
      table.string('transaction_id').unique()
      table.decimal('amount',10,2)
      table.enum('status',['pending','completed','failed']).defaultTo('pending')
      table.timestamp('created_at')
    })
    
    this.schema.createTable(this.tableName2, (table) => {
      table.increments('id').primary()
      table.uuid('ticket_code').unique().notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('event_id').unsigned().references('id').inTable('events')
      table.integer('payment_id').unsigned().references('id').inTable('payments')
      table.enum('status',['valid','used','cancelled']).defaultTo('valid')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName1)
    this.schema.dropTable(this.tableName2)

  }
}