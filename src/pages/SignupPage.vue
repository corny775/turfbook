<template>
  <q-page class="flex flex-center signup-page">
    <q-card class="signup-card q-pa-md">

      <div class="column items-center q-mb-md">
        <q-avatar size="32px" class="q-mr-sm">
  <img
    src="/fslogo1.png"
    alt="FirstSteps"
  />
</q-avatar>

        <div class="text-h5 text-weight-bold">Create Account</div>
        <div class="text-body2 text-grey-7">
          Join FirstSteps
        </div>
      </div>

      <q-form @submit.prevent="signup">

        <q-input
          outlined
          v-model="username"
          label="Username"
          class="q-mb-sm"
          :rules="[
            val => !!val || 'Username is required'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <q-select
  outlined
  v-model="accountType"
  label="Account Type"
  :options="[
    {
      label: 'Customer',
      value: 'customer'
    },
    {
      label: 'Administrator',
      value: 'admin'
    }
  ]"
  emit-value
  map-options
  class="q-mb-sm"
>
  <template v-slot:prepend>
    <q-icon name="person_outline" />
  </template>
</q-select>

<q-select
  v-if="accountType === 'admin'"
  outlined
  v-model="categoryId"
  :options="categories"
  option-label="name"
  option-value="id"
  emit-value
  map-options
  label="Admin Category"
  class="q-mb-sm"
  :rules="[
    val =>
      accountType !== 'admin' ||
      !!val ||
      'Please select an admin category'
  ]"
>
  <template v-slot:prepend>
    <q-icon name="category" />
  </template>
</q-select>

        <q-input
          outlined
          v-model="email"
          type="email"
          label="Email"
          class="q-mb-sm"
          :rules="[
            val => !!val || 'Email is required',
            val =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
              'Enter a valid email'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="contactNumber"
          label="Contact Number"
          class="q-mb-sm"
          :rules="[
            val => !!val || 'Contact number is required'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          class="q-mb-sm"
          :rules="[
            val => !!val || 'Password is required',
            val =>
              val.length >= 6 ||
              'Password must be at least 6 characters'
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

        <q-input
          outlined
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          label="Confirm Password"
          class="q-mb-sm"
          :rules="[
            val => !!val || 'Please confirm your password',
            val =>
              val === password ||
              'Passwords do not match'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>

          <template v-slot:append>
            <q-icon
              :name="
                showConfirmPassword
                  ? 'visibility_off'
                  : 'visibility'
              "
              class="cursor-pointer"
              @click="
                showConfirmPassword = !showConfirmPassword
              "
            />
          </template>
        </q-input>

        <q-input
  v-if="accountType === 'admin'"
  outlined
  v-model="adminInviteCode"
  label="Admin Invite Code"
  class="q-mb-sm"
  :rules="[
    val =>
      accountType !== 'admin' ||
      !!val ||
      'Admin invite code is required'
  ]"
>
  <template v-slot:prepend>
    <q-icon name="admin_panel_settings" />
  </template>
</q-input>

        <q-btn
          color="primary"
          label="Sign Up"
          type="submit"
          unelevated
          class="full-width q-py-sm q-mt-sm"
          :loading="loading"
        />

      </q-form>

      <div class="text-center q-mt-lg">
        Already have an account?
        <router-link
          to="/login"
          class="text-primary text-weight-bold"
        >
          Login
        </router-link>
      </div>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';
import axios from 'axios';

const router = useRouter();
const auth = useAuthStore();
const $q = useQuasar();

const username = ref('');
const email = ref('');
const contactNumber = ref('');
const password = ref('');
const confirmPassword = ref('');

const accountType = ref('customer');
const categoryId = ref<number | null>(null);
const adminInviteCode = ref('');

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

const categories = ref<
  {
    id: number;
    name: string;
    description: string;
    icon: string;
  }[]
>([]);

async function loadCategories() {
  try {
    const response = await api.get('/categories');

    categories.value = response.data;
  } catch (err) {
    console.error(err);

    $q.notify({
      type: 'negative',
      message: 'Failed to load admin categories.',
    });
  }
}

async function signup() {
  if (
    !username.value.trim() ||
    !email.value.trim() ||
    !contactNumber.value.trim() ||
    !password.value.trim() ||
    !confirmPassword.value.trim()
  ) {
    $q.notify({
      type: 'warning',
      message: 'Please fill in all required fields.',
    });

    return;
  }

  if (password.value !== confirmPassword.value) {
    $q.notify({
      type: 'warning',
      message: 'Passwords do not match.',
    });

    return;
  }

  if (accountType.value === 'admin') {
  if (!categoryId.value) {
    $q.notify({
      type: 'warning',
      message: 'Please select an admin category.',
    });

    return;
  }

  if (!adminInviteCode.value.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Please enter the admin invite code.',
    });

    return;
  }
}

  loading.value = true;

  try {
    const response = await api.post('/auth/signup', {
  username: username.value.trim(),
  email: email.value.trim(),
  contactNumber: contactNumber.value.trim(),
  password: password.value,

  adminInviteCode:
    accountType.value === 'admin'
      ? adminInviteCode.value.trim()
      : undefined,

  categoryId:
    accountType.value === 'admin'
      ? categoryId.value
      : undefined,
});

    auth.login(response.data);

    $q.notify({
      type: 'positive',
      message: 'Account created successfully!',
    });

    if (response.data.role === 'admin') {
      await router.push('/admin');
    } else {
      await router.push('/dashboard');
    }
  } catch (err: unknown) {
    console.error(err);

    let message = 'Signup failed. Please try again.';

    if (axios.isAxiosError(err)) {
      message =
        err.response?.data?.message ?? message;
    }

    $q.notify({
      type: 'negative',
      message,
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadCategories();
});
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
}

.signup-card {
  width: 420px;
  max-width: 90vw;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 32px rgba(27, 94, 32, 0.15);
}
</style>