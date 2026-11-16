<script setup lang="ts">
const { data: projects, refresh } = await useFetch('/api/projects')

async function deleteProject(id: number) {
  await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <ul class="project-list">
    <li
      v-for="project in projects"
      :key="project.id"
    >
      <NuxtLink :to="`/projects/${project.id}`">
        {{ project.title }} ({{ project.year }})
      </NuxtLink>
      <button
        type="button"
        @click="deleteProject(project.id)"
      >
        Supprimer {{ project.title }}
      </button>
    </li>
  </ul>
</template>
