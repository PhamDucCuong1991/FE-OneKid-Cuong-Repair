<template>
  <el-dialog
    title="Thêm học sinh vào nhóm"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <div style="margin-bottom: 20px"></div>

    <el-transfer
      filterable
      filter-placeholder="Nhập thông tin học sinh"
      v-model="dataTarget"
      :titles="['Tất cả học sinh', 'Học sinh trong nhóm']"
      :button-texts="['', '']"
      :data="dataSource"
      @change="handleChange"
    >
      <template></template>
    </el-transfer>

    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton()">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import KidsGroupService from "@/services/KidsGroupService";
export default {
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      dataSource: [],
      dataTarget: [],
      studentList: [],
      dataSubmit: {
        id: Number,
        idKidsGroupList: [],
      },
      loadingButton: false,
      checkUpdateTransfer: "",
      gradeOfSchoolList: [],
      classOfGradeList: [],
      searchCodeOrname: "",
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      this.resetFormData();
    },
    closeDialogByButton() {
      this.$emit("dialog-close");
      this.resetFormData();
    },
    resetFormData() {
      setTimeout(() => {
        this.dataSource = [];
        this.dataTarget = [];
        this.studentList = [];
      }, 500);
    },
    handleChange(value, direction, movedKeys) {
      let a = value;
      console.log(a);
      console.log(value, direction, movedKeys);
    },
    submitForm() {
      this.loadingButton = true;
      this.dataSubmit.idKidsGroupList = this.dataTarget;
      KidsGroupService.updateTransferGroup(this.dataSubmit)
        .then((resp) => {
          this.checkUpdateTransfer = resp.data.data;
          this.$message({
            message: "Chuyển học sinh trong nhóm thành công",
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
            this.closeDialog();
          }, 500);
        });
    },
    /**
     * get student of group
     */
    async getGroupById(id) {
      await KidsGroupService.getById(id)
        .then((resp) => {
          this.dataTarget = resp.data.data.idKidsList;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * get all student
     */
    async getAllStudent() {
      await KidsGroupService.getAllKidsInGroup()
        .then((resp) => {
          this.studentList = resp.data.data;
        })
        .catch((err) => {
          this.studentList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    /**
     * get data source
     */
    setDataSource() {
      const dataResponse = [];
      const states = this.studentList;
      states.forEach((kid) => {
        dataResponse.push({
          label: kid.fullName + " -- " + kid.maClass.className + " -- " + kid.kidStatus,
          key: kid.id,
        });
      });
      this.dataSource = dataResponse;
    },
    /**
     * get data initial
     */
    async getDataInitial(id) {
      await Promise.all([this.getAllStudent(), this.getGroupById(id)]);
      this.setDataSource();
      this.dataSubmit.id = id;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-transfer-panel {
  width: 40%;
}
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-dialog__body {
  padding-top: 10px;
}
/deep/.el-transfer-panel__body {
  height: 300px;
}
/deep/.el-transfer-panel__list.is-filterable {
  height: 245px;
  padding-top: 0;
}
/deep/.el-transfer-panel .el-transfer-panel__header {
  background: #78a5e7;
}
/deep/.el-transfer-panel
  .el-transfer-panel__header
  .el-checkbox
  .el-checkbox__label
  span {
  color: white;
}
/deep/.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
  color: white;
}
.button-left-class {
  margin-right: 15px;
  width: 160px;
}
</style>
