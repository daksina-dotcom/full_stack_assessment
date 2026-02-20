import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
export default class UserController {
    async userList({request,response}:HttpContext){
        const data = request.input('role')
        const query = User.query()
        try{

            if(data){
                query.where('role',data)
            }
    
            const users = await query.orderBy('full_name')
            return response.ok(users)
        }catch(e){
            throw e
        }

    }

    // async getUser({params,response}:HttpContext){
    //     const userId = params.id
    //     const query = User.query()

    //     try{

    //         if(userId){
    //             query.where('id',userId)
    //         }
    
    //         const users = await query()
    //         return response.ok(users)
    //     }catch(e){
    //         throw e
    //     }

    // }

}