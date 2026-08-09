<template>
  <div>

    <q-date
      v-model="date"
      mask="YYYY-MM-DD"
      class="q-mb-lg"
      :options="dateOptions"
      @update:model-value="emit('date-change')"
    />

    <div class="text-h6 q-mt-lg q-mb-md">
      Available Slots
    </div>

    <q-list bordered separator>

      <q-item
        v-for="slot in slots"
        :key="slot"
      >

        <q-item-section>
          {{ slot }} -
          {{ Number(slot.split(':')[0]) + 1 }}:00
        </q-item-section>

        <q-item-section side>

          <q-btn
            :color="isBooked(slot) ? 'red' : 'primary'"
            :label="isBooked(slot) ? 'Booked' : 'Book'"
            :disable="isBooked(slot)"
            @click="emit('select-slot', slot)"
          />

        </q-item-section>

      </q-item>

    </q-list>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Booking {
  start_time: string;
  end_time: string;
}

const props = defineProps<{
  modelValue: string;
  bookings: Booking[];
  slots: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "date-change"): void;
  (e: "select-slot", slot: string): void;
}>();

const date = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function dateOptions(date: string) {
  return date >= new Date().toISOString().slice(0, 10);
}

function isBooked(slot: string) {
  return props.bookings.some(
    booking => booking.start_time.substring(0, 5) === slot
  );
}
</script>