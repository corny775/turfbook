<template>
  <q-page class="q-pa-md facilities-page">

    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">
  {{ categoryTitle }}
</div>

<div class="text-subtitle2 text-grey-7">
  Pick a facility and book your slot in a couple of clicks
</div>
      </div>

      <q-btn
  v-if="route.query.category"
  flat
  color="primary"
  icon="apps"
  label="All Facilities"
  class="q-mr-sm"
  @click="router.push('/facilities')"
/>

      <q-input
        v-model="search"
        dense
        outlined
        debounce="300"
        placeholder="Search facilities..."
        class="search-input bg-white"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="row q-col-gutter-md">
      <div v-for="n in 3" :key="n" class="col-12 col-md-4">
        <q-card flat bordered class="facility-card">
          <q-skeleton height="120px" square />
          <q-card-section>
            <q-skeleton type="text" width="60%" class="q-mb-sm" />
            <q-skeleton type="text" width="40%" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="filteredFacilities.length === 0"
      class="column items-center q-pa-xl text-grey-6"
    >
      <q-icon name="domain_disabled" size="64px" class="q-mb-md" />
      <div class="text-h6">No facilities found</div>
      <div class="text-body2">Try a different search term.</div>
    </div>

    <!-- Facility grid -->
    <div v-else class="row q-col-gutter-md">

      <div
        v-for="facility in filteredFacilities"
        :key="facility.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat bordered class="facility-card">

          <div class="facility-banner" :class="bannerClass(facility.type)">
            <q-icon :name="typeIcon(facility.type)" size="40px" color="white" />
          </div>

          <q-card-section>
            <div class="text-h6 text-weight-bold ellipsis">
              {{ facility.name }}
            </div>

            <q-chip
              dense
              square
              color="green-1"
              text-color="primary"
              class="text-weight-medium q-mb-sm"
            >
              {{ facility.type }}
            </q-chip>

            <div class="row items-baseline q-gutter-xs">
              <span class="text-h6 text-weight-bold text-primary">
                ₹{{ facility.base_rate }}
              </span>
              <span class="text-caption text-grey-6">
  /{{ formatPricingUnit(facility.pricing_unit) }}
</span>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              unelevated
              color="primary"
              icon-right="arrow_forward"
              label="Book Now"
              class="full-width"
              @click="bookFacility(facility.id)"
            />
          </q-card-actions>

        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';

interface Facility {
  id: number;
  name: string;
  type: string;
  base_rate: string;
  pricing_unit: string;
  slot_duration: number | null;
  category_id: number;
  capacity: number | null;
}

const facilities = ref<Facility[]>([]);
const loading = ref(false);
const search = ref('');
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const bannerPalette = [
  'banner-green',
  'banner-teal',
  'banner-lime',
];

function bannerClass(type: string) {
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bannerPalette[Math.abs(hash) % bannerPalette.length];
}

function typeIcon(type: string) {
  const key = type.toLowerCase();
  if (key.includes('court') || key.includes('badminton') || key.includes('basketball')) return 'sports_basketball';
  if (key.includes('pool') || key.includes('swim')) return 'pool';
  if (key.includes('turf') || key.includes('football') || key.includes('soccer')) return 'sports_soccer';
  if (key.includes('tennis')) return 'sports_tennis';
  if (key.includes('gym') || key.includes('fitness')) return 'fitness_center';
  if (key.includes('hall') || key.includes('room')) return 'meeting_room';
  return 'stadium';
}

const filteredFacilities = computed(() => {
  let result = facilities.value;

  const category = Number(route.query.category);

  if (category) {
    result = result.filter(
      (facility) => facility.category_id === category
    );
  }

  if (search.value) {
    const term = search.value.toLowerCase();

    result = result.filter(
      (facility) =>
        facility.name.toLowerCase().includes(term) ||
        facility.type.toLowerCase().includes(term)
    );
  }

  return result;
});

function formatPricingUnit(unit: string) {
  switch (unit) {
    case 'hour':
      return 'hour';
    case 'night':
      return 'night';
    case 'day':
      return 'day';
    case 'event':
      return 'event';
    case 'person':
      return 'person';
    case 'session':
      return 'session';
    case 'item':
      return 'item';
    default:
      return unit;
  }
}

const categoryTitles: Record<number, string> = {
  1: 'Academic Facilities',
  2: 'Sports & Fitness Facilities',
  3: 'Events & Conference Facilities',
  4: 'Technology & Innovation Facilities',
  5: 'Food & Dining Facilities',
  6: 'Accommodation Facilities',
  7: 'Health & Wellness Facilities',
  8: 'Recreation & Culture Facilities',
  9: 'Transport & Infrastructure Facilities',
};

const categoryTitle = computed(() => {
  const category = Number(route.query.category);

  return categoryTitles[category] ?? 'Available Facilities';
});

function bookFacility(id: number) {
  void router.push(`/booking/${id}`);
}

async function loadFacilities() {
  loading.value = true;

  try {
    const response = await api.get('/facilities');
    facilities.value = response.data;
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Failed to load facilities.',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadFacilities();
});
</script>

<style scoped>
.facilities-page {
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  width: 280px;
  border-radius: 8px;
}

.facility-card {
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.facility-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.facility-banner {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-green {
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
}

.banner-teal {
  background: linear-gradient(135deg, #00695c, #26a69a);
}

.banner-lime {
  background: linear-gradient(135deg, #558b2f, #9ccc65);
}
</style>