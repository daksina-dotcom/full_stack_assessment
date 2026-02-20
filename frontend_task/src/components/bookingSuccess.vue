<script setup>
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import apiClient from '@/services/api'; 

const router = useRouter();
const isDownloading = ref(false);

const ticketData = computed(() => window.history.state.ticket || {});

const downloadAuthenticatedFile = async () => {
  if (!ticketData.value.downloadLink) return;
  
  isDownloading.value = true;
  try {
    const response = await apiClient.get(ticketData.value.downloadLink, {
      responseType: 'blob', 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ticket-${ticketData.value.ticketCode || 'download'}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download ticket. Please try again.');
  } finally {
    isDownloading.value = false;
  }
};
</script>

<template>
  <v-container class="text-center py-10">
    <v-icon color="success" size="100">mdi-check-circle</v-icon>
    <h1 class="text-h4 my-4">Booking Confirmed!</h1>
    
    <v-card variant="outlined" class="mx-auto pa-6" max-width="500">
      <p class="text-h6">Ticket Code: {{ ticketData.ticketCode }}</p>
      <v-divider class="my-4"></v-divider>
      <p>Your ticket has been generated. Click below to save it.</p>
      
      <v-btn
        color="teal"
        class="mt-6"
        prepend-icon="mdi-download"
        :loading="isDownloading"
        @click="downloadAuthenticatedFile"
      >
        Download PDF Ticket
      </v-btn>
    </v-card>
    
    <v-btn variant="text" class="mt-6" @click="router.push('/events')">
      Return to Events
    </v-btn>
  </v-container>
</template>