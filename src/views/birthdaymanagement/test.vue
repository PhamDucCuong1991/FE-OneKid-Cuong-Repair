<template>
  <el-dialog
    title="Gửi lời chúc mừng sinh nhật"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <!-- <div class="hr">
      <hr />
    </div> -->
    <div class="table-content row-data">
      <div class="content">
        <span style="font-size: 20px">Nội dung :</span>
        {{ imageSelected.wishesContent }}
        <el-input
          type="textarea"
          :rows="9"
          maxlength="3000"
          show-word-limit
          style="margin-bottom: 20px"
          placeholder="Nhập nội dung lời chúc"
          v-model="imageSelected.content"
        ></el-input>

        <el-input
          type="textarea"
          :rows="1"
          disabled
          style="margin-bottom: 20px"
          v-model="imageSelected.src"
        ></el-input>
      </div>
      <div class="reply">
        <span style="font-size: 20px; margin-left: 15px; margin-bottom: 10px"
          >Chọn thiệp đính kèm :</span
        >
        <vue-select-image
          :dataImages="dataImages"
          @onselectimage="onSelectImage"
          ref="single-select-image"
        ></vue-select-image>
      </div>

      <div class="btt">
        <el-button type="success" @click="submitForm()" icon="el-icon-circle-check"
          >Gửi</el-button
        >
        <el-button type="danger" @click="closeDialog()" icon="el-icon-circle-close"
          >Đóng</el-button
        >
      </div>
    </div>
    <!-- {{dataImages}} -->
  </el-dialog>
</template>

<script>
import VueSelectImage from "vue-select-image";
import KidsBirhtdayService from "@/services/KidsBirhtdayService";
export default {
  props: {
    dialogVisible: null,
  },
  components: {
    VueSelectImage,
  },
  data() {
    return {
      radio: "",
      imageSelected: {
        urlPicture: "",
        wishesContent: "",
      },
      input: "",
      dataImages: [],
      pictureList: [],
      idKid: "",
      viewContent: "",
      textarea: "",
      schoolConfirmStatus: "",
      newappsendCreated: "",
      newappsend: {},
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;f9*ont-weight: bold";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
    },
    onSelectImage(data) {
      console.log("Info: ", data);
      this.imageSelected = data;
    },
    getAllAppSend() {
      KidsBirhtdayService.searchWish()
        .then((resp) => {
          this.dataImages = resp.data.data.wishesSampleResponse;
          this.dataImages.forEach((x) => {
            let abc = { src: "", content: "" };
            abc.src = x.urlPicture;
            abc.content = x.wishesContent;
            this.dataImages.push(abc);
          });
        })
        .catch((err) => {
          this.dataImages = null;
          console.log(err);
        });
      this.showCreateDialog = false;
    },
    submitForm() {
      KidsBirhtdayService.create(this.newappsend)
        .then((response) => {
          this.newappsendCreated = response.data.data;
          this.$message({
            message: "Gửi lời chúc thành công",
            type: "success",
          });
          setTimeout(() => {
            this.closeDialogByButton();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: "Gửi lời chúc thất bại",
            type: "error",
          });
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$refs[fromData].resetFields();
      this.$emit("dialog-close");
    },
    getDetailMethodSend(id) {
      this.newappsend.idKid = id;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/[data-v-fe3ffff4] .el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: 17px;
  font-family: arial;
  background-color: #f0f0f0;
  background-image: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/.el-carousel--horizontal {
  overflow-x: hidden;
  margin-bottom: 15px;
}
.abc {
  width: 300px;
  height: 300px;
}
small {
  display: block;
  color: #ddd;
  font-size: 16px;
}
.grid__row {
  *zoom: 1;
  margin: 0 auto;
  max-width: 92.308em;
}
.grid__row:before,
.grid__row:after {
  display: table;
  content: " ";
}
.grid__row:after {
  clear: both;
}
img {
  display: block;
  // max-width: 230px;
  // max-height: 95px;
  width: 200px !important;
  height: 200px !important;
}
.vue-select-image__item {
  height: 200px;
  width: 200px;
}
.vue-select-image__wrapper {
  overflow: auto;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
}

.vue-select-image__item {
  margin: 0px 12px 12px 0px;
  float: left;
}

.vue-select-image__thumbnail {
  cursor: pointer;
  padding: 6px;
  border: 1px solid #dddddd;

  display: block;
  padding: 4px;
  line-height: 20px;
  border: 1px solid #ddd;

  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;

  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
  -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);

  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.vue-select-image__thumbnail--selected {
  background: #0088cc;
}

.vue-select-image__thumbnail--disabled {
  background: #b9b9b9;
  cursor: not-allowed;
}

.vue-select-image__thumbnail--disabled > .vue-select-image__img {
  opacity: 0.5;
  height: 200px !important;
  width: 200px !important;
}

.vue-select-image__img {
  -webkit-user-drag: none;
  display: block;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
}

.vue-select-image__lbl {
  line-height: 3;
}

@media only screen and (min-width: 1200px) {
  .vue-select-image__item {
    margin-left: 30px;
  }
}

.centered {
  text-align: center;
}
.content {
  margin: 0 20px;
}
.ion {
  &:hover {
    color: #4f8ef7;
  }
}
.label-image {
  font-size: 0.7rem;
}
.vue-select-image {
  display: flex;
  justify-content: center;
}
pre,
code {
  text-align: left;
  max-width: 500px;
  margin: auto;
}
table {
  overflow: auto;
  margin: auto;
  margin-top: 0;
  margin-bottom: 16px;
  border-spacing: 0;
  border-collapse: collapse;
  text-align: left;
  font-size: 1.2rem;
  thead {
    tr {
      background-color: #f6f8fa;
    }
  }
  tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }
  th,
  td {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }
}
.VueSelectImage {
  /deep/ .vue-select-image__thumbnail--active {
    background: #50af2b;
    &:after {
      content: "✅";
      position: absolute;
      color: #50af2b;
      margin-top: -190px;
      margin-left: 70px;
      font-size: 20px;
      border-radius: 3px;
    }
    width: 200px !important;
    height: 200px !important;
  }
}
.custom-style {
  display: flex;
  justify-content: center;
  &__wrapper {
    overflow: auto;
    list-style-image: none;
    list-style-position: outside;
    list-style-type: none;
    padding: 0px;
    margin: 0px;
  }
  &__item {
    margin: 0px 12px 12px 0px;
    float: left;
    @media only screen and (min-width: 1200px) {
      margin-left: 30px;
    }
  }
  &__thumbnail {
    padding: 6px;
    border: 1px solid #dddddd;
    display: block;
    padding: 4px;
    line-height: 20px;
    border: 1px solid #ddd;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
    -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    &--selected {
      background: #0088cc;
      .custom-style__img {
        zoom: 1.1;
      }
    }
  }
  &__img {
    -webkit-user-drag: none;
    display: block;
    max-width: 100%;
    margin-right: auto;
    margin-left: auto;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
}
.adswrapper {
  width: 70%;
  margin: 0 auto;
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
/deep/.el-carousel__item[data-v-1651e955]:nth-child(2n) {
  background-color: #ffffff;
}

/deep/.el-carousel__item--card.is-active {
  z-index: 1;
}
/deep/.el-carousel__item[data-v-1651e955]:nth-child(2n + 1) {
  background-color: #ffffff;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.btt {
  float: right;
  margin-top: -20px;
}
.vue-select-image__wrapper {
  float: right;
}
</style>
