import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/services/api'

export const useDataStore = defineStore('data', () => {
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)

  // Derive the privilege level directly from the user data
  const canCreateEvents = computed(() => {
    console.log('Current User Role:', user.value?.role)
    return user.value?.role === 'admin' || user.value?.role === 'organiser'
  })
  const loading = ref(false)
  const events = ref([])

  const isAuthenticated = computed(() => !!token.value)

  async function signup(payload) {
    return await apiClient.post('/signup', payload)
  }

  async function login(credentials) {

    const response = await apiClient.post('/login/', credentials)
    console.log('Raw Login Response:', response.data)
    const { token: authToken, user: userData } = response.data

    try {
    const payload = JSON.parse(atob(authToken.split('.')[1]))
    if (!userData.role && payload.role) {
      userData.role = payload.role
    }
  } catch (e) {
    console.error('Failed to parse token for role')
  }
    token.value = authToken
    user.value = userData
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    
    return response.data
  }

  function setAuth(userData, userToken) {
    user.value = userData
    token.value = userToken
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  async function fetchEvents() {
    loading.value = true
    try {
      const response = await apiClient.get('/events')
      events.value = response.data.data
      console.log('Stored Events:', events.value)
    } finally {
      loading.value = false
    }
  }

async function bookTicket(eventId) {
    try {
      const response = await apiClient.post(`/events/${eventId}/book`)
      return response.data 
    } catch (error) {
      throw error
    }
  }

  async function createEvent(payload) {
  loading.value = true
  try {
    const response = await apiClient.post('/event/create', payload)
    await fetchEvents() 
    return response.data
  } catch (error) {
    throw error
  } finally {
    loading.value = false
  }
}



  return { user, token, isAuthenticated, events,
    loading,signup,login, setAuth,fetchEvents,bookTicket ,createEvent,canCreateEvents}
})