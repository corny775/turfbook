<template>
  <q-page class="q-pa-md dashboard-page">

    <div class="hero q-pa-xl q-mb-lg">
      <div class="text-h3 text-weight-bold text-white">
  Welcome back, {{ auth.user?.username }} 👋
</div>
      <div class="text-subtitle1 text-white hero-subtitle">
        Here's a quick look at what's happening with your bookings.
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="primary" text-color="white" icon="domain" size="46px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Facilities</div>
              <div class="text-h5 text-weight-bold">
                <q-skeleton v-if="loading" type="text" width="30px" />
                <template v-else>{{ facilityCount }}</template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="green-6" text-color="white" icon="event" size="46px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Past Bookings</div>
              <div class="text-h5 text-weight-bold">
                <q-skeleton v-if="loading" type="text" width="30px" />
                <template v-else>{{ myBookings.length - upcomingCount }}</template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="teal-6" text-color="white" icon="event_upcoming" size="46px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Current bookings</div>
              <div class="text-h5 text-weight-bold">
                <q-skeleton v-if="loading" type="text" width="30px" />
                <template v-else>{{ upcomingCount }}</template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="lime-8" text-color="white" icon="payments" size="46px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Total Spent</div>
              <div class="text-h5 text-weight-bold">
                <q-skeleton v-if="loading" type="text" width="60px" />
                <template v-else>₹{{ totalSpent.toFixed(0) }}</template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <div class="row q-col-gutter-md">

      <div class="col-12 col-md-6">
        <q-card
          flat
          bordered
          class="action-card cursor-pointer"
          @click="router.push('/facilities')"
        >
          <q-card-section class="row items-center no-wrap">
            <q-icon name="search" size="36px" color="primary" class="q-mr-md" />
            <div>
              <div class="text-h6 text-weight-bold">Browse Facilities</div>
              <div class="text-body2 text-grey-7">Find and book a slot for your favorite facility</div>
            </div>
            <q-space />
            <q-icon name="arrow_forward" color="grey-6" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card
          flat
          bordered
          class="action-card cursor-pointer"
          @click="router.push('/history')"
        >
          <q-card-section class="row items-center no-wrap">
            <q-icon name="history" size="36px" color="primary" class="q-mr-md" />
            <div>
              <div class="text-h6 text-weight-bold">View Booking History</div>
              <div class="text-body2 text-grey-7">See all your past and upcoming bookings</div>
            </div>
            <q-space />
            <q-icon name="arrow_forward" color="grey-6" />
          </q-card-section>
        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

interface Facility {
  id: number;
  name: string;
  type: string;
  base_rate: string;
  slot_duration: number;
}

interface Booking {
  id: number;
  facility_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  amount: string;
  status: string;
}

const router = useRouter();
const auth = useAuthStore();
const loading = ref(true);
const facilityCount = ref(0);
const myBookings = ref<Booking[]>([]);

const upcomingCount = computed(() => {
  const today = new Date().toISOString().substring(0, 10);
  return myBookings.value.filter((b) => b.booking_date.substring(0, 10) >= today).length;
});

const totalSpent = computed(() => {
  return myBookings.value.reduce((sum, b) => sum + Number(b.amount), 0);
});

async function loadDashboard() {
  loading.value = true;

  try {
    const [facilitiesRes, bookingsRes] = await Promise.all([
      api.get<Facility[]>('/facilities'),
      api.get<Booking[]>(`/bookings/user/${auth.user?.id}`)
    ]);

    facilityCount.value = facilitiesRes.data.length;
    myBookings.value = bookingsRes.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadDashboard();
});
</script>

<style scoped>
.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  border-radius: 16px;
  background: linear-gradient(135deg, #1b5e20, #2e7d32 45%, #66bb6a);
  box-shadow: 0 8px 24px rgba(27, 94, 32, 0.25);
}

.hero-subtitle {
  opacity: 0.9;
}

.stat-card,
.action-card {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.action-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
</style>