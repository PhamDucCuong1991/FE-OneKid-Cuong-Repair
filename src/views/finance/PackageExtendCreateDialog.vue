<template>
  <div>
    <el-dialog
      :title="
        dataTranfer.buttonType == 'create'
          ? 'Tạo khoảng đính kèm'
          : ' Sửa khoảng đính kèm'
      "
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <el-form
        label-width="150px"
        :model="dataInput"
        label-position="left"
        :rules="rules"
        ref="dataInput"
      >
        <el-form-item
          v-if="dataTranfer.buttonType == 'create'"
          label="Chọn khoản"
          prop="idPackage"
          :rules="[
            {
              required: true,
              message: 'Khoản không được để trống',
              trigger: 'change',
            },
          ]"
        >
          <el-select
            v-model="dataInput.idPackage"
            placeholder="Chọn khoản"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in packageList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
              <span>{{ item.name }}</span> -
              <span v-if="item.category == 'in'">Thu</span>
              <span v-else>Chi</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else label="Tên khoản" prop="idPackage">
          <span>{{ dataTranfer.packageName }}</span>
        </el-form-item>
        <el-form-item label="Tên khoản đính kèm" prop="name">
          <el-input
            v-model="dataInput.name"
            size="medium"
            placeholder="Nhập tên khoản đính kèm"
          ></el-input>
        </el-form-item>
        <el-form-item label="Mô tả" prop="note">
          <el-input
            autosize
            type="textarea"
            v-model="dataInput.note"
            placeholder="Nhập mô tả"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Kích hoạt"
          prop="active"
          style="display: inline-block; width: 20%"
        >
          <el-tooltip
            effect="dark"
            :content="
              dataTranfer.type == 'root'
                ? 'Trạng thái kích hoạt'
                : dataTranfer.type == 'default'
                ? 'Khi khoản học sinh được tạo thì khoản đính kèm được tạo theo'
                : 'Khoản đính kèm được áp dụng cho việc tính toán học phí'
            "
            placement="right"
          >
            <el-checkbox v-model="dataInput.active"></el-checkbox>
          </el-tooltip>
        </el-form-item>
        <el-form-item style="display: inline-block; width: 65%; float: right">
          <el-button
            type="text"
            style="text-decoration: underline"
            @click="insertRangeMethod()"
            >Thêm khoảng tính toán</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        highlight-current-row
        :empty-text="textTable"
        element-loading-background="rgba(255,255,255, 0)"
        :data="dataInput.moneyList"
        :cell-style="tableRowStyle"
        :header-cell-style="$funcCommon.tableHeaderColorFunction"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="Kiểu" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.category1 == 'reduce'">Giảm tiền</span>
            <span v-else-if="scope.row.category1 == 'increase'">Thêm tiền</span>
          </template>
        </el-table-column>
        <el-table-column label="Loại tính toán" align="center">
          <template slot-scope="scope" v-if="scope.row.category1 == 'reduce'">
            <span v-if="scope.row.category2 == 'dynamic'">Điểm danh</span>
            <span v-else-if="scope.row.category2 == 'fixed'">Cố định</span>
          </template>
        </el-table-column>
        <el-table-column label="Loại nghỉ" align="center">
          <template v-if="scope.row.category2 == 'dynamic'" slot-scope="scope">
            <span v-if="scope.row.category3 == 'absentAll'">Nghỉ chung</span>
            <span v-else-if="scope.row.category3 == 'absentDetail'"
              >Nghỉ chi tiết</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="Tác vụ"
          fixed="right"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="updateRangeMethod(scope.row)"
              >{{ $t("button.update") }}</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="removeRangeMethod(scope.row)"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          mini
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>{{ $t("button.save") }}</span>
        </el-button>
      </span>
    </el-dialog>

    <RangeExtendDialog
      :dialogVisible="showRangeExtendDialog"
      @dialog-close="closeRangeExtendDialog"
      ref="RangeExtendDialog"
    />
  </div>
</template>

<script>
import FnPackageExtendService from "@/services/FnPackageExtendService";
import RangeExtendDialog from "./RangeExtendDialog.vue";
export default {
  props: {
    dialogVisible: null,
  },
  components: {
    RangeExtendDialog,
  },
  data() {
    return {
      textTable: this.$tableEmpty,
      packageList: [],
      dataTranfer: {
        //type có 3 loại sau:
        //root->tạo khản đính kèm gốc
        //default->tạo khản đính kèm mặc định
        //kids->tạo khản đính kèm học sinh
        type: "",
        buttonType: "",
        id: "",
        packageName: "",
      },
      dataInput: {
        idPackage: "",
        name: "",
        note: "",
        active: false,
        moneyList: [],
      },
      loadingButton: false,
      showRangeExtendDialog: false,
      rules: {
        name: [
          {
            required: true,
            message: "Tên khoản đính kèm không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.$refs["dataInput"].resetFields();
        this.dataInput.moneyList = [];
        this.dataInput.packageList = [];
        this.loadingButton = false;
      }, 300);
    },
    tableRowStyle({ row }) {
      if (row.id == null) {
        return "color: #409EFF";
      }
    },
    insertRangeMethod() {
      this.showRangeExtendDialog = true;
      this.$refs.RangeExtendDialog.getDataRangeInitial("insert");
    },
    updateRangeMethod(row) {
      this.showRangeExtendDialog = true;
      this.$refs.RangeExtendDialog.getDataRangeInitial("updateMoney", row);
    },
    closeRangeExtendDialog(type, click, data) {
      //thêm nó vào mảng
      if (type == "insert" && click == "ok") {
        this.dataInput.moneyList.push(data);
      } else if (type == "updateMoney" && click != "ok") {
        //gọi lại dữ liệu ban đầu
        // if (this.dataTranfer.type == "root") {
        //   this.getPackageExtendByIdMethod();
        // } else if (this.dataTranfer.type == "default") {
        //   this.getDefaultExtendByIdMethod();
        // }
      }
      this.showRangeExtendDialog = false;
    },
    removeRangeMethod(row) {
      let list = this.dataInput.moneyList;
      var index = list.indexOf(row);
      list.splice(index, 1);
    },

    checkBeforeSumbit() {
      if (this.dataInput.moneyList.length == 0) {
        this.$message({
          message: "Thêm khoảng tính toán",
          type: "error",
        });
        throw null;
      }
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.checkBeforeSumbit();
          this.loadingButton = true;
          if (this.dataTranfer.type == "root") {
            if (this.dataTranfer.buttonType == "create") {
              this.createPackageExtendMethod();
            } else if (this.dataTranfer.buttonType == "update") {
              this.updatePackageExtendMethod();
            }
          } else if (this.dataTranfer.type == "default") {
            this.updateDefaultExtendMethod();
          } else if (this.dataTranfer.type == "kids") {
            this.updateKidsExtendMethod();
          } else {
            this.$message({
              message: "Không có kiểu nào được chọn",
              type: "error",
            });
          }
        }
      });
    },
    updateKidsExtendMethod() {
      FnPackageExtendService.updateKidsExtend(this.dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    updateDefaultExtendMethod() {
      FnPackageExtendService.updateDefaultExtend(this.dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    updatePackageExtendMethod() {
      FnPackageExtendService.updatePackageExtend(this.dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    createPackageExtendMethod() {
      FnPackageExtendService.createPackageExtend(this.dataInput)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
          setTimeout(() => {
            this.closeDialog();
          }, 500);
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },

    getPackage() {
      FnPackageExtendService.getPackageForAdd()
        .then((resp) => {
          this.packageList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getPackageExtendByIdMethod() {
      FnPackageExtendService.getPackageExtendById(this.dataTranfer.id)
        .then((resp) => {
          this.dataInput = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getDefaultExtendByIdMethod() {
      FnPackageExtendService.getDefaultExtendById(this.dataTranfer.id)
        .then((resp) => {
          this.dataInput = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getKidsExtendByIdMethod() {
      FnPackageExtendService.getKidsExtendById(this.dataTranfer.id)
        .then((resp) => {
          this.dataInput = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    async getDataExtendInitial(type, buttonType, id, packageName) {
      this.dataTranfer.type = type;
      this.dataTranfer.buttonType = buttonType;
      if (type == "root") {
        if (buttonType == "create") {
          this.getPackage();
        } else if (buttonType == "update") {
          this.dataTranfer.id = id;
          this.dataTranfer.packageName = packageName;
          this.getPackageExtendByIdMethod(id);
        }
      } else if (type == "default") {
        this.dataTranfer.id = id;
        this.dataTranfer.packageName = packageName;
        this.getDefaultExtendByIdMethod(id);
      } else if (type == "kids") {
        this.dataTranfer.id = id;
        this.dataTranfer.packageName = packageName;
        this.getKidsExtendByIdMethod(id);
      }
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
.input-class {
  width: 200px;
  margin-right: 15px;
}
.text-class {
  margin-right: 10px;
}
.table-3 {
  width: 30%;
  display: inline-block;
  margin-right: 3%;
}
</style>
