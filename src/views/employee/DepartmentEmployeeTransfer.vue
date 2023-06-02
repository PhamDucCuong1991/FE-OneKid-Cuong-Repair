<template>
  <el-dialog
    title="Thêm nhân viên vào phòng ban"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-transfer
      filterable
      filter-placeholder="Nhập thông tin nhân viên"
      v-model="dataTarget"
      :titles="['Tất cả nhân viên', 'Nhân viên trong phòng ban']"
      :button-texts="['', '']"
      :data="dataSource"
      @change="handleChange"
    ></el-transfer>

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
import DepartmentDataService from "../../services/DepartmentDataService";
export default {
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      dataSource: [],
      dataTarget: [],
      employeeList: [],
      dataSubmit: {
        id: Number,
        idEmployeeInDepartmentList: [],
      },
      loadingButton: false,
      checkUpdateTransfer: "",
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
    },
    closeDialogByButton() {
      this.$emit("dialog-close");
    },
    handleChange(value, direction, movedKeys) {
      let a = value;
      console.log(a);
      console.log(value, direction, movedKeys);
    },
    submitForm() {
      this.loadingButton = true;
      this.dataSubmit.idEmployeeInDepartmentList = this.dataTarget;
      let a = this.dataSubmit;
      console.log(a);
      DepartmentDataService.updateTrasferEmployeeDepartment(this.dataSubmit)
        .then((resp) => {
          this.checkUpdateTransfer = resp.data.data;
          this.$message({
            message: "Chuyển nhân viên trong phòng ban thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Chuyển nhân viên trong phòng ban thất bại",
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
    getDepartmentById(id) {
      this.dataSubmit.id = id;
      DepartmentDataService.get(id)
        .then((resp) => {
          this.dataTarget = resp.data.data.idEmployeeInDepartmentList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // getAllEmployee() {
    //   DepartmentDataService.getInfoEmployeeForDepartment()
    //     .then((resp) => {
    //       this.employeeList = resp.data.data.infoEmployeeSchoolDTOList;
    //     })
    //     .catch((err) => {
    //       this.employeeList = [];
    //       console.log(err);
    //     })
    //     .finally(() => {
    //       this.setDataSource();
    //     });
    // },
    setDataSource() {
      const dataResponse = [];
      const states = this.employeeList;
      states.forEach((employee) => {
        dataResponse.push({
          label:
            // employee.id +
            // " " +
            employee.fullName + "--" + employee.phone,
          key: employee.id,
        });
      });
      this.dataSource = dataResponse;
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
