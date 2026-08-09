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

        <div>
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
  confirmLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm-booking"): void;
}>();
</script>