<template>
  <div>
    <br />
    <br />
    <br />
    <br />
    <div class="text">Bạn không có quyền để truy cập</div>

    <img class="picture" src="@/assets/images/forbidden.gif" />
  </div>
</template>
<script>
import CommonOnekidsService from "@/services/CommonOnekidsService";
export default {
  data() {
    return {};
  },
  methods: {
    getApiMethod() {
      CommonOnekidsService.getApiAgain()
        .then((resp) => {
          let user = JSON.parse(localStorage.getItem("user"));
          user.apiSet = resp.data.data;
          localStorage.setItem("user", JSON.stringify(user));
          this.$store.dispatch("auth/setUserActions", user);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
  beforeMount() {
    this.getApiMethod();
  },
};
</script>
<style scoped>
.text {
  font-size: 40px;
  color: red;
  font-weight: bold;
  text-align: center;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
.picture {
  display: block;
  margin: 0 auto;
  width: 700px;
  height: 550px;
}
</style>
