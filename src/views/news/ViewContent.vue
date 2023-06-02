<template>
  <el-dialog
    title="Thông báo hệ thống"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="2vh"
  >
    <div class="hr">
      <hr />
    </div>

    <div class="table-content row-data">
      <div class="title">
        <span style="font-size: 18px">Tiêu đề :</span>
        {{ this.viewContent.sendTitle }}
      </div>

      <div class="content">
        <span style="font-size: 18px">Nội dung :</span>
        <el-input type="textarea" v-model="this.viewContent.sendContent" :rows="10">{{
          this.viewContent.sendContent
        }}</el-input>
      </div>

      <div class="file">
        <span style="font-size: 18px">File đính kèm :</span>
        <!-- <el-upload
          class="upload-demo"
          style="margin-top: 20px"
          action
          :file-list="viewContent.urlFileAppSendList"
          :on-preview="handleFileRequest"
          limit="3"
        >
        </el-upload> -->

        <el-upload
          class="upload-demo"
          ref="upload"
          style="margin-top: 10px"
          action
          multiple
          :auto-upload="false"
          :on-change="handleChangeFile"
          :limit="5"
          :on-exceed="handleExceed"
          :file-list="viewContent.urlFileAppSendList"
          :on-preview="handleFileRequest"
        >
        </el-upload>
        <!-- <div class="hasagi" style="margin-bottom: 20px">
          <el-button type="danger" @click="closeDialog()" icon="el-icon-circle-close"
            >Đóng</el-button
          >
        </div> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
import AppSendService from "@/services/AppSendService";
import http from "../../http-download";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      viewContent: "",
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
    handleFileRequest(file) {
      let a = file;
      console.log(a);
      let extensionFile = file.name.split(".").pop();
      let label = file.name;
      let idUrlFileAppsend = file.id;
      this.downloadItem(label, extensionFile, idUrlFileAppsend);
    },
    downloadItem(label, extensionFile, idUrlFileAppsend) {
      http
        .get(`/appsend/appsendowload/${idUrlFileAppsend}`)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", label);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Thất bại",
            type: "error",
          });
        });
    },
    getDetailMethod(id) {
      AppSendService.getById2(id)
        .then((resp) => {
          let data = (this.viewContent = resp.data.data);
          this.content = data.content;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.title {
  margin-top: 10px;
  margin-bottom: 35px;
  height: 20px;
  font-family: Arial;
  font-size: 18px;
}
.hasagi {
  float: right;
  margin-top: -10px;
}
.content {
  margin-top: -30px;
  max-height: 300px;
  font-family: Arial;
  font-size: 20px;
}
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
  word-break: break-word;
}
/deep/.el-textarea__inner {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  word-break: break-word;
  color: #606266;
  font-size: 14px;
  background-color: #f0f0f0;
  background-image: none;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.file {
  margin-top: 10px;
  font-family: arial;
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
</style>
