<template>
  <div class="custom-card ">
    <slot />
  </div>
</template>

<style lang="less" scoped>
.custom-card{
  @apply bg-white dark:bg-[#121212] relative w-full ;
  max-width: 80ch;
  border-radius: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid rgb(30 41 59);
  background-repeat: repeat;
}
.custom-card::after{
  position: absolute;
  z-index: -1;
  height: 100%;
  width: 100%;
  border-radius: 0.5rem;
  background-repeat: repeat;
  top: 0.6em;
  left: 0.6em;
  transition: top .25s,left .25s;
  background-image: var(--bg-border-svg);
  transition: top .25s,left .25s;
  content: "";
}

.custom-card:hover:after {
  top:0.3rem;
  left: 0.3rem;
}
</style>
