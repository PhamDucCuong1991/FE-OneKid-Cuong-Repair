<template>
  <div>
    <el-dialog
      :title="'Danh sách học sinh lớp: ' + dataClassName"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-table
        ref="multipleTable"
        :data="kidsList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column type="index" label="STT" width="50"></el-table-column>
        <el-table-column prop="fullName" label="Họ tên"></el-table-column>
        <el-table-column label="Tác vụ" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleCreated(scope.row)"
              >Nhận xét</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialogByButton('newGrade')">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="handleCreatedCommon()"
        >
          <i class="el-icon-circle-check" />
          <span>Nhận xét chung</span>
        </el-button>
      </span>
    </el-dialog>
    <EvaluatePeriodicCreateDialog
      :dialogVisible="showDialogCreate"
      @dialog-close="showDialogCreate = false"
      ref="EvaluatePeriodicCreateDialog"
    />
    <EvaluatePeriodicCreateCommonDialog
      :dialogVisible="showDialogCreateCommon"
      @dialog-close="closeDialogCreateCommon()"
      ref="EvaluatePeriodicCreateCommonDialog"
    />
  </div>
</template>

<script>
import EvaluateService from "@/services/EvaluateService";

import EvaluatePeriodicCreateDialog from "./EvaluatePeriodicCreateDialog";
import EvaluatePeriodicCreateCommonDialog from "./EvaluatePeriodicCreateCommonDialog";
export default {
  components: {
    EvaluatePeriodicCreateDialog,
    EvaluatePeriodicCreateCommonDialog,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      newGrade: {
        gradeName: "",
        gradeDescription: "",
      },
      kidsList: [],
      multipleSelection: [],
      dataClassName: "",
      showDialogCreate: false,
      showDialogCreateCommon: false,
      loadingButton: false,
      rules: {
        gradeName: [
          {
            required: true,
            message: "Tên khối không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["newGrade"].resetFields();
      }, 300);
    },
    //click when click button
    closeDialogByButton(fromData) {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs[fromData].resetFields();
      }, 300);
    },
    resetFormData() {
      this.$refs["newGrade"].resetFields();
    },
    handleCreated(row) {
      this.showDialogCreate = true;
      this.$refs.EvaluatePeriodicCreateDialog.getDataInitial(row);
    },
    closeDialogCreateCommon() {
      this.showDialogCreateCommon = false;
      this.getDataInitial(this.idClassData, this.dataClassName);
    },
    handleCreatedCommon() {
      let kidList = this.multipleSelection;
      if (kidList.length == 0) {
        this.$message({
          message: "Không có học sinh nào được chọn",
          type: "error",
        });
        return;
      }
      this.$refs.EvaluatePeriodicCreateCommonDialog.getDataCommonInitial(kidList);
      this.showDialogCreateCommon = true;
    },
    // submitForm(fromData) {
    //   this.$refs[fromData].validate((valid) => {
    //     if (valid) {
    //       this.loadingButton = true;
    //       EvaluateService.create(this.newGrade)
    //         .then((response) => {
    //           let data = response.data.data;
    //           console.log(data);
    //           this.$message({
    //             message: "Thêm mới khối thành công",
    //             type: "success",
    //           });

    //           setTimeout(() => {
    //             this.closeDialogByButton(fromData);
    //           }, 500);
    //         })
    //         .catch((err) => {
    //           this.$message({
    //             message: "Thêm mới khối thất bại",
    //             type: "error",
    //           });
    //           console.log(err);
    //         })
    //         .finally(() => {
    //           setTimeout(() => {
    //             this.loadingButton = false;
    //           }, 500);
    //         });
    //     } else {
    //       console.log("error validate data!");
    //       return false;
    //     }
    //   });
    // },
    getDataInitial(idClass, className) {
      this.dataClassName = className;
      this.idClassData = idClass;
      EvaluateService.searchEvaluatePeriodicKidsClass(idClass)
        .then((resp) => {
          this.kidsList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>
