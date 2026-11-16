<script setup lang="ts">
const email = ref('')
const status = ref<'idle' | 'success' | 'error'>('idle')

async function subscribe() {
  try {
    await $fetch('/api/newsletter', { method: 'POST', body: { email: email.value } })
    status.value = 'success'
    email.value = ''
  }
  catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section aria-labelledby="newsletter-title">
    <h2 id="newsletter-title">
      Newsletter
    </h2>
    <form @submit.prevent="subscribe">
      <label for="newsletter-email">Votre e-mail</label>
      <input
        id="newsletter-email"
        v-model="email"
        type="email"
        autocomplete="email"
      >
      <button type="submit">
        S'inscrire
      </button>
    </form>
    <p
      role="status"
      aria-live="polite"
    >
      <template v-if="status === 'success'">
        Merci, votre inscription est confirmée.
      </template>
      <template v-else-if="status === 'error'">
        Cette adresse e-mail n'est pas valide.
      </template>
    </p>
  </section>
</template>
