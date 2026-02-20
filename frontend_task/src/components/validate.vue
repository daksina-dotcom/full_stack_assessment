<template>
  <div class="max-w-md mx-auto mt-10 p-6 border rounded shadow">
    <h2 class="text-xl font-bold mb-4">Ticket Check-in</h2>
    <input v-model="code" placeholder="Enter Ticket UUID" class="w-full p-2 border mb-4" />
    <button @click="handleValidate" class="w-full bg-green-600 text-white py-2 rounded">Validate Ticket</button>
    
    <p v-if="message" :class="isError ? 'text-red-500' : 'text-green-500'" class="mt-4">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDataStore } from '@/stores/data'

const store = useDataStore()
const code = ref('')
const message = ref('')
const isError = ref(false)

const handleValidate = async () => {
  try {
    const res = await store.validateTicket(code.ref)
    message.value = res.data.message
    isError.value = false
    code.value = ''
  } catch (err) {
    message.value = err.response?.data?.message || 'Invalid Ticket'
    isError.value = true
  }
}
</script>