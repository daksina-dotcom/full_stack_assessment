<script setup>
import { reactive } from 'vue'
import apiClient from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
// 🚨 ADD 'date' TO YOUR FORM OBJECT
const form = reactive({ 
  title: '', 
  description: '', 
  price: 0, 
  capacity: 50,
  date: '' // New field
})

const submitEvent = async () => {
  try {
    await apiClient.post('/event/create', form)
    router.push('/events')
  } catch (error) {
    // 🚨 Add error handling to see what went wrong in the UI
    alert(error.response?.data?.error || 'Failed to create event')
  }
}
</script>

<template>
  <v-container class="fill-height justify-center">
    <v-card width="100%" max-width="600" class="pa-6">
      <v-card-title class="text-h5 mb-4">Create New Event</v-card-title>
      <v-form @submit.prevent="submitEvent">
        <v-text-field v-model="form.title" label="Event Title" variant="outlined"></v-text-field>
        
        <v-text-field 
          v-model="form.date" 
          label="Event Date" 
          type="date" 
          variant="outlined"
        ></v-text-field>

        <v-textarea v-model="form.description" label="Description" variant="outlined"></v-textarea>
        
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="form.price" label="Price" type="number" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="form.capacity" label="Capacity" type="number" variant="outlined"></v-text-field>
          </v-col>
        </v-row>
        <v-btn type="submit" block color="teal" size="large" class="mt-4">Publish Event</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>