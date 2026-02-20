<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '@/stores/data'

const router = useRouter()
const dataStore = useDataStore()
const signupForm = ref(null)
const loading = ref(false)

const form = reactive({
  full_name: '', // Snake_case for backend
  email: '',
  password: '',
  password_confirmation: '',
  role: 'participant'
})

const handleSignup = async () => {
  const { valid } = await signupForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await dataStore.signup(form)
    router.push('/login')
  } catch (error) {
    alert(error.response?.data?.message || 'Signup failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container class="fill-height justify-center">
    <v-card width="100%" max-width="450" class="elevation-4 rounded-lg">
      <v-sheet color="#6da3a1" class="pa-6 rounded-t-lg">
        <h2 class="text-h5 text-white font-weight-regular">Create Account</h2>
      </v-sheet>

      <v-card-text class="pa-8">
        <v-form ref="signupForm" @submit.prevent="handleSignup">
          <v-text-field
            v-model="form.full_name"
            placeholder="Full Name"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            :rules="[v => !!v || 'Required']"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="form.email"
            placeholder="Email"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            :rules="[v => !!v || 'Required']"
            class="mb-2"
          ></v-text-field>

          <v-select
            v-model="form.role"
            label="I am a..."
            :items="['participant', 'organiser']"
            variant="outlined"
            prepend-inner-icon="mdi-briefcase-outline"
            class="mb-2"
          ></v-select>

          <v-text-field
            v-model="form.password"
            placeholder="Password"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            type="password"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="form.password_confirmation"
            placeholder="Confirm Password"
            variant="outlined"
            prepend-inner-icon="mdi-lock-check-outline"
            type="password"
            class="mb-6"
          ></v-text-field>

          <v-btn type="submit" color="#accfcc" block size="large" :loading="loading" flat>
            SIGN UP
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>