<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
      title="Chi tiết thông báo hệ thống"
    >
      <el-form
        label-width="140px"
        :model="fromData"
        label-position="left"
        ref="fromData"
      >
        <el-row :gutter="40">
          <el-col :span="24">
            <div style="margin-bottom: 5px; text-align: right">
              <span>{{ fromData.createdDate | formatDateTime }}</span>
            </div>
            <div class="grid-content">
              <el-form-item label="Tiêu đề" prop="title">
                <el-input v-model="fromData.title"></el-input>
              </el-form-item>
              <el-form-item label="Nội dung" prop="content">
                <el-input
                  :rows="15"
                  type="textarea"
                  v-model="fromData.content"
                ></el-input>
              </el-form-item>
              <el-form-item label="Người nhận" prop="fullName">
                <el-input v-model="fromData.fullName"></el-input
              ></el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="tab-infor-button">
        <el-button type="danger" size="medium" @click="closeDialogByButton()">
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NotificationManageService from "@/services/NotificationManageService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return { fromData: "", showDetailDialog: false };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
    },

    getDataInitial(id) {
      NotificationManageService.findByIdInternalPlus(id).then((resp) => {
        this.fromData = resp.data.data;
      });
    },
  },
};
</script>
<style></style>
<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-button--primary {
  width: 100%;
  background: #409eff;
}
/deep/.upload-demo {
  text-align: center;
  .el-upload {
    width: 100%;
  }
}
/deep/.el-avatar {
  display: inline;
  img {
    border-radius: 5px;
    width: 100%;
  }
}
/deep/.el-input.is-disabled .el-input__inner {
  text-align: center;
  color: #d13b93;
  font-weight: bold;
}
.el-select {
  display: block;
}

.tab-infor-button {
  text-align: right;
  margin-top: 20px;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.group-radio-status {
  margin: 0 50px;
  .kids-status {
    margin-bottom: 10px;
  }
}
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #67c23a;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
.table-icon-1 {
  width: 30%;
  margin-left: 15%;
  display: inline-block;
}
.table-icon-2 {
  width: 30%;
  margin-right: 15%;
  float: right;
}
</style>
