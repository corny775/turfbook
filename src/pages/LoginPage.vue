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
      />

      <q-input
        outlined
        v-model="password"
        type="password"
        label="Password"
        class="q-mb-md"
      />

      <q-btn
        color="primary"
        label="Login"
        class="full-width"
        @click="login"
      />

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');

async function login() {
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value,
    });

    auth.login(response.data);

    if (response.data.role === 'admin') {
      await router.push('/admin');
    } else {
      await router.push('/facilities');
    }
  } catch {
    alert('Invalid username or password');
  }
}
</script>