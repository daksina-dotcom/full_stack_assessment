import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreate({email:'admin@gmail.com'},{fullName:'Admin',password:'adminNGP',role:'admin'})
    console.log("Admin created successfully")
  }
}