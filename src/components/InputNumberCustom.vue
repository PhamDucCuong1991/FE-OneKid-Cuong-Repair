<template>
  <input
    type="number"
    class="class-custom"
    :value="name"
    @input="updateSelf($event.target.value)"
  />
</template>

<script>
export default {
  model: {
    prop: "name",
    event: "input",
  },
  props: ["name"],
  methods: {
    updateSelf(name) {
      this.$emit("input", name);
    },
  },
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.class-custom {
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
input:focus {
  border: 1px solid #4aa3ff;
  outline: none;
}
</style>
