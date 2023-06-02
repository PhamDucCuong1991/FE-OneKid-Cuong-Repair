<template>
  <div>
    <el-dialog
      :title="'Chi tiết khoản mặc định của học sinh: ' + fullName"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="2vh"
    >
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseInClassList"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeight"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column
          fixed
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          prop="fnPackage.name"
          label="Tên khoản"
          min-width="200"
        ></el-table-column>
        <el-table-column fixed label="Kiểu đóng" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.type == 'single'">Một lần</span>
            <span v-else-if="scope.row.fnPackage.type == 'multiple'">Nhiều lần</span>
          </template>
        </el-table-column>
        <el-table-column label="Loại" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
            <span v-else-if="scope.row.fnPackage.category == 'out'">Chi</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed label="Đăng ký tự động" width="120">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.active"
              @change="activeDefaultPackageMethod(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Khoản đính kèm" align="center" width="125">
          <template v-if="scope.row.fnPackageDefaultExtend != null" slot-scope="scope">
            <el-button
              style="text-decoration: underline"
              type="text"
              size="mini"
              @click="updatePackageExtend(scope.row)"
              >Sửa</el-button
            >&nbsp;
            <el-tooltip
              effect="dark"
              :content="'Khoản đính kèm: ' + scope.row.fnPackageDefaultExtend.name"
              placement="top"
            >
              <i
                class="el-icon-circle-check"
                :style="
                  scope.row.fnPackageDefaultExtend.active
                    ? 'margin-left: 10px; color: #409eff'
                    : 'margin-left: 10px; color: red'
                "
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="110" align="center">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.existKidsPackage"
              effect="dark"
              content="Đã được khởi tạo cho tháng hiện tại"
              placement="top"
            >
              <i class="el-icon-circle-check" style="color: #409eff" />
            </el-tooltip>
            <el-tooltip
              v-else
              effect="dark"
              content="Chưa được khởi tạo cho tháng hiện tại"
              placement="top"
            >
              <i class="el-icon-circle-check" style="color: red" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Mô tả"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="fnPackage.unit"
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
        <el-table-column prop="expired" align="center" label="Hết hạn" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.expired">Có</span>
            <span v-else>Không</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Điểm danh" width="85">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.attendance">Có</span>
            <span v-else>Không</span>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" fixed="right" width="170" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.existKidsPackage"
              @click="addPackageKidsMethod(scope.row)"
              size="mini"
              type="primary"
              >Bổ sung</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="updateDialogMethod(scope.row)"
              >{{ $t("button.update") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <br />
      <span v-if="responseOtherList.length > 0" style="font-weight: bold; font-size: 17px"
        >Khoản khác</span
      >
      <el-table
        v-if="responseOtherList.length > 0"
        ref="multipleTable"
        :empty-text="textTableOther"
        highlight-current-row
        :data="responseOtherList"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :max-height="$tableMaxHeight"
        @selection-change="handleSelectionChangeOther"
        border
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column
          fixed
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          prop="fnPackage.name"
          label="Tên khoản"
          min-width="200"
        ></el-table-column>
        <el-table-column fixed label="Kiểu đóng" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.type == 'single'">Một lần</span>
            <span v-else-if="scope.row.fnPackage.type == 'multiple'">Nhiều lần</span>
          </template>
        </el-table-column>
        <el-table-column label="Loại" align="center" width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
            <span v-else-if="scope.row.fnPackage.category == 'out'">Chi</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed label="Đăng ký tự động" width="120">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.active"
              @change="activeDefaultPackageMethod(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Khoản đính kèm" align="center" width="125">
          <template v-if="scope.row.fnPackageDefaultExtend != null" slot-scope="scope">
            <el-button
              style="text-decoration: underline"
              type="text"
              size="mini"
              @click="updatePackageExtend(scope.row)"
              >Sửa</el-button
            >&nbsp;
            <el-tooltip
              effect="dark"
              :content="'Khoản đính kèm: ' + scope.row.fnPackageDefaultExtend.name"
              placement="top"
            >
              <i
                class="el-icon-circle-check"
                :style="
                  scope.row.fnPackageDefaultExtend.active
                    ? 'margin-left: 10px; color: #409eff'
                    : 'margin-left: 10px; color: red'
                "
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="110" align="center">
          <template slot-scope="scope">
            <el-tooltip
              v-if="scope.row.existKidsPackage"
              effect="dark"
              content="Đã được khởi tạo cho tháng hiện tại"
              placement="top"
            >
              <i class="el-icon-circle-check" style="color: #409eff" />
            </el-tooltip>
            <el-tooltip
              v-else
              effect="dark"
              content="Chưa được khởi tạo cho tháng hiện tại"
              placement="top"
            >
              <i class="el-icon-circle-check" style="color: red" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Mô tả"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="fnPackage.unit"
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
        <el-table-column prop="expired" align="center" label="Hết hạn" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.expired">Có</span>
            <span v-else>Không</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Điểm danh" width="85">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.attendance">Có</span>
            <span v-else>Không</span>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" fixed="right" width="230" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.existKidsPackage"
              @click="addPackageKidsMethod(scope.row)"
              size="mini"
              type="primary"
              >Bổ sung</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="updateDialogMethod(scope.row)"
              >{{ $t("button.update") }}</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deletePackageDefaultMethod(scope.row)"
              >{{ $t("button.delete") }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-dropdown @command="handlePackageDefaultExtend" style="margin-left: 5px">
          <el-button
            :loading="loaddingButtonExtend"
            size="medium"
            class="button-bottom"
            type="success"
          >
            Khoản đính kèm
            <i class="el-icon-arrow-down" />
          </el-button>
          <el-dropdown-menu>
            <el-dropdown-item command="createExtendCommand">Thêm khoản</el-dropdown-item>
            <el-dropdown-item command="activeExtendCommand">Kích hoạt</el-dropdown-item>
            <el-dropdown-item command="unActiveExtendCommand"
              >Bỏ kích hoạt</el-dropdown-item
            >
            <el-dropdown-item command="deleteExtendCommand">Xóa khoản</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </el-dialog>
    <PackageDefaultUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="PackageDefaultUpdateDialog"
    />
    <PackageExtendCreateDialog
      :dialogVisible="showCreateExtendDialog"
      @dialog-close="dialogCloseCreateExtendMethod()"
      ref="PackageExtendCreateDialog"
    />
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import FnPackageExtendService from "@/services/FnPackageExtendService";

import PackageDefaultUpdateDialog from "./PackageDefaultUpdateDialog.vue";
import PackageExtendCreateDialog from "./PackageExtendCreateDialog.vue";
export default {
  props: {
    dialogVisible: null,
  },
  components: {
    PackageDefaultUpdateDialog,
    PackageExtendCreateDialog,
  },
  data() {
    return {
      textTable: "",
      textTableOther: "",
      responseList: [],
      responseInClassList: [],
      responseOtherList: [],
      idKid: "",
      fullName: "",
      multipleSelection: [],
      multipleSelectionOther: [],
      showUpdateDialog: false,
      showCreateExtendDialog: false,
      loaddingButtonExtend: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.fnPackage.category == "out") {
        return "color: #409EFF";
      }
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loaddingButtonExtend = false;
        this.responseInClassList = [];
        this.responseOtherList = [];
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChangeOther(val) {
      this.multipleSelectionOther = val;
    },
    updateDialogMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.PackageDefaultUpdateDialog.getDataInitial(row.id);
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.getDataAgainMethod();
    },
    dialogCloseCreateExtendMethod() {
      this.showCreateExtendDialog = false;
      this.getDataAgainMethod();
    },
    checkBeforeSelect(list) {
      if (list.length == 0) {
        this.$message({
          message: "Không có khoản nào được chọn",
          type: "error",
        });
        throw null;
      }
    },
    updatePackageExtend(row) {
      this.$refs.PackageExtendCreateDialog.getDataExtendInitial(
        "default",
        "update",
        row.fnPackageDefaultExtend.id,
        row.fnPackage.name
      );
      setTimeout(() => {
        this.showCreateExtendDialog = true;
      }, 100);
    },
    handlePackageDefaultExtend(command) {
      let idPackageList1 = this.multipleSelection.map((x) => x.id);
      let idPackageList2 = this.multipleSelectionOther.map((x) => x.id);
      let idPackageList = idPackageList1.concat(idPackageList2);
      this.checkBeforeSelect(idPackageList);
      this.loaddingButtonExtend = true;
      if (command == "createExtendCommand") {
        this.createDefaultExtendMethod(idPackageList);
      } else if (command == "activeExtendCommand") {
        this.activeDefaultExtendMethod(idPackageList, true);
      } else if (command == "unActiveExtendCommand") {
        this.activeDefaultExtendMethod(idPackageList, false);
      } else if (command == "deleteExtendCommand") {
        this.deleteDefaultExtendMethod(idPackageList);
      }
    },
    createDefaultExtendMethod(idKidList) {
      FnPackageExtendService.createDefaultExtendFromPackage(idKidList)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.getDataAgainMethod();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonExtend = false;
          }, 500);
        });
    },
    activeDefaultExtendMethod(idKidList, active) {
      FnPackageExtendService.activeDefaultExtendFromPackage(idKidList, active)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          this.getDataAgainMethod();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonExtend = false;
          }, 500);
        });
    },
    deleteDefaultExtendMethod(idKidList) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản đính kèm không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      })
        .then(() => {
          FnPackageExtendService.deleteDefaultExtendFromPackage(idKidList)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              this.getDataAgainMethod();
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
            })
            .finally(() => {
              setTimeout(() => {
                this.loaddingButtonExtend = false;
              }, 500);
            });
        })
        .catch(() => {
          this.loadingData = false;
        });
    },

    /**
     * bổ sung khoản cho học sinh
     */
    addPackageKidsMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn bổ sung khoản này cho tháng hiện tại không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        FnFeesService.addPackageKidsFromPackageDefault(this.idKid, row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.getDataAgainMethod();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    activeDefaultPackageMethod(row) {
      FnFeesService.activePackageDefaultKid(row)
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
    deletePackageDefaultMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản này?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        FnFeesService.deletePackageDefaultKid(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.getDataAgainMethod();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    getDataAgainMethod() {
      FnFeesService.getPackageDefaultKid(this.idKid)
        .then((resp) => {
          let dataList = (this.responseList = resp.data.data);
          this.responseInClassList = dataList.filter((x) => x.idClass != 0);
          this.responseOtherList = dataList.filter((x) => x.idClass == 0);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseInClassList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          if (this.responseOtherList.length == 0) {
            this.textTableOther = this.$tableEmpty;
          }
        });
    },
    getDataInitialPackageDefaultKid(row) {
      this.idKid = row.id;
      this.fullName = row.fullName;
      this.textTable = this.$tableLoadding;
      this.textTableOther = this.$tableLoadding;
      FnFeesService.getPackageDefaultKid(row.id)
        .then((resp) => {
          let dataList = (this.responseList = resp.data.data);
          this.responseInClassList = dataList.filter((x) => x.idClass != 0);
          this.responseOtherList = dataList.filter((x) => x.idClass == 0);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
          this.responseInClassList = [];
          this.responseOtherList = [];
        })
        .finally(() => {
          if (this.responseInClassList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          if (this.responseOtherList.length == 0) {
            this.textTableOther = this.$tableEmpty;
          }
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
.el-input-number {
  width: 100%;
}
</style>
