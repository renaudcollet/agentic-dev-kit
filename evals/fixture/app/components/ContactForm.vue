<script setup lang="ts">
const form = reactive({ name: '', email: '', message: '' })
const sent = ref(false)

function submit() {
  // No validation yet.
  sent.value = true
}
</script>

<template>
  <form
    novalidate
    @submit.prevent="submit"
  >
    <div>
      <label for="contact-name">Nom</label>
      <input
        id="contact-name"
        v-model="form.name"
        type="text"
      >
    </div>
    <div>
      <label for="contact-email">E-mail</label>
      <input
        id="contact-email"
        v-model="form.email"
        type="email"
      >
    </div>
    <div>
      <label for="contact-message">Message</label>
      <textarea
        id="contact-message"
        v-model="form.message"
      />
    </div>
    <button type="submit">
      Envoyer
    </button>
    <p v-if="sent">
      Merci, votre message a bien été envoyé.
    </p>
  </form>
</template>
