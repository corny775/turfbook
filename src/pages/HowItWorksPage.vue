<template>
  <q-page class="how-it-works-page q-pa-md">

    <!-- Header -->
    <div class="text-center q-mb-xl">
      <div class="text-h3 text-weight-bold text-primary">
        How TurfBook Works
      </div>

      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        Everything you need to know about booking facilities and understanding
        your final price.
      </div>
    </div>

    <!-- What is TurfBook -->
    <q-card flat bordered class="info-card q-mb-lg">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-avatar
            color="primary"
            text-color="white"
            icon="sports"
            size="48px"
            class="q-mr-md"
          />

          <div class="text-h5 text-weight-bold">
            What is TurfBook?
          </div>
        </div>

        <div class="text-body1 text-grey-8">
          TurfBook makes it easy to discover sports facilities, check
          availability, understand pricing, and book your preferred time slot.
        </div>
      </q-card-section>
    </q-card>


    <!-- Booking Process -->
    <q-card flat bordered class="info-card q-mb-lg">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-lg">
          How to Make a Booking
        </div>

        <div class="row q-col-gutter-lg">

          <div class="col-12 col-sm-6 col-md-3">
            <div class="step-card text-center">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                icon="sports_soccer"
              />

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                1. Choose a Facility
              </div>

              <div class="text-body2 text-grey-7 q-mt-sm">
                Browse the available sports facilities and select the one
                you want to book.
              </div>
            </div>
          </div>


          <div class="col-12 col-sm-6 col-md-3">
            <div class="step-card text-center">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                icon="calendar_month"
              />

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                2. Select Date & Time
              </div>

              <div class="text-body2 text-grey-7 q-mt-sm">
                Choose your preferred date and an available time slot.
              </div>
            </div>
          </div>


          <div class="col-12 col-sm-6 col-md-3">
            <div class="step-card text-center">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                icon="calculate"
              />

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                3. Check Your Price
              </div>

              <div class="text-body2 text-grey-7 q-mt-sm">
                TurfBook calculates your price using the facility's pricing
                rules.
              </div>
            </div>
          </div>


          <div class="col-12 col-sm-6 col-md-3">
            <div class="step-card text-center">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                icon="check_circle"
              />

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                4. Confirm Booking
              </div>

              <div class="text-body2 text-grey-7 q-mt-sm">
                Review the details and confirm your booking.
              </div>
            </div>
          </div>

        </div>
      </q-card-section>
    </q-card>


    <!-- Pricing -->
    <q-card flat bordered class="info-card q-mb-lg">
      <q-card-section>

        <div class="text-h5 text-weight-bold q-mb-sm">
          How Is Your Price Calculated?
        </div>

        <div class="text-body1 text-grey-7 q-mb-xl">
          Each facility can have its own pricing rules. The final amount is
          calculated based on the facility, selected time, date, discounts,
          and applicable tax.
        </div>


        <!-- Pricing Flow -->
        <div class="pricing-flow">

          <div class="price-step">
            <q-avatar
              color="primary"
              text-color="white"
              icon="payments"
            />

            <div class="text-subtitle1 text-weight-bold q-mt-sm">
              Base Rate
            </div>

            <div class="text-body2 text-grey-7">
              Starting price of the facility
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            size="32px"
            color="grey-5"
            class="flow-arrow"
          />

          <div class="price-step">
            <q-avatar
              color="orange"
              text-color="white"
              icon="trending_up"
            />

            <div class="text-subtitle1 text-weight-bold q-mt-sm">
              Peak Time
            </div>

            <div class="text-body2 text-grey-7">
              Peak pricing may increase the rate
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            size="32px"
            color="grey-5"
            class="flow-arrow"
          />

          <div class="price-step">
            <q-avatar
              color="blue"
              text-color="white"
              icon="event"
            />

            <div class="text-subtitle1 text-weight-bold q-mt-sm">
              Weekend
            </div>

            <div class="text-body2 text-grey-7">
              Weekend pricing may apply
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            size="32px"
            color="grey-5"
            class="flow-arrow"
          />

          <div class="price-step">
            <q-avatar
              color="green"
              text-color="white"
              icon="discount"
            />

            <div class="text-subtitle1 text-weight-bold q-mt-sm">
              Discount
            </div>

            <div class="text-body2 text-grey-7">
              Applicable discounts are deducted
            </div>
          </div>

          <q-icon
            name="arrow_forward"
            size="32px"
            color="grey-5"
            class="flow-arrow"
          />

          <div class="price-step">
            <q-avatar
              color="deep-purple"
              text-color="white"
              icon="receipt_long"
            />

            <div class="text-subtitle1 text-weight-bold q-mt-sm">
              Tax
            </div>

            <div class="text-body2 text-grey-7">
              Applicable tax is added
            </div>
          </div>

        </div>

      </q-card-section>
    </q-card>

<!-- Pricing Example -->
<q-card flat bordered class="info-card q-mb-lg">
  <q-card-section>

    <div class="text-h5 text-weight-bold q-mb-sm">
      Example Price Calculation
    </div>

    <div class="text-body1 text-grey-7 q-mb-md">
      Here's an example using the sample pricing rules for
      <strong>Turf 1</strong> when booking for one hour on a
      <strong>Saturday at 7:00 PM</strong>.
    </div>

    <q-list bordered separator class="rounded-borders">

      <!-- Base Rate -->
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium">
            Base Rate
          </q-item-label>
          <q-item-label caption>
            ₹800 × 1 hour
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span>₹800.00</span>
        </q-item-section>
      </q-item>


      <!-- Peak -->
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium">
            Peak Time
          </q-item-label>
          <q-item-label caption>
            1.50× multiplier · 7:00 PM falls within peak hours
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span>₹1,200.00</span>
        </q-item-section>
      </q-item>


      <!-- Weekend -->
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium">
            Weekend
          </q-item-label>
          <q-item-label caption>
            1.20× multiplier · Saturday
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span>₹1,440.00</span>
        </q-item-section>
      </q-item>


      <!-- Discount -->
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium">
            Discount
          </q-item-label>
          <q-item-label caption>
            10% discount
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span>-₹144.00</span>
        </q-item-section>
      </q-item>


      <!-- After Discount -->
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium">
            Price After Discount
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span>₹1,296.00</span>
        </q-item-section>
      </q-item>


      <!-- Tax -->
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-medium">
            Tax
          </q-item-label>
          <q-item-label caption>
            18% of ₹1,296.00
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span>+₹233.28</span>
        </q-item-section>
      </q-item>


      <!-- Final Price -->
      <q-item class="bg-grey-2">
        <q-item-section>
          <q-item-label class="text-weight-bold">
            Final Price
          </q-item-label>

          <q-item-label caption>
            After all applicable pricing rules
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <span class="text-h6 text-primary text-weight-bold">
            ₹1,529.28
          </span>
        </q-item-section>
      </q-item>

    </q-list>

    <div class="text-caption text-grey-6 q-mt-md">
      Note: Each facility can have different pricing rules. This example
      uses the sample rules configured for Turf 1.
    </div>

  </q-card-section>
</q-card>

    <!-- Booking Guidelines -->
    <q-card flat bordered class="info-card">
      <q-card-section>

        <div class="text-h5 text-weight-bold q-mb-md">
          Booking Guidelines
        </div>

        <q-list>

          <q-item>
            <q-item-section avatar>
              <q-icon name="check_circle" color="positive" />
            </q-item-section>

            <q-item-section>
              Select an available facility and time slot before confirming.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="calculate" color="primary" />
            </q-item-section>

            <q-item-section>
              Review the calculated price before confirming your booking.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="event_busy" color="negative" />
            </q-item-section>

            <q-item-section>
              A time slot that has already been booked cannot be booked again.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="history" color="primary" />
            </q-item-section>

            <q-item-section>
              Your bookings can be viewed from the My Bookings section.
            </q-item-section>
          </q-item>

        </q-list>

      </q-card-section>
    </q-card>

  </q-page>
</template>


<style scoped>
.how-it-works-page {
  max-width: 1300px;
  margin: 0 auto;
}

.info-card {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.95);
}

.step-card {
  padding: 20px 12px;
  height: 100%;
}

.pricing-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.price-step {
  text-align: center;
  width: 150px;
}

.flow-arrow {
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .flow-arrow {
    display: none;
  }

  .price-step {
    width: 180px;
  }
}
</style>