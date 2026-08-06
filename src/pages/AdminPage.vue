<template>
  <q-page class="q-pa-md">

    <div class="row items-center justify-between q-mb-lg">

      <div class="text-h4">
        Facility Management
      </div>

      <q-btn
        color="primary"
        label="Add Facility"
        @click="showDialog = true"
      />

    </div>

    <q-table
      :rows="facilities"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >

      <template v-slot:body-cell-actions="props">

        <q-td align="center">

          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            @click="editFacility(props.row)"
          />

          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            @click="deleteFacility(props.row.id)"
          />

        </q-td>

      </template>

    </q-table>

    <q-dialog v-model="showDialog">

      <q-card style="min-width:400px">

        <q-card-section>

          <div class="text-h6">
            {{ editing ? "Edit Facility" : "Add Facility" }}
          </div>

        </q-card-section>

        <q-card-section>

          <q-input
            outlined
            v-model="form.name"
            label="Facility Name"
            class="q-mb-md"
          />

          <q-input
            outlined
            v-model="form.type"
            label="Type"
            class="q-mb-md"
          />

          <q-input
            outlined
            type="number"
            v-model="form.base_rate"
            label="Base Rate"
            class="q-mb-md"
          />

          <q-input
            outlined
            type="number"
            v-model="form.slot_duration"
            label="Slot Duration"
          />

        </q-card-section>

        <q-card-actions align="right">

          <q-btn
            flat
            label="Cancel"
            v-close-popup
          />

          <q-btn
            color="primary"
            label="Save"
            @click="saveFacility"
          />

        </q-card-actions>

      </q-card>

    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import api from '@/services/api';

interface Facility {
  id: number;
  name: string;
  type: string;
  base_rate: number | string;
  slot_duration: number;
}

interface FacilityForm {
  id: number | null;
  name: string;
  type: string;
  base_rate: number | string;
  slot_duration: number;
}

const facilities = ref<Facility[]>([]);

const columns: QTableColumn<Facility>[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left',
  },
  {
    name: 'base_rate',
    label: 'Base Rate',
    field: 'base_rate',
    align: 'left',
  },
  {
    name: 'slot_duration',
    label: 'Duration',
    field: 'slot_duration',
    align: 'left',
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
  slot_duration: 60,
});

async function loadFacilities() {
  try {
    const response = await api.get('/facilities');
    facilities.value = response.data;
  } catch (err) {
    console.error(err);
    alert('Failed to load facilities');
  }
}

function editFacility(facility: Facility) {
  editing.value = true;

  form.value = {
    id: facility.id,
    name: facility.name,
    type: facility.type,
    base_rate: facility.base_rate,
    slot_duration: facility.slot_duration,
  };

  showDialog.value = true;
}

async function saveFacility() {
  try {
    if (editing.value) {

      await api.put(`/facilities/${form.value.id}`, {
        name: form.value.name,
        type: form.value.type,
        base_rate: Number(form.value.base_rate),
        slot_duration: Number(form.value.slot_duration),
      });

      alert("Facility updated successfully!");

    } else {

      await api.post("/facilities", {
        name: form.value.name,
        type: form.value.type,
        base_rate: Number(form.value.base_rate),
        slot_duration: Number(form.value.slot_duration),
      });

      alert("Facility added successfully!");
    }

    showDialog.value = false;

    editing.value = false;

    form.value = {
      id: null,
      name: "",
      type: "",
      base_rate: 0,
      slot_duration: 60,
    };

    await loadFacilities();

  } catch (err) {
    console.error(err);
    alert("Operation failed");
  }
}

async function deleteFacility(id: number) {
  try {
    const confirmed = confirm(
      "Are you sure you want to delete this facility?"
    );

    if (!confirmed) {
      return;
    }

    await api.delete(`/facilities/${id}`);

    await loadFacilities();

    alert("Facility deleted successfully!");

  } catch (err) {
    console.error(err);
    alert("Failed to delete facility");
  }
}

onMounted(() => {
  void loadFacilities();
});
</script>