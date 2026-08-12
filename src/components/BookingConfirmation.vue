<template>
  <q-dialog :model-value="showDialog">

    <q-card style="min-width:350px">

      <q-card-section>

        <div class="text-h6">
          Confirm Booking
        </div>

      </q-card-section>

      <q-card-section>

        <div><b>Facility:</b> {{ facility?.name }}</div>

        <div><b>Date:</b> {{ selectedDate }}</div>

        <div>
          <b>Slot:</b>
          {{ selectedSlot }} -
          {{ Number(selectedSlot.split(":")[0]) + 1 }}:00
        </div>

        <div v-if="pricingBreakdown.length" class="q-mt-md">
  <div class="text-subtitle1 text-weight-bold q-mb-sm">
    Pricing Breakdown
  </div>

  <div
    v-for="item in pricingBreakdown"
    :key="item.label"
    class="row justify-between q-py-xs"
  >
    <span>{{ item.label }}</span>

    <span
      :class="
        item.type === 'discount'
          ? 'text-positive'
          : ''
      "
    >
      {{ item.amount < 0 ? '-' : '+' }}₹{{
        Math.abs(item.amount).toFixed(2)
      }}
    </span>
  </div>

  <q-separator class="q-my-sm" />

  <div class="row justify-between text-weight-bold">
    <span>Total</span>

    <span v-if="calculatedPrice !== null">
      ₹{{ calculatedPrice.toFixed(2) }}
    </span>

    <span v-else>
      Calculating...
    </span>
  </div>
</div>

<div v-else>
  <b>Amount:</b>

  <span v-if="calculatedPrice !== null">
    ₹{{ calculatedPrice.toFixed(2) }}
  </span>

  <span v-else>
    Calculating...
  </span>
</div>

      </q-card-section>

      <q-card-actions align="right">

        <q-btn
          flat
          label="Cancel"
          @click="emit('close')"
        />

        <q-btn
          color="primary"
          label="Confirm"
          :loading="confirmLoading"
          @click="emit('confirm-booking')"
        />

      </q-card-actions>

    </q-card>

  </q-dialog>
</template>

<script setup lang="ts">
interface Facility {
  id: number;
  name: string;
  type: string;
  base_rate: string;
  slot_duration: number;
}

defineProps<{
  showDialog: boolean;
  facility: Facility | null;
  selectedDate: string;
  selectedSlot: string;
  calculatedPrice: number | null;

  pricingBreakdown: Array<{
    label: string;
    type: string;
    amount: number;
  }>;

  confirmLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm-booking"): void;
}>();
</script>