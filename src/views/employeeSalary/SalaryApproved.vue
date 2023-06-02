<template>
  <div class="content">
    <div style="margin-top: 5px">
      <div
        style="margin-bottom: 20px; position: relative; z-index: 1; display: inline-block"
      >
        <el-date-picker
          style="width: 130px"
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
          style="width: 150px"
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
          style="width: 200px"
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
      <div style="float: right; display: flex">
        <div>
          <el-button
            style="border-radius: 0; margin-right: 5px"
            type="success"
            @click="searchByProperties()"
          >
            Cập nhật dữ liệu
          </el-button>
        </div>
        <div
          v-if="
            checkPermission(['salary_approved_approved']) ||
            checkPermission(['salary_approved_locked']) ||
            checkPermission(['salary_approved_useNumber'])
          "
        >
          <el-button
            style="border-radius: 0"
            type="success"
            @click="approvedRapidMethod()"
          >
            Cập nhật nhanh
          </el-button>
        </div>
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
        :data="responseList"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
        border
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="fullName" min-width="150" label="Tên nhân viên">
          <template slot-scope="scope">
            <el-span>{{ scope.row.fullName }}</el-span>
          </template>
        </el-table-column>
        <el-table-column label="Số điện thoại" min-width="100" align="center">
          <template slot-scope="scope">
            <el-span>{{ scope.row.phone }}</el-span>
          </template>
        </el-table-column>
        <el-table-column align="right" min-width="115" label="Còn lại thu">
          <template slot-scope="scope">
            <span class="high-light">{{
              scope.row.totalMoneyRemainIn | formatCurrencyNew
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" min-width="115" label="Còn lại chi">
          <template slot-scope="scope">
            <span class="high-light">{{
              scope.row.totalMoneyRemainOut | formatCurrencyNew
            }}</span>
          </template></el-table-column
        >
        <el-table-column label="Dự toán chi" min-width="115" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyTotalOut | formatCurrencyNew }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Dự toán thu" min-width="115" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.moneyTotalIn | formatCurrencyNew }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Đã duyệt"
          prop="numberApproved"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column label="Đã khóa" prop="numberLocked" width="80" align="center">
        </el-table-column>
        <el-table-column label="Tác vụ" width="160" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.fnEmployeeSalaryList.length > 0">
              <el-button
                size="mini"
                type="primary"
                @click="detialApprovedKidsMethod(scope.row)"
                >Mở rộng</el-button
              >
              <el-button
                v-if="scope.row.expandRow"
                size="mini"
                type="success"
                @click="toogleExpandDetailDate(scope.row)"
                ><i class="el-icon-remove-outline"></i
              ></el-button>
              <el-button
                v-else
                type="success"
                size="mini"
                @click="toogleExpandDetailDate(scope.row)"
                ><i class="el-icon-circle-plus"></i
              ></el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column type="expand" width="1">
          <template slot-scope="scope">
            <el-table
              class="tab_child"
              ref="kidsPackageForKidsRef"
              :data="scope.row.fnEmployeeSalaryList"
              highlight-current-row
              :cell-style="tableRowStyleChildren"
              :max-height="$tableMaxHeightMini"
              :header-cell-style="tableHeaderChidrenColor"
              border
            >
              <el-table-column
                fixed="left"
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column fixed="left" label="Tên khoản" min-width="150">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column fixed label="Trạng thái" align="center" width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.paid == 0">Chưa thanh toán</span>
                  <span v-else-if="scope.row.paid < scope.row.money">Thiếu</span>
                  <span v-else>Đủ</span>
                </template></el-table-column
              >
              <el-table-column
                label="Loại"
                prop="fnEmployeeSalary.category"
                width="80"
                align="center"
              >
                <template slot-scope="scope">
                  <p v-if="scope.row.category == 'out'">Chi</p>
                  <p v-else>Thu</p>
                </template>
              </el-table-column>
              <el-table-column label="Đơn vị" width="90" align="center">
                <template slot-scope="scope">
                  {{ scope.row.unit }}
                </template>
              </el-table-column>
              <el-table-column label="Đơn giá" width="120" align="right">
                <template slot-scope="scope">
                  <span>{{ scope.row.price | formatCurrencyNew }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="Số lượng"
                prop="fnEmployeeSalary.number"
                min-width="80"
              >
                <template slot-scope="scope">
                  {{ scope.row.number }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="Giảm giá" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">Có</span>
                  <span v-else>Không</span>
                </template>
              </el-table-column>
              <el-table-column align="right" label="Đơn giá sau giảm" width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">
                    <span> {{ scope.row.discountPrice | formatCurrencyNew }}</span>
                  </span>
                  <span v-else>
                    <span>{{ scope.row.price | formatCurrencyNew }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Điểm danh" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.attendance">Có</span>
                  <span v-else>Không</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="Số dự toán" width="90">
                <template slot-scope="scope">
                  <span>{{ scope.row.calculateNumber | formatNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Tiền dự toán" align="right" width="110">
                <template slot-scope="scope">
                  <span>{{ scope.row.moneyTemp | formatCurrencyNew }}</span>
                </template></el-table-column
              >
              <el-table-column
                label="Số sử dụng"
                width="100"
                prop="fnEmployeeSalary.userNumber"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.approved ||
                      scope.row.locked ||
                      !checkPermission(['salary_approved_useNumber'])
                    "
                    >{{ scope.row.userNumber }}</span
                  >
                  <el-input
                    type="number"
                    size="small"
                    style="width: 70px"
                    v-else
                    v-model="scope.row.userNumber"
                    :min="0"
                    :max="10000"
                    :precision="2"
                    :step="0.1"
                  >
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column label="Số tiền phải trả" min-width="120" align="right">
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">
                    <span>{{
                      ((scope.row.userNumber * scope.row.discountPrice) /
                        scope.row.number)
                        | formatCurrencyNew
                    }}</span>
                  </span>
                  <span v-else>
                    <span>{{
                      ((scope.row.userNumber * scope.row.price) / scope.row.number)
                        | formatCurrencyNew
                    }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Số tiền đã trả" min-width="120" align="right">
                <template slot-scope="scope">
                  <span>{{ scope.row.paid | formatCurrencyNew }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Mô tả" min-width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.description }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="Duyệt" width="65" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    :disabled="
                      scope.row.showNumber == 0 ||
                      scope.row.price == 0 ||
                      scope.row.userNumber != scope.row.showNumber ||
                      scope.row.locked ||
                      scope.row.paid > 0 ||
                      !checkPermission(['salary_approved_approved'])
                    "
                    v-model="scope.row.approved"
                    @change="handleApprove(scope.row)"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="Khóa" width="65" align="center">
                <el-checkbox
                  :disabled="!checkPermission(['salary_approved_locked'])"
                  slot-scope="scope"
                  v-model="scope.row.locked"
                  @change="handleLocked(scope.row)"
                ></el-checkbox>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="Tác vụ"
                min-width="170"
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.approved ||
                      scope.row.locked ||
                      !checkPermission(['salary_approved_useNumber'])
                    "
                  >
                    <span v-if="scope.row.paid > 0">Không thể sửa</span>
                    <span v-else-if="scope.row.locked">Đã khóa, có thể sửa</span>
                    <span v-else-if="scope.row.approved">Đã duyệt, có thể sửa</span>
                  </span>
                  <span v-else>
                    <el-button
                      v-if="scope.row.showNumber == scope.row.calculateNumber"
                      disabled
                      type="primary"
                      size="mini"
                      icon="el-icon-d-arrow-right"
                    >
                    </el-button>
                    <el-tooltip
                      v-else
                      effect="dark"
                      content="Sử dụng số dự toán"
                      placement="top"
                    >
                      <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-d-arrow-right"
                        @click="transferNumberOneMethod(scope.row)"
                      >
                      </el-button>
                    </el-tooltip>
                    <el-button
                      v-if="
                        scope.row.userNumber != 0 &&
                        scope.row.showNumber == scope.row.userNumber
                      "
                      disabled
                      size="mini"
                      type="success"
                      >Đã lưu</el-button
                    >
                    <el-button
                      v-else
                      size="mini"
                      type="success"
                      @click="saveUsedNumberOneMethod(scope.row)"
                      >Lưu số</el-button
                    >
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="float: right; margin: 15px 0">
      <el-button
        v-if="checkPermission(['salary_approved_useNumber'])"
        type="success"
        class="button-bottom"
        @click="transferNumberManyMethod()"
        :loading="loaddingButton1"
      >
        Sử dụng số dự toán
      </el-button>
      <el-button
        v-if="checkPermission(['salary_approved_useNumber'])"
        type="success"
        class="button-bottom"
        @click="saveUseNumberManyMethod()"
        :loading="loaddingButton2"
      >
        Lưu số
      </el-button>
      <el-dropdown
        v-if="
          checkPermission(['salary_approved_approved']) ||
          checkPermission(['salary_approved_locked'])
        "
        @command="handleCommandAction"
      >
        <el-button class="button-bottom" type="success" :loading="loadingButtonAction">
          Tác vụ
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu class="el-dropdown-menu-container">
          <el-dropdown-item
            v-if="checkPermission(['salary_approved_approved'])"
            command="approved"
            >Duyệt</el-dropdown-item
          >
          <el-dropdown-item
            v-if="checkPermission(['salary_approved_approved'])"
            command="unApproved"
            >Bỏ duyệt</el-dropdown-item
          >
          <el-dropdown-item
            v-if="checkPermission(['salary_approved_locked'])"
            command="locked"
            >Khóa</el-dropdown-item
          >
          <el-dropdown-item
            v-if="checkPermission(['salary_approved_locked'])"
            command="unLocked"
            >Bỏ khóa</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <SalaryApprovedRapid
      :dialogVisible="showApprovedRapid"
      @dialog-close="closeApprovedRapidDialog()"
      ref="SalaryApprovedRapid"
    />
    <SalaryApprovedDetailDialog
      :dialogVisible="showDetialApprovedDialog"
      @dialog-close="closeApprovedDetailDialog()"
      ref="SalaryApprovedDetailDialog"
    />
  </div>
</template>

<script>
import moment from "moment";
import checkPermission from "@/utils/permission.js";
import DepartmentDataService from "@/services/DepartmentDataService";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
import SalaryApprovedRapid from "./SalaryApprovedRapid";
import SalaryApprovedDetailDialog from "./SalaryApprovedDetailDialog";

export default {
  components: {
    SalaryApprovedRapid,
    SalaryApprovedDetailDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      loadingButton: false,
      loaddingButton1: false,
      loaddingButton2: false,
      loadingButtonAction: false,
      showApprovedRapid: false,
      showDetialApprovedDialog: false,
      departmentList: [],
      responseList: [],
      multipleSelection: [],
      dataSearch: {
        date: "",
        statusEmployeee: "Đang làm",
        idDepartment: "",
        employeeNameOrPhone: "",
      },
      statusEmployeeList: ["Đang làm", "Tạm nghỉ", "Nghỉ làm"],
    };
  },
  methods: {
    checkPermission,
    tableRowStyle({ row }) {
      if (row.expandRow) {
        return "font-weight: bold";
      }
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    tableHeaderChidrenColor() {
      return "background-color: #c0c4cc; color: #606266;";
    },
    tableRowStyleChildren({ row }) {
      if (row.paid == 0) {
        return "color: #F14950";
      } else if (row.paid < row.money) {
        return "color: #E6A23C";
      }
    },
    handleCommandAction(command) {
      this.checkBeforeSelectData();
      if (command == "approved") {
        this.handleApproveMulti("duyệt", true);
      } else if (command == "unApproved") {
        this.handleApproveMulti("hủy duyệt", false);
      } else if (command == "locked") {
        this.handleLokedMulti("khóa", true);
      } else if (command == "unLocked") {
        this.handleLokedMulti("bỏ khóa", false);
      } else if (command == "exportSaraly") {
        console.log("xuất excel");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toogleExpandDetailDate(row) {
      row.expandRow = !row.expandRow;
      let $tableDetail = this.$refs.tableDetail;
      $tableDetail.toggleRowExpansion(row);
    },
    toogleExpandDetail(row) {
      row.expandRow = !row.expandRow;
      let $tableDetail = this.$refs.tableDetail;
      $tableDetail.toggleRowExpansion(row);
    },
    checkBeforeSelectData() {
      let selectRowList = this.multipleSelection;
      if (selectRowList.length == 0) {
        this.$message({
          message: "Không có nhân sự nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    /**
     * Cập nhật nhanh
     */
    approvedRapidMethod() {
      this.checkBeforeSelectData();
      let idList = this.multipleSelection.map((x) => x.id);
      this.showApprovedRapid = true;
      this.$refs.SalaryApprovedRapid.getApprovedRapidInitial(this.dataSearch, idList);
    },
    /**
     * chi tiết phần mở rộng
     */
    detialApprovedKidsMethod(row) {
      this.showDetialApprovedDialog = true;
      this.$refs.SalaryApprovedDetailDialog.getApprovedDetailInitial(
        row.id,
        this.dataSearch.date,
        row.fullName
      );
    },
    closeApprovedRapidDialog() {
      this.showApprovedRapid = false;
      this.searchByProperties();
    },
    closeApprovedDetailDialog() {
      this.showDetialApprovedDialog = false;
      this.searchByProperties();
    },
    /**
     * duyệt nhiều khoản
     */
    handleApproveMulti(text, status) {
      let selectRowList = this.multipleSelection;
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          text +
          " cho " +
          selectRowList.length +
          " nhân viên không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        let dataInput = {
          status: status,
          employeeList: selectRowList,
        };
        this.loadingButtonAction = true;
        EmployeeSalaryService.approvedAllSalary(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButtonAction = false;
            }, 500);
          });
      });
    },
    /**
     * khóa nhiều khoản
     */
    handleLokedMulti(text, status) {
      let selectRowList = this.multipleSelection;
      this.$confirm(
        "Bạn có chắc chắn muốn " +
          text +
          " cho " +
          selectRowList.length +
          " nhân viên không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        let dataInput = {
          status: status,
          employeeList: selectRowList,
        };
        this.loadingButtonAction = true;
        EmployeeSalaryService.lockedAllSalary(dataInput)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingButtonAction = false;
            }, 500);
          });
      });
    },

    /**
     * duyệt 1 khoản
     */
    handleApprove(row) {
      EmployeeSalaryService.approvedOneSalary(row.id)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
          setTimeout(() => {
            row.approved = !row.approved;
          }, 200);
        });
    },
    /**
     * khóa 1 khoản
     */
    handleLocked(row) {
      EmployeeSalaryService.lockedOneSalary(row.id)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
          setTimeout(() => {
            row.locked = !row.locked;
          }, 200);
        });
    },
    /**
     * lưu số cho 1 nhân sự
     */
    saveUsedNumberOneMethod(row) {
      let dataInput = {
        id: row.id,
        userNumber: row.userNumber,
      };
      EmployeeSalaryService.saveNumberUser(dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          row.showNumber = row.userNumber;
          if (row.userNumber > 0) {
            row.approved = true;
          }
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
        });
    },
    /**
     * chuyển số cho 1 nhân sự
     */
    transferNumberOneMethod(row) {
      let dataInput = {
        id: row.id,
        userNumber: row.calculateNumber,
      };
      EmployeeSalaryService.saveNumberUser(dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          row.showNumber = row.calculateNumber;
          row.userNumber = row.calculateNumber;
          if (row.userNumber > 0) {
            row.approved = true;
          }
        })
        .catch((err) => {
          let messageText =
            err.response.status == 403
              ? this.$permissionDenied
              : err.response.data.message;
          this.$message({
            message: messageText,
            type: "error",
          });
        });
    },
    /**
     * chuyển đổi số lượng tính toán sang số lượng sử dụng cho nhiều nhân sự
     */
    transferNumberManyMethod() {
      this.checkBeforeSelectData();
      let selectRowList = this.multipleSelection;
      this.$confirm(
        "Bạn có chắc chắn muốn sử dụng số dự toán cho " +
          selectRowList.length +
          " nhân sự không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loaddingButton1 = true;
        EmployeeSalaryService.transferNumberEmployeeMany(selectRowList)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loaddingButton1 = false;
            }, 500);
          });
      });
    },
    /**
     * lưu số sử dụng cho nhiều nhân sự
     */
    saveUseNumberManyMethod() {
      this.checkBeforeSelectData();
      let selectRowList = this.multipleSelection;
      this.$confirm(
        "Bạn có chắc chắn lưu các số sử dụng đã nhập cho " +
          selectRowList.length +
          " nhân sự không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.loaddingButton2 = true;
        EmployeeSalaryService.usedNumberEmployeeMany(selectRowList)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          })
          .finally(() => {
            setTimeout(() => {
              this.loaddingButton2 = false;
            }, 500);
          });
      });
    },

    searchByProperties() {
      this.loadingData = true;
      this.textTable = "";
      EmployeeSalaryService.searchEmployeeSalaryInSchool(
        this.dataSearch.date,
        this.dataSearch.statusEmployeee,
        this.dataSearch.idDepartment,
        this.dataSearch.employeeNameOrPhone,
        ""
      )
        .then((resp) => {
          console.log(resp);
          this.responseList = resp.data.data;
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
          this.responseList = [];
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getDepartment() {
      DepartmentDataService.getAllCommon()
        .then((response) => {
          this.departmentList = response.data.data;
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
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
/deep/.el-table .cell {
  line-height: 15px;
}
/deep/.el-table th > .cell {
  font-size: 13px;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
/deep/.el-table td {
  padding: 8px 0;
}
/deep/.el-table th {
  padding: 12px 0;
}
/deep/.el-icon-arrow-right:before {
  content: "";
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 5px;
}
.button-left {
  margin-right: 5px;
}
.button-click {
  float: right;
  margin: 20px 0 40px 0;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: #5fb44a;
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 #0000001a;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;

  // display: inline-block;
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/deep/.el-input--small .el-input__inner {
  text-align: center;
}
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
tbody {
  color: #606266;
  font-size: 14px;
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
}
td {
  padding: 12px;
}
.table-index {
  width: 10px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 200px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
.high-light {
  color: blue;
  font-weight: bold;
}
</style>
