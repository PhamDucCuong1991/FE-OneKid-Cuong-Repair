<template>
  <el-dialog
    title="Danh sách giáo viên"
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      highlight-current-row
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      @selection-change="handleSelectionChange"
      :max-height="$tableMaxHeight"
    >
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="infoEmployeeSchool.fullName"
        label="Giáo viên"
      ></el-table-column>
      <el-table-column
        prop="infoEmployeeSchool.employeeStatus"
        label="Trạng thái"
        align="center"
      ></el-table-column>
      <el-table-column label="Chủ nhiệm" width="120" align="center">
        <template slot-scope="scope">
          <i
            v-if="scope.row.master"
            class="el-icon-circle-check"
            style="margin-left: 10px; color: #409eff"
          />
        </template>
      </el-table-column>
      <el-table-column width="300" label="Môn học">
        <template slot-scope="scope">
          <span v-for="item in scope.row.subjectSet" :key="item.id"
            >- {{ item.subjectName }}<br />
          </span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import MaClassService from "@/services/MaClassService";

export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      newGrade: {
        gradeName: "",
        gradeDescription: "",
      },
      tableData: [],
      newGradeCreated: null,
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
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.tableData = [];
      this.$emit("dialog-close");
    },
    getDetailInitial(id) {
      console.log(id);
      MaClassService.findTeacherInClass(id)
        .then((resp) => {
          this.tableData = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  }
};
</script>

<style lang="scss" scoped>
// /deep/.el-input__inner,
// /deep/.el-textarea__inner {
//   border: none;
//   border-radius: 0;
//   resize: none;
//   padding-left: 0;
//   padding-right: 0;
//   border-bottom: 1px solid #d9d9d9;
// }
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
// /deep/.el-form-item__label {
//   font-family: Arial, Helvetica, sans-serif;
// }
</style>
