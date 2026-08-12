<template>
  <q-page class="q-pa-md dashboard-page">

    <!-- Welcome -->
    <div class="hero q-pa-xl q-mb-lg">
      <div class="text-h3 text-weight-bold text-white">
        Welcome back, {{ auth.user?.username }} 👋
      </div>

      <div class="text-subtitle1 text-white hero-subtitle">
        Explore and book facilities across First Steps.
      </div>
    </div>


    <!-- Statistics -->
    <div class="row q-col-gutter-md q-mb-xl">

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar
              color="primary"
              text-color="white"
              icon="domain"
              size="46px"
              class="q-mr-md"
            />

            <div>
              <div class="text-caption text-grey-6">
                Facilities
              </div>

              <div class="text-h5 text-weight-bold">
                <q-skeleton
                  v-if="loading"
                  type="text"
                  width="30px"
                />

                <template v-else>
                  {{ facilityCount }}
                </template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>


      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar
              color="green-6"
              text-color="white"
              icon="event"
              size="46px"
              class="q-mr-md"
            />

            <div>
              <div class="text-caption text-grey-6">
                Past Bookings
              </div>

              <div class="text-h5 text-weight-bold">
                <q-skeleton
                  v-if="loading"
                  type="text"
                  width="30px"
                />

                <template v-else>
                  {{ myBookings.length - upcomingCount }}
                </template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>


      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar
              color="teal-6"
              text-color="white"
              icon="event_upcoming"
              size="46px"
              class="q-mr-md"
            />

            <div>
              <div class="text-caption text-grey-6">
                Current Bookings
              </div>

              <div class="text-h5 text-weight-bold">
                <q-skeleton
                  v-if="loading"
                  type="text"
                  width="30px"
                />

                <template v-else>
                  {{ upcomingCount }}
                </template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>


      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar
              color="lime-8"
              text-color="white"
              icon="payments"
              size="46px"
              class="q-mr-md"
            />

            <div>
              <div class="text-caption text-grey-6">
                Total Spent
              </div>

              <div class="text-h5 text-weight-bold">
                <q-skeleton
                  v-if="loading"
                  type="text"
                  width="60px"
                />

                <template v-else>
                  ₹{{ totalSpent.toFixed(0) }}
                </template>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>


    <!-- Facility Categories -->
    <div class="q-mb-xl">

      <div class="text-h5 text-weight-bold q-mb-sm">
        Explore Facilities
      </div>

      <div class="text-body2 text-grey-7 q-mb-md">
        Choose a category to explore the facilities available to you.
      </div>

      <!-- Loading categories -->
<div
  v-if="loading && categories.length === 0"
  class="column q-gutter-sm"
>
  <q-card
    v-for="n in 9"
    :key="n"
    flat
    bordered
  >
    <q-card-section>
      <q-skeleton type="text" width="35%" />
      <q-skeleton type="text" width="55%" />
    </q-card-section>
  </q-card>
</div>

<!-- Categories -->
<q-list
  v-else-if="categories.length > 0"
  bordered
  separator
  class="category-list rounded-borders"
>
  <q-expansion-item
    v-for="category in categories"
    :key="category.id"
    :icon="category.icon"
    :label="category.name"
    :caption="category.description"
    header-class="category-header"
  >
    <q-card flat>
      <q-card-section>

        <div class="text-body2 text-grey-7 q-mb-md">
          {{ category.description }}
        </div>

        <q-btn
          color="primary"
          label="View Facilities"
          icon="arrow_forward"
          @click="browseCategory(category.id)"
        />

      </q-card-section>
    </q-card>
  </q-expansion-item>
</q-list>

<!-- No categories -->
<div
  v-else
  class="column items-center q-pa-xl text-grey-6"
>
  <q-icon
    name="category"
    size="56px"
    class="q-mb-md"
  />

  <div class="text-h6">
    No facility categories available
  </div>

  <div class="text-body2">
    Please check back later.
  </div>
</div>

    </div>


    <!-- Quick Actions -->
    <div class="row q-col-gutter-md">

      <div class="col-12 col-md-6">
        <q-card
          flat
          bordered
          class="action-card cursor-pointer"
          @click="router.push('/facilities')"
        >
          <q-card-section class="row items-center no-wrap">
            <q-icon
              name="search"
              size="36px"
              color="primary"
              class="q-mr-md"
            />

            <div>
              <div class="text-h6 text-weight-bold">
                Browse All Facilities
              </div>

              <div class="text-body2 text-grey-7">
                Explore every facility available on First Steps
              </div>
            </div>

            <q-space />

            <q-icon
              name="arrow_forward"
              color="grey-6"
            />
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
            <q-icon
              name="history"
              size="36px"
              color="primary"
              class="q-mr-md"
            />

            <div>
              <div class="text-h6 text-weight-bold">
                View Booking History
              </div>

              <div class="text-body2 text-grey-7">
                See all your past and upcoming bookings
              </div>
            </div>

            <q-space />

            <q-icon
              name="arrow_forward"
              color="grey-6"
            />
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

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const router = useRouter();
const auth = useAuthStore();
const loading = ref(true);
const facilityCount = ref(0);
const myBookings = ref<Booking[]>([]);
const categories = ref<Category[]>([]);

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
    const [facilitiesRes, bookingsRes, categoriesRes] = await Promise.all([
  api.get<Facility[]>('/facilities'),
  api.get<Booking[]>(`/bookings/user/${auth.user?.id}`),
  api.get<Category[]>('/categories')
]);

    facilityCount.value = facilitiesRes.data.length;
    myBookings.value = bookingsRes.data;
    categories.value = categoriesRes.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function browseCategory(categoryId: number) {
  router.push({
    path: '/facilities',
    query: {
      category: String(categoryId),
    },
  });
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

.category-list {
  overflow: hidden;
}

.category-header {
  min-height: 72px;
  font-weight: 600;
}

.category-header:hover {
  background: rgba(0, 0, 0, 0.02);
}
</style>