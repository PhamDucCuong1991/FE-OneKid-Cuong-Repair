<template>
  <div>
    <el-dialog
      :title="'Thiết lập công lương nhân viên: ' + nameEmployee"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <div>
        <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
          <!-- khoản áp dụng-->
          <el-tab-pane label="Áp dụng" name="TabSalaryApply">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              highlight-current-row
              :data="dataSalaryApply"
              :cell-style="tableRowStyle"
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChangeApply"
              :max-height="$tableMaxHeight"
              border
            >
              <el-table-column
                fixed
                type="selection"
                align="center"
                width="55"
              ></el-table-column>
              <el-table-column
                fixed
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                prop="name"
                label="Tên khoản công lương"
                min-width="200"
                ><template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template></el-table-column
              >
              <el-table-column fixed label="Loại" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.category == 'out'">Chi</span>
                  <span v-else>Thu</span>
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
              <el-table-column prop="unit" align="center" label="Đơn vị" width="100"
                ><template slot-scope="scope">
                  <span>{{ scope.row.unit }}</span>
                </template></el-table-column
              >
              <el-table-column
                prop="number"
                align="center"
                label="Số lượng"
                width="80"
              ></el-table-column>
              <el-table-column prop="price" align="right" label="Đơn giá" width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.price | formatCurrency }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="discount" align="center" label="Giảm giá" width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">Có</span>
                  <span v-else>Không</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="discountPrice"
                align="right"
                label="Đơn giá sau giảm"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">{{
                    scope.row.discountPrice | formatCurrency
                  }}</span>
                  <span v-else>{{ scope.row.price | formatCurrency }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="fnSalaryGroup.name"
                align="center"
                label="Nhóm"
                width="150"
              >
              </el-table-column>
              <el-table-column label="Tác vụ" fixed="right" width="140" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="updateDialogMethod(scope.row)"
                    >{{ $t("button.update") }}</el-button
                  >
                  <el-button
                    :disabled="
                      !scope.row.approved && !scope.row.locked && scope.row.paid == 0
                        ? false
                        : true
                    "
                    size="mini"
                    type="danger"
                    @click="deleteSalaryApplyMethod(scope.row)"
                    >{{ $t("button.delete") }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div style="float: right; margin: 15px 0">
              <el-date-picker
                v-model="localDate"
                type="month"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="MM-yyyy"
                style="width: 115px"
                placeholder="Chọn tháng"
                @change="searchSalaryApplyMethod()"
              >
              </el-date-picker>
              <el-button
                :disabled="localDate < pastDate || localDate > futureDate ? true : false"
                class="button-bottom"
                type="success"
                @click="createSalaryCustom()"
                size="medium"
                >Tạo khoản áp dụng</el-button
              >
              <el-button
                v-if="checkPermission(['statisticalFinance_groupSalary'])"
                class="button-bottom"
                type="primary"
                size="medium"
                @click="addApplyGroupMethod()"
                >Thêm áp dụng vào nhóm</el-button
              >
              <el-button
                :loading="loaddingButtonDeleteApply"
                class="button-bottom"
                size="medium"
                type="warning"
                @click="deleteSalaryApplyManyMethod()"
                >Xóa nhiều khoản</el-button
              >
              <el-button
                class="button-bottom"
                type="danger"
                @click="closeDialog()"
                size="medium"
                ><i
                  class="el-icon-circle-close"
                  style="margin-right: 10px"
                />Đóng</el-button
              >
            </div>
          </el-tab-pane>

          <!-- quản lý khoản mặc định -->
          <el-tab-pane label="Mặc định" name="TabSalaryDefault">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              highlight-current-row
              :data="dataSalaryDefaultList"
              :cell-style="tableRowStyle"
              :header-cell-style="tableHeaderColor"
              :max-height="$tableMaxHeight"
              @selection-change="handleSelectionChangeDefault"
              border
            >
              <el-table-column
                fixed
                type="selection"
                align="center"
                width="55"
              ></el-table-column>
              <el-table-column
                fixed
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                prop="name"
                label="Tên khoản công lương"
                min-width="200"
                ><template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template></el-table-column
              >
              <el-table-column prop="active" align="center" label="Áp dụng" width="70">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.active"
                    @change="activeSalaryDefaultMethod(scope.row.id)"
                  ></el-checkbox>
                </template>
              </el-table-column>

              <el-table-column fixed label="Loại" align="center" width="90">
                <template slot-scope="scope">
                  <span v-if="scope.row.category == 'out'">Chi</span>
                  <span v-else>Thu</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                label="Mô tả"
                min-width="180"
              ></el-table-column>
              <el-table-column
                prop="unit"
                align="center"
                label="Đơn vị"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="number"
                align="center"
                label="Số lượng"
                width="80"
              ></el-table-column>
              <el-table-column prop="price" align="right" label="Đơn giá" width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.price | formatCurrency }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="discount" align="center" label="Giảm giá" width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">Có</span>
                  <span v-else>Không</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="discountPrice"
                align="right"
                label="Đơn giá sau giảm"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.discount">{{
                    scope.row.discountPrice | formatCurrency
                  }}</span>
                  <span v-else>{{ scope.row.price | formatCurrency }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="fnSalaryGroup.name"
                align="center"
                label="Nhóm"
                width="150"
              >
              </el-table-column>
              <el-table-column label="Tác vụ" fixed="right" width="140" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="updateSalaryDefault(scope.row)"
                    >{{ $t("button.update") }}</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteSalaryDefaultOneMethod(scope.row)"
                    >{{ $t("button.delete") }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div style="float: right; margin: 15px 0">
              <el-button
                class="button-bottom"
                size="medium"
                type="success"
                @click="createSalaryDefault()"
                >Tạo khoản mặc định</el-button
              >
              <el-button
                v-if="checkPermission(['statisticalFinance_groupSalary'])"
                class="button-bottom"
                type="primary"
                size="medium"
                @click="addDefaultGroupMethod()"
                >Thêm mặc định vào nhóm</el-button
              >
              <el-button
                :loading="loaddingButtonDeleteDefault"
                class="button-bottom"
                size="medium"
                type="warning"
                @click="deleteSalaryDefaultManyMethod()"
                >Xóa nhiều khoản</el-button
              >
              <el-button
                class="button-bottom"
                size="medium"
                type="danger"
                @click="closeDialog()"
                ><i
                  class="el-icon-circle-close"
                  style="margin-right: 5px"
                />Đóng</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <SalaryDefaultCreate
      v-bind:idInfo="idInfo"
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod"
      ref="SalaryDefaultCreate"
    />
    <SalaryApplyCreate
      :dialogVisible="showCreateApply"
      @dialog-close="dialogCloseCreateApply"
      ref="SalaryApplyCreate"
    />
    <SalaryApplyUpdate
      :dialogVisible="showUpdateApply"
      @dialog-close="dialogCloseUpdateApply"
      ref="SalaryApplyUpdate"
    />
    <SalaryDefaultUpdate
      v-bind:idSalaryDefault="idSalaryDefault"
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod"
      ref="SalaryDefaultUpdate"
    />
    <SalaryGroupAddDialog
      :dialogVisible="showAddSalaryGroup"
      @dialog-close="closeAddSalaryGroupMethod()"
      ref="SalaryGroupAddDialog"
    />
  </div>
</template>
<script>
import checkPermission from "@/utils/permission.js";
import EmployeeSalaryService from "@/services/EmployeeSalaryService";
import SalaryDefaultCreate from "./SalaryDefaultCreate.vue";
import SalaryApplyCreate from "./SalaryApplyCreate.vue";
import SalaryApplyUpdate from "./SalaryApplyUpdate.vue";
import SalaryDefaultUpdate from "./SalaryDefaultUpdate.vue";
import SalaryGroupAddDialog from "./SalaryGroupAddDialog.vue";
import moment from "moment";

export default {
  components: {
    SalaryDefaultCreate,
    SalaryDefaultUpdate,
    SalaryApplyCreate,
    SalaryApplyUpdate,
    SalaryGroupAddDialog,
  },
  props: {
    dialogVisible: null,
    nameEmployee: null,
  },

  data() {
    return {
      loadingButton: false,
      loaddingButtonDeleteApply: false,
      loaddingButtonDeleteDefault: false,
      showCreateDialog: false,
      showCreateApply: false,
      showUpdateApply: false,
      showUpdateDialog: false,
      showAddSalaryGroup: false,
      dataSalaryUpdate: [],
      multipleSelectionDefault: [],
      multipleSelectionApply: [],
      name: "Phạm Ngọc Thắng",
      textTable: this.$tableLoadding,
      activeTabName: "TabSalaryDefault",
      dataSalaryDefaultList: [],
      dataSalaryApply: [],
      localDate: moment(new Date()).format("YYYY-MM-DD"),
      pastDate: moment(new Date()).add(-2, "M").format("YYYY-MM-DD"),
      futureDate: moment(new Date()).add(1, "M").format("YYYY-MM-DD"),
      idInfo: "",
      idSalaryDefault: "",
      dataApply: {
        idInfoEmployee: "",
        status: "",
      },
      dataCreate: {
        date: "",
        idInfo: "",
      },
    };
  },
  methods: {
    checkPermission,
    closeDialog() {
      this.$emit("dialog-close");
      this.dataSalaryApply = [];
      this.activeTabName = "TabSalaryDefault";
      setTimeout(() => {
        this.loadingButton = false;
        this.localDate = moment(new Date()).format("YYYY-MM-DD");
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    tableRowStyle({ row }) {
      if (row.category == "in") {
        return "color:#78a5e7";
      }
    },
    createSalaryCustom() {
      this.showCreateApply = true;
      this.$refs.SalaryApplyCreate.getDataApplyInitial(this.idInfo, this.localDate);
    },
    handleSelectionChangeDefault(val) {
      this.multipleSelectionDefault = val;
    },
    handleSelectionChangeApply(val) {
      this.multipleSelectionApply = val;
    },
    updateSalaryDefault(data) {
      this.showUpdateDialog = true;
      this.idSalaryDefault = data.id;
      this.$refs.SalaryDefaultUpdate.seachSalaryDefault(this.idSalaryDefault);
    },
    closeAddSalaryGroupMethod() {
      this.showAddSalaryGroup = false;
      if (this.activeTabName == "TabSalaryDefault") {
        this.searchEmloyeeSalaryDefault(this.idInfo);
      } else if (this.activeTabName == "TabSalaryApply") {
        this.searchSalaryApplyMethod();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.loadAgainSalaryDefault();
    },
    dialogCloseCreateMethod(idInfo) {
      this.showCreateDialog = false;
      this.searchEmloyeeSalaryDefault(idInfo);
    },
    dialogCloseCreateApply() {
      this.showCreateApply = false;
      this.searchSalaryApplyMethod();
    },
    dialogCloseUpdateApply() {
      this.showUpdateApply = false;
      this.searchSalaryApplyMethod();
    },
    createSalaryDefault() {
      this.showCreateDialog = true;
      this.$refs.SalaryDefaultCreate.getSalaryDefaultInitial();
    },
    addDefaultGroupMethod() {
      this.addSalaryGroupMethod(this.multipleSelectionDefault, "default");
    },
    addApplyGroupMethod() {
      this.addSalaryGroupMethod(this.multipleSelectionApply, "salary");
    },
    addSalaryGroupMethod(rowList, type) {
      let selectRowList = rowList.map((x) => x.id);
      this.checkSelectRowList(selectRowList);
      this.showAddSalaryGroup = true;
      this.$refs.SalaryGroupAddDialog.getDataInitial(selectRowList, type);
    },
    checkSelectRowList(rowList) {
      if (rowList.length == 0) {
        this.$message({
          message: "Không có khoản công lương nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    /**
     * xóa một khoản mặc định
     */
    deleteSalaryDefaultOneMethod(data) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản mặc định này?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        EmployeeSalaryService.deleteSalaryDefault(data.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.loadAgainSalaryDefault();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    /**
     * xóa nhiều khoản mặc định
     */
    deleteSalaryDefaultManyMethod() {
      let selectRowList = this.multipleSelectionDefault;
      this.checkSelectRowList(selectRowList);
      this.loaddingButtonDeleteDefault = true;
      this.$confirm(
        "Bạn có chắc chắn muốn xóa " + selectRowList.length + " khoản đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          let idList = selectRowList.map((x) => x.id);
          EmployeeSalaryService.deleteSalaryDefaultMany(idList)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              this.loadAgainSalaryDefault();
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
            })
            .finally(() => {
              setTimeout(() => {
                this.loaddingButtonDeleteDefault = false;
              }, 500);
            });
        })
        .catch(() => {
          setTimeout(() => {
            this.loaddingButtonDeleteDefault = false;
          }, 500);
        });
    },
    activeSalaryDefaultMethod(id) {
      EmployeeSalaryService.activeSalaryDefault(id)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    updateDialogMethod(data) {
      this.showUpdateApply = true;
      this.$refs.SalaryApplyUpdate.getSalaryApply(data.id);
    },
    /**
     * xóa một khoản áp dụng
     */
    deleteSalaryApplyMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản công lương này?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        EmployeeSalaryService.deleteSalaryApplyOne(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchSalaryApplyMethod();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    /**
     * xóa nhiều khoản áp dụng
     */
    deleteSalaryApplyManyMethod() {
      let selectRowList = this.multipleSelectionApply;
      this.checkSelectRowList(selectRowList);
      selectRowList = this.multipleSelectionApply.filter(
        (x) => !x.approved && !x.locked && x.paid == 0
      );
      if (selectRowList.length == 0) {
        this.$message({
          message: "Chọn khoản công lương có thể xóa được",
          type: "error",
        });
        throw null;
      }
      this.loaddingButtonDeleteApply = true;
      this.$confirm(
        "Bạn có chắc chắn muốn xóa " + selectRowList.length + " khoản?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "Có",
          closeOnClickModal: false,
          cancelButtonText: "Không",
        }
      )
        .then(() => {
          let idList = selectRowList.map((x) => x.id);
          EmployeeSalaryService.deleteSalaryApplyMany(idList)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              this.searchSalaryApplyMethod();
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
            })
            .finally(() => {
              setTimeout(() => {
                this.loaddingButtonDeleteApply = false;
              }, 500);
            });
        })
        .catch(() => {
          setTimeout(() => {
            this.loaddingButtonDeleteApply = false;
          }, 500);
        });
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "TabSalaryDefault") {
        this.searchEmloyeeSalaryDefault(this.idInfo);
      }
      if (tabNameClick == "TabSalaryApply") {
        this.searchSalaryApplyMethod();
      }
    },
    loadAgainSalaryDefault() {
      this.searchEmloyeeSalaryDefault(this.idInfo);
    },
    /**
     * get dataInitial
     */
    searchEmloyeeSalaryDefault(id) {
      this.idInfo = id;
      this.textTable = this.$tableLoadding;
      EmployeeSalaryService.searchEmloyeeSalaryDefault(id)
        .then((resp) => {
          this.dataSalaryDefaultList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.dataSalaryDefaultList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
        });
    },
    searchSalaryApplyMethod() {
      this.localDate = moment(this.localDate).format("YYYY-MM-DD");
      this.dataCreate.date = this.localDate;
      this.dataCreate.idInfo = this.idInfo;
      EmployeeSalaryService.searchSalaryApply(this.idInfo, this.localDate)
        .then((resp) => {
          this.dataSalaryApply = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.dataSalaryApply.length == 0) {
            this.textTable = this.$tableEmpty;
          }
        });
    },
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
// /deep/.el-tabs__nav-scroll {
//   float: right;
// }
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
.input-common {
  margin-right: 5px;
}
.button-bottom {
  margin-left: 10px;
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
// .table-header {
//   position: sticky;
// }
// table{

// }
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
  // display: block;
  // width: 90%;
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
</style>
