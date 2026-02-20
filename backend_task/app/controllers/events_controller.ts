import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
export default class EventController {
    async getEvents({response}:HttpContext){
        try{

            const eventData = await Event.query().orderBy('title')
            return response.ok({
                message:'Successfully fetched events',
                data:eventData
            })
        }catch(e){
            response.internalServerError({
                message:"Unable to fetch events",
                error: e.message
            })
        }
    }

    async createEvent({response,auth_user,request}:HttpContext){
        try{
            if (!auth_user) {
            return response.unauthorized({ message: "Authentication required" })
        }

        // 2. Authorization check: Ensure only admins or organisers can create events
        if (auth_user.role !== 'admin' && auth_user.role !== 'organiser') {
            return response.forbidden({ message: "You do not have permission to create events" })
        }
            const eventData = request.only(['title','description','capacity','price','date'])
    
            const event = await Event.create({
                ...eventData,
                userId:auth_user.id
    
            })

            return response.created({
                message:"Event created successfully",
                data:event
            })
        }catch(e){
            return response.badRequest({
                message: "Failed to create event",
                error: e.message
            })
        }
    }

    async editEvent({request,auth,response,params}:HttpContext){
        try{

            const user = auth.getUserOrFail()
            const event = await Event.findOrFail(params.id)
            if(event.userId !==user.id && user.role!=='admin'){
                return response.forbidden("Not allowed to edit events")
            }
            const eventData = request.only(['title','description','capacity','price','date'])
    
            event.merge(eventData)

            await event.save()

            return response.ok({
                message:"Event edited successfully",
                editedData:event
            })
        }catch(e){
            return response.badRequest({
                message: "Failed to edit event",
                error: e.message
            })
        }
    }
    
    async deleteEvent({auth,response,params}:HttpContext){
        try{

            const user = auth.getUserOrFail()
            const event = await Event.findOrFail(params.id)
            if(event.userId !==user.id && user.role!=='admin'){
                return response.forbidden("Not allowed to delete events")
            }
    
            await event.delete()

            return response.ok({
                message:"Event deleted successfully",
            })
        }catch(e){
            return response.notFound({
                message: "Failed to delete event",
                error: e.message
            })
        }
    }
    
}