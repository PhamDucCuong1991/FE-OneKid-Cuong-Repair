<template>
  <el-dialog
    title="Gửi lời chúc mừng sinh nhật học sinh"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <!-- <div class="hr" style="margin-top: -35px">
      <hr />
    </div> -->
    <div class="table-content row-data">
      <div class="content">
        <span style="font-size: 18px">Nội dung :</span>
        <el-input
          refs:imageSelected
          type="textarea"
          :rows="4"
          maxlength="3000"
          show-word-limit
          style="margin-bottom: 20px"
          placeholder="Nhập nội dung lời chúc"
          v-model="imageSelected.sendContent"
        ></el-input>
        <!-- v-model="imageSelected.content" -->
      </div>
      <div class="reply">
        <span
          style="
            font-size: 18px;
            margin-left: 15px;
            font-family: arial;
            margin-bottom: 10px;
          "
          >Chọn thiệp đính kèm :</span
        >
        <div style="max-height: 500px; overflow: scroll">
          <vue-select-image
            class="VueSelectImage"
            :dataImages="dataImages"
            @onselectimage="onSelectImage"
            :activeClass="'--active'"
          >
          </vue-select-image>
        </div>
      </div>

      <div class="btt">
        <el-button
          type="danger"
          @click="closeDialogByButton('imageSelected')"
          icon="el-icon-circle-close"
          >Đóng</el-button
        >
        <el-button
          type="success"
          @click="submitForm('imageSelected')"
          icon="el-icon-circle-check"
          >Gửi</el-button
        >
      </div>
    </div>
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
        urlPictureLocal: "",
        sendContent: "",
        idKid: "",
        idKidList: [],
      },
      input: "",
      dataImages: [],
      dataImagesNew: [],
      pictureList: [],
      // idKid: "",
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

    onSelectImage(data) {
      console.log("Info: ", data);
      this.imageSelected.sendContent = data.sendContent;
      this.imageSelected.urlPictureLocal = data.urlPictureLocal;
      this.imageSelected.urlPicture = data.src;
      console.log("hi");
      console.log(this.imageSelected);
    },
    getAllAppSend() {
      KidsBirhtdayService.searchWish()
        .then((resp) => {
          this.dataImagesNew = resp.data.data.wishesSampleResponse;
          this.dataImagesNew.forEach((x) => {
            let abc = { src: "", sendContent: "", urlPictureLocal: "" };
            abc.src = x.urlPicture;
            abc.sendContent = x.wishesContent;
            abc.urlPictureLocal = x.urlPictureLocal;
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
      KidsBirhtdayService.createBirthdayKids(this.imageSelected)
        .then((response) => {
          this.newappsendCreated = response.data.data;
          this.$message({
            message: "Gửi lời chúc thành công",
            type: "success",
          });
          this.closeDialogByButton();
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
    //reset when click x
    closeDialog() {
      this.dataImagesNew = [];
      this.dataImages = [];
      this.$emit("dialog-close");
      setTimeout(() => {
        // this.$refs["imageSelected"].resetFields();
        this.imageSelected.sendContent = "";
        this.imageSelected.idKid = "";
        this.imageSelected.idKidList = [];
        this.idKid = "";
        this.idKidList = [];
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.dataImagesNew = [];
      this.dataImages = [];

      this.$emit("dialog-close");
      setTimeout(() => {
        // this.$refs["imageSelected"].resetFields();
        this.imageSelected.sendContent = "";
        this.imageSelected.idKid = "";
        this.imageSelected.idKidList = [];
        this.idKid = "";
        this.idKidList = [];
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["imageSelected"].resetFields();
    },
    getDetailMethodSend(id) {
      this.imageSelected.idKid = id;
      console.log(this.imageSelected);
    },
    getDetailMultiMethodSend(data) {
      this.imageSelected.idKidList = data;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-textarea__inner {
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
/deep/.vue-select-image {
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.abc {
  width: 300px;
  height: 300px;
}
.gg {
  margin-top: -18px;
}
small {
  display: block;
  color: #ddd;
  font-size: 16px;
}
.grid__row {
  *zoom: 1;
  // margin: 0 auto;
  max-width: 92.308em;
}
/deep/.vue-select-image__img {
  width: 200px;
  height: 200px;
  display: block;
  margin-right: auto;
  margin-left: auto;
}
.grid__row:before,
.grid__row:after {
  display: table;
  content: " ";
}
.grid__row:after {
  clear: both;
}
/deep/.vue-select-image__item {
  height: 200px;
  width: 200px;
  margin: 10px 20px 30px 20px;
  float: left;
  display: flex;
}
/deep/.vue-select-image__wrapper {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}

/deep/.vue-select-image__thumbnail {
  padding: 4px;
  cursor: pointer;
  width: 200px;
  height: 200px;
  border: 2px solid #ddd;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
  -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.055);

  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
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
  font-family: Arial;
}
.ion {
  &:hover {
    color: #4f8ef7;
  }
}
.label-image {
  font-size: 0.7rem;
}

pre,
code {
  text-align: left;
  max-width: 500px;
  // margin: auto;
}
table {
  // overflow: auto;
  // margin: auto;
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

// /deep/ .VueSelectImage {
//   /deep/.vue-select-image__thumbnail--active {
//     background: #50af2b;
//     &:after {
//       content: "✅";
//       position: absolute;
//       color: #50af2b;
//       margin-top: -190px;
//       margin-left: 70px;
//       font-size: 20px;
//       border-radius: 3px;
//     }
//   }
// }
/deep/.vue-select-image__thumbnail:active:after {
  content: "✅";
  position: absolute;
  color: #50af2b;
  margin-top: 90px;
  margin-left: 90px;
  font-size: 20px;
  border-radius: 3px;
}

/deep/.vue-select-image__img:active {
  position: absolute;
  border-radius: 3px;
  border: 3px;
}
/deep/.custom-style {
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
    // margin-right: auto;
    // margin-left: auto;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
}
.adswrapper {
  width: 70%;
  // margin: 0 auto;
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
/deep/.el-carousel__item[data-v-1651e955]:nth-child(2n) {
  background-color: #ffffff;
}
.VueSelectImage /deep/ .vue-select-image__thumbnail--active:after {
  content: "✅";
  position: absolute;
  color: #50af2b;
  margin-top: -190px;
  margin-left: 70px;
  font-size: 20px;
  border-radius: 3px;
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
  }
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
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>
