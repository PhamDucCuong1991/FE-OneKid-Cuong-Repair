<template>
  <div class="content">
    <div style="margin-top: 5px">
      <div class="button-click-left" style="margin-bottom: 20px">
        <el-date-picker
          class="button-left"
          v-model="dataSearch.date"
          type="month"
          :clearable="false"
          value-format="yyyy-MM-dd"
          format="MM-yyyy"
          placeholder="Chọn tháng"
          @change="searchByProperties()"
        >
        </el-date-picker>
        <!-- trạng thái làm -->
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
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyleHead"
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
        <el-table-column label="Số khoản" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.fnEmployeeSalaryList.length }}</span>
          </template></el-table-column
        >
        <el-table-column label="Tác vụ" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.expandRow"
              size="mini"
              type="primary"
              :disabled="
                scope.row.fnEmployeeSalaryList.length == 0 ? true : false
              "
              @click="toogleExpandDetail(scope.$index, scope.row)"
              >Thu nhỏ</el-button
            >
            <el-button
              v-else
              type="primary"
              size="mini"
              :disabled="
                scope.row.fnEmployeeSalaryList.length == 0 ? true : false
              "
              @click="toogleExpandDetail(scope.$index, scope.row)"
              >Mở rộng</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handleSalaryDefault(scope.row)"
              >Thiết lập</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="expand" width="1">
          <template slot-scope="scope">
            <el-table
              class="tab_child"
              ref="kidsPackageForKidsRef1"
              :data="scope.row.fnEmployeeSalaryList"
              highlight-current-row
              :cell-style="cellStyleChild"
              :max-height="$tableMaxHeightMini"
              :header-cell-style="tableHeaderChidrenColor"
              border
            >
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
                fixed
              ></el-table-column>
              <el-table-column
                label="Tên khoản"
                prop="name"
                min-width="150"
                fixed
              >
              </el-table-column>
              <el-table-column label="Loại" width="90" align="center">
                <template slot-scope="scope" width="90">
                  <span v-if="scope.row.category == 'out'">Chi</span>
                  <span v-else-if="scope.row.category == 'in'">Thu</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Duyệt" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.approved">Đã duyệt</span>
                  <span v-else>Chưa duyệt</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Khóa" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.locked">Đã khóa</span>
                  <span v-else>Chưa khóa</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Thanh toán" width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.paid > 0">Đã thanh toán</span>
                  <span v-else>Chưa thanh toán</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                label="Mô tả"
                min-width="180"
              ></el-table-column>
              <el-table-column label="Đơn vị" width="100" align="center">
                <template slot-scope="scope">
                  {{ scope.row.unit }}
                </template>
              </el-table-column>
              <el-table-column
                prop="attendance"
                align="center"
                label="Điểm danh"
                width="90"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.attendance">Có</span>
                  <span v-else>Không</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="Số lượng"
                prop="number"
                width="90"
              >
              </el-table-column>

              <el-table-column label="Đơn giá" min-width="130" align="right">
                <template slot-scope="scope">
                  <span v-if="scope.row.price == 0">0</span>
                  <span v-else>{{ scope.row.price | formatCurrency }}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" label="Giảm giá" min-width="130">
                <template slot-scope="scope">
                  <span v-if="scope.row.discountNumber == 0">0</span>
                  <span v-else>{{
                    scope.row.discountNumber | formatCurrency
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="discount"
                align="center"
                label="Giảm giá"
                width="90"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">Có</span>
                  <span v-else>Không</span>
                </template>
              </el-table-column>
              <el-table-column label="Thành tiền" min-width="130" align="right">
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">
                    <span v-if="scope.row.discountPrice == 0">0</span>
                    <span v-else>{{
                      scope.row.discountPrice | formatCurrency
                    }}</span>
                  </span>
                  <span v-else>
                    <span v-if="scope.row.price == 0">0</span>
                    <span v-else>{{ scope.row.price | formatCurrency }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="fnSalaryGroup.name"
                align="center"
                label="Nhóm"
                width="150"
              >
              </el-table-column>
              <el-table-column
                label="Tác vụ"
                width="100"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    :disabled="
                      !scope.row.approved &&
                      !scope.row.locked &&
                      scope.row.paid == 0
                        ? false
                        : true
                    "
                    size="mini"
                    type="success"
                    @click="edit(scope.row)"
                    >Sửa</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right; margin: 15px 0">
      <el-button
        :disabled="
          dataSearch.date < pastDate || dataSearch.date > futureDate
            ? true
            : false
        "
        class="button-bottom"
        type="success"
        :loading="loadingButtonFromDefault"
        @click="generateEmployeeSalaryFromDefaultMethod()"
      >
        Tạo áp dụng từ mặc định
      </el-button>
      <el-button
        :disabled="
          dataSearch.date < pastDate || dataSearch.date > futureDate
            ? true
            : false
        "
        class="button-bottom"
        type="success"
        :loading="loadingButton"
        @click="generateEmployeeSalaryFromSchoolMethod()"
      >
        Tạo áp dụng từ mẫu trường
      </el-button>
      <el-button
        class="button-bottom"
        type="success"
        :loading="loadingButton"
        @click="generateEmployeeSalaryDefaultMethod()"
      >
        Tạo mặc định từ mẫu trường
      </el-button>
    </div>
    <EmployeeSalaryDefault
      v-bind:nameEmployee="nameEmployee"
      :dialogVisible="showSalaryDefaultDialog"
      @dialog-close="dialogCloseSalaryDefault()"
      ref="EmployeeSalaryDefault"
    />
    <!-- v-bind:idSalaryDefault="idSalaryDefault" -->
    <SalaryApplyUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="SalaryApplyUpdate"
    />
    <SalarySampleDefaultBriefDialog
      :dialogVisible="showSalarySampleDefaultBrief"
      @dialog-close="closeSalrySampleDefaultDialog()"
      ref="SalarySampleDefaultBriefDialog"
    />
    <SalarySampleBriefDialog
      :dialogVisible="showSalarySampleBrief"
      @dialog-close="closeSalrySampleDialog()"
      ref="SalarySampleBriefDialog"
    />
  </div>
</template>

<script>
// import http from "../../http-download";
import moment from "moment";
import DepartmentDataService from "../../services/DepartmentDataService";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
import EmployeeSalaryDefault from "./EmployeeSalaryDefault.vue";
import SalaryApplyUpdate from "./SalaryApplyUpdate.vue";
import SalarySampleDefaultBriefDialog from "./SalarySampleDefaultBriefDialog.vue";
import SalarySampleBriefDialog from "./SalarySampleBriefDialog.vue";

export default {
  components: {
    EmployeeSalaryDefault,
    SalaryApplyUpdate,
    SalarySampleDefaultBriefDialog,
    SalarySampleBriefDialog,
  },
  data() {
    return {
      nameEmployee: "",
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,
      loadingButtonFromDefault: false,
      loadingButton: false,
      loadingButtonSchool: false,
      departmentList: [],
      employeeSalaryApplyList: [],
      multipleSelection: [],
      dataSearch: {
        date: "",
        loginStatus: "",
        statusEmployeee: "Đang làm",
        idDepartment: "",
        employeeNameOrPhone: "",
      },
      statusEmployeeList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
      showSalaryDefaultDialog: false,
      showUpdateDialog: false,
      showSalarySampleDefaultBrief: false,
      showSalarySampleBrief: false,
      pastDate: moment(new Date()).add(-2, "M").format("YYYY-MM-DD"),
      futureDate: moment(new Date()).add(1, "M").format("YYYY-MM-DD"),
      applyMulti: {
        status: "",
        idList: [],
      },
    };
  },
  methods: {
    tableRowStyleHead({ row }) {
      if (row.expandRow) {
        return "font-weight: bold";
      }
    },
    cellStyleChild({ row }) {
      if (row.category == "in") {
        return "color: #409EFF";
      }
    },
    tableHeaderChidrenColor() {
      return "background-color: #b0d3f7;color: #606266;";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    applyFromSchool() {
      this.loadingButtonSchool = true;
      if (this.checkSelect()) {
        EmployeeSalaryService.applyFromSchool(this.applyMulti)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.loadingButtonSchool = false;
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButtonSchool = false;
              this.applyMulti.idList = [];
              this.searchByProperties();
            }, 500);
          });
      }
    },
    checkSelectRow() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "Chưa có nhân viên nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    checkSelect() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "Chưa có nhân viên nào được chọn",
          type: "error",
        });
        this.loadingButtonSchool = false;
        this.loadingButton = false;
        return false;
      } else {
        this.multipleSelection.forEach((element) => {
          this.applyMulti.idList.push(element.id);
        });
        return true;
      }
    },

    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    closeSalrySampleDefaultDialog() {
      this.showSalarySampleDefaultBrief = false;
      this.searchByProperties();
    },
    closeSalrySampleDialog() {
      this.showSalarySampleBrief = false;
      this.searchByProperties();
    },
    edit(data) {
      this.showUpdateDialog = true;
      this.$refs.SalaryApplyUpdate.getSalaryApply(data.id);
    },
    /**
     * tạo áp dụng từ mặc định nhân sự
     */
    generateEmployeeSalaryFromDefaultMethod() {
      this.checkSelectRow();
      this.loadingButtonFromDefault = true;
      let dataInputLocal = {
        date: this.dataSearch.date,
        idEmployeeList: this.multipleSelection.map((x) => x.id),
      };
      EmployeeSalaryService.generateEmployeeSalaryFromDefault(dataInputLocal)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: resp.data.data == 0 ? "warning" : "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonFromDefault = false;
          }, 500);
        });
    },
    /**
     * tạo áp dụng từ mẫu trường
     */
    generateEmployeeSalaryFromSchoolMethod() {
      this.checkSelectRow();
      this.showSalarySampleBrief = true;
      let idEmployeeList = this.multipleSelection.map((x) => x.id);
      this.$refs.SalarySampleBriefDialog.getSalarySampleInitial(
        idEmployeeList,
        this.dataSearch.date
      );
    },
    /**
     * tạo mặc định từ mẫu trường
     */
    generateEmployeeSalaryDefaultMethod() {
      this.checkSelectRow();
      this.showSalarySampleDefaultBrief = true;
      let idEmployeeList = this.multipleSelection.map((x) => x.id);
      this.$refs.SalarySampleDefaultBriefDialog.getSalarySampleDefaultInitial(
        idEmployeeList
      );
    },

    handleSalaryDefault(data) {
      this.nameEmployee = data.fullName;
      this.showSalaryDefaultDialog = true;
      this.$refs.EmployeeSalaryDefault.searchEmloyeeSalaryDefault(data.id);
    },
    dialogCloseSalaryDefault() {
      this.showSalaryDefaultDialog = false;
      this.searchByProperties();
    },

    toogleExpandDetail(index, row) {
      row.expandRow = !row.expandRow;
      let $tableDetail = this.$refs.tableDetail;
      $tableDetail.toggleRowExpansion(row);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    searchByProperties() {
      this.loadingData = true;
      this.textTable = "";
      this.dataSearch.date = moment(this.dataSearch.date).format("YYYY-MM-DD");
      EmployeeSalaryService.searchEmployeeSalarySetting(
        this.dataSearch.date,
        this.dataSearch.statusEmployeee,
        this.dataSearch.idDepartment,
        this.dataSearch.employeeNameOrPhone
      )
        .then((resp) => {
          this.employeeSalaryApplyList = resp.data.data;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
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
  /deep/.el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
    // max-height: 50px;
    text-overflow: ellipsis;
  }
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
