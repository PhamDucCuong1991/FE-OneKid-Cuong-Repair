<template>
  <div>
    <el-dialog
      :title="'Danh sách khoản áp dụng của: ' + name"
      :visible.sync="dialogVisible"
      width="1100px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="3vh"
    >
      <div style="margin-bottom: 15px">
        <el-date-picker
          style="width: 135px"
          class="input-common"
          @change="searchByDate()"
          v-model="dataSearch.date"
          type="month"
          value-format="yyyy-MM-dd"
          format="MM-yyyy"
          placeholder="Chọn tháng"
        >
        </el-date-picker>

        <!-- chọn lớp -->
        <el-select
          class="input-common input-class"
          style="width: 140px"
          v-model="dataSearch.idClass"
          placeholder="Chọn lớp"
          clearable
          @change="searchByClassInFE()"
        >
          <el-option
            v-for="item in classList"
            :key="item.id"
            :value="item.id"
            :label="item.className"
          ></el-option>
        </el-select>
        <el-input
          style="width: 300px"
          placeholder="Nhập tên học sinh"
          v-model="dataSearch.fullName"
          clearable
          @keyup.enter.native="searchByClassInFE()"
          @clear="searchByClassInFE()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchByClassInFE()"
          ></el-button>
        </el-input>
      </div>
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        highlight-current-row
        :data="responseFilterList"
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
          prop="kidName"
          label="Tên học sinh"
          min-width="200"
        ></el-table-column>
        <el-table-column
          fixed
          prop="className"
          label="Tên lớp"
          min-width="150"
        ></el-table-column>
        <el-table-column fixed label="Tháng áp dụng" align="center" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.month }}-{{ scope.row.year }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="Thanh toán" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.paid > 0" class="color-warrning">Đã thanh toán</span>
            <span v-else>Chưa thanh toán</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="Duyệt" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.approved" class="color-warrning">Đã duyệt</span>
            <span v-else>Chưa duyệt</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="Khóa" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.locked" class="color-warrning">Đã khóa</span>
            <span v-else>Chưa khóa</span>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" fixed="right" width="110" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.approved && !scope.row.locked && scope.row.paid == 0">
              <el-button
                size="mini"
                type="danger"
                @click="deletePackageKidsMethod(scope.row)"
                >{{ $t("button.delete") }}</el-button
              >
            </span>
            <span v-else>
              <el-button disabled size="mini" type="danger">{{
                $t("button.delete")
              }}</el-button></span
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button type="success" size="medium" @click="deleteManyMethod()">
          <i class="el-icon-circle-close" />
          <span>Xóa nhiều khoản</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FnFeesService from "@/services/FnFeesService";
import {mapActions, mapState} from "vuex";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      textTable: "",
      name: "",
      idPackage: "",
      multipleSelection: [],
      responseList: [],
      responseFilterList: [],
      classList: [],
      dataSearch: {
        date: "",
        idClass: "",
        fullName: "",
      },
    };
  },
  computed: {
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.responseFilterList = [];
        this.resetData();
      }, 300);
    },
    resetData() {
      this.dataSearch.idClass = "";
      this.dataSearch.fullName = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteManyMethod() {
      let selectRow = this.multipleSelection
        .filter((x) => !x.approved && !x.locked && x.paid == 0)
        .map((x) => x.id);
      if (selectRow.length == 0) {
        this.$message({
          message: "Không có khoản nào có thể xóa được chọn",
          type: "error",
        });
        return;
      }
      this.$confirm(
        "Bạn có chắc chắn muốn xóa " + selectRow.length + " khoản không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        FnFeesService.deletePackageKidsMany(selectRow)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    deletePackageKidsMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa không?", "Thông báo!", {
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
            this.searchByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    searchByClassInFE() {
      let idClass = this.dataSearch.idClass;
      if (idClass != "") {
        this.responseFilterList = this.responseList.filter((x) => x.idClass == idClass);
      } else {
        this.responseFilterList = this.responseList;
      }
      let fullNameStrim = this.dataSearch.fullName.trim();
      if (fullNameStrim != "") {
        this.responseFilterList = this.responseFilterList.filter((x) =>
          x.kidName.toLowerCase().includes(fullNameStrim.toLowerCase())
        );
      }
    },
    searchByDate() {
      if (this.dataSearch.date == null) {
        this.dataSearch.date = "";
      }
      this.searchByProperties();
    },
    searchByProperties() {
      FnFeesService.detailPackage(this.idPackage, this.dataSearch.date)
        .then((resp) => {
          this.responseList = this.responseFilterList = resp.data.data;
        })
        .catch((err) => {
          err.response.data.message;
        });
    },
    getClassInitial() {
        this.classList = mapState(['serverDataClass'])
    },
    getDataDetailInitial(idPackage, name) {
      this.name = name;
      this.idPackage = idPackage;
      this.dataSearch.date = this.moment().format("YYYY-MM-DD");
      this.searchByProperties();
      this.getClassInitial();
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
.input-common {
  margin-right: 5px;
}
.el-input-number {
  width: 100%;
}
.color-warrning {
  color: #e95757;
}
</style>
