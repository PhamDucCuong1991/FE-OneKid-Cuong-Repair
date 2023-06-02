<template>
  <div>
    <spinner speed="1" font-size="20" :message="$tableLoadding" />
  </div>
</template>
<script>
import Spinner from "vue-simple-spinner";
export default {
  components: {
    Spinner,
  },
};
</script>
