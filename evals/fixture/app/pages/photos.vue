<script setup lang="ts">
useHead({ title: 'Photos | Studio Démo' })

const { data: photos } = await useFetch('/api/photos')
// Only the first 20 photos are displayed for now.
const visiblePhotos = computed(() => photos.value?.slice(0, 20) ?? [])
</script>

<template>
  <div>
    <h1>Photos</h1>
    <ul class="grid">
      <li
        v-for="photo in visiblePhotos"
        :key="photo.id"
      >
        <img
          :src="photo.src"
          :alt="photo.alt"
          :width="photo.width"
          :height="photo.height"
        >
      </li>
    </ul>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
}
.grid img {
  width: 100%;
  height: auto;
}
</style>
