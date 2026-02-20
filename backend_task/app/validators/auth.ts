import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim().minLength(2).maxLength(50),
    email: vine.string().email().normalizeEmail().unique(async (db, value) => {
      const user = await db.from('users').where('email', value).first()
      return !user
    }),
    password: vine.string().minLength(8).confirmed(),
    role: vine.enum(['organiser', 'participant'] as const),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)