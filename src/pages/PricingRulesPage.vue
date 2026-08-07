<template>
  <q-page class="q-pa-md">

    <div class="text-h4 q-mb-lg">
      Pricing Rule Management
    </div>

    <q-select
      outlined
      v-model="selectedFacility"
      :options="facilities"
      option-label="name"
      option-value="id"
      label="Select Facility"
      class="q-mb-lg"
    />

    <q-table
      v-if="selectedFacility"
      :rows="rules"
      :columns="columns"
      row-key="id"
      bordered
      flat
    >

      <template v-slot:body-cell-actions="props">

        <q-td align="center">

          <q-btn
            icon="edit"
            flat
            round
            color="primary"
            @click="editRule(props.row)"
          />

        </q-td>

      </template>

    </q-table>
<q-dialog v-model="showDialog">

  <q-card style="min-width:350px">

  <q-form @submit.prevent="saveRule">

    <q-card-section>

      <div class="text-h6">
        Edit Pricing Rule
      </div>

    </q-card-section>

    <q-card-section>

      <q-input
        outlined
        v-model="editingRule.rule_type"
        label="Rule"
        disable
        class="q-mb-md"
      />

      <q-input
  outlined
  v-model="editingRule.value"
  type="number"
  label="Value"
  :rules="[
    val => Number(val) > 0 || 'Value must be greater than 0'
  ]"
/>

    </q-card-section>

    <q-card-actions align="right">

    <q-btn
  flat
  label="Cancel"
  @click="
    showDialog = false;
    editingRule = {
      id: 0,
      facility_id: 0,
      rule_type: '',
      value: '',
    };
  "
/>

    <q-btn
      color="primary"
      label="Save"
      :loading="saveLoading"
      type="submit"
    />

  </q-card-actions>

</q-form>

  </q-card>

</q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import type { QTableColumn } from "quasar";
import axios from "axios";
import api from "@/services/api";

interface Facility {
  id: number;
  name: string;
}

interface Rule {
  id: number;
  facility_id: number;
  rule_type: string;
  value: string;
}

const facilities = ref<Facility[]>([]);
const selectedFacility = ref<Facility | null>(null);
const rules = ref<Rule[]>([]);
const $q = useQuasar();

const saveLoading = ref(false);

const showDialog = ref(false);

const editingRule = ref<Rule>({
  id: 0,
  facility_id: 0,
  rule_type: "",
  value: "",
});

const columns: QTableColumn<Rule>[] = [
  {
    name: "rule_type",
    label: "Rule",
    field: "rule_type",
    align: "left",
  },
  {
    name: "value",
    label: "Value",
    field: "value",
    align: "left",
  },
  {
    name: "actions",
    label: "Actions",
    field: "id",
    align: "center",
  },
];

async function loadFacilities() {
  try {
    const response = await api.get("/facilities");
    facilities.value = response.data;

  } catch (err: unknown) {
    console.error(err);

    $q.notify({
      type: "negative",
      message: "Failed to load facilities.",
    });
  }
}

async function loadRules() {
  if (!selectedFacility.value) {
    rules.value = [];
    return;
  }

  try {
    const response = await api.get(
      `/pricing-rules/${selectedFacility.value.id}`
    );

    rules.value = response.data;

  } catch (err: unknown) {
    console.error(err);

    let message = "Failed to load pricing rules.";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }

    $q.notify({
      type: "negative",
      message,
    });

    rules.value = [];
  }
}

function editRule(rule: Rule) {
  editingRule.value = { ...rule };
  showDialog.value = true;
}

async function saveRule() {
  saveLoading.value = true;

  try {
    await api.put(
      `/pricing-rules/${editingRule.value.id}`,
      {
        value: Number(editingRule.value.value),
      }
    );

    showDialog.value = false;

    await loadRules();

    $q.notify({
      type: "positive",
      message: "Pricing rule updated successfully!",
    });

  } catch (err: unknown) {
    console.error(err);

    let message = "Update failed";

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

watch(selectedFacility, () => {
  void loadRules();
});

onMounted(() => {
  void loadFacilities();
});
</script>