<template>
  <form
    action="https://www.paypal.com/cgi-bin/webscr"
    method="post"
    target="_top"
    class="donate-form"
  >
    <input type="hidden" name="cmd" value="_s-xclick" />
    <input type="hidden" name="hosted_button_id" value="7596RGJWUWZZ4" />
    <input
      type="image"
      src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
      border="0"
      name="submit"
      alt="Donate to HeatSync Labs"
      class="donate-button"
    />
    <img
      alt=""
      border="0"
      src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
      width="1"
      height="1"
    />
  </form>
</template>

<script setup lang="ts">
</script>

<style scoped>
.donate-form {
  display: inline-block;
}

.donate-button {
  cursor: pointer;
  transition: opacity var(--transition-base);
}

.donate-button:hover {
  opacity: 0.9;
}
</style>