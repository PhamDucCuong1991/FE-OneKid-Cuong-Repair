<template>
  <div class="content">
    <div style="margin-top: 5px">
      <div class="button-click-left" style="margin: 0 10px 20px 0">
        <el-select
          class="button-left"
          v-model="dataSearch.statusEmployeee"
          @change="searchByProperties()"
          placeholder="Trạng thái"
        >
          <el-option
            v-for="item in statusEmployeeList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>

        <el-select
          class="button-left"
          v-model="dataSearch.idDepartment"
          @change="searchByProperties()"
          placeholder="Phòng ban"
          clearable
        >
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.departmentName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          style="width: 280px"
          placeholder="Nhập tên hoặc số điện thoại"
          v-model="dataSearch.employeeNameOrPhone"
          @keyup.enter.native="searchByProperties()"
          clearable
          @clear="searchByProperties()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchByProperties()"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="table-content row-data">
      <el-table
        ref="tableDetail"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="employeeSalaryApplyList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="fullName" min-width="100" label="Tên nhân viên">
          <template slot-scope="scope">
            <el-span>{{ scope.row.fullName }}</el-span>
          </template>
        </el-table-column>
        <el-table-column label="Số điện thoại" min-width="170" align="center">
          <template slot-scope="scope">
            <el-span>{{ scope.row.phone }}</el-span>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleConfigEmployee(scope.row)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right; margin: 15px 0"></div>
    <update-config-attendance-employee
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogClose()"
      ref="UpdateConfigAttendanceEmployee"
    />
  </div>
</template>

<script>
// import http from "../../http-download";
import moment from "moment";
import DepartmentDataService from "../../services/DepartmentDataService";
import AttendanceEmployeeService from "@/services/AttendanceEmployeeService";
import UpdateConfigAttendanceEmployee from "./UpdateConfigAttendanceEmployee.vue";

export default {
  components: {
    UpdateConfigAttendanceEmployee,
  },
  data() {
    return {
      nameEmployee: "",
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      loadingButton: false,
      loadingButtonSchool: false,
      departmentList: [],
      employeeSalaryApplyList: [],
      multipleSelectionDetail: [],
      dataSearch: {
        loginStatus: "",
        statusEmployeee: "Đang làm",
        idDepartment: "",
        employeeNameOrPhone: "",
      },
      statusEmployeeList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      showSalaryDefaultDialog: false,
      showUpdateDialog: false,
    };
  },
  methods: {
    tableHeaderChidrenColor() {
      return "background-color: #b0d3f7;color: #606266;";
    },
    handleCommandAction(command) {
      if (command == "nowMonth") {
        this.applyMulti.status = "nowMonth";
        this.applyFromDefault();
      } else if (command == "nextMonth") {
        this.applyMulti.status = "nextMonth";
        this.applyFromDefault();
      }
    },
    handleCommandActionSchool(command) {
      if (command == "nowMonth") {
        this.applyMulti.status = "nowMonth";
        this.applyFromSchool();
      } else if (command == "nextMonth") {
        this.applyMulti.status = "nextMonth";
        this.applyFromSchool();
      }
    },
    handleConfigEmployee(data) {
      this.showUpdateDialog = true;
      this.$refs.UpdateConfigAttendanceEmployee.getData(data);
    },
    checkSelect() {
      if (this.multipleSelectionDetail.length == 0) {
        this.$message({
          message: "Chưa có nhân viên nào được chọn",
          type: "error",
        });
        this.loadingButtonSchool = false;
        this.loadingButton = false;
        return false;
      } else {
        this.multipleSelectionDetail.forEach((element) => {
          this.applyMulti.idList.push(element.id);
        });
        return true;
      }
    },
    dialogClose() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    handleSelectionChange(val) {
      this.multipleSelectionDetail = val;
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    searchByProperties() {
      this.loadingData = true;
      this.textTable = "";
      AttendanceEmployeeService.searchConfigEmployeeAttendance(
        this.dataSearch.statusEmployeee,
        this.dataSearch.idDepartment,
        this.dataSearch.employeeNameOrPhone
      )
        .then((resp) => {
          console.log(resp);
          this.employeeSalaryApplyList = resp.data.data;
          console.log(this.employeeSalaryApplyList);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          if (this.employeeSalaryApplyList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getDepartment() {
      DepartmentDataService.getAllCommon()
        .then((response) => {
          this.departmentList = response.data.data;
          let a = this.departmentList;
          console.log(a);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMonthNow() {
      this.dataSearch.date = moment(new Date()).format("YYYY-MM-DD");
      console.log(this.dataSearch.date);
    },
  },
  beforeMount() {
    this.getMonthNow();
    this.getDepartment();
    this.searchByProperties();
  },
};
</script>

<style lang="scss" scoped>
.content {
  .row-data {
    margin-bottom: 20px;
  }

  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-left {
    margin-right: 5px;
    width: 145px;
  }
  .button-click-left {
    display: inline-block;
  }
  .button-click {
    float: right;
  }
  .table-content {
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
    .tab_child {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin: 0 0px 50px 10px;
      border: 1px solid #78a5e7;
    }
  }
  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
  /deep/.el-table th.gutter {
    background-color: #78a5e7;
  }
  // /deep/.el-table--scrollable-y .el-table__body-wrapper {
  //   overflow-y: auto;
  //   margin-top: -1px;
  // }
  // /deep/.el-table .cell {
  //   box-sizing: border-box;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: pre-line;
  //   word-break: break-all;
  //   line-height: 23px;
  //   padding-right: 10px;
  //   // max-height: 50px;
  //   text-overflow: ellipsis;
  // }
  /deep/.el-range-editor.el-input__inner {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    width: 260px;
  }
  /deep/.el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    // margin-left: 5px;
  }
  /deep/.element.style {
    width: 257px !important;
  }
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: rgb(95, 180, 74);
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
/deep/.el-icon-loading:before {
  content: "\e6cf";
}
/deep/.el-loading-spinner .el-loading-text {
  color: #606266;
  font-size: 15px;
}
/deep/.el-loading-spinner {
  top: 67%;
  width: 100%;
  text-align: center;
  position: absolute;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.click-in-row {
  border: none;
  padding: 0;
  color: #3a3ace;
}
.click-in-row:hover {
  color: #fa03d9;
  // background: none;
}
.handle-account {
  border: none;
  padding: 0;
  color: red;
}
.handle-account:hover {
  color: #fa03d9;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
h4.edit {
  color: red;
  position: absolute;
  bottom: -12px;
  right: 18px;
}
/deep/.el-table th > .cell {
  text-align: center !important;
}
/deep/.el-icon-arrow-right:before {
  content: "";
}
</style>
