import type { HttpContext } from '@adonisjs/core/http'
import Payment from '#models/payment'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class PaymentController {
  async getAnalytics({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      if (user.role !== 'admin') {
        return response.forbidden({ message: 'Access denied' })
      }

      const totalRevenue = await Payment.query().where('status', 'completed').sum('amount as total')
      const userStats = await User.query().select('role').count('* as count').groupBy('role')

      const salesTrend = await db.from('payments').select(db.raw('DATE(created_at) as date')).count('* as sales_count')
        .where('status', 'completed').groupBy('date').orderBy('date', 'desc').limit(7)

      return response.ok({
        revenue: totalRevenue[0].$extras.total || 0,
        userParticipation: userStats,
        trends: salesTrend,
      })

    } catch (e) {
      return response.badRequest({ 
        message: 'Error fetching analytics',
        error: e.message 
    })
    }
  }
}