<script setup lang="ts">
const items = [
  { id: 'delais', question: 'Quels sont vos délais ?', answer: 'Comptez quatre à huit semaines selon la complexité du projet.' },
  { id: 'webar', question: 'Faut-il une application pour la WebAR ?', answer: 'Non, l\'expérience s\'ouvre directement dans le navigateur du téléphone.' },
  { id: 'maintenance', question: 'Assurez-vous la maintenance ?', answer: 'Oui, un contrat de maintenance peut être proposé après la mise en ligne.' },
]
const openId = ref<string | null>(null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <section aria-labelledby="faq-title">
    <h2 id="faq-title">
      Questions fréquentes
    </h2>
    <div
      v-for="item in items"
      :key="item.id"
      class="faq-item"
    >
      <h3>
        <button
          type="button"
          :aria-expanded="openId === item.id"
          :aria-controls="`faq-${item.id}`"
          @click="toggle(item.id)"
        >
          {{ item.question }}
        </button>
      </h3>
      <div
        v-show="openId === item.id"
        :id="`faq-${item.id}`"
        class="faq-answer"
      >
        <p>{{ item.answer }}</p>
      </div>
    </div>
  </section>
</template>
