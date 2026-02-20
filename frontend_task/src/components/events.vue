<script setup>
import { onMounted } from 'vue'
import { useDataStore } from '@/stores/data'
import { useRouter } from 'vue-router'

const store = useDataStore()
const router = useRouter()

onMounted(async () => {

  await store.fetchEvents()
  console.log('Events in Component after mount:', store.events)
})

const handleCreateNavigation = () => {
  router.push('/event/createEvent')
}

const handleBooking = async (id) => {
  try {
    const result = await store.bookTicket(id);
    
    router.push({
      name: 'BookingSuccess',
      state: { ticket: result }
    });
  } catch (error) {
    alert(error.response?.data?.message || 'Booking failed');
  }
}
</script>
<template>
  <v-container fluid>
    <v-row v-if="store.events && store.events.length > 0">
      <v-col 
        v-for="event in store.events" 
        :key="event.id" 
        cols="12" 
        sm="6" 
        md="4"
      >
        <v-card class="mx-auto elevation-3 rounded-lg" max-width="400">
          <v-sheet color="#6da3a1" class="pa-3">
            <v-card-title class="text-white py-0">
              {{ event.title }}
            </v-card-title>
          </v-sheet>

          <v-card-text class="pt-4">
            <div class="text-subtitle-1 mb-2">
              <v-icon start icon="mdi-calendar" color="grey"></v-icon>
              {{ new Date(event.date).toLocaleDateString() }}
            </div>
            
            <p class="text-body-2 text-grey-darken-1">
              {{ event.description }}
            </p>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-actions class="pa-4 justify-space-between">
            <v-chip color="teal" variant="flat" label>
              ${{ event.price }}
            </v-chip>
            
            <v-btn 
              color="#6da3a1" 
              variant="elevated" 
              class="text-white"
              @click="handleBooking(event.id)"
            >
              Book Now
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-btn 
    color="teal-darken-2" 
    prepend-icon="mdi-plus" 
    size="large"
    :disabled="!store.canCreateEvents"
    @click="handleCreateNavigation"
  >
    Create New Event
  </v-btn>
    </v-row>

    <v-row v-else justify="center">
      <v-col cols="12" md="6">
        <v-alert type="info" variant="tonal" class="mt-10">
          No events found. Check your database.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

