<script setup>
import {ref} from 'vue';
import backend from '../config/backend.js'
import axios from 'axios'
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Message from "primevue/message";
import {useUserStore} from "@/store/user.js";
import router from "../router/router.js";

const loading = ref(true);
const buttonLoading = ref(false);
const errorMessage = ref(false);

const username = ref();
const password = ref();

setTimeout(() => {
  loading.value = false;
}, 0.5 * 1000, 1);


function loginButtonClickHandler() {
  buttonLoading.value = true;

  axios.post(backend.url + '/login', {
    'username': username.value,
    'password': password.value,
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((res) => {
    const data = res.data;

    if (data.token)
    {
      const userStore = useUserStore();

      userStore.setToken(data.token);
      userStore.setLoggedIn(true);
      userStore.setRole(data.role);
      userStore.setUserId(data.userId);

      loading.value = true;

      router.push({name: 'admin'});
    } else {
      errorMessage.value = data.error;
      buttonLoading.value = false;

      setTimeout(() => {
        errorMessage.value = false;
      }, 1500)
    }
  });
}
</script>

<template>
  <div class="centered">
    <Transition mode="out-in">
      <div v-if="loading">
        <ProgressSpinner></ProgressSpinner>
      </div>

      <div v-else-if="!loading" class="formContainer">
        <Transition class="inputContainer" mode="out-in">
          <div v-if="errorMessage">
            <Message severity="error">{{errorMessage}}</Message>
          </div>
        </Transition>
        <div class="inputContainer">
          <IconField>
            <InputIcon class="pi pi-user"/>
            <InputText v-model="username" placeholder="Username"/>
          </IconField>
        </div>

        <div class="inputContainer">
          <IconField>
            <InputIcon class="pi pi-lock"/>
            <InputText type="password" v-model="password" placeholder="Password"/>
          </IconField>
        </div>

        <Button class="inputContainer" label="Login" :loading="buttonLoading" @click="loginButtonClickHandler"></Button>
      </div>
    </Transition>
  </div>
</template>
