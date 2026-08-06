<template>
  <q-page class="q-pa-md">

    <div class="text-h4 q-mb-lg">
      My Bookings
    </div>

    <q-card
      v-for="booking in bookings"
      :key="booking.id"
      class="q-mb-md"
    >

      <q-card-section>

        <div class="text-h6">
          {{ booking.facility_name }}
        </div>

        <div>
          Date:
          {{ booking.booking_date.substring(0, 10) }}
        </div>

        <div>
          Time:
          {{ booking.start_time }} -
          {{ booking.end_time }}
        </div>

        <div>
          Amount:
          ₹{{ booking.amount }}
        </div>

        <div>
          Status:
          {{ booking.status }}
        </div>

      </q-card-section>

    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';

interface Booking {
  id: number;
  facility_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  amount: string;
  status: string;
}

const bookings = ref<Booking[]>([]);

async function loadBookings() {
  try {
    const response = await api.get("/bookings/user/1");
    bookings.value = response.data;
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  void loadBookings();
});
</script>