<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const router = useRouter()

// Check if user is logged in to show/hide logout
const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title class="font-weight-bold">
      EVENTS
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn variant="text" to="/events" v-if="isLoggedIn">Events</v-btn>
      <!-- <v-btn variant="text" to="/my-tickets" v-if="isLoggedIn">My Tickets</v-btn> -->
      
      <v-btn variant="outlined" color="white" class="ml-4" @click="handleLogout" v-if="isLoggedIn">
        Logout
      </v-btn>

    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>

*/
html, body {
  overflow-y: auto !important;
}

.v-main {
  min-height: 100vh;
}
</style>