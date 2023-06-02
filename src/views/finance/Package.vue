<template>
  <div>
    <div style="margin-top: 5px">
      <div style="margin-bottom: -20px; position: relative; z-index: 1">
        <span v-if="activeTabName == 'packageTab'">
          <el-select
            class="button-left"
            v-model="dataSearch.usingStatus"
            @change="searchPackageProperties()"
            placeholder="Chọn trạng thái"
            clearable
          >
            <el-option label="Đang sử dụng" :value="true"></el-option>
            <el-option label="Ngừng sử dụng" :value="false"></el-option>
          </el-select>
          <el-select
            class="button-left"
            v-model="dataSearch.category"
            @change="searchPackageProperties()"
            placeholder="Chọn loại"
            clearable
          >
            <el-option label="Thu" value="in"></el-option>
            <el-option label="Chi" value="out"></el-option>
          </el-select>
          <el-input
            style="width: 300px"
            placeholder="Nhập tên khoản"
            clearable
            v-model="dataSearch.name"
            @clear="searchPackageProperties()"
            @keyup.enter.native="searchPackageProperties()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchPackageProperties()"
            ></el-button>
          </el-input>
        </span>
        <el-input
          v-else-if="activeTabName == 'classPackageTab'"
          style="width: 300px"
          placeholder="Nhập tên lớp"
          clearable
          v-model="className"
          @clear="searchClassPackageByProperties()"
          @keyup.enter.native="searchClassPackageByProperties()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchClassPackageByProperties()"
          ></el-button>
        </el-input>
        <el-input
          v-else-if="activeTabName == 'packageExtendTab'"
          style="width: 300px"
          placeholder="Nhập tên khoản"
          clearable
          v-model="dataExtendSearch.name"
          @clear="searchPackageExtendProperties()"
          @keyup.enter.native="searchPackageExtendProperties()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchPackageExtendProperties()"
          ></el-button>
        </el-input>
      </div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- thiết lập khoản -->
        <el-tab-pane label="Thiết lập thu" name="classPackageTab">
          <el-table
            ref="multipleTable"
            highlight-current-row
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            :data="responseClassList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              fixed
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              fixed
              prop="className"
              label="Tên lớp"
              min-width="150"
            ></el-table-column>
            <el-table-column
              prop="grade.gradeName"
              label="Tên khối"
              min-width="150"
            ></el-table-column>
            <el-table-column
              prop="number"
              align="center"
              label="Số khoản"
              min-width="150"
            ></el-table-column>
            <el-table-column label="Tác vụ" fixed="right" width="160" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="addDialogMethod(scope.row)"
                  >Thêm khoản</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- quản lý khoản -->
        <el-tab-pane label="Danh sách khoản" name="packageTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="responsePackageList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            @selection-change="handleSelectionChange"
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
              label="Tên khoản"
              min-width="190"
            ></el-table-column>
            <el-table-column fixed label="Kiểu đóng" align="center" width="90">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 'single'">Một lần</span>
                <span v-else-if="scope.row.type == 'multiple'">Nhiều lần</span>
              </template>
            </el-table-column>
            <el-table-column label="Loại" align="center" width="90">
              <template slot-scope="scope">
                <span v-if="scope.row.category == 'in'">Thu</span>
                <span v-else-if="scope.row.category == 'out'">Chi</span>
              </template>
            </el-table-column>
            <el-table-column label="Khoản đính kèm" align="center" width="125">
              <template v-if="scope.row.fnPackageExtend != null" slot-scope="scope">
                <el-button
                  style="text-decoration: underline"
                  type="text"
                  size="mini"
                  @click="updatePackageExtend(scope.row)"
                  >Sửa</el-button
                >
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
                <span v-if="scope.row.price == 0">0</span>
                <span v-else>{{ scope.row.price | formatCurrency }}</span>
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
              width="130"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.discount">
                  <span v-if="scope.row.discountPrice == 0">0</span>
                  <span v-else>{{ scope.row.discountPrice | formatCurrency }}</span></span
                >
                <span v-else>
                  <span v-if="scope.row.price == 0">0</span>
                  <span v-else>{{ scope.row.price | formatCurrency }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="expired" align="center" label="Hết hạn" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.expired">Có</span>
                <span v-else>Không</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="attendance"
              align="center"
              label="Điểm danh"
              width="95"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.attendance">Có</span>
                <span v-else>Không</span>
              </template>
            </el-table-column>
            <el-table-column prop="active" align="center" label="Đăng ký" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.active">Có</span>
                <span v-else>Không</span>
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" fixed="right" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateDialogMethod(scope.row)"
                  >{{ $t("button.update") }}</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="detailDialogMethod(scope.row)"
                  >{{ $t("button.detail") }}</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deletePackageMethod(scope.row)"
                  >{{ $t("button.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button class="button-bottom" type="success" @click="createDialogMethod()"
              >Tạo khoản</el-button
            >
            <el-dropdown @command="handleCommandAction">
              <el-button class="button-bottom" type="success">
                Tác vụ
                <i class="el-icon-caret-bottom" />
              </el-button>
              <el-dropdown-menu class="el-dropdown-menu-container">
                <el-dropdown-item command="changeSortCommand">Sắp xếp</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Khoản đính kèm" name="packageExtendTab">
          <el-table
            ref="multipleTableExtend"
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="responsePackageExtendList"
            :cell-style="tableRowStyleExtend"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            @selection-change="handleSelectionChangeExtend"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="Tên khoản đính kèm"
              min-width="190"
            ></el-table-column>
            <el-table-column
              prop="fnPackage.name"
              label="Đính kèm khoản"
              min-width="190"
            ></el-table-column>
            <el-table-column prop="note" label="mô tả" min-width="190"></el-table-column>
            <el-table-column label="Kích hoạt" width="130" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.active"
                  @change="activeExtendPackageMethod(scope.row)"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="Số khoảng kèm"
              width="130"
              align="center"
            ></el-table-column>
            <el-table-column label="Tác vụ" fixed="right" width="160" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateExtendDialogMethod(scope.row)"
                  >{{ $t("button.update") }}</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteExtendPackageMethod(scope.row)"
                  >{{ $t("button.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              @click="createExtendDialogMethod()"
              >Tạo khoản</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="Khoản hệ thống" name="packageRootTab">
          <el-table
            ref="multipleTablePackageRootTab"
            :empty-text="textTable"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="responsePackageRootList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            @selection-change="handleSelectionChangeExtend"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="Tên khoản"
              min-width="190"
            ></el-table-column>
            <el-table-column label="Loại" align="center" width="90">
              <template slot-scope="scope">
                <span v-if="scope.row.category == 'in'">Thu</span>
                <span v-else-if="scope.row.category == 'out'">Chi</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="unit"
              align="center"
              label="Đơn vị"
              width="100"
            ></el-table-column>
            <el-table-column prop="note" label="mô tả" min-width="190"></el-table-column>
            <el-table-column label="Tác vụ" fixed="right" width="130" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateRootDialogMethod(scope.row)"
                  >{{ $t("button.update") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <PackageCreateDialog
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
    <PackageUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="PackageUpdateDialog"
    />
    <AddPackageInClassDialog
      :dialogVisible="showAddDialog"
      @dialog-close="dialogCloseAddMethod()"
      ref="AddPackageInClassDialog"
    />
    <PackageDetailDialog
      :dialogVisible="showDetailDialog"
      @dialog-close="dialogCloseDetailMethod()"
      ref="PackageDetailDialog"
    />
    <PackageExtendCreateDialog
      :dialogVisible="showCreateExtendDialog"
      @dialog-close="dialogCloseCreateExtendMethod()"
      ref="PackageExtendCreateDialog"
    />
    <PackageRootUpdateDialog
      :dialogVisible="showUpdateRootDialog"
      :dataTransfer="updateGrade"
      @dialog-close="dialogCloseUpdateRootMethod()"
      ref="PackageRootUpdateDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import FnPackageExtendService from "@/services/FnPackageExtendService";

import PackageUpdateDialog from "./PackageUpdateDialog.vue";
import PackageCreateDialog from "./PackageCreateDialog.vue";
import AddPackageInClassDialog from "./AddPackageInClassDialog.vue";
import PackageDetailDialog from "./PackageDetailDialog.vue";
import PackageExtendCreateDialog from "./PackageExtendCreateDialog.vue";
import PackageRootUpdateDialog from "./PackageRootUpdateDialog.vue";

export default {
  components: {
    PackageUpdateDialog,
    PackageCreateDialog,
    AddPackageInClassDialog,
    PackageDetailDialog,
    PackageExtendCreateDialog,
    PackageRootUpdateDialog,
  },
  data() {
    return {
      textTable: "",
      loadingData: false,
      activeTabName: "classPackageTab",
      responsePackageList: [],
      responsePackageExtendList: [],
      responsePackageRootList: [],
      responseClassList: [],
      multipleSelection: [],
      loaddingButton: false,
      showCreateDialog: false,
      showCreateExtendDialog: false,
      showUpdateRootDialog: false,
      showUpdateDialog: false,
      showAddDialog: false,
      showDetailDialog: false,
      dataSearch: {
        name: "",
        usingStatus: true,
        category: "",
      },
      dataExtendSearch: {
        name: "",
      },
      className: "",
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.category == "out") {
        return "color: #409EFF";
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "classPackageTab") {
        this.searchClassPackageByProperties();
      } else if (tabNameClick == "packageTab") {
        this.searchPackageProperties();
      } else if (tabNameClick == "packageExtendTab") {
        this.searchPackageExtendProperties();
      } else if (tabNameClick == "packageRootTab") {
        this.searchPackageRootProperties();
      }
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchPackageProperties();
    },
    dialogCloseCreateExtendMethod() {
      this.showCreateExtendDialog = false;
      this.searchPackageExtendProperties();
    },
    dialogCloseUpdateRootMethod() {
      this.showUpdateRootDialog = false;
      this.searchPackageRootProperties();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchPackageProperties();
    },
    dialogCloseAddMethod() {
      this.showAddDialog = false;
      this.searchClassPackageByProperties();
    },
    dialogCloseDetailMethod() {
      this.showDetailDialog = false;
    },
    updateDialogMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.PackageUpdateDialog.getDataInitial(row.id);
    },
    addDialogMethod(row) {
      this.showAddDialog = true;
      this.$refs.AddPackageInClassDialog.getAddDataInitial(row);
    },
    detailDialogMethod(row) {
      this.showDetailDialog = true;
      this.$refs.PackageDetailDialog.getDataDetailInitial(row.id, row.name);
    },
    //select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleCommandAction(command) {
      if (command == "changeSortCommand") {
        this.changeSortMethod();
      } else if (command == "addFromFileCommand") {
        console.log("add from file");
      } else if (command == "exportFileCommand") {
        console.log("export file");
      }
    },
    changeSortMethod() {
      let selectRowList = this.multipleSelection;
      if (selectRowList.length != 2) {
        this.$message({
          message: "Chọn 2 khoản để thực hiện sắp xếp",
          type: "error",
        });
        return;
      }
      let dataInput = {
        id1: selectRowList[0].id,
        id2: selectRowList[1].id,
      };
      FnFeesService.changeSortNumber(dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchPackageProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    /**
     * thêm khoản
     */
    createDialogMethod() {
      this.showCreateDialog = true;
    },
    //thêm khoản đính kèm
    createExtendDialogMethod() {
      this.$refs.PackageExtendCreateDialog.getDataExtendInitial("root", "create");
      setTimeout(() => {
        this.showCreateExtendDialog = true;
      }, 100);
    },
    updateExtendDialogMethod(row) {
      this.$refs.PackageExtendCreateDialog.getDataExtendInitial(
        "root",
        "update",
        row.id,
        row.fnPackage.name
      );
      setTimeout(() => {
        this.showCreateExtendDialog = true;
      }, 100);
    },
    updateRootDialogMethod(row) {
      this.$refs.PackageRootUpdateDialog.getDataInitial(row);
        this.showUpdateRootDialog = true;
    },
    updatePackageExtend(row) {
      this.$refs.PackageExtendCreateDialog.getDataExtendInitial(
        "root",
        "update",
        row.fnPackageExtend.id,
        row.name
      );
      setTimeout(() => {
        this.showCreateExtendDialog = true;
      }, 100);
    },
    //xóa khoản đính kèm
    deleteExtendPackageMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        FnPackageExtendService.deletePackageExtend(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchPackageExtendProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    //active khoảng đính kèm
    activeExtendPackageMethod(row) {
      FnPackageExtendService.activePackageExtendById(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.searchPackageExtendProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },

    /**
     * xóa khoản
     */
    deletePackageMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản này?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        FnFeesService.deletePackage(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchPackageProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    searchPackageExtendProperties() {
      this.loadingData = true;
      FnPackageExtendService.getPackageExtend(this.dataExtendSearch.name)
        .then((resp) => {
          this.responsePackageExtendList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responsePackageExtendList = [];
        })
        .finally(() => {
          if (this.responsePackageExtendList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    searchPackageRootProperties() {
      this.loadingData = true;
      FnFeesService.searchPackageRoot()
        .then((resp) => {
          this.responsePackageRootList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responsePackageRootList = [];
        })
        .finally(() => {
          if (this.responsePackageRootList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    searchPackageProperties() {
      this.loadingData = true;
      FnFeesService.searchPackage(
        this.dataSearch.name,
        this.dataSearch.usingStatus,
        this.dataSearch.category
      )
        .then((resp) => {
          this.responsePackageList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responsePackageList = [];
        })
        .finally(() => {
          if (this.responsePackageList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm tất cả các quyền cho người dùng
     */
    searchClassPackageByProperties() {
      this.loadingData = true;
      FnFeesService.searchClassPackage(this.className)
        .then((resp) => {
          this.responseClassList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseClassList = [];
        })
        .finally(() => {
          if (this.responseClassList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.searchClassPackageByProperties();
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
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
// /deep/.el-table td {
//   padding: 8px 0;
// }
// /deep/.el-table th {
//   padding: 12px 0;
// }
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
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
}
.wrapper-table {
  height: 600px;
  overflow-y: scroll;
  border-bottom: 1px solid #ebeef5;
}
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
// td {
//   padding: 12px;
// }
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
.button-left {
  margin-right: 5px;
  width: 150px;
}
</style>
