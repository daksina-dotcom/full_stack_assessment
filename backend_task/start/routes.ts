/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import app from '@adonisjs/core/services/app'
import path from 'node:path'

const AuthController = ()=> import('#controllers/auth_controller')
const EventController = ()=> import('#controllers/events_controller')
const PaymentController = ()=> import('#controllers/payments_controller')
const TicketController = ()=> import('#controllers/tickets_controller')
const UserController = ()=> import('#controllers/user_controller')


router.post('/login/',[AuthController,'login']).as('login');
router.get('/login/:id?',[AuthController,'login']).as('login.get');

router.post('/signup/',[AuthController,'signup']).as('signup');
router.get('/signup/:id?',[AuthController,'signup']).as('signup.get');

router.group(()=>{
  router.get('/users/role?',[UserController,'userList']).as('user.get');
  router.get('/events',[EventController,'getEvents']).as('event.get');
  router.post('/events/:id/book', [TicketController, 'bookTicket'])
  router.post('/event/create',[EventController,'createEvent']).as('event.create');
  router.route('/event/:id',['PUT','PATCH'],[EventController,'editEvent']).as('event.update')
  router.delete('/event/:id',[EventController,'deleteEvent']).as('event.delete')
}).use(middleware.jwtAuth())

router.get('/tickets/download/:filename', async ({ params, response }) => {
  const filePath = path.join(app.tmpPath(), params.filename)
  return response.download(filePath)
}).use(middleware.jwtAuth())

router.group(() => {
  router.get('/admin/analytics', [PaymentController, 'getAnalytics']).use(middleware.jwtAuth())
  router.post('/tickets/validate', [TicketController, 'validateTicket'])
})



