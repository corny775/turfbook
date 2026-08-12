<template>
  <q-page class="how-it-works-page q-pa-md">

    <!-- Header -->
    <div class="text-center q-mb-xl">
      <div class="text-h3 text-weight-bold text-primary">
        How FirstSteps Works
      </div>

      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        Discover facilities, understand pricing, and make bookings
        across the different services available on campus.
      </div>
    </div>

    <!-- What is FirstSteps -->
    <q-card flat bordered class="info-card q-mb-lg">
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-avatar
            color="primary"
            text-color="white"
            icon="apps"
            size="48px"
            class="q-mr-md"
          />

          <div class="text-h5 text-weight-bold">
            What is FirstSteps?
          </div>
        </div>

        <div class="text-body1 text-grey-8">
          FirstSteps is a unified campus facility booking platform.
          Instead of managing different types of facilities separately,
          FirstSteps brings academic, sports, events, technology, dining,
          accommodation, wellness, recreation, and infrastructure services
          into one system.
        </div>
      </q-card-section>
    </q-card>

    <!-- Categories -->
    <q-card flat bordered class="info-card q-mb-lg">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-md">
          What Can You Book?
        </div>

        <div class="text-body1 text-grey-7 q-mb-lg">
          FirstSteps organizes facilities into nine categories so you can
          quickly find the type of service you need.
        </div>

        <div class="row q-col-gutter-md">

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="school" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Academic
                </q-item-label>
                <q-item-label caption>
                  Classrooms, laboratories and libraries
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="fitness_center"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Sports & Fitness
                </q-item-label>
                <q-item-label caption>
                  Sports turfs, gym and swimming pool
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="event" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Events & Conference
                </q-item-label>
                <q-item-label caption>
                  Auditoriums, conference halls and seminar halls
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="computer"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Technology & Innovation
                </q-item-label>
                <q-item-label caption>
                  Computer labs, innovation centres and maker spaces
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="restaurant"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Food & Dining
                </q-item-label>
                <q-item-label caption>
                  Cafeterias, canteens and food courts
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="hotel" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Accommodation
                </q-item-label>
                <q-item-label caption>
                  Hostels, dormitories and guest houses
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="health_and_safety"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Health & Wellness
                </q-item-label>
                <q-item-label caption>
                  Medical centres, counselling and first-aid facilities
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="palette" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Recreation & Culture
                </q-item-label>
                <q-item-label caption>
                  Student clubs, music rooms, art spaces and recreation areas
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-item bordered class="category-card rounded-borders">
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  icon="directions_bus"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">
                  Transport & Infrastructure
                </q-item-label>
                <q-item-label caption>
                  Parking, campus buses, EV charging and utilities
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

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

          <!-- Step 1 -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="step-card text-center">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                icon="category"
              />

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                1. Choose a Category
              </div>

              <div class="text-body2 text-grey-7 q-mt-sm">
                Start by selecting the category that contains the service
                or facility you need.
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="step-card text-center">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                icon="business"
              />

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                2. Choose a Facility
              </div>

              <div class="text-body2 text-grey-7 q-mt-sm">
                Browse the facilities available inside that category and
                select the one you want to use.
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="step-card text-center">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                icon="calendar_month"
              />

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                3. Select Booking Details
              </div>

              <div class="text-body2 text-grey-7 q-mt-sm">
                Select the date, time, duration, quantity, or other details
                required by the facility.
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="col-12 col-sm-6 col-md-3">
            <div class="step-card text-center">
              <q-avatar
                color="primary"
                text-color="white"
                size="56px"
                icon="check_circle"
              />

              <div class="text-subtitle1 text-weight-bold q-mt-md">
                4. Review & Confirm
              </div>

              <div class="text-body2 text-grey-7 q-mt-sm">
                Review availability and the complete pricing breakdown
                before confirming the booking.
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
          FirstSteps uses a layered pricing system. A category can define
          default pricing rules, while individual facilities can override
          those defaults when necessary.
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
              Starting rate of the selected facility
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
              icon="category"
            />

            <div class="text-subtitle1 text-weight-bold q-mt-sm">
              Category Default
            </div>

            <div class="text-body2 text-grey-7">
              Default pricing rules for the facility's category
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
              icon="tune"
            />

            <div class="text-subtitle1 text-weight-bold q-mt-sm">
              Facility Override
            </div>

            <div class="text-body2 text-grey-7">
              Facility-specific rules can replace category defaults
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
              Adjustments
            </div>

            <div class="text-body2 text-grey-7">
              Applicable peak, weekend and discount rules
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
              Final Price
            </div>

            <div class="text-body2 text-grey-7">
              Tax and all applicable pricing rules are reflected
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
          For example, suppose a facility has a base rate of
          <strong>₹300 per person</strong> and the booking is made for
          <strong>2 people</strong>.
        </div>

        <q-list bordered separator class="rounded-borders">

          <!-- Base Rate -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-medium">
                Base Price
              </q-item-label>

              <q-item-label caption>
                ₹300 × 2 people
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <span>₹600.00</span>
            </q-item-section>
          </q-item>

          <!-- Discount -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-medium">
                Discount
              </q-item-label>

              <q-item-label caption>
                Any applicable category or facility discount
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <span class="text-positive">
                Applied if applicable
              </span>
            </q-item-section>
          </q-item>

          <!-- Tax -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-medium">
                Tax
              </q-item-label>

              <q-item-label caption>
                Calculated after applicable pricing adjustments
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <span>Added if applicable</span>
            </q-item-section>
          </q-item>

          <!-- Final Price -->
          <q-item class="bg-grey-2">
            <q-item-section>
              <q-item-label class="text-weight-bold">
                Final Price
              </q-item-label>

              <q-item-label caption>
                Displayed in the booking confirmation
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <span class="text-h6 text-primary text-weight-bold">
                Calculated at booking
              </span>
            </q-item-section>
          </q-item>

        </q-list>

        <div class="text-caption text-grey-6 q-mt-md">
          The actual amount depends on the selected facility, quantity,
          booking date/time, category pricing defaults, facility overrides,
          discounts, peak or weekend rules, and applicable tax.
        </div>

      </q-card-section>
    </q-card>

    <!-- Pricing Hierarchy -->
    <q-card flat bordered class="info-card q-mb-lg">
      <q-card-section>

        <div class="text-h5 text-weight-bold q-mb-md">
          Understanding Pricing Rules
        </div>

        <q-list bordered separator class="rounded-borders">

          <q-item>
            <q-item-section avatar>
              <q-avatar
                color="primary"
                text-color="white"
                icon="category"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                Category Default
              </q-item-label>

              <q-item-label caption>
                Provides the standard pricing policy for facilities
                belonging to that category.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-avatar
                color="orange"
                text-color="white"
                icon="business"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                Facility Override
              </q-item-label>

              <q-item-label caption>
                Allows a specific facility to use its own pricing rule
                instead of the category default.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-avatar
                color="green"
                text-color="white"
                icon="calculate"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                Booking Calculation
              </q-item-label>

              <q-item-label caption>
                FirstSteps applies the applicable rules to calculate the
                amount shown before confirmation.
              </q-item-label>
            </q-item-section>
          </q-item>

        </q-list>

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
              <q-icon name="category" color="primary" />
            </q-item-section>

            <q-item-section>
              Start by selecting the appropriate category and facility.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="event_available" color="positive" />
            </q-item-section>

            <q-item-section>
              Select an available date, time, quantity, or other required
              booking information.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="calculate" color="primary" />
            </q-item-section>

            <q-item-section>
              Always review the complete pricing breakdown before confirming.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="event_busy" color="negative" />
            </q-item-section>

            <q-item-section>
              A facility cannot be booked when the requested availability
              conflicts with an existing booking.
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon name="history" color="primary" />
            </q-item-section>

            <q-item-section>
              Confirmed bookings can be viewed through the booking section
              of FirstSteps.
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

.category-card {
  height: 100%;
  padding: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
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
  width: 165px;
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