import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { signupValidator } from '#validators/auth'
import { loginValidator } from '#validators/auth'
import JwtUtils from '../utils/jwt_utils.js'
export default class AuthController {
  public async login({ request, params,response }: HttpContext) {
    // console.log(request.body())
    // console.log(request.all())
    // console.log(params)
    const payload = await request.validateUsing(loginValidator)
    const {email,password} = payload
    try{
        const user = await User.findBy('email',email)
        if(!user){
            return "User doesn't exist!"
        }
        const isPasswordValid = await hash.verify(user.password, password)
        if(!isPasswordValid){
            return response.unauthorized({message:"Enter the correct password!"})
        }

        const jwtPayload = { userId: user.id, email: user.email }

        const accessToken = JwtUtils.generateAccessToken(jwtPayload)
        console.log(accessToken)
        const refreshToken = JwtUtils.generateRefreshToken(jwtPayload)

        response.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: '7d',
        path: '/',
      })

        return {
          message: 'Logged In Successfully',
          token:accessToken,
          user: {
            email: user.email,
            password: user.password,
            id: user.id,
          },
        }

    }catch(e){
        throw e
    }
  }
  
  async signup({ request,response}: HttpContext) {
    // console.log(request.body())
    // console.log(request.all())
    // console.log(params)
    const payload = await request.validateUsing(signupValidator)
    try {
      const user = await User.create(payload)
      return response.created({
        message: 'User created Successfully',
        receivedData: user,
      })
    } catch(e) {
      throw e
    }
  }

async refresh({ request, response }: HttpContext) {
  const refreshToken = request.cookie('refresh_token')

  if (!refreshToken) {
    return response.unauthorized({ message: 'Refresh token is missing' })
  }

  try {
    const payload = JwtUtils.verifyRefreshToken(refreshToken)

    const user = await User.find(payload.userId)
    if (!user) {
      return response.unauthorized({ message: 'User no longer exists' })
    }

    const newAccessToken = JwtUtils.generateAccessToken({ 
      userId: user.id, 
      email: user.email 
    })

    return response.ok({
      message: 'Token refreshed',
      token: newAccessToken
    })
  } catch (error) {
    return response.unauthorized({ message: 'Invalid or expired refresh token' })
  }
}
}
