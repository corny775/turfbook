<template>
  <q-page class="q-pa-md">

    <div class="text-h4 q-mb-lg">
      Available Facilities
    </div>

    <div class="row q-col-gutter-md">

      <div
        v-for="facility in facilities"
        :key="facility.id"
        class="col-12 col-md-4"
      >
        <q-card>

          <q-card-section>
            <div class="text-h6">
              {{ facility.name }}
            </div>

            <div>
              {{ facility.type }}
            </div>

            <div class="text-primary text-subtitle1">
              ₹{{ facility.base_rate }}/hour
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              color="primary"
              label="Book Now"
              @click="bookFacility(facility.id)"
            />
          </q-card-actions>

        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import api from '@/services/api';

interface Facility {
  id: number;
  name: string;
  type: string;
  base_rate: string;
  slot_duration: number;
}

const facilities = ref<Facility[]>([]);
const router = useRouter();
const $q = useQuasar();

function bookFacility(id: number) {
  void router.push(`/booking/${id}`);
}

async function loadFacilities() {
  try {
    const response = await api.get('/facilities');
    facilities.value = response.data;
  } catch {
  $q.notify({
    type: 'negative',
    message: 'Failed to load facilities.',
  });
}
}

onMounted(() => {
  void loadFacilities();
});
</script>