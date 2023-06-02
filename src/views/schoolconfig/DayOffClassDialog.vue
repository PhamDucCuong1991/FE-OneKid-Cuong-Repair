<template>
  <el-dialog
    :title="'Thiết lập ngày nghỉ cho lớp: ' + className"
    :visible.sync="dialogVisible"
    width="1000px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <spinner-custom v-if="showSpinner" />
    <el-tabs v-else type="card" @tab-click="handleClickTab" v-model="activeTabName">
      <el-tab-pane label="Ngày nghỉ" name="tabName1">
        <el-calendar v-model="nowDate">
          <template slot="dateCell" slot-scope="{ data }">
            <div class="calendar-day">{{ data.day.split("-").slice(2).join("-") }}</div>
            <div v-for="item in responseTab1List" :key="item.id">
              <span v-if="item.date == data.day">
                <el-tooltip :content="item.note" placement="top">
                  <div class="mark">{{ item.note }}</div>
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-calendar>
        <span style="float: right; margin-bottom: 15px">
          <el-button type="danger" size="medium" @click="closeDialog()">
            <i class="el-icon-circle-close" />
            <span>{{ $t("button.close") }}</span>
          </el-button>
        </span>
      </el-tab-pane>

      <el-tab-pane
        v-if="checkPermission(['schoolConfig_absentTeacher_update'])"
        label="Tạo ngày nghỉ"
        name="tabName2"
      >
        <br />
        <el-form
          label-width="140px"
          :model="dataInput"
          label-position="left"
          :rules="rules"
          ref="dataInput"
        >
          <el-form-item label="Chọn ngày" prop="dateList">
            <el-date-picker
              style="margin: 0 auto; width: 100%"
              :picker-options="startDayOfWeek"
              type="dates"
              value-format="yyyy-MM-dd"
              format="dd-MM-yyyy"
              v-model="dataInput.dateList"
              placeholder="Chọn các ngày nghỉ"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Ghi chú" prop="note">
            <el-input v-model="dataInput.note" placeholder="Ghi chú"> </el-input>
          </el-form-item>
        </el-form>
        <span style="float: right; margin-bottom: 15px">
          <el-button
            type="success"
            size="medium"
            :loading="loadingButton"
            mini
            @click="submitForm()"
          >
            <i class="el-icon-circle-check" />
            <span>Tạo ngày nghỉ</span>
          </el-button>
        </span>
        <hr style="clear: right" />
        <div style="margin-bottom: 5px">
          <el-date-picker
            style="margin-right: 5px"
            v-model="dataSearch.year"
            type="year"
            :clearable="false"
            placeholder="Chọn năm"
            @change="getDayOffClassYearMethod()"
          >
          </el-date-picker>
          <el-date-picker
            style="margin-right: 5px"
            v-model="dataSearch.date"
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            placeholder="Chọn ngày"
            @change="getDayOffClassYearMethod()"
          >
          </el-date-picker>
          <el-input
            style="width: 300px"
            placeholder="Nhập ghi chú"
            clearable
            v-model="dataSearch.note"
            @clear="getDayOffClassYearMethod()"
            @keyup.enter.native="getDayOffClassYearMethod()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getDayOffClassYearMethod()"
            ></el-button>
          </el-input>
        </div>
        <el-table
          ref="multipleTable"
          :empty-text="textTable"
          highlight-current-row
          :data="responseTab2List"
          :cell-style="tableRowStyle"
          :header-cell-style="tableHeaderColor"
          :max-height="350"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column
            type="index"
            fixed
            label="STT"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column align="center" width="200" label="Ngày nghỉ">
            <template slot-scope="scope">
              <span>{{ scope.row.date | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Ghi chú">
            <template slot-scope="scope">
              <el-input v-model="scope.row.note"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Tác vụ" fixed="right" width="170" align="center">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="updateRowMethod(scope.row)"
                >Sửa</el-button
              >
              <el-button type="danger" size="mini" @click="deleteRowMethod(scope.row)"
                >Xóa</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <br />
        <span style="float: right; margin-bottom: 15px">
          <el-button type="danger" size="medium" @click="deleteManyMethod()">
            <i class="el-icon-circle-close" />
            <span>{{ $t("button.delete") }}</span>
          </el-button>
        </span>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      activeTabName: "tabName1",
      showSpinner: true,
      textTable: "",
      nowDate: this.moment(),
      className: "",
      dataSearch: {
        year: this.moment(),
        date: "",
        note: "",
      },
      responseTab1List: [],
      responseTab2List: [],
      multipleSelection: [],
      dataInput: {
        idClass: "",
        dateList: [],
        note: "Ngày nghỉ",
      },
      loadingButton: false,
      rules: {
        dateList: [
          {
            required: true,
            message: "Ngày không được để trống",
            trigger: "change",
          },
        ],
        note: [
          {
            required: true,
            message: "Ghi chú không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.responseTab1List = [];
        this.responseTab2List = [];
        this.activeTabName = "tabName1";
        this.loadingButton = false;
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "tabName1") {
        this.getDayOffClassViewMethod();
      } else if (tabNameClick == "tabName2") {
        this.getDayOffClassYearMethod();
      }
    },
    updateRowMethod(row) {
      SchoolConfigService.updateDayOffClassYear(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.responseTab2List = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    deleteRowMethod(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
        SchoolConfigService.deleteDayOffClassYear(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.getDayOffClassYearMethod();
          })
          .catch((err) => {
            this.responseTab2List = [];
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    deleteManyMethod() {
      let idList = this.multipleSelection.map((x) => x.id);
      if (idList.length == 0) {
        this.$message({
          message: "Chưa có hàng nào được chọn",
          type: "error",
        });
        throw null;
      }
      this.$confirm("Bạn có chắc chắn muốn xóa không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Có",
        closeOnClickModal: false,
        cancelButtonText: "Không",
      }).then(() => {
        SchoolConfigService.deleteDayOffClassYearList(idList)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.getDayOffClassYearMethod();
          })
          .catch((err) => {
            this.responseTab2List = [];
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },

    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          SchoolConfigService.createDayOffClass(this.dataInput)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              this.getDayOffClassYearMethod();
            })
            .catch((err) => {
              this.$message({
                message: err.response.data.message,
                type: "error",
              });
              this.$refs["dataInput"].resetFields();
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getDayOffClassYearMethod() {
      if (this.dataSearch.date == null) {
        this.dataSearch.date = "";
      }
      SchoolConfigService.getDayOffClassYear(
        this.dataInput.idClass,
        this.moment(this.dataSearch.year).year(),
        this.dataSearch.date,
        this.dataSearch.note
      )
        .then((resp) => {
          this.responseTab2List = resp.data.data;
        })
        .catch((err) => {
          this.responseTab2List = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseTab2List.length == 0) {
            this.textTable = this.$tableEmpty;
          }
        });
    },
    getDayOffClassViewMethod() {
      SchoolConfigService.viewDayOffClass(this.dataInput.idClass)
        .then((resp) => {
          this.responseTab1List = resp.data.data;
          this.showSpinner = false;
        })
        .catch((err) => {
          this.responseTab1List = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getDataInitial(row) {
      this.className = row.className;
      this.dataInput.idClass = row.id;
      this.getDayOffClassViewMethod();
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
/deep/.el-dialog__body {
  padding-bottom: 5px;
}

/deep/.el-calendar-table .el-calendar-day {
  font-size: 20px;
  text-align: center;
  height: 65px;
  background: lightgrey;
}
.mark {
  font-size: 15px;
  color: white;
  background: #e74b4b;
  height: 33px;
  overflow: hidden;
  line-height: 33px;
  word-break: break-word;
}
</style>
