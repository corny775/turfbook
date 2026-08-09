<template>
  <q-page class="q-pa-md pricing-page">

    <div class="q-mb-lg">
      <div class="text-h4 text-weight-bold">Pricing Rule Management</div>
      <div class="text-subtitle2 text-grey-7">
        Set surcharges, discounts, and time-based rates per facility
      </div>
    </div>

    <q-card flat bordered class="q-pa-md q-mb-lg selector-card">
      <q-select
        outlined
        v-model="selectedFacility"
        :options="facilities"
        option-label="name"
        option-value="id"
        label="Select Facility"
        emit-value
        map-options
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="domain" />
        </template>
      </q-select>
    </q-card>

    <!-- No facility selected -->
    <div
      v-if="!selectedFacility"
      class="column items-center q-pa-xl text-grey-6"
    >
      <q-icon name="sell" size="64px" class="q-mb-md" />
      <div class="text-h6">Select a facility</div>
      <div class="text-body2">Choose a facility above to view and edit its pricing rules.</div>
    </div>

    <!-- Loading -->
    <q-card v-else-if="loading" flat bordered class="table-card">
      <q-card-section>
        <q-skeleton type="text" width="30%" class="q-mb-sm" />
        <q-skeleton type="text" width="50%" class="q-mb-sm" />
        <q-skeleton type="text" width="40%" />
      </q-card-section>
    </q-card>

    <!-- Empty rules -->
    <div
      v-else-if="rules.length === 0"
      class="column items-center q-pa-xl text-grey-6"
    >
      <q-icon name="rule" size="64px" class="q-mb-md" />
      <div class="text-h6">No pricing rules found</div>
      <div class="text-body2">This facility doesn't have any pricing rules configured yet.</div>
    </div>

    <q-card v-else flat bordered class="table-card">
      <q-table
        :rows="rules"
        :columns="columns"
        row-key="id"
        flat
      >

        <template v-slot:body-cell-rule_type="props">
          <q-td :props="props">
            <q-chip dense square color="green-1" text-color="primary" class="text-weight-medium">
              <q-icon :name="ruleIcon(props.row.rule_type)" size="16px" class="q-mr-xs" />
              {{ formatRuleName(props.row.rule_type) }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-value="props">
          <q-td :props="props" class="text-weight-medium">
            {{ formatValue(props.row.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">

          <q-td align="center" :props="props">

            <q-btn
              icon="edit"
              flat
              round
              dense
              color="primary"
              @click="editRule(props.row)"
            >
              <q-tooltip>Edit rule</q-tooltip>
            </q-btn>

          </q-td>

        </template>

      </q-table>
    </q-card>

    <q-dialog v-model="showDialog">

      <q-card style="min-width:380px" class="dialog-card">

        <q-form @submit.prevent="saveRule">

          <q-card-section class="row items-center q-pb-none">
            <q-icon name="edit" color="primary" size="26px" class="q-mr-sm" />
            <div class="text-h6">Edit Pricing Rule</div>
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

          <q-card-actions align="right" class="q-pa-md q-pt-none">

            <q-btn
              flat
              color="grey-8"
              label="Cancel"
              @click="closeDialog"
            />

            <q-btn
              unelevated
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
const selectedFacility = ref<number | null>(null);
const rules = ref<Rule[]>([]);
const loading = ref(false);
const $q = useQuasar();

const saveLoading = ref(false);

const showDialog = ref(false);

const emptyRule: Rule = {
  id: 0,
  facility_id: 0,
  rule_type: "",
  value: "",
};

const editingRule = ref<Rule>({ ...emptyRule });

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

function ruleIcon(ruleType: string) {
  const key = ruleType.toLowerCase();
  if (key.includes('weekend')) return 'weekend';
  if (key.includes('peak') || key.includes('evening')) return 'schedule';
  if (key.includes('holiday')) return 'celebration';
  if (key.includes('discount')) return 'local_offer';
  return 'sell';
}

function formatRuleName(ruleType: string) {
  return ruleType
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatValue(value: string) {
  const num = Number(value);
  return Number.isFinite(num) ? `₹${num}` : value;
}

function closeDialog() {
  showDialog.value = false;
  editingRule.value = { ...emptyRule };
}

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

  loading.value = true;

  try {
    const response = await api.get(
      `/pricing-rules/${selectedFacility.value}`
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
  } finally {
    loading.value = false;
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

<style scoped>
.pricing-page {
  max-width: 1000px;
  margin: 0 auto;
}

.selector-card,
.table-card,
.dialog-card {
  border-radius: 12px;
}

.table-card {
  overflow: hidden;
}
</style>