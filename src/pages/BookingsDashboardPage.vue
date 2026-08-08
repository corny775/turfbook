<template>
  <q-page class="q-pa-md">

    <div class="text-h4 q-mb-lg">
      Bookings Dashboard
    </div>

    <div class="row q-col-gutter-md q-mb-lg">

  <div class="col-4">
    <q-select
      outlined
      v-model="facilityFilter"
      :options="facilityOptions"
      label="Facility"
    />
  </div>

  <div class="col-4">
    <q-select
      outlined
      v-model="statusFilter"
      :options="['All', 'Booked', 'Cancelled']"
      label="Status"
    />
  </div>

  <div class="col-4">
    <q-input
      outlined
      v-model="dateFilter"
      type="date"
      label="Date"
    />
  </div>

</div>

    <q-card class="q-pa-md q-mb-lg">

      <div class="text-h6">
        Total Revenue
      </div>

      <div class="text-h4 text-primary">
        ₹{{ filteredRevenue.toFixed(2) }}
      </div>

    </q-card>

    <q-table
      :rows="filteredBookings"
      :columns="columns"
      row-key="id"
      bordered
      flat
    />

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import type { QTableColumn } from "quasar";
import axios from "axios";
import api from "@/services/api";

interface Booking {
  id: number;
  facility_name: string;
  username: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  amount: string;
  status: string;
}

const bookings = ref<Booking[]>([]);
const $q = useQuasar();
const facilityFilter = ref("All");
const statusFilter = ref("All");
const dateFilter = ref("");

const columns: QTableColumn<Booking>[] = [
  {
    name: "facility_name",
    label: "Facility",
    field: "facility_name",
    align: "left",
  },
  {
    name: "username",
    label: "User",
    field: "username",
    align: "left",
  },
  {
  name: "booking_date",
  label: "Date",
  field: (row) => row.booking_date.substring(0, 10),
  align: "left",
},
  {
    name: "start_time",
    label: "Start",
    field: "start_time",
    align: "left",
  },
  {
    name: "end_time",
    label: "End",
    field: "end_time",
    align: "left",
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
    align: "right",
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "center",
  },
];

async function loadBookings() {
  try {
    const response = await api.get("/admin/bookings");
    bookings.value = response.data;

  } catch (err: unknown) {
    console.error(err);

    let message = "Failed to load bookings.";

    if (axios.isAxiosError(err)) {
      message = err.response?.data?.message ?? message;
    }

    $q.notify({
      type: "negative",
      message,
    });

    bookings.value = [];
  }
}

const facilityOptions = computed(() => {
  return [
    "All",
    ...new Set(bookings.value.map((b) => b.facility_name)),
  ];
});

const filteredBookings = computed(() => {
  return bookings.value.filter((booking) => {
    const facilityOk =
      facilityFilter.value === "All" ||
      booking.facility_name === facilityFilter.value;

    const statusOk =
      statusFilter.value === "All" ||
      booking.status === statusFilter.value;

    const dateOk =
      !dateFilter.value ||
      booking.booking_date.startsWith(dateFilter.value);

    return facilityOk && statusOk && dateOk;
  });
});

const filteredRevenue = computed(() => {
  return filteredBookings.value.reduce(
    (sum, booking) => sum + Number(booking.amount),
    0
  );
});

onMounted(() => {
  void loadBookings();
});
</script>