<template>
  <q-page class="analytics-page q-pa-lg">

    <!-- Header -->
    <div class="analytics-header row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">
          FirstSteps Analytics
        </div>

        <div class="text-subtitle1 text-grey-7">
          Understand bookings, revenue and platform performance
        </div>
      </div>

      <q-btn
        outline
        color="green-8"
        icon="refresh"
        label="Refresh"
        :loading="loading"
        @click="loadAnalytics"
      />
    </div>

    <!-- Error -->
    <q-banner
      v-if="error"
      class="bg-red-1 text-red-9 q-mb-lg"
      rounded
    >
      <template #avatar>
        <q-icon name="error" color="negative" />
      </template>

      {{ error }}

      <template #action>
        <q-btn
          flat
          label="Retry"
          color="negative"
          @click="loadAnalytics"
        />
      </template>
    </q-banner>

    <!-- Loading -->
    <div
      v-if="loading && !analytics"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner
        color="green-8"
        size="50px"
      />
    </div>

    <!-- Dashboard -->
    <div v-if="analytics">

      <!-- ================================================= -->
      <!-- KPI CARDS -->
      <!-- ================================================= -->

      <div class="row q-col-gutter-md q-mb-lg">

        <!-- Bookings -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="kpi-card">
            <q-card-section>

              <div class="kpi-top">
                <div class="kpi-icon bookings-icon">
                  <q-icon
                    name="event_available"
                    size="26px"
                  />
                </div>

                <q-icon
                  name="trending_up"
                  color="green-7"
                  size="22px"
                />
              </div>

              <div class="kpi-label">
                Total Bookings
              </div>

              <div class="kpi-value">
                {{ analytics.totalBookings }}
              </div>

              <div class="kpi-description">
                All bookings recorded
              </div>

            </q-card-section>
          </q-card>
        </div>

        <!-- Revenue -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="kpi-card">
            <q-card-section>

              <div class="kpi-top">
                <div class="kpi-icon revenue-icon">
                  <q-icon
                    name="payments"
                    size="26px"
                  />
                </div>

                <q-icon
                  name="currency_rupee"
                  color="green-7"
                  size="22px"
                />
              </div>

              <div class="kpi-label">
                Total Revenue
              </div>

              <div class="kpi-value">
                ₹{{ formatNumber(analytics.totalRevenue) }}
              </div>

              <div class="kpi-description">
                Revenue generated
              </div>

            </q-card-section>
          </q-card>
        </div>

        <!-- Cancellation -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="kpi-card">
            <q-card-section>

              <div class="kpi-top">
                <div class="kpi-icon cancelled-icon">
                  <q-icon
                    name="event_busy"
                    size="26px"
                  />
                </div>

                <q-icon
                  name="trending_down"
                  color="negative"
                  size="22px"
                />
              </div>

              <div class="kpi-label">
                Cancelled Bookings
              </div>

              <div class="kpi-value cancelled-value">
                {{ analytics.cancelledBookings }}
              </div>

              <div class="kpi-description">
                {{ analytics.cancellationRate }}% cancellation rate
              </div>

            </q-card-section>
          </q-card>
        </div>

        <!-- Average -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="kpi-card">
            <q-card-section>

              <div class="kpi-top">
                <div class="kpi-icon average-icon">
                  <q-icon
                    name="analytics"
                    size="26px"
                  />
                </div>

                <q-icon
                  name="insights"
                  color="teal-7"
                  size="22px"
                />
              </div>

              <div class="kpi-label">
                Average Booking Value
              </div>

              <div class="kpi-value">
                ₹{{ formatNumber(analytics.averageBookingValue) }}
              </div>

              <div class="kpi-description">
                Average revenue per booking
              </div>

            </q-card-section>
          </q-card>
        </div>

      </div>


      <!-- ================================================= -->
      <!-- MAIN VISUALS -->
      <!-- ================================================= -->

      <div class="row q-col-gutter-md q-mb-md">

        <!-- Booking Status -->
        <div class="col-12 col-md-5">

          <q-card class="dashboard-card">
            <q-card-section>

              <div class="section-title">
                Booking Status
              </div>

              <div class="section-subtitle">
                Current distribution of bookings
              </div>

              <div class="status-chart-area">

                <!-- Donut -->
                <div
                  class="donut-chart"
                  :style="donutStyle"
                >
                  <div class="donut-center">

                    <div class="donut-number">
                      {{ analytics.totalBookings }}
                    </div>

                    <div class="donut-label">
                      Bookings
                    </div>

                  </div>
                </div>

                <!-- Legend -->
                <div class="status-legend">

                  <div class="legend-item">
                    <div class="legend-left">
                      <span class="legend-dot active-dot"></span>

                      <span>
                        Active
                      </span>
                    </div>

                    <strong>
                      {{ activeBookings }}
                    </strong>
                  </div>

                  <div class="legend-item">
                    <div class="legend-left">
                      <span class="legend-dot cancelled-dot"></span>

                      <span>
                        Cancelled
                      </span>
                    </div>

                    <strong>
                      {{ analytics.cancelledBookings }}
                    </strong>
                  </div>

                  <q-separator class="q-my-md" />

                  <div class="legend-total">
                    <span>Total</span>

                    <strong>
                      {{ analytics.totalBookings }}
                    </strong>
                  </div>

                </div>

              </div>

            </q-card-section>
          </q-card>

        </div>


        <!-- Cancellation Rate -->
        <div class="col-12 col-md-7">

          <q-card class="dashboard-card">

            <q-card-section>

              <div class="section-title">
                Cancellation Analysis
              </div>

              <div class="section-subtitle">
                How many bookings are being cancelled
              </div>

              <div class="cancellation-content">

                <div class="cancellation-number">
                  {{ analytics.cancellationRate }}%
                </div>

                <div class="cancellation-label">
                  Overall cancellation rate
                </div>

                <div class="large-progress">
                  <div
                    class="progress-fill"
                    :style="{
                      width: `${Math.min(
                        analytics.cancellationRate,
                        100
                      )}%`
                    }"
                  ></div>
                </div>

                <div class="progress-labels">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>

                <div
                  class="cancellation-message"
                  :class="cancellationClass"
                >
                  <q-icon
                    :name="cancellationIcon"
                    size="22px"
                  />

                  <span>
                    {{ cancellationMessage }}
                  </span>
                </div>

              </div>

            </q-card-section>

          </q-card>

        </div>

      </div>


      <!-- ================================================= -->
      <!-- REVENUE VISUALIZATION -->
      <!-- ================================================= -->

      <div class="row q-col-gutter-md q-mb-md">

        <div class="col-12">

          <q-card class="dashboard-card">

            <q-card-section>

              <div class="section-title">
                Revenue Performance
              </div>

              <div class="section-subtitle">
                Financial overview based on current booking activity
              </div>

              <div class="revenue-dashboard">

                <!-- Main number -->
                <div class="revenue-summary">

                  <div class="revenue-label">
                    Total Revenue
                  </div>

                  <div class="revenue-number">
                    ₹{{ formatNumber(analytics.totalRevenue) }}
                  </div>

                  <div class="revenue-note">
                    Generated across
                    <strong>
                      {{ analytics.totalBookings }}
                    </strong>
                    bookings
                  </div>

                </div>


                <!-- Visual -->
                <div class="revenue-visual">

                  <div class="revenue-bars">

                    <div class="revenue-bar-group">

                      <div
                        class="revenue-bar"
                        :style="{ height: `${revenueBarHeight}%` }"
                      >
                        <span>
                          ₹{{ formatNumber(analytics.totalRevenue) }}
                        </span>
                      </div>

                      <div class="bar-label">
                        Total Revenue
                      </div>

                    </div>


                    <div class="revenue-bar-group">

                      <div
                        class="revenue-bar secondary"
                        :style="{ height: `${averageBarHeight}%` }"
                      >
                        <span>
                          ₹{{ formatNumber(analytics.averageBookingValue) }}
                        </span>
                      </div>

                      <div class="bar-label">
                        Avg. Booking
                      </div>

                    </div>

                  </div>

                </div>


                <!-- Breakdown -->
                <div class="revenue-breakdown">

                  <div class="breakdown-row">
                    <div>
                      <span class="breakdown-dot revenue-dot"></span>
                      Total revenue
                    </div>

                    <strong>
                      ₹{{ formatNumber(analytics.totalRevenue) }}
                    </strong>
                  </div>

                  <div class="breakdown-row">
                    <div>
                      <span class="breakdown-dot average-dot"></span>
                      Average booking
                    </div>

                    <strong>
                      ₹{{ formatNumber(analytics.averageBookingValue) }}
                    </strong>
                  </div>

                  <div class="breakdown-row">
                    <div>
                      <span class="breakdown-dot bookings-dot"></span>
                      Total bookings
                    </div>

                    <strong>
                      {{ analytics.totalBookings }}
                    </strong>
                  </div>

                </div>

              </div>

            </q-card-section>

          </q-card>

        </div>

      </div>


      <!-- ================================================= -->
      <!-- PERFORMANCE GRID -->
      <!-- ================================================= -->

      <div class="row q-col-gutter-md q-mb-md">

        <!-- Active Bookings -->
        <div class="col-12 col-md-4">

          <q-card class="metric-card">

            <q-card-section>

              <div class="metric-heading">
                <q-icon
                  name="check_circle"
                  color="green-7"
                  size="24px"
                />

                Active Bookings
              </div>

              <div class="metric-big">
                {{ activeBookings }}
              </div>

              <div class="metric-description">
                {{ activeBookingPercentage }}% of all bookings
              </div>

              <q-linear-progress
                :value="activeBookingPercentage / 100"
                color="green-7"
                track-color="grey-3"
                rounded
                size="10px"
                class="q-mt-md"
              />

            </q-card-section>

          </q-card>

        </div>


        <!-- Cancelled -->
        <div class="col-12 col-md-4">

          <q-card class="metric-card">

            <q-card-section>

              <div class="metric-heading">
                <q-icon
                  name="cancel"
                  color="negative"
                  size="24px"
                />

                Cancelled
              </div>

              <div class="metric-big cancelled-text">
                {{ analytics.cancelledBookings }}
              </div>

              <div class="metric-description">
                {{ analytics.cancellationRate }}% of all bookings
              </div>

              <q-linear-progress
                :value="analytics.cancellationRate / 100"
                color="negative"
                track-color="grey-3"
                rounded
                size="10px"
                class="q-mt-md"
              />

            </q-card-section>

          </q-card>

        </div>


        <!-- Average Value -->
        <div class="col-12 col-md-4">

          <q-card class="metric-card">

            <q-card-section>

              <div class="metric-heading">
                <q-icon
                  name="payments"
                  color="teal-7"
                  size="24px"
                />

                Average Booking
              </div>

              <div class="metric-big">
                ₹{{ formatNumber(analytics.averageBookingValue) }}
              </div>

              <div class="metric-description">
                Average revenue generated per booking
              </div>

              <div class="average-indicator">
                <q-icon
                  name="trending_up"
                  size="18px"
                />

                Revenue efficiency
              </div>

            </q-card-section>

          </q-card>

        </div>

      </div>


      <!-- ================================================= -->
      <!-- INSIGHTS -->
      <!-- ================================================= -->

      <q-card class="dashboard-card">

        <q-card-section>

          <div class="section-title">
            FirstSteps Insights
          </div>

          <div class="section-subtitle">
            Automatically generated observations from current platform data
          </div>


          <div class="insights-grid">

            <div class="insight-item">
              <div class="insight-icon green-insight">
                <q-icon
                  name="event"
                  size="24px"
                />
              </div>

              <div>
                <div class="insight-title">
                  Booking Activity
                </div>

                <div class="insight-text">
                  FirstSteps has recorded
                  <strong>{{ analytics.totalBookings }}</strong>
                  bookings.
                </div>
              </div>
            </div>


            <div class="insight-item">
              <div class="insight-icon blue-insight">
                <q-icon
                  name="payments"
                  size="24px"
                />
              </div>

              <div>
                <div class="insight-title">
                  Revenue Generated
                </div>

                <div class="insight-text">
                  Current booking activity has generated
                  <strong>
                    ₹{{ formatNumber(analytics.totalRevenue) }}
                  </strong>.
                </div>
              </div>
            </div>


            <div class="insight-item">
              <div class="insight-icon orange-insight">
                <q-icon
                  name="analytics"
                  size="24px"
                />
              </div>

              <div>
                <div class="insight-title">
                  Average Transaction
                </div>

                <div class="insight-text">
                  Each booking contributes an average of
                  <strong>
                    ₹{{ formatNumber(analytics.averageBookingValue) }}
                  </strong>.
                </div>
              </div>
            </div>


            <div class="insight-item">
              <div class="insight-icon red-insight">
                <q-icon
                  name="event_busy"
                  size="24px"
                />
              </div>

              <div>
                <div class="insight-title">
                  Cancellation
                </div>

                <div class="insight-text">
                  <strong>
                    {{ analytics.cancellationRate }}%
                  </strong>
                  of bookings have been cancelled.
                </div>
              </div>
            </div>

          </div>

        </q-card-section>

      </q-card>

    </div>

  </q-page>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'

interface AnalyticsData {
  totalBookings: number
  totalRevenue: number
  cancelledBookings: number
  cancellationRate: number
  averageBookingValue: number
}

const $q = useQuasar()

const loading = ref(false)
const error = ref('')
const analytics = ref<AnalyticsData | null>(null)


/* ---------------------------------------------
   Computed values
--------------------------------------------- */

const activeBookings = computed(() => {
  if (!analytics.value) return 0

  return Math.max(
    0,
    analytics.value.totalBookings -
      analytics.value.cancelledBookings
  )
})


const activeBookingPercentage = computed(() => {
  if (!analytics.value || analytics.value.totalBookings === 0) {
    return 0
  }

  return Math.round(
    (activeBookings.value /
      analytics.value.totalBookings) *
      100
  )
})


/*
 * Donut chart.
 *
 * The API gives us:
 * - total bookings
 * - cancelled bookings
 *
 * Therefore we can legitimately calculate the
 * active/cancelled distribution.
 */
const donutStyle = computed(() => {
  if (!analytics.value) {
    return {}
  }

  const cancelled = Math.min(
    Math.max(analytics.value.cancellationRate, 0),
    100
  )

  return {
    background: `conic-gradient(
      #2e7d32 0% ${100 - cancelled}%,
      #e53935 ${100 - cancelled}% 100%
    )`
  }
})


/*
 * Revenue visual.
 *
 * These are normalized heights rather than
 * fabricated values.
 */
const revenueBarHeight = computed(() => {
  if (!analytics.value) return 0

  if (analytics.value.totalRevenue <= 0) {
    return 5
  }

  return 100
})


const averageBarHeight = computed(() => {
  if (!analytics.value) return 0

  if (
    analytics.value.totalRevenue <= 0 ||
    analytics.value.averageBookingValue <= 0
  ) {
    return 5
  }

  const ratio =
    (analytics.value.averageBookingValue /
      analytics.value.totalRevenue) *
    100

  return Math.max(
    8,
    Math.min(ratio, 100)
  )
})


/* ---------------------------------------------
   Cancellation messaging
--------------------------------------------- */

const cancellationMessage = computed(() => {
  if (!analytics.value) {
    return ''
  }

  const rate = analytics.value.cancellationRate

  if (rate === 0) {
    return 'Excellent — no bookings have been cancelled.'
  }

  if (rate <= 10) {
    return 'Very low cancellation activity.'
  }

  if (rate <= 25) {
    return 'Cancellation activity is currently moderate.'
  }

  if (rate <= 50) {
    return 'A significant portion of bookings are being cancelled.'
  }

  return 'Cancellation activity is very high and may require attention.'
})


const cancellationClass = computed(() => {
  if (!analytics.value) {
    return ''
  }

  const rate = analytics.value.cancellationRate

  if (rate <= 10) {
    return 'insight-good'
  }

  if (rate <= 25) {
    return 'insight-warning'
  }

  return 'insight-danger'
})


const cancellationIcon = computed(() => {
  if (!analytics.value) {
    return 'info'
  }

  const rate = analytics.value.cancellationRate

  if (rate <= 10) {
    return 'check_circle'
  }

  if (rate <= 25) {
    return 'warning'
  }

  return 'error'
})


/* ---------------------------------------------
   Number formatting
--------------------------------------------- */

function formatNumber(
  value: number | string | null | undefined
) {
  return Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })
}


/* ---------------------------------------------
   API
--------------------------------------------- */

async function loadAnalytics() {
  loading.value = true
  error.value = ''

  try {
    const storedAuth = localStorage.getItem('auth')

    if (!storedAuth) {
      throw new Error(
        'Authentication information not found.'
      )
    }

    const auth = JSON.parse(storedAuth)

    if (!auth.token) {
      throw new Error(
        'Authentication token not found.'
      )
    }

    const response = await fetch(
      'http://localhost:3000/api/analytics',
      {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message ||
          'Failed to load analytics.'
      )
    }

    const summary = data.summary || data

    analytics.value = {
      totalBookings: Number(
        summary.totalBookings || 0
      ),

      totalRevenue: Number(
        summary.totalRevenue || 0
      ),

      cancelledBookings: Number(
        summary.cancelledBookings || 0
      ),

      cancellationRate: Number(
        summary.cancellationRate || 0
      ),

      averageBookingValue: Number(
        summary.averageBookingValue || 0
      )
    }

  } catch (err: unknown) {

    console.error(
      'Analytics error:',
      err
    )

    const message =
      err instanceof Error
        ? err.message
        : 'Unable to load analytics.'

    error.value = message

    $q.notify({
      type: 'negative',
      message
    })

  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadAnalytics()
})
</script>


<style scoped>

.analytics-page {
  min-height: 100%;
  background:
    linear-gradient(
      135deg,
      rgba(46, 125, 50, 0.045),
      rgba(255, 255, 255, 0.9)
    );
}


/* =========================================
   Header
========================================= */

.analytics-header {
  padding-bottom: 4px;
}


/* =========================================
   Cards
========================================= */

.kpi-card,
.dashboard-card,
.metric-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.06);
}

.kpi-card {
  height: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.1);
}


/* =========================================
   KPI
========================================= */

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.kpi-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bookings-icon {
  background: #e8f5e9;
  color: #2e7d32;
}

.revenue-icon {
  background: #e0f2f1;
  color: #00897b;
}

.cancelled-icon {
  background: #ffebee;
  color: #d32f2f;
}

.average-icon {
  background: #e8eaf6;
  color: #3949ab;
}

.kpi-label {
  color: #777;
  font-size: 14px;
  margin-bottom: 5px;
}

.kpi-value {
  color: #263238;
  font-size: 29px;
  font-weight: 800;
  line-height: 1.2;
}

.cancelled-value {
  color: #d32f2f;
}

.kpi-description {
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}


/* =========================================
   Section headers
========================================= */

.section-title {
  font-size: 19px;
  font-weight: 700;
  color: #263238;
}

.section-subtitle {
  color: #888;
  font-size: 13px;
  margin-top: 3px;
  margin-bottom: 24px;
}


/* =========================================
   Booking status donut
========================================= */

.status-chart-area {
  min-height: 270px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 45px;
}

.donut-chart {
  width: 185px;
  height: 185px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  flex-shrink: 0;
}

.donut-chart::before {
  content: '';
  position: absolute;

  width: 122px;
  height: 122px;

  background: white;
  border-radius: 50%;
}

.donut-center {
  position: relative;
  z-index: 1;

  text-align: center;
}

.donut-number {
  font-size: 32px;
  font-weight: 800;
  color: #263238;
}

.donut-label {
  font-size: 12px;
  color: #888;
}

.status-legend {
  min-width: 150px;
}

.legend-item,
.legend-total {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.legend-left {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #555;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.active-dot {
  background: #2e7d32;
}

.cancelled-dot {
  background: #e53935;
}

.legend-total {
  font-size: 15px;
}


/* =========================================
   Cancellation
========================================= */

.cancellation-content {
  padding: 15px 5px 5px;
}

.cancellation-number {
  font-size: 52px;
  line-height: 1;
  font-weight: 800;
  color: #263238;
}

.cancellation-label {
  color: #888;
  margin-top: 8px;
  margin-bottom: 28px;
}

.large-progress {
  height: 18px;
  width: 100%;

  background: #eeeeee;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;

  background:
    linear-gradient(
      90deg,
      #ef5350,
      #c62828
    );

  border-radius: 20px;

  transition:
    width 0.7s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;

  color: #999;
  font-size: 11px;

  margin-top: 7px;
}

.cancellation-message {
  margin-top: 25px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 14px;
  border-radius: 10px;

  font-size: 13px;
}

.insight-good {
  background: #e8f5e9;
  color: #2e7d32;
}

.insight-warning {
  background: #fff8e1;
  color: #f57f17;
}

.insight-danger {
  background: #ffebee;
  color: #c62828;
}


/* =========================================
   Revenue
========================================= */

.revenue-dashboard {
  display: grid;

  grid-template-columns:
    1fr
    1.3fr
    1fr;

  gap: 35px;

  align-items: center;

  min-height: 270px;
}

.revenue-label {
  color: #888;
  font-size: 14px;
}

.revenue-number {
  color: #2e7d32;

  font-size: 42px;
  font-weight: 800;

  margin-top: 8px;
}

.revenue-note {
  color: #777;
  font-size: 13px;
  margin-top: 8px;
}


/* Revenue bars */

.revenue-visual {
  height: 220px;

  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.revenue-bars {
  width: 80%;

  height: 190px;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  gap: 55px;
}

.revenue-bar-group {
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  align-items: center;
}

.revenue-bar {
  width: 65px;

  min-height: 10px;

  background:
    linear-gradient(
      to top,
      #2e7d32,
      #66bb6a
    );

  border-radius:
    10px 10px 3px 3px;

  position: relative;

  transition:
    height 0.7s ease;
}

.revenue-bar.secondary {
  background:
    linear-gradient(
      to top,
      #00897b,
      #4db6ac
    );
}

.revenue-bar span {
  position: absolute;

  top: -25px;
  left: 50%;

  transform: translateX(-50%);

  white-space: nowrap;

  font-size: 11px;
  color: #666;
  font-weight: 600;
}

.bar-label {
  font-size: 11px;
  color: #777;

  margin-top: 10px;
  text-align: center;
}


/* Revenue breakdown */

.revenue-breakdown {
  border-left: 1px solid #eeeeee;
  padding-left: 25px;
}

.breakdown-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 0;

  border-bottom:
    1px solid #f1f1f1;

  color: #666;

  font-size: 13px;
}

.breakdown-row:last-child {
  border-bottom: none;
}

.breakdown-row > div {
  display: flex;
  align-items: center;
  gap: 9px;
}

.breakdown-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.revenue-dot {
  background: #2e7d32;
}

.average-dot {
  background: #00897b;
}

.bookings-dot {
  background: #3949ab;
}


/* =========================================
   Metric cards
========================================= */

.metric-card {
  height: 100%;
}

.metric-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  color: #555;

  font-weight: 600;
}

.metric-big {
  font-size: 34px;
  font-weight: 800;

  color: #263238;

  margin-top: 18px;
}

.cancelled-text {
  color: #d32f2f;
}

.metric-description {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.average-indicator {
  display: inline-flex;

  align-items: center;
  gap: 5px;

  margin-top: 15px;

  padding:
    6px 10px;

  border-radius: 20px;

  background: #e0f2f1;
  color: #00796b;

  font-size: 11px;
}


/* =========================================
   Insights
========================================= */

.insights-grid {
  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 15px;
}

.insight-item {
  display: flex;
  align-items: flex-start;

  gap: 14px;

  padding: 18px;

  border-radius: 12px;

  background: #f8faf8;
}

.insight-icon {
  width: 44px;
  height: 44px;

  flex-shrink: 0;

  border-radius: 11px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.green-insight {
  background: #e8f5e9;
  color: #2e7d32;
}

.blue-insight {
  background: #e3f2fd;
  color: #1976d2;
}

.orange-insight {
  background: #fff3e0;
  color: #ef6c00;
}

.red-insight {
  background: #ffebee;
  color: #d32f2f;
}

.insight-title {
  font-weight: 700;
  color: #37474f;

  margin-bottom: 4px;
}

.insight-text {
  color: #777;

  font-size: 13px;
  line-height: 1.5;
}


/* =========================================
   Responsive
========================================= */

@media (max-width: 900px) {

  .status-chart-area {
    gap: 25px;
  }

  .revenue-dashboard {
    grid-template-columns: 1fr;
  }

  .revenue-breakdown {
    border-left: none;
    border-top: 1px solid #eeeeee;

    padding-left: 0;
    padding-top: 15px;
  }

}


@media (max-width: 700px) {

  .analytics-page {
    padding: 16px !important;
  }

  .status-chart-area {
    flex-direction: column;
    gap: 25px;

    padding-bottom: 10px;
  }

  .donut-chart {
    width: 160px;
    height: 160px;
  }

  .donut-chart::before {
    width: 105px;
    height: 105px;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .revenue-number {
    font-size: 32px;
  }

  .revenue-bars {
    gap: 35px;
  }

}

</style>