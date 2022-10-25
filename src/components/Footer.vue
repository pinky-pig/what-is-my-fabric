<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <nav text-xl mt-6>
    <!-- <RouterLink class="icon-btn mx-2" to="/" :title="t('button.home')">
      <div i-carbon-campsite />
    </RouterLink> -->

    <button class="icon-btn mx-2 !outline-none" @click="toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>

    <!-- <a class="icon-btn mx-2" :title="t('button.toggle_langs')" @click="toggleLocales()">
      <div i-carbon-language />
    </a> -->

    <RouterLink class="icon-btn mx-2" to="/about">
      <div i-carbon-dicom-overlay />
    </RouterLink>

    <a class="icon-btn mx-2 bg-[var(--bg-contrary)]" rel="noreferrer" href="https://pinky-pig.github.io/blog/" target="_blank" title="GitHub">
      <div i-carbon-blog />
    </a>

    <a
      class="icon-btn mx-2" rel="noreferrer" href="https://github.com/pinky-pig/icons-basic-edit.git" target="_blank"
      title="GitHub"
    >
      <div i-carbon-logo-github />
    </a>
  </nav>
</template>

