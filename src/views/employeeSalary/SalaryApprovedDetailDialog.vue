<template>
  <el-dialog
    :title="
      'Duyệt công lương nhân sự: ' +
      dataTransfer.fullName +
      ' - T' +
      this.moment(dataTransfer.date).format('MM/yyyy')
    "
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <div class="table-content row-data">
      <el-table
        class="tab_child"
        style="border-radius: 0"
        ref="kidsPackageForKidsRef1"
        :data="responseDetailDataList"
        highlight-current-row
        :cell-style="tableRowStyleChildren"
        :max-height="$tableMaxHeightMini"
        :header-cell-style="$funcCommon.tableHeaderColorFunction"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
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
        <el-table-column fixed label="Trạng thái" align="center" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.paid == 0">Chưa thanh toán</span>
            <span v-else-if="scope.row.paid < scope.row.money">Thiếu</span>
            <span v-else>Đủ</span>
          </template></el-table-column
        >
        <el-table-column
          label="Loại"
          prop="fnEmployeeSalary.category"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.category == 'out'">Chi</p>
            <p v-else-if="scope.row.category == 'in'">Thu</p>
          </template>
        </el-table-column>
        <el-table-column align="right" label="Giá tiền" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.discount">
              <span> {{ scope.row.discountPrice | formatCurrencyNew }}</span>
            </span>
            <span v-else>
              <span>{{ scope.row.price | formatCurrencyNew }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="calculateNumber"
          align="center"
          label="Số dự toán"
          min-width="90"
        ></el-table-column>
        <el-table-column
          label="Số sử dụng"
          min-width="100"
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
            >
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="Tiền phải trả" min-width="120" align="right">
          <template slot-scope="scope">
            <span v-if="scope.row.discount">
              <span>{{
                ((scope.row.userNumber * scope.row.discountPrice) / scope.row.number)
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
        <el-table-column label="Tiền đã trả" min-width="120" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.paid | formatCurrencyNew }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Duyệt" min-width="65" align="center">
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
        <el-table-column fixed="right" label="Khóa" min-width="65" align="center">
          <el-checkbox
            :disabled="!checkPermission(['salary_approved_locked'])"
            slot-scope="scope"
            v-model="scope.row.locked"
            @change="handleLocked(scope.row)"
          ></el-checkbox>
        </el-table-column>
        <el-table-column fixed="right" label="Tác vụ" width="170" align="center">
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
    </div>
    <span slot="footer">
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
      <el-button type="danger" class="button-bottom" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import checkPermission from "@/utils/permission.js";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
export default {
  props: {
    dialogVisible: null,
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
      departmentList: [],
      responseList: [],
      responseDetailDataList: [],
      multipleSelection: [],
      dataSearch: {},
      idListTransfer: [],
      dataTransfer: {
        id: "",
        date: "",
        fullName: "",
      },
    };
  },
  methods: {
    checkPermission,
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.responseList = [];
        this.responseDetailDataList = [];
        this.loadingButton = false;
      }, 300);
    },
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
    // approvedRapidMethod() {
    //   this.checkBeforeSelectData();
    //   let idList = this.multipleSelection.map((x) => x.id);
    //   this.showApprovedRapid = true;
    //   this.$refs.SalaryApprovedRapid.getApprovedRapidInitial(this.dataSearch, idList);
    // },
    closeApprovedRapidDialog() {
      this.showApprovedRapid = false;
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
          " khoản không?",
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
          employeeList: [{ fnEmployeeSalaryList: selectRowList }],
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
          employeeList: [{ fnEmployeeSalaryList: selectRowList }],
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
          this.searchByProperties();
          row.showNumber = row.userNumber;
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
        let listInput = [];
        let dataInput = {
          id: 1,
          fnEmployeeSalaryList: selectRowList,
        };
        listInput.push(dataInput);
        EmployeeSalaryService.transferNumberEmployeeMany(listInput)
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
        let listInput = [];
        let dataInput = {
          id: 1,
          fnEmployeeSalaryList: selectRowList,
        };
        listInput.push(dataInput);
        EmployeeSalaryService.usedNumberEmployeeMany(listInput)
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
      EmployeeSalaryService.searchEmployeeSalaryDetail(
        this.dataTransfer.id,
        this.dataTransfer.date
      )
        .then((resp) => {
          this.responseList = resp.data.data;
          this.responseDetailDataList = this.responseList[0].fnEmployeeSalaryList;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseList = [];
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getApprovedDetailInitial(id, date, fullName) {
      this.dataTransfer.id = id;
      this.dataTransfer.date = date;
      this.dataTransfer.fullName = fullName;
      this.searchByProperties();
    },
  },
};
</script>
<style lang="scss" scoped>
.button-bottom {
  border-radius: 4px !important;
  margin-left: 10px;
}
.high-light {
  color: blue;
  font-weight: bold;
}
</style>
