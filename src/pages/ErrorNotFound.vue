<template>
  <div class="fullscreen error-page text-white text-center q-pa-md flex flex-center">
    <div>
      <q-icon name="explore_off" size="80px" class="q-mb-md" />

      <div class="error-code">404</div>

      <div class="text-h5 text-weight-medium q-mt-sm" style="opacity: 0.85">
        Oops. Nothing here...
      </div>

      <div class="text-body1 q-mt-sm" style="opacity: 0.7; max-width: 420px; margin: 0 auto;">
        The page you're looking for doesn't exist or may have been moved.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        to="/"
        label="Go Home"
        icon="home"
        no-caps
        rounded
        size="lg"
      />
    </div>
  </div>
</template>

<style scoped>
.error-page {
  background: linear-gradient(135deg, #1b5e20, #2e7d32 50%, #43a047);
}

.error-code {
  font-size: 22vh;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -4px;
}
</style>