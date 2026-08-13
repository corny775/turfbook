<template>
  <q-page class="q-pa-md admin-page">

    <div class="row items-center justify-between q-mb-lg">

      <div>
        <div class="text-h4 text-weight-bold">Facility Management</div>
        <div class="text-subtitle2 text-grey-7">
          {{ facilities.length }} facilit{{ facilities.length === 1 ? 'y' : 'ies' }} configured
        </div>
      </div>

      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Add Facility"
        class="q-px-md"
        @click="openAddDialog"
      />

    </div>

    <q-card flat bordered class="table-card">
      <q-table
        :rows="facilities"
        :columns="columns"
        :filter="search"
        :loading="loading"
        row-key="id"
        flat
        :rows-per-page-options="[5, 10, 15, 20, 25]"
      >

        <template v-slot:top-right>
          <q-input
            v-model="search"
            dense
            outlined
            debounce="300"
            placeholder="Search facilities..."
            class="search-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.name }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-chip dense square color="green-1" text-color="primary" class="text-weight-medium">
              {{ props.row.type }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-base_rate="props">
          <q-td :props="props">
            ₹{{ props.row.base_rate }}
          </q-td>
        </template>

        <template v-slot:body-cell-slot_duration="props">
  <q-td :props="props">
    <span v-if="props.row.pricing_unit === 'hour'">
      {{ props.row.slot_duration ?? 60 }} min
    </span>

    <span v-else>
      /{{ props.row.pricing_unit }}
    </span>
  </q-td>
</template>

        <template v-slot:body-cell-actions="props">

          <q-td align="center" :props="props">

            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              class="q-mr-xs"
              @click="editFacility(props.row)"
            >
              <q-tooltip>Edit</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              :loading="deleteLoading"
              @click="deleteFacility(props.row.id)"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>

          </q-td>

        </template>

        <template v-slot:no-data>
          <div class="full-width column items-center q-pa-xl text-grey-6">
            <q-icon name="domain" size="48px" class="q-mb-sm" />
            <div>No facilities yet. Add your first one to get started.</div>
          </div>
        </template>

      </q-table>
    </q-card>

    <q-dialog v-model="showDialog">

      <q-card style="min-width:420px" class="dialog-card">

        <q-card-section class="row items-center q-pb-none">
          <q-icon
            :name="editing ? 'edit' : 'add_circle'"
            color="primary"
            size="28px"
            class="q-mr-sm"
          />
          <div class="text-h6">
            {{ editing ? "Edit Facility" : "Add Facility" }}
          </div>
        </q-card-section>

        <q-form @submit.prevent="saveFacility">

          <q-card-section>

            <q-input
              outlined
              v-model="form.name"
              label="Facility Name"
              class="q-mb-md"
              :rules="[
                val => !!val || 'Facility name is required'
              ]"
            />

            <q-input
              outlined
              v-model="form.type"
              label="Type"
              class="q-mb-md"
              :rules="[
                val => !!val || 'Facility type is required'
              ]"
            />

            <q-input
              outlined
              type="number"
              v-model="form.base_rate"
              label="Base Rate"
              prefix="₹"
              class="q-mb-md"
              :rules="[
                val => Number(val) > 0 || 'Base rate must be greater than 0'
              ]"
            />

            <q-input
  outlined
  :model-value="
    categoryPricing[authStore.categoryId ?? 0]?.label ?? ''
  "
  label="Pricing Unit"
  readonly
  class="q-mb-md"
/>

            <q-input
  v-if="['person', 'item'].includes(form.pricing_unit)"
  outlined
  type="number"
  v-model="form.capacity"
  label="Capacity / Inventory"
  class="q-mb-md"
  hint="Used for person and item facilities"
  :rules="[
    val =>
      Number(val) > 0 ||
      'Capacity must be greater than 0'
  ]"
/>

            <q-input
  v-if="form.pricing_unit === 'hour'"
  outlined
  type="number"
  v-model="form.slot_duration"
  label="Slot Duration (minutes)"
  :rules="[
    val =>
      Number(val) <= 60 ||
      'Slot duration must be lesser than  or equal to 60',
      val =>
      Number(val) > 0 ||
      'Slot duration must be greater than 0'
  ]"
/>

          </q-card-section>

          <q-card-actions align="right" class="q-pa-md q-pt-none">

            <q-btn
              flat
              label="Cancel"
              color="grey-8"
              v-close-popup
            />

            <q-btn
              unelevated
              color="primary"
              label="Save"
              type="submit"
              :loading="saveLoading"
            />

          </q-card-actions>

        </q-form>

      </q-card>

    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import axios from 'axios';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

interface Facility {
  id: number;
  name: string;
  type: string;
  base_rate: number | string;
  pricing_unit: string;
  slot_duration: number | null;
  capacity: number | null;
}

interface FacilityForm {
  id: number | null;
  name: string;
  type: string;
  base_rate: number | string;
  pricing_unit: string;
  slot_duration: number | null;
  capacity: number | null;
}

const facilities = ref<Facility[]>([]);
const $q = useQuasar();
const authStore = useAuthStore();

const categoryPricing: Record<number, {
  unit: string;
  label: string;
  defaultRate: number;
}> = {
  1: { unit: 'hour', label: 'Hour', defaultRate: 500 },
  2: { unit: 'hour', label: 'Hour', defaultRate: 800 },
  3: { unit: 'event', label: 'Event', defaultRate: 10000 },
  4: { unit: 'hour', label: 'Hour', defaultRate: 1000 },
  5: { unit: 'person', label: 'Person', defaultRate: 300 },
  6: { unit: 'night', label: 'Night', defaultRate: 2500 },
  7: { unit: 'session', label: 'Session', defaultRate: 800 },
  8: { unit: 'hour', label: 'Hour', defaultRate: 500 },
  9: { unit: 'hour', label: 'Hour', defaultRate: 200 },
};

const loading = ref(false);
const saveLoading = ref(false);
const deleteLoading = ref(false);
const search = ref('');

const columns: QTableColumn<Facility>[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left',
    sortable: true,
  },
  {
    name: 'base_rate',
    label: 'Base Rate',
    field: 'base_rate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'slot_duration',
    label: 'Duration',
    field: 'slot_duration',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'id',
    align: 'center',
  },
];

const showDialog = ref(false);
const editing = ref(false);

const form = ref<FacilityForm>({
  id: null,
  name: '',
  type: '',
  base_rate: 0,
  pricing_unit: 'hour',
  slot_duration: 60,
  capacity: null,
});

function resetForm() {
  form.value = {
    id: null,
    name: "",
    type: "",
    base_rate:
  categoryPricing[authStore.categoryId ?? 0]?.defaultRate ?? 500,
pricing_unit:
  categoryPricing[authStore.categoryId ?? 0]?.unit ?? 'hour',
slot_duration: 60,
    capacity: null,
  };
}

function openAddDialog() {
  editing.value = false;
  resetForm();
  showDialog.value = true;
}

async function loadFacilities() {
  loading.value = true;

  try {
    const response = await api.get('/facilities');
    facilities.value = response.data;
  } catch (err: unknown) {
    console.error(err);

    let message = "Failed to load facilities";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }

    $q.notify({
      type: "negative",
      message,
    });
  } finally {
    loading.value = false;
  }
}

function editFacility(facility: Facility) {
  editing.value = true;

  form.value = {
    id: facility.id,
    name: facility.name,
    type: facility.type,
    base_rate: facility.base_rate,
    pricing_unit: facility.pricing_unit,
    slot_duration: facility.slot_duration,
    capacity: facility.capacity,
  };

  showDialog.value = true;
}

async function saveFacility() {
  saveLoading.value = true;

  try {
    if (editing.value) {

      await api.put(`/facilities/${form.value.id}`, {
  name: form.value.name,
  type: form.value.type,
  base_rate: Number(form.value.base_rate),
  pricing_unit: form.value.pricing_unit,
  slot_duration:
    form.value.pricing_unit === "hour"
      ? Number(form.value.slot_duration)
      : null,
  capacity:
    ["person", "item"].includes(form.value.pricing_unit)
      ? Number(form.value.capacity)
      : null,
});

      $q.notify({
        type: "positive",
        message: "Facility updated successfully!",
      });

    } else {

      await api.post("/facilities", {
  name: form.value.name,
  type: form.value.type,
  base_rate: Number(form.value.base_rate),
  pricing_unit: form.value.pricing_unit,
  slot_duration:
    form.value.pricing_unit === "hour"
      ? Number(form.value.slot_duration)
      : null,
  capacity:
    ["person", "item"].includes(form.value.pricing_unit)
      ? Number(form.value.capacity)
      : null,
});

      $q.notify({
        type: "positive",
        message: "Facility added successfully!",
      });
    }

    showDialog.value = false;
    editing.value = false;

    resetForm();

    await loadFacilities();

  } catch (err: unknown) {

    console.error(err);

    let message = "Operation failed";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }

    $q.notify({
      type: "negative",
      message,
    });

  } finally {
    saveLoading.value = false;
  }
}

function deleteFacility(id: number) {
  $q.dialog({
    title: "Delete Facility",
    message: "Are you sure you want to delete this facility?",
    cancel: true,
    persistent: true,
    ok: {
      label: "Delete",
      color: "negative",
    },
  }).onOk(() => {
    void performDelete(id);
  });
}

async function performDelete(id: number) {
  deleteLoading.value = true;

  try {
    await api.delete(`/facilities/${id}`);

    await loadFacilities();

    $q.notify({
      type: "positive",
      message: "Facility deleted successfully!",
    });

  } catch (err: unknown) {
    console.error(err);

    let message = "Failed to delete facility";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }

    $q.notify({
      type: "negative",
      message,
    });

  } finally {
    deleteLoading.value = false;
  }
}

onMounted(() => {
  void loadFacilities();
});
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.table-card {
  border-radius: 12px;
  overflow: hidden;
}

.search-input {
  width: 260px;
}

.dialog-card {
  border-radius: 12px;
}
</style>