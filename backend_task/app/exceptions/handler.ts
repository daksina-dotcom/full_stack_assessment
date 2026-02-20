import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'
import { errors as lucidErrors } from '@adonisjs/lucid'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, Adonis provides a full stack trace. 
   * In production, it hides sensitive details.
   */
  protected debug = !app.inProduction

  async handle(error: any, ctx: HttpContext) {
    /**
     * 1. Handle Validation Failures (VineJS)
     */
    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      return ctx.response.status(422).send({
        status: 'error',
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    /**
     * 2. Handle "Record Not Found" (Lucid findOrFail)
     */
    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response.status(404).send({
        status: 'error',
        message: 'The requested resource does not exist',
      })
    }

    /**
     * 3. Fallback for all other unhandled exceptions
     */
    return ctx.response.status(error.status || 500).send({
      status: 'error',
      message: error.message || 'Internal Server Error',
      // Only include stack trace if in development mode
      stack: this.debug ? error.stack : undefined,
    })
  }
}