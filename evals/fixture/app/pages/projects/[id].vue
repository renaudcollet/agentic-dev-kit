<script setup lang="ts">
const route = useRoute()
const { data: project } = await useFetch(`/api/projects/${route.params.id}`)

useHead({ title: () => `${project.value?.title ?? 'Projet'} | Studio Démo` })
</script>

<template>
  <article v-if="project">
    <h1>{{ project.title }}</h1>
    <p>Année : {{ project.year }}</p>
    <!-- TODO: render the project description (HTML from the CMS) -->
  </article>
</template>
