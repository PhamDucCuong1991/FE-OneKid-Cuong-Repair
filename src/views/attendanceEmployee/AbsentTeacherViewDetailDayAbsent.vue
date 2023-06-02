<template>
  <div>
    <el-dialog
      :title="'Xin nghỉ: ' + dataRow.createdBy"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="10vh"
    >
      <div class="table-content row-data">
        <el-table
          class="table-icon-1"
          :data="dayleavelist"
          highlight-current-row
          :header-cell-style="tableHeaderColor"
          :max-height="$tableMaxHeight"
          border
        >
          <el-table-column
            type="index"
            sortable
            label="STT"
            width="70"
            align="center"
          ></el-table-column>
          <el-table-column label="Ngày nghỉ" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.date | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Buổi sáng" align="center">
            <template slot-scope="scope">
              <i
                class="el-icon-circle-check"
                v-if="scope.row.morning"
                style="margin-left: 10px; color: #409eff"
              />
            </template>
          </el-table-column>
          <el-table-column label="Buổi chiều" align="center">
            <template slot-scope="scope">
              <i
                class="el-icon-circle-check"
                v-if="scope.row.afternoon"
                style="margin-left: 10px; color: #409eff"
              />
            </template>
          </el-table-column>
          <el-table-column label="Buổi tối" align="center">
            <template slot-scope="scope">
              <i
                class="el-icon-circle-check"
                v-if="scope.row.evening"
                style="margin-left: 10px; color: #409eff"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TakeLeaveService from "@/services/AbsentTeacherService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataRow: "",
      dayleavelist: [],
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {}, 100);
    },

    getDetailMethod(data) {
      let a = (this.dataRow = data);
      console.log(a);
      TakeLeaveService.getByIdAbsentDateTeacher(data.id)
        .then((resp) => {
          this.dayleavelist = resp.data.data;
        })
        .catch((err) => {
          console.log(err.response.data.message);
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
.column {
  float: left;
  width: 50%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-dialog__body {
  padding: 15px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}

thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
td {
  padding: 10px;
}
.table-index {
  width: 30px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 150px;
  text-align: center;
}
/deep/.el-icon-close:before {
  content: "\e6db";
  color: #909399;
}
.color-text-reply {
  color: #4177e2;
}
.confirm {
  margin-top: -20px;
  margin-left: 25px;
}
.hhh {
  color: #f56c6c;
  margin-left: 100px;
  font-size: 17px;
  margin-top: -20px;
}
.timeleave {
  white-space: pre-line;
  word-break: break-all;
}
.timelea {
  border-right: 1px solid #ebeef5;
}
.ip1 {
  width: 50%;
}
/deep/[data-v-4824703a] .el-dialog__headerbtn .el-dialog__close {
  color: #9e9e9e !important;
}
/deep/.el-textarea.is-disabled .el-textarea__inner {
  background-color: #ffff;
  border-color: #e4e7ed;
  color: #b9b9b9;
  cursor: not-allowed;
}
</style>
