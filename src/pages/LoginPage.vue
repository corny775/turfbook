<template>
  <q-page class="flex flex-center login-page">
    <q-card class="login-card q-pa-lg">

      <div class="column items-center q-mb-lg">
        <q-avatar size="56px" color="primary" text-color="white" class="q-mb-sm">
          <q-icon name="sports_soccer" size="30px" />
        </q-avatar>

        <div class="text-h5 text-weight-bold">TurfBook</div>
        <div class="text-body2 text-grey-7">Sign in to manage your bookings</div>
      </div>

      <q-form @submit.prevent="login">

        <q-input
          outlined
          v-model="username"
          label="Username"
          class="q-mb-md"
          autofocus
          :rules="[
            val => !!val || 'Username is required'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          class="q-mb-md"
          :rules="[
            val => !!val || 'Password is required',
            val => val.length >= 8 || 'Password must be a length of atleast 8 characters'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-btn
          color="primary"
          label="Login"
          type="submit"
          unelevated
          class="full-width q-py-sm q-mt-sm"
          :loading="loading"
        />

      </q-form>

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
const showPassword = ref(false);

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
      await router.push('/dashboard');
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

<style scoped>
.login-page {
  min-height: 100vh;
}

.login-card {
  width: 380px;
  max-width: 90vw;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 32px rgba(27, 94, 32, 0.15);
}
</style>