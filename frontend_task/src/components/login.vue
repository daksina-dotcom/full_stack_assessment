<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data'

const router = useRouter()
const dataStore = useDataStore()
const loginForm = ref(null)
const loading = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  const { valid } = await loginForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await dataStore.login(form)
    // Redirect to the events page on success
    router.push('/events')
  } catch (error) {
    // Handle 401 Unauthorized or other errors
    const message = error.response?.data?.message || 'Invalid email or password'
    alert(message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container class="fill-height d-flex justify-center align-center">
        <v-card width="100%" max-width="450" class="elevation-4 rounded-lg">
          
          <v-sheet color="#6da3a1" class="pa-6 rounded-t-lg">
            <h2 class="text-h5 text-white font-weight-regular">Login</h2>
          </v-sheet>

          <v-card-text class="pa-8">
            <v-form ref="loginForm" @submit.prevent="handleLogin">
              <v-text-field
                v-model="form.email"
                placeholder="Email"
                variant="outlined"
                prepend-inner-icon="mdi-email-outline"
                :rules="[v => !!v || 'Email is required']"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                placeholder="Password"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                type="password"
                :rules="[v => !!v || 'Password is required']"
                class="mb-6"
              ></v-text-field>

              <v-btn
                type="submit"
                color="#accfcc"
                block
                size="large"
                class="text-white font-weight-bold"
                :loading="loading"
                flat
              >
                LOG IN
              </v-btn>
            </v-form>

            <div class="text-center mt-6">
              Don't have an account? 
              <router-link to="/signup" class="text-blue font-weight-bold">SIGN UP</router-link>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>