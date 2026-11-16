<template>
  <div>
    <a
      class="skip-link"
      href="#main"
    >Aller au contenu</a>
    <header>
      <nav aria-label="Navigation principale">
        <NuxtLink to="/">
          Accueil
        </NuxtLink>
        <NuxtLink to="/projects">
          Projets
        </NuxtLink>
        <NuxtLink to="/photos">
          Photos
        </NuxtLink>
        <NuxtLink to="/contact">
          Contact
        </NuxtLink>
      </nav>
    </header>
    <main id="main">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
}
</style>
