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

<BookingSelection
  v-model="selectedDate"
  :bookings="bookings"
  :slots="slots"
  @date-change="loadBookings"
  @select-slot="void openBookingDialog($event)"
/>

<BookingConfirmation
  :show-dialog="confirmDialog"
  :facility="facility"
  :selected-date="selectedDate"
  :selected-slot="selectedSlot"
  :calculated-price="calculatedPrice"
  :confirm-loading="confirmLoading"
  @close="
    confirmDialog = false;
    selectedSlot = '';
  "
  @confirm-booking="confirmBooking"
/>



      <q-btn
  flat
  label="Cancel"
  @click="
    confirmDialog = false;
    selectedSlot = '';
    calculatedPrice = null;
  "
/>

      <q-btn
  color="primary"
  label="Confirm"
  :loading="confirmLoading"
  @click="confirmBooking"
/>


    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useRoute } from 'vue-router';
import BookingSelection from "@/components/BookingSelection.vue";
import BookingConfirmation from "@/components/BookingConfirmation.vue";
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
const $q = useQuasar();
const facilityId = route.params.id as string;

const facility = ref<Facility | null>(null);
const selectedDate = ref('');
const bookings = ref<Booking[]>([]);
const confirmDialog = ref(false);
const selectedSlot = ref("");
const confirmLoading = ref(false);
const dialogLoading = ref(false);
const calculatedPrice = ref<number | null>(null);
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
  try {
    const response = await api.get(`/facilities/${facilityId}`);
    facility.value = response.data;
  } catch {
    $q.notify({
      type: "negative",
      message: "Failed to load facility.",
    });
  }
}

async function loadBookings() {
  if (!selectedDate.value) {
    bookings.value = [];
    return;
  }

  try {
    const response = await api.get(
      `/bookings/${facilityId}/${selectedDate.value}`
    );

    bookings.value = response.data;

  } catch (err: unknown) {
    console.error(err);

    let message = "Failed to load bookings.";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }

    $q.notify({
      type: "negative",
      message,
    });

    bookings.value = [];
  }
}

async function calculatePrice(slot: string) {
  try {
    const response = await api.post("/bookings/calculate", {
      facilityId: Number(facilityId),
      date: selectedDate.value,
      startTime: slot,
      duration: 1,
    });

    calculatedPrice.value = response.data.finalPrice;
  } catch (err) {
    console.error(err);

    $q.notify({
      type: "negative",
      message: "Failed to calculate booking price.",
    });
  }
}

async function openBookingDialog(slot: string) {
  if (!selectedDate.value) {
    $q.notify({
      type: "warning",
      message: "Please select a booking date first.",
    });
    return;
  }

  dialogLoading.value = true;

  try {
    selectedSlot.value = slot;

    await calculatePrice(slot);

    confirmDialog.value = true;
  } finally {
    dialogLoading.value = false;
  }
}

async function confirmBooking() {
  confirmLoading.value = true;

  try {
    const slot = selectedSlot.value;
    const endHour = Number(slot.split(":")[0]) + 1;

    // Create booking
    await api.post("/bookings", {
      user_id: 1,
      facility_id: Number(facilityId), 
      booking_date: selectedDate.value,
      start_time: `${slot}:00`,
      end_time: `${endHour.toString().padStart(2, "0")}:00:00`,
      amount: calculatedPrice.value,
    });

    confirmDialog.value = false;
    selectedSlot.value = "";
    calculatedPrice.value = null;

    await loadBookings();

    $q.notify({
      type: "positive",
      message: "Booking successful!",
    });

  } catch (err: unknown) {
    console.error(err);

    let message = "Booking failed";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }

    $q.notify({
      type: "negative",
      message,
    });
  } finally {
    confirmLoading.value = false;
  }
}

onMounted(async () => {
  await loadFacility();
});
</script>