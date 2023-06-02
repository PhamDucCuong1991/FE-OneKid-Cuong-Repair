<template>
  <div style="margin-top: 5px">
    <div
      style="
        margin-bottom: 20px;
        display: inline-block;
        position: relative;
        z-index: 1;
      "
    >
      <!-- chọn khối -->
      <el-select
        class="input-common"
        style="width: 140px"
        clearable
        v-model="dataSearch.idGrade"
        @change="changeGradeMethod()"
        placeholder="Chọn khối"
      >
        <el-option
          v-for="item in gradeList"
          :key="item.id"
          :value="item.id"
          :label="item.gradeName"
        ></el-option>
      </el-select>

      <!-- chọn lớp -->
      <el-select
        class="input-common"
        style="width: 140px"
        filterable
        clearable
        v-model="dataSearch.idClass"
        placeholder="Chọn lớp"
        @change="searchByProperties()"
      >
        <el-option
          v-for="item in classList"
          :key="item.id"
          :value="item.id"
          :label="item.className"
        ></el-option>
      </el-select>

      <el-input
        style="width: 280px"
        placeholder="Nhập tên lớp"
        clearable
        v-model="dataSearch.className"
        @clear="searchByProperties()"
        @keyup.enter.native="searchByProperties()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchByProperties()"
        ></el-button>
      </el-input>
    </div>
    <el-table
      ref="multipleTable"
      :empty-text="textTable"
      v-loading="loadingData"
      :element-loading-text="$tableLoadding"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255, 0)"
      highlight-current-row
      :data="responseList"
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      @selection-change="handleSelectionChange"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        type="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        label="STT"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column prop="className" label="Tên lớp"></el-table-column>
      <el-table-column label="Học sáng T.7" width="150" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.morningSaturday"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Học chiều T.7" width="150" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.afternoonSaturday"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Học tối T.7" width="150" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.eveningSaturday"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Học chủ nhật" width="150" align="center">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sunday"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="Tác vụ" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="settingDayOffClassMethod(scope.row)"
            >Chi tiết</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right; margin: 15px 0">
      <el-button
        v-if="checkPermission(['schoolConfig_absentTeacher_update'])"
        style="border-radius: 0"
        @click="settingDayOffClass1Method()"
        size="medium"
        type="success"
      >
        <i class="el-icon-plus" />
        <span>Tạo ngày nghỉ chung</span>
      </el-button>
      <el-button
        v-if="checkPermission(['schoolConfig_absentTeacher_update'])"
        :disabled="responseList.length == 0"
        style="border-radius: 0"
        @click="submitForm()"
        :loading="loaddingButton"
        size="medium"
        type="success"
      >
        <i class="el-icon-circle-check" />
        <span>Lưu</span>
      </el-button>
    </div>
    <DayOffClassDialog
      :dialogVisible="showSettingDayOff"
      @dialog-close="closeSettingDayOffMethod()"
      ref="DayOffClassDialog"
    />
    <DayOfManyClassDialog
      :dialogVisible="showSettingDayOff1"
      @dialog-close="closeSettingDayOff1Method()"
      ref="DayOfManyClassDialog"
    />
  </div>
</template>
<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";
import DayOffClassDialog from "./DayOffClassDialog";
import DayOfManyClassDialog from "./DayOfManyClassDialog";
import {mapActions, mapState} from "vuex";
export default {
  components: {
    DayOffClassDialog,
    DayOfManyClassDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      responseList: [],
      gradeList: [],
      classList: [],
      loaddingButton: false,
      showSettingDayOff: false,
      showSettingDayOff1: false,
      multipleSelection: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        className: "",
      },
    };
  },
  computed:{
    ...mapState(['serverDataGrade']),
    ...mapState(['serverDataClass']),
    ...mapState(['serverDataClassInGrade']),
  },
  methods: {
    ...mapActions(['fetchDataGradeFromServer']),
    ...mapActions(['fetchDataClassFromServer']),
    ...mapActions(['fetchDataClassInGradeFromServer']),
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    closeSettingDayOffMethod() {
      this.showSettingDayOff = false;
    },
    closeSettingDayOff1Method() {
      this.showSettingDayOff1 = false;
      this.searchByProperties();
    },
    settingDayOffClassMethod(row) {
      this.showSettingDayOff = true;
      this.$refs.DayOffClassDialog.getDataInitial(row);
    },
    settingDayOffClass1Method() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "Không có lớp nào được chọn",
          type: "error",
        });
        throw null;
      }
      this.showSettingDayOff1 = true;
      this.$refs.DayOfManyClassDialog.getDataInitial(this.multipleSelection);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * lưu cấu nghỉ học của các lớp
     */
    submitForm() {
      this.loaddingButton = true;
      SchoolConfigService.updateConfigClassAbsent(this.responseList)
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
            this.loaddingButton = false;
          }, 500);
        });
    },
    /**
     * tìm kiếm cấu hình cho lớp
     */
    searchByProperties() {
      this.loadingData = true;
      let data = this.dataSearch;
      SchoolConfigService.searchConfigClass(
        data.idGrade,
        data.idClass,
        data.className
      )
        .then((resp) => {
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
    changeGradeMethod() {
      this.dataSearch.idClass = "";
      this.getClassOfGrade();
      this.searchByProperties();
    },
    /**
     * tìm tất cả các khối trong một trường
     */
    async getAllGrade() {
      this.gradeOfSchoolList = mapState(["serverDataGrade"]);
          if (this.gradeList.length > 0) {
            this.dataSearch.idGrade = this.gradeList[0].id;
          }

    },
    /**
     * tìm tất cả lớp trong một khối
     */
    async getClassOfGrade() {
      this.classOfGradeList = mapState(['serverDataClassInGrade', this.dataSearch.idGrade])

    },
    async fetchDataMany() {
      await this.getAllGrade();
      this.getClassOfGrade();
      this.searchByProperties();
    },
  },
  beforeMount() {
    this.fetchDataMany();
  },
};
</script>
<style lang="scss" scoped>
// /deep/.el-tabs__nav {
//   background: #a0a19ce0;
// }
// /deep/.el-tabs__item {
//   color: white;
// }
// /deep/.el-tabs__item.is-active {
//   color: white;
//   background: #78a5e7;
// }
// /deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
//   border-bottom-color: #78a5e7;
// }
.input-common {
  margin-right: 5px;
}
</style>
