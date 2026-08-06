<template>
  <q-page class="q-pa-md">

    <div v-if="facility">

      <div class="text-h4 q-mb-md">
        {{ facility.name }}
      </div>

      <div class="text-subtitle1">
        {{ facility.type }}
      </div>

      <div class="text-primary q-mb-lg">
        ₹{{ facility.base_rate }}/hour
      </div>

      <q-date
  v-model="selectedDate"
  mask="YYYY-MM-DD"
  class="q-mb-lg"
  @update:model-value="loadBookings"
/>

      <div class="text-h6 q-mt-lg q-mb-md">
  Available Slots
</div>

<q-list bordered separator>

  <q-item
    v-for="slot in slots"
    :key="slot"
  >

    <q-item-section>
      {{ slot }} - {{ Number(slot.split(':')[0]) + 1 }}:00
    </q-item-section>

    <q-item-section side>

      <q-btn
  :color="isBooked(slot) ? 'red' : 'primary'"
  :label="isBooked(slot) ? 'Booked' : 'Book'"
  :disable="isBooked(slot)"
  @click="
  selectedSlot = slot;
  confirmDialog = true;
"
/>

    </q-item-section>

  </q-item>

</q-list>
<q-dialog v-model="confirmDialog">

  <q-card style="min-width:350px">

    <q-card-section>

      <div class="text-h6">
        Confirm Booking
      </div>

    </q-card-section>

    <q-card-section>

      <div><b>Facility:</b> {{ facility?.name }}</div>

      <div><b>Date:</b> {{ selectedDate }}</div>

      <div><b>Slot:</b> {{ selectedSlot }} -
        {{ Number(selectedSlot.split(':')[0]) + 1 }}:00
      </div>

      <div><b>Amount:</b> ₹{{ facility?.base_rate }}</div>

    </q-card-section>

    <q-card-actions align="right">

      <q-btn
        flat
        label="Cancel"
        v-close-popup
      />

      <q-btn
        color="primary"
        label="Confirm"
        @click="confirmBooking"
      />

    </q-card-actions>

  </q-card>

</q-dialog>

    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

interface Facility {
  id: number;
  name: string;
  type: string;
  base_rate: string;
  slot_duration: number;
}

interface Booking {
  start_time: string;
  end_time: string;
}

const route = useRoute();
const facilityId = route.params.id as string;

const facility = ref<Facility | null>(null);
const selectedDate = ref('');
const bookings = ref<Booking[]>([]);
const confirmDialog = ref(false);
const selectedSlot = ref("");
const slots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

async function loadFacility() {
  const response = await api.get(`/facilities/${facilityId}`);
  facility.value = response.data;
}

async function loadBookings() {
  console.log(selectedDate.value);

  if (!selectedDate.value) return;

  const response = await api.get(
    `/bookings/${facilityId}/${selectedDate.value}`
  );

  console.log(response.data);

  bookings.value = response.data;
}

function isBooked(slot: string) {
  return bookings.value.some(
    (booking) => booking.start_time.substring(0, 5) === slot
  );
}

async function confirmBooking() {
  try {
    const slot = selectedSlot.value;
    const endHour = Number(slot.split(":")[0]) + 1;

    // Step 1: Calculate the price
    const priceResponse = await api.post("/bookings/calculate", {
      facilityId: Number(facilityId),
      date: selectedDate.value,
      startTime: slot,
      duration: 1,
    });

    // Temporary: Show calculated price
    alert(`Calculated Price: ₹${priceResponse.data.finalPrice}`);

    // Step 2: Create the booking
    await api.post("/bookings", {
      user_id: 1, // Temporary (we'll use the logged-in user later)
      facility_id: Number(facilityId),
      booking_date: selectedDate.value,
      start_time: `${slot}:00`,
      end_time: `${endHour.toString().padStart(2, "0")}:00:00`,
      amount: priceResponse.data.finalPrice,
    });

    confirmDialog.value = false;
    selectedSlot.value = "";

    alert("Booking successful!");

    await loadBookings();
  } catch (err) {
    console.error(err);
    alert("Booking failed");
  }
}

onMounted(async () => {
  await loadFacility();
});
</script>