<template>
  <div>
    <el-dialog
      :title="'Chi tiết khoản ' + monthText + ' của học sinh: ' + fullName"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="4vh"
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
        <el-table-column align="center" fixed label="Đăng ký" width="80">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.active"
              @change="activePackageKidsMethod(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Loại" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
            <span v-else-if="scope.row.fnPackage.category == 'out'">Chi</span>
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

        <el-table-column label="Khoản đính kèm" align="center" width="125">
          <template v-if="scope.row.fnPackageKidsExtend != null" slot-scope="scope">
            <el-button
              style="text-decoration: underline"
              type="text"
              size="mini"
              @click="updatePackageExtend(scope.row)"
              >Sửa</el-button
            >&nbsp;
            <el-tooltip
              effect="dark"
              :content="'Khoản đính kèm: ' + scope.row.fnPackageKidsExtend.name"
              placement="top"
            >
              <i
                class="el-icon-circle-check"
                :style="
                  scope.row.fnPackageKidsExtend.active
                    ? 'margin-left: 10px; color: #409eff'
                    : 'margin-left: 10px; color: red'
                "
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Mô tả"
          min-width="200"
        ></el-table-column>
        <el-table-column
          align="center"
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
        <el-table-column align="right" label="Đơn giá" width="120">
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
        <el-table-column label="Tác vụ" fixed="right" width="140" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.approved && !scope.row.locked && scope.row.paid == 0">
              <el-button
                size="mini"
                type="success"
                @click="updateDialogMethod(scope.row)"
                >{{ $t("button.update") }}</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="deletePackageKidsMethod(scope.row)"
                >{{ $t("button.delete") }}</el-button
              >
            </span>
            <span v-else>
              <el-button disabled size="mini" type="success">{{
                $t("button.update")
              }}</el-button>
              <el-button disabled size="mini" type="danger">{{
                $t("button.delete")
              }}</el-button></span
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
        <el-table-column align="center" fixed label="Đăng ký" width="80">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.active"
              @change="activePackageKidsMethod(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Loại" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.fnPackage.category == 'in'">Thu</span>
            <span v-else-if="scope.row.fnPackage.category == 'out'">Chi</span>
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
        <el-table-column label="Khoản đính kèm" align="center" width="125">
          <template v-if="scope.row.fnPackageKidsExtend != null" slot-scope="scope">
            <el-button
              style="text-decoration: underline"
              type="text"
              size="mini"
              @click="updatePackageExtend(scope.row)"
              >Sửa</el-button
            >&nbsp;
            <el-tooltip
              effect="dark"
              :content="'Khoản đính kèm: ' + scope.row.fnPackageKidsExtend.name"
              placement="top"
            >
              <i
                class="el-icon-circle-check"
                :style="
                  scope.row.fnPackageKidsExtend.active
                    ? 'margin-left: 10px; color: #409eff'
                    : 'margin-left: 10px; color: red'
                "
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Mô tả"
          min-width="200"
        ></el-table-column>
        <el-table-column
          align="center"
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
        <el-table-column align="right" label="Đơn giá" width="120">
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
        <el-table-column label="Tác vụ" fixed="right" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="updateDialogMethod(scope.row)"
              >{{ $t("button.update") }}</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deletePackageKidsMethod(scope.row)"
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
        <el-dropdown @command="handlePackageKidsExtend">
          <el-button
            :loading="loaddingButtonExtend"
            size="medium"
            class="button-bottom"
            type="success"
            style="margin-left: 5px"
          >
            Khoản đính kèm
            <i class="el-icon-caret-bottom" />
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
    <PackageKidsUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="PackageKidsUpdateDialog"
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

import PackageKidsUpdateDialog from "./PackageKidsUpdateDialog.vue";
import PackageExtendCreateDialog from "./PackageExtendCreateDialog.vue";
export default {
  props: {
    dialogVisible: null,
  },
  components: {
    PackageKidsUpdateDialog,
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
      idClass: "",
      date: "",
      monthText: "",
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
      this.$refs.PackageKidsUpdateDialog.getDataInitial(row.id);
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
        "kids",
        "update",
        row.fnPackageKidsExtend.id,
        row.fnPackage.name
      );
      setTimeout(() => {
        this.showCreateExtendDialog = true;
      }, 100);
    },
    handlePackageKidsExtend(command) {
      let idPackageList1 = this.multipleSelection.map((x) => x.id);
      let idPackageList2 = this.multipleSelectionOther.map((x) => x.id);
      let idPackageList = idPackageList1.concat(idPackageList2);
      this.checkBeforeSelect(idPackageList);
      this.loaddingButtonExtend = true;
      if (command == "createExtendCommand") {
        this.createKidsExtendMethod(idPackageList);
      } else if (command == "activeExtendCommand") {
        this.activeKidsExtendMethod(idPackageList, true);
      } else if (command == "unActiveExtendCommand") {
        this.activeKidsExtendMethod(idPackageList, false);
      } else if (command == "deleteExtendCommand") {
        this.deleteKidsExtendMethod(idPackageList);
      }
    },
    createKidsExtendMethod(idPackageList) {
      FnPackageExtendService.createKidsExtendFromPackage(idPackageList)
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
    activeKidsExtendMethod(idPackageList, active) {
      FnPackageExtendService.activeKidsExtendFromPackage(idPackageList, active)
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
    deleteKidsExtendMethod(idPackageList) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản đính kèm không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        FnPackageExtendService.deleteKidsExtendFromPackage(idPackageList)
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
      });
    },
    activePackageKidsMethod(row) {
      FnFeesService.activePackageKids(row)
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
    deletePackageKidsMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa khoản này?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        FnFeesService.deletePackageKidsById(row.id)
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
      FnFeesService.getPackageKidsDetail(this.idKid, this.date, this.idClass)
        .then((resp) => {
          let dataList = (this.responseList = resp.data.data);
          this.responseInClassList = dataList.filter((x) => x.defaultStatus);
          this.responseOtherList = dataList.filter((x) => !x.defaultStatus);
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
    getDataInitialPackageKidsDetail(row, date, idClass) {
      this.date = date;
      this.idKid = row.id;
      this.fullName = row.fullName;
      this.idClass = idClass;
      this.textTable = this.$tableLoadding;
      this.textTableOther = this.$tableLoadding;
      this.monthText = this.moment(date).format("MM-YYYY");
      FnFeesService.getPackageKidsDetail(row.id, date, idClass)
        .then((resp) => {
          let dataList = (this.responseList = resp.data.data);
          this.responseInClassList = dataList.filter((x) => x.defaultStatus);
          this.responseOtherList = dataList.filter((x) => !x.defaultStatus);
        })
        .catch((err) => {
          this.responseList = [];
          this.responseInClassList = [];
          this.responseOtherList = [];
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
