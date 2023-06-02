<template>
  <el-dialog
    title="Nội dung tin nhắn"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="18vh"
  >
    <div class="hr">
      <hr />
    </div>

    <div class="table-content row-data">
      <!-- <div class="title">
        <span style="font-size: 20px; margin-bottom: 10px">Tiêu đề :</span>
        {{ this.viewContent.sendTitle }}
      </div> -->

      <div class="content">
        <!-- <span style="font-size: 20px; margin-bottom: 20px">Nội dung :</span> -->
        <el-input
          type="textarea"
          style="word-break: break-word"
          v-model="viewContent[0].sendContent"
          :rows="10"
        ></el-input>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import HistorySmsService from "@/services/HistorySmsService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      viewContent: "",
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {}, 100);
    },
    tableRowStyle({ row }) {
      if (!row.userUnread) {
        return "color: #409EFF";
      }
    },

    getDetailMethod(id) {
      HistorySmsService.getViewContent(id)
        .then((resp) => {
          let data = (this.viewContent = resp.data.data);
          this.content = data.content;
          // this.viewContent.user_unread= true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  margin-top: 20px;
  height: 20px;
}
.hasagi {
  float: right;
  margin-top: -10px;
}
.content {
  max-height: 300px;
  // font-family: Arial;
  font-size: 20px;
}
/deep/.el-dialog__body {
  padding: 30px 20px;
  font-size: 14px;
  word-break: break-word;
  min-height: 230px;
}
/deep/.el-button--danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
  margin-top: 20px !important;
}
/deep/[data-v-6400a8d2] .el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: 17px;
  // font-family: serif;
  // color: #000000;
  background-color: #f0f0f0;
  background-image: none;
  // border: 1px solid #000000;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.file {
  margin-top: 10px;
}
.hr {
  margin-top: -40px;
}
/deep/.el-dialog__title {
  line-height: 24px;
  font-size: 30px;
  color: #5d5050;
}
/deep/.el-dialog__body {
  padding: 30px 20px;
  // color: #000000;
  font-size: 14px;
  word-break: break-all;
}
/deep/[data-v-6400a8d2] [data-v-6400a8d2] .el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: 15px;
  background-color: #ffffff;
  background-image: none;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/deep/el-upload-list__item.is-success .el-upload-list__item-status-label {
  display: none;
}
/deep/.el-upload-list__item .el-icon-upload-success {
  color: #ffffff !important;
}
/deep/.el-upload-list__item .el-icon-close {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  opacity: 0.75;
  color: #ffffff;
}
/deep/.el-upload-list {
  margin: 0;
  padding: 0;
  list-style: none;
  margin-top: -25px !important;
}

/deep/.el-upload-list__item-name {
  color: #606266;
  display: block;
  margin-right: 40px;
  overflow: hidden;
  padding-left: 4px;
  text-overflow: ellipsis;
  transition: color 0.3s;
  white-space: nowrap;
  margin-bottom: 15px;
  line-height: 15px;
  margin-left: 20px;
}
/deep/.el-upload-list__item .el-icon-close-tip {
  display: none;
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0px;
  cursor: pointer;
  /* opacity: 1; */
  color: #409eff;
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #f0f0f0;
  background-image: none;
  // border: 1px solid #000000;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/deep/.title[data-v-6400a8d2] {
  margin-top: 15px;
  height: 60px;
  font-size: 18px;
}
</style>
