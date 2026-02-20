<template>
  <div class="p-6" v-if="store.analytics">
    <h2 class="text-2xl font-bold mb-6">Financial Analytics</h2>
    <div class="grid grid-cols-3 gap-4">
      <div class="p-4 bg-blue-100 rounded shadow">
        <p class="text-sm">Total Revenue</p>
        <p class="text-2xl font-bold">${{ store.analytics.totalRevenue }}</p>
      </div>
      <div class="p-4 bg-green-100 rounded shadow">
        <p class="text-sm">Tickets Sold</p>
        <p class="text-2xl font-bold">{{ store.analytics.totalTickets }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDataStore } from '@/stores/data'

const store = useDataStore()
onMounted(() => store.fetchAnalytics())
</script>