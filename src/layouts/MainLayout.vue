<template>
  <q-layout view="lHh Lpr lFf">

    <!-- App-wide background (sits behind everything, see .app-background below) -->
    <div class="app-background" />

    <q-header elevated class="app-header">
      <q-toolbar>

        <q-btn
          flat
          dense
          round
          icon="menu"
          class="q-mr-sm"
          @click="drawerOpen = !drawerOpen"
        />

        <q-avatar size="32px" class="q-mr-sm">
          <q-icon name="sports_soccer" size="24px" />
        </q-avatar>

        <q-toolbar-title class="text-weight-bold">
          TurfBook
        </q-toolbar-title>

        <q-btn
          v-if="auth?.user"
          flat
          dense
          no-caps
          icon="logout"
          label="Logout"
          @click="logout"
        />

      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" side="left" bordered class="drawer">
      <q-list padding>

  <!-- CUSTOMER NAVIGATION -->
  <template v-if="auth.isCustomer">

    <q-item-label header class="text-weight-bold text-grey-8">
      Navigate
    </q-item-label>

    <q-item clickable v-ripple to="/dashboard" exact>
      <q-item-section avatar>
        <q-icon name="dashboard" />
      </q-item-section>

      <q-item-section>
        Dashboard
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple to="/facilities" exact>
      <q-item-section avatar>
        <q-icon name="domain" />
      </q-item-section>

      <q-item-section>
        Facilities
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple to="/history" exact>
      <q-item-section avatar>
        <q-icon name="history" />
      </q-item-section>

      <q-item-section>
        My Bookings
      </q-item-section>
    </q-item>

  </template>


  <!-- ADMIN NAVIGATION -->
  <template v-if="auth.isAdmin">

    <q-item-label header class="text-weight-bold text-grey-8">
      Admin
    </q-item-label>

    <q-item clickable v-ripple to="/admin" exact>
      <q-item-section avatar>
        <q-icon name="settings" />
      </q-item-section>

      <q-item-section>
        Facility Management
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple to="/admin/bookings" exact>
      <q-item-section avatar>
        <q-icon name="event_note" />
      </q-item-section>

      <q-item-section>
        Bookings Dashboard
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple to="/pricing-rules" exact>
      <q-item-section avatar>
        <q-icon name="sell" />
      </q-item-section>

      <q-item-section>
        Pricing Rules
      </q-item-section>
    </q-item>

  </template>

</q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const drawerOpen = ref(false);

function logout() {
  auth.logout?.();
  void router.push('/login');
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(120deg, #1b5e20, #2e7d32 55%, #388e3c);
}

.drawer {
  background: rgba(255, 255, 255, 0.97);
}

/*
  App-wide background.
  This is a tasteful CSS-generated "turf" backdrop (diagonal green
  gradient bands + soft vignette) so there's no white void behind
  the translucent cards on every page.

  To swap in an actual photo instead: drop your image into
  public/images/background.jpg and replace the `background:` line
  below with:

    background: url('/images/background.jpg') center / cover no-repeat fixed;

  Keep the ::after overlay (or something like it) so text and cards
  stay readable on top of a busy photo.
*/
.app-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    repeating-linear-gradient(
      135deg,
      #e8f5e9 0px,
      #e8f5e9 60px,
      #dcedc8 60px,
      #dcedc8 120px
    );
}

.app-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.5), rgba(232,245,233,0.2) 60%);
}
</style>