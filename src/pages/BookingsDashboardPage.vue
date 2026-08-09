<template>
  <q-page class="q-pa-md bookings-dashboard-page">

    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Bookings Dashboard</div>
        <div class="text-subtitle2 text-grey-7">
          Track and filter all bookings across facilities
        </div>
      </div>

      <q-btn
        outline
        color="primary"
        icon="refresh"
        label="Refresh"
        :loading="loading"
        @click="loadBookings"
      />
    </div>

    <!-- Stat cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="primary" text-color="white" icon="payments" size="48px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Total Revenue</div>
              <div class="text-h5 text-weight-bold text-primary">
                ₹{{ filteredRevenue.toFixed(2) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="green-6" text-color="white" icon="event_available" size="48px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Bookings Shown</div>
              <div class="text-h5 text-weight-bold">
                {{ filteredBookings.length }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="teal-6" text-color="white" icon="cancel" size="48px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Cancelled</div>
              <div class="text-h5 text-weight-bold">
                {{ cancelledCount }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filters -->
    <q-card flat bordered class="q-pa-md q-mb-lg filter-card">
      <div class="row q-col-gutter-md items-center">

        <div class="col-12 col-md-4">
          <q-select
            outlined
            dense
            v-model="facilityFilter"
            :options="facilityOptions"
            label="Facility"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-select
            outlined
            dense
            v-model="statusFilter"
            :options="['All', 'Booked', 'Cancelled']"
            label="Status"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-input
            outlined
            dense
            v-model="dateFilter"
            type="date"
            label="Date"
          />
        </div>

        <div class="col-12 col-md-1">
          <q-btn
            flat
            round
            color="grey-7"
            icon="filter_alt_off"
            @click="clearFilters"
          >
            <q-tooltip>Clear filters</q-tooltip>
          </q-btn>
        </div>

      </div>
    </q-card>

    <q-card flat bordered class="table-card">
      <q-table
        :rows="filteredBookings"
        :columns="columns"
        :loading="loading"
        row-key="id"
        flat
        :rows-per-page-options="[10, 25, 50]"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props" align="center">
            <q-chip
              dense
              square
              :color="props.row.status === 'Cancelled' ? 'negative' : 'primary'"
              text-color="white"
              class="text-weight-medium"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props" align="right" class="text-weight-medium">
            ₹{{ props.row.amount }}
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width column items-center q-pa-xl text-grey-6">
            <q-icon name="event_busy" size="48px" class="q-mb-sm" />
            <div>No bookings match your filters.</div>
          </div>
        </template>
      </q-table>
    </q-card>

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
const loading = ref(false);
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
    sortable: true,
  },
  {
    name: "username",
    label: "User",
    field: "username",
    align: "left",
    sortable: true,
  },
  {
    name: "booking_date",
    label: "Date",
    field: (row) => row.booking_date.substring(0, 10),
    align: "left",
    sortable: true,
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
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "center",
  },
];

function clearFilters() {
  facilityFilter.value = "All";
  statusFilter.value = "All";
  dateFilter.value = "";
}

async function loadBookings() {
  loading.value = true;

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
  } finally {
    loading.value = false;
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

const cancelledCount = computed(() => {
  return filteredBookings.value.filter((b) => b.status === "Cancelled").length;
});

onMounted(() => {
  void loadBookings();
});
</script>

<style scoped>
.bookings-dashboard-page {
  max-width: 1300px;
  margin: 0 auto;
}

.stat-card,
.filter-card,
.table-card {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
}

.table-card {
  overflow: hidden;
}
</style>