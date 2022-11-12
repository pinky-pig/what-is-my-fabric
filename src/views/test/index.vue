<script setup lang="ts">

</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g>
      <path
        id="path" d="M10 10 S 10 75 50 50" fill="transparent" stroke-width="0.5" stroke="#000"
        stroke-miterlimit="10"
      />
    </g>

    <circle cx="10" cy="10" r="1" stroke-width="0.2" fill="red" />
    <circle cx="50" cy="50" r="1" stroke-width="0.2" fill="red" />
    <g class="pen">
      <circle id="curve" cx="10" cy="75" r="1" stroke-width="0.2" fill="green" />

      <path id="path-curve" d="M10 75 L 50 50" stroke="green" stroke-miterlimit="1" stroke-width="0.2" />

      <circle id="cursor" cx="90" cy="25" r="1" stroke-width="0.2" fill="rebeccapurple" />

      <path id="path-cursor" d="M50 50 L 90 25" stroke="blue" stroke-miterlimit="1" stroke-width="0.2" />
    </g>

  </svg>
</template>

<style scoped>
body {
  background: #ddd;
  display: flex;
  justify-content: center;
}

svg {
  margin: 0 auto;
  width: 400px;
  background: 400px;
  border: 1px solid white;
}
</style>
