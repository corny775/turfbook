<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg" style="width: 350px">

      <div class="text-h5 text-center q-mb-lg">
        TurfBook Login
      </div>

      <q-input
  outlined
  v-model="username"
  label="Username"
  class="q-mb-md"
  :rules="[
    val => !!val || 'Username is required'
  ]"
/>

      <q-input
  outlined
  v-model="password"
  type="password"
  label="Password"
  class="q-mb-md"
  :rules="[
    val => !!val || 'Password is required'
  ]"
/>

      <q-btn
  color="primary"
  label="Login"
  class="full-width"
  :loading="loading"
  @click="login"
/>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import axios from 'axios';

const router = useRouter();
const auth = useAuthStore();
const $q = useQuasar();

const username = ref('');
const password = ref('');
const loading = ref(false);

async function login() {
  if (!username.value.trim() || !password.value.trim()) {
  $q.notify({
    type: "warning",
    message: "Please enter both username and password.",
  });
  return;
}
  loading.value = true;

  try {
    const response = await api.post('/auth/login', {
      username: username.value.trim(),
      password: password.value,
    });

    auth.login(response.data);

    $q.notify({
  type: 'positive',
  message: 'Login successful!',
});

    if (response.data.role === 'admin') {
      await router.push('/admin');
    } else {
      await router.push('/facilities');
    }
  } catch (err: unknown) {
    console.error(err);
  let message = 'Invalid username or password';

  if (axios.isAxiosError(err)) {
    message = err.response?.data?.message ?? message;
  }

  $q.notify({
  type: 'negative',
  message,
});
} finally {
    loading.value = false;
  }
}
</script>