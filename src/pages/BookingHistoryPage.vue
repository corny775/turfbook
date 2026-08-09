<template>
  <q-page class="q-pa-md booking-history-page">

    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">My Bookings</div>
        <div class="text-subtitle2 text-grey-7">
          {{ bookings.length }} booking{{ bookings.length === 1 ? '' : 's' }} on record
        </div>
      </div>

      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="Refresh"
        :loading="loading"
        @click="loadBookings"
      />
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="column q-gutter-md">
      <q-card v-for="n in 3" :key="n" flat bordered class="booking-card">
        <q-card-section>
          <q-skeleton type="text" width="40%" class="q-mb-sm" />
          <q-skeleton type="text" width="60%" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Empty state -->
    <div v-else-if="bookings.length === 0" class="column items-center q-pa-xl text-grey-6">
      <q-icon name="event_busy" size="64px" class="q-mb-md" />
      <div class="text-h6">No bookings yet</div>
      <div class="text-body2">Once you book a facility, it will show up here.</div>
    </div>

    <!-- Booking list -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="booking in bookings"
        :key="booking.id"
        class="col-12 col-md-6"
      >
        <q-card flat bordered class="booking-card">

          <div class="status-bar" :class="statusClass(booking.status)" />

          <q-card-section>
            <div class="row items-start justify-between no-wrap">
              <div class="text-h6 text-weight-bold ellipsis">
                {{ booking.facility_name }}
              </div>

              <q-chip
                :color="statusColor(booking.status)"
                text-color="white"
                dense
                square
                class="text-capitalize text-weight-medium"
              >
                {{ booking.status }}
              </q-chip>
            </div>

            <q-separator class="q-my-sm" />

            <div class="row items-center q-gutter-x-md q-gutter-y-xs text-body2 text-grey-8">
              <div class="row items-center">
                <q-icon name="event" size="18px" class="q-mr-xs" />
                {{ formatDate(booking.booking_date) }}
              </div>

              <div class="row items-center">
                <q-icon name="schedule" size="18px" class="q-mr-xs" />
                {{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}
              </div>
            </div>

            <div class="row items-center justify-between q-mt-md">
              <div class="text-caption text-grey-6">Amount paid</div>
              <div class="text-h6 text-weight-bold text-primary">
                ₹{{ booking.amount }}
              </div>
            </div>
          </q-card-section>

        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
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
const loading = ref(false);
const $q = useQuasar();

function statusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'primary';
    case 'pending':
      return 'orange-8';
    case 'cancelled':
      return 'negative';
    case 'completed':
      return 'grey-7';
    default:
      return 'grey-6';
  }
}

function statusClass(status: string) {
  return `status-${(status ?? '').toLowerCase()}`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr.substring(0, 10));
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(timeStr: string) {
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = Number(hourStr);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${suffix}`;
}

async function loadBookings() {
  loading.value = true;

  try {
    const response = await api.get("/bookings/user/1");
    bookings.value = response.data;

  } catch (err: unknown) {
    console.error(err);

    let message = "Failed to load booking history.";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }

    $q.notify({
      type: "negative",
      message,
    });

    bookings.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadBookings();
});
</script>

<style scoped>
.booking-history-page {
  max-width: 1100px;
  margin: 0 auto;
}

.booking-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.booking-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
}

.status-confirmed {
  background: var(--q-primary);
}

.status-pending {
  background: #ef6c00;
}

.status-cancelled {
  background: var(--q-negative);
}

.status-completed {
  background: #757575;
}
</style>