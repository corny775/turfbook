<template>
  <q-page class="q-pa-md booking-page">

    <!-- Loading state -->
    <div v-if="loadingFacility" class="column q-gutter-md" style="max-width: 900px; margin: 0 auto;">
      <q-skeleton type="rect" height="140px" class="rounded-borders" />
      <q-skeleton type="rect" height="240px" class="rounded-borders" />
    </div>

    <!-- Not found state -->
    <div
      v-else-if="!facility"
      class="column items-center q-pa-xl text-grey-6"
    >
      <q-icon name="domain_disabled" size="64px" class="q-mb-md" />
      <div class="text-h6">Facility not found</div>
      <div class="text-body2">The facility you're looking for doesn't exist or was removed.</div>
    </div>

    <div v-else class="booking-content">

      <q-card flat bordered class="facility-hero q-mb-lg">
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <div class="text-h4 text-weight-bold">
                {{ facility.name }}
              </div>

              <div class="row items-center text-subtitle1 text-grey-8 q-mt-xs">
                <q-icon name="category" size="18px" class="q-mr-xs" />
                {{ facility.type }}
              </div>
            </div>

            <div class="rate-badge">
              <div class="text-caption text-grey-6">Starting from</div>
              <div class="text-h5 text-weight-bold text-primary">
                ₹{{ facility.base_rate }}
<span class="text-body2 text-grey-7">
  /{{ pricingUnitLabel }}
</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="q-pa-md">
        <div class="text-h6 text-weight-bold q-mb-md">
  {{ facility.pricing_unit === "hour"
    ? "Choose a slot"
    : "Choose booking details" }}
</div>

        <BookingSelection
  v-if="facility.pricing_unit === 'hour'"
  v-model="selectedDate"
  :bookings="bookings"
  :slots="slots"
  @date-change="loadBookings"
  @select-slot="void openBookingDialog($event)"
/>

<div
  v-else
  class="column q-gutter-lg"
>
  <q-input
  v-model="selectedDate"
  outlined
  label="Booking Date"
  type="date"
  @update:model-value="checkAvailability"
/>

<div
  v-if="selectedDate && hasExistingBooking"
  class="q-mt-md text-negative"
>
  <q-icon name="event_busy" class="q-mr-xs" />
  This facility already has a booking for the selected date.
</div>

<div
  v-else-if="selectedDate"
  class="q-mt-md text-positive"
>
  <q-icon name="event_available" class="q-mr-xs" />
  This facility is available for the selected date.
</div>

  <div>
    <div class="text-subtitle1 text-weight-medium q-mb-sm">
      Number of {{ pricingUnitLabel }}{{ quantity === 1 ? "" : "s" }}
    </div>

    <div class="row items-center q-gutter-md">
      <q-btn
  round
  outline
  icon="remove"
  :disable="quantity <= 1"
  @click="quantity--; checkAvailability()"
/>

      <div class="text-h5 text-weight-bold">
        {{ quantity }}
      </div>

      <q-btn
  round
  outline
  icon="add"
  @click="quantity++; checkAvailability()"
/>
    </div>
  </div>

  <div
  v-if="checkingAvailability"
  class="text-grey-7"
>
  Checking availability...
</div>

<div
  v-else-if="hasExistingBooking"
  class="text-negative text-weight-medium"
>
  This facility is unavailable for the selected dates.
</div>

<div
  v-else-if="selectedDate"
  class="text-positive text-weight-medium"
>
  This facility is available for the selected dates.
</div>

  <q-btn
    color="primary"
    label="Calculate Price"
    icon="calculate"
    :loading="dialogLoading"
    :disable="!selectedDate || hasExistingBooking"
    @click="calculateNonHourlyPrice"
  />
</div>

      </q-card>

      <BookingConfirmation
        :show-dialog="confirmDialog"
        :facility="facility"
        :selected-date="selectedDate"
        :selected-slot="selectedSlot"
        :calculated-price="calculatedPrice"
        :confirm-loading="confirmLoading"
        @close="closeConfirmDialog"
        @confirm-booking="confirmBooking"
      />

    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BookingSelection from "@/components/BookingSelection.vue";
import BookingConfirmation from "@/components/BookingConfirmation.vue";
import api from '@/services/api';

interface Facility {
  id: number;
  name: string;
  type: string;
  base_rate: string;
  slot_duration: number;
  pricing_unit: string;
  category_id: number;
}

interface Booking {
  start_time: string;
  end_time: string;
}

const route = useRoute();
const $q = useQuasar();
const auth = useAuthStore();
const facilityId = route.params.id as string;

const facility = ref<Facility | null>(null);
const loadingFacility = ref(true);
const selectedDate = ref('');
const bookings = ref<Booking[]>([]);
const confirmDialog = ref(false);
const selectedSlot = ref("");
const confirmLoading = ref(false);
const dialogLoading = ref(false);
const calculatedPrice = ref<number | null>(null);
const quantity = ref(1);
const hasExistingBooking = ref(false);
const checkingAvailability = ref(false);

const pricingUnitLabel = computed(() => {
  if (!facility.value) return "unit";

  const labels: Record<string, string> = {
    hour: "hour",
    event: "event",
    person: "person",
    night: "night",
    session: "session",
  };

  return labels[facility.value.pricing_unit] ?? facility.value.pricing_unit;
});

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

function closeConfirmDialog() {
  confirmDialog.value = false;
  selectedSlot.value = "";
  calculatedPrice.value = null;
  quantity.value = 1;
}

async function loadFacility() {
  loadingFacility.value = true;

  try {
    const response = await api.get(`/facilities/${facilityId}`);
    facility.value = response.data;
  } catch {
    $q.notify({
      type: "negative",
      message: "Failed to load facility.",
    });
  } finally {
    loadingFacility.value = false;
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

    bookings.value = response.data.bookings ?? [];

  } catch (err: unknown) {
    console.error(err);

    let message = "Failed to load availability.";

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
  quantity: 1,
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

async function calculateNonHourlyPrice() {
  if (!selectedDate.value) {
    $q.notify({
      type: "warning",
      message: "Please select a booking date first.",
    });

    return;
  }

  dialogLoading.value = true;

  try {
    const response = await api.post("/bookings/calculate", {
      facilityId: Number(facilityId),
      date: selectedDate.value,
      startTime: "00:00",
      quantity: quantity.value,
    });

    calculatedPrice.value = response.data.finalPrice;

    selectedSlot.value = "00:00";

    confirmDialog.value = true;
  } catch (err) {
    console.error(err);

    $q.notify({
      type: "negative",
      message: "Failed to calculate booking price.",
    });
  } finally {
    dialogLoading.value = false;
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
    const isHourly = facility.value?.pricing_unit === "hour";

    const bookingData = {
      user_id: auth.user?.id,
      facility_id: Number(facilityId),
      booking_date: selectedDate.value,
      start_time: isHourly
        ? `${selectedSlot.value}:00`
        : null,
      end_time: isHourly
        ? `${(
            Number(selectedSlot.value.split(":")[0]) + 1
          )
            .toString()
            .padStart(2, "0")}:00:00`
        : null,
      quantity: quantity.value,
    };

    await api.post("/bookings", bookingData);

    closeConfirmDialog();

    quantity.value = 1;

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

async function checkAvailability() {
  if (!selectedDate.value || !facility.value) {
    hasExistingBooking.value = false;
    return;
  }

  checkingAvailability.value = true;

  try {
    const response = await api.get("/bookings/availability", {
      params: {
        facilityId: Number(facilityId),
        startDate: selectedDate.value,
        quantity: quantity.value,
      },
    });

    hasExistingBooking.value = !response.data.available;
  } catch (err) {
    console.error(err);

    hasExistingBooking.value = false;

    $q.notify({
      type: "negative",
      message: "Failed to check availability.",
    });
  } finally {
    checkingAvailability.value = false;
  }
}

onMounted(async () => {
  await loadFacility();
});

</script>

<style scoped>
.booking-page {
  max-width: 900px;
  margin: 0 auto;
}

.facility-hero {
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(46, 125, 50, 0.06), rgba(46, 125, 50, 0.01));
}

.rate-badge {
  text-align: right;
}
</style>