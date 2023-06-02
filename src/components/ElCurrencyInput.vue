<template>
  <ElInput
    ref="input"
    v-currency="options"
    :value="formattedValue"
    @input="handleInput"
  />
</template>

<script>
import { setValue, getValue } from "vue-currency-input";

export default {
  name: "ElCurrencyInput",
  props: {
    value: {
      type: Number,
      default: null,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formattedValue: null,
    };
  },
  watch: {
    value: "setValue",
  },
  mounted() {
    this.setValue(this.value);
  },
  methods: {
    handleInput(value) {
      this.$emit("input", getValue(this.$refs.input));
      this.formattedValue = value;
    },
    setValue(value) {
      setValue(this.$refs.input, value);
    },
  },
};
</script>
