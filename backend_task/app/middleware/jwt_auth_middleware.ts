import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import JwtService from '#services/jwt_service'
import { inject } from '@adonisjs/core'

@inject()
export default class JwtAuthMiddleware {
  constructor(protected jwtService: JwtService) {}

async handle(ctx: HttpContext, next: NextFn) {
  const authHeader = ctx.request.header('authorization')
    console.log('Authorization Header1:', ctx.request.header('authorization'))

  console.log('Authorization Header:', authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ctx.response.unauthorized({ message: 'Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const user = await this.jwtService.authenticateRequest(token)
    ctx.auth_user = user 
    await next()
  } catch (error) {
    return ctx.response.unauthorized({ message: error.message })
  }
}
}