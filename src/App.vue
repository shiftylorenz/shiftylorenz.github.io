<script setup>
import 'primeicons/primeicons.css'
import { RouterView } from 'vue-router'
import './style/main.scss'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :key='$route.path' :is='Component' />
    </Transition>
  </RouterView>
</template>