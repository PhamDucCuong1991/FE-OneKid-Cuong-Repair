<template>
  <div>
    <div
      class="search-input"
      :style="{ visibility: showDataSearch ? 'visible' : 'hidden' }"
      style="
        margin-bottom: -20px;
        position: relative;
        z-index: 1;
        margin-top: 5px;
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

    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- media setting -->
        <el-tab-pane label="Media setting" name="mediaSetting">
          <el-table
            ref="multipleTable"
            :empty-text="textTableSetting"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="mediaSettingList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeMedia"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="className"
              label="Tên lớp"
              width="200"
            ></el-table-column>
            <el-table-column label="Danh sách áp dụng">
              <template slot-scope="scope">
                <el-tag
                  style="margin-right: 8px"
                  v-for="item in scope.row.mediaList"
                  :key="item.id"
                  type
                  effect="plain"
                  >{{ item.mediaName }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="130" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="addMediaForClassMethod(scope.row)"
                  >Thêm Media</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- media config -->
        <el-tab-pane label="Media config" name="mediaConfig">
          <el-table
            ref="multipleTable"
            :empty-text="textTableConfig"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="mediaList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeMedia"
            :max-height="$tableMaxHeight"
            border
          >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="mediaName"
              label="Tên media"
            ></el-table-column>
            <el-table-column
              prop="linkMedia"
              label="Media Link"
            ></el-table-column>
            <el-table-column
              prop="mediaType"
              label="Loại"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="scopeType"
              label="Phạm vi"
              align="center"
            ></el-table-column>
            <el-table-column label="Kích hoạt" align="center" width="100">
              <template slot-scope="scope">
                <el-checkbox
                  @change="activeMediaMethod(scope.row)"
                  v-model="scope.row.mediaActive"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="Ghi chú"></el-table-column>
            <el-table-column label="Tác vụ" width="140" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateMediaMethod(scope.row)"
                  >{{ $t("button.update") }}</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteOneMediaMethod(scope.row)"
                  >{{ $t("button.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              type="success"
              class="button-bottom"
              @click="addMediaMethod()"
            >
              <i class="el-icon-circle-check" />
              Thêm media
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <MediaUpdateDialog
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="MediaUpdateDialog"
    />
    <MediaCreateDialog
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
    <AddMediaForClassDialog
      :dialogVisible="showAddMediaDialog"
      @dialog-close="dialogCloseAddMediaMethod()"
      ref="AddMediaForClassDialog"
    />
  </div>
</template>

<script>
import SchoolConfigService from "@/services/SchoolConfigService";

import MediaUpdateDialog from "./MediaUpdateDialog.vue";
import MediaCreateDialog from "./MediaCreateDialog.vue";
import AddMediaForClassDialog from "./AddMediaForClassDialog.vue";
import {mapActions, mapState} from "vuex";

export default {
  components: {
    MediaUpdateDialog,
    MediaCreateDialog,
    AddMediaForClassDialog,
  },
  data() {
    return {
      loadingData: true,
      textTableSetting: "",
      textTableConfig: "",
      activeTabName: "mediaSetting",
      showDataSearch: true,
      mediaList: [],
      mediaSettingList: [],
      noSelect: "",
      multipleSelectionMedia: [],
      albumRadio: false,
      loaddingButton: false,
      showUpdateDialog: false,
      showAddMediaDialog: false,
      showCreateDialog: false,
      loaddingButtonClass: false,
      gradeList: [],
      classList: [],
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
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyleDetail({ row }) {
      if (
        row.absentStatus == "Nghỉ có phép" ||
        row.absentStatus == "Nghỉ không phép"
      ) {
        return "color: red";
      } else if (row.absentStatus == "Chưa điểm danh") {
        return "color: #409EFF";
      }
    },
    handleSelectionChangeMedia(val) {
      this.multipleSelectionMedia = val;
    },
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelAttendanceDate();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      }
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "mediaSetting") {
        this.showDataSearch = true;
        this.searchByProperties();
      } else if (tabNameClick == "mediaConfig") {
        this.showDataSearch = false;
        this.findAllMediaMethod();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.findAllMediaMethod();
    },
    dialogCloseAddMediaMethod() {
      this.showAddMediaDialog = false;
      this.searchByProperties();
    },
    updateMediaMethod(row) {
      this.showUpdateDialog = true;
      this.$refs.MediaUpdateDialog.getDataInitial(row);
    },
    addMediaForClassMethod(row) {
      setTimeout(() => {
        this.showAddMediaDialog = true;
      }, 100);
      this.$refs.AddMediaForClassDialog.getMediaForClassInitial(row.id);
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.findAllMediaMethod();
    },
    addMediaMethod() {
      this.showCreateDialog = true;
    },
    /**
     * xóa 1 media
     */
    deleteOneMediaMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa Media Link đã chọn?",
        "Xóa Media Link",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteOneMedia(row.id)
          .then((resp) => {
            let data = resp.data.data;
            console.log(data);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.findAllMediaMethod();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa thất bại",
              type: "error",
            });
          });
      });
    },
    /**
     * kích hoạt 1 media
     */
    activeMediaMethod(row) {
      let textAlert = "";
      if (row.mediaActive) {
        textAlert = "Kích hoạt";
      } else {
        textAlert = "Hủy kích hoạt";
      }
      SchoolConfigService.updateActiveMedia(row)
        .then((resp) => {
          let checkActive = resp.data.data;
          console.log(checkActive);
          this.$message({
            message: textAlert + " thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: textAlert + " thất bại",
            type: "error",
          });
        });
    },
    /**
     * lưu cấu nghỉ học của các lớp
     */
    submitConfigClass() {
      let dataClassList = this.mediaList;
      if (dataClassList.length == 0) {
        this.$message({
          message: "Không có lớp nào",
          type: "error",
        });
        return;
      }
      this.loaddingButtonClass = true;
      SchoolConfigService.updateConfigClassAbsent(this.mediaList)
        .then((resp) => {
          this.mediaList = resp.data.data;
          this.$message({
            message: "Lưu cấu hình ngày nghỉ thành công",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lưu cấu hình ngày nghỉ thất bại ",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButtonClass = false;
          }, 500);
        });
    },

    /**
     * tìm kiếm tất cả các media
     */
    findAllMediaMethod() {
      this.loadingData = true;
      SchoolConfigService.findAllMedia()
        .then((resp) => {
          this.mediaList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.mediaList = null;
        })
        .finally(() => {
          if (this.mediaList.length == 0) {
            this.textTableConfig = this.$tableEmpty;
          }
          this.loadingData = false;
          // this.getClassFirstGrade(this.dataSearch.idGrade);
        });
    },
    /**
     * tìm kiếm tất cả media setting
     */
    searchByProperties() {
      this.loadingData = true;
      let data = this.dataSearch;
      SchoolConfigService.findAllMediaSetting(
        data.idGrade,
        data.idClass,
        data.className
      )
        .then((resp) => {
          this.mediaSettingList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.mediaSettingList = null;
        })
        .finally(() => {
          if (this.mediaSettingList.length == 0) {
            this.textTableSetting = this.$tableEmpty;
          }
          this.loadingData = false;
          // this.getClassFirstGrade(this.dataSearch.idGrade);
        });
    },
    /**
     * thay đổi khối
     */
    changeGradeMethod() {
      this.dataSearch.idClass = "";
      this.getClassOfGrade();
      this.findAllCameraSettingMethod();
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
     await this.getClassOfGrade();
      this.searchByProperties();
    },
  },
  beforeMount() {
    this.fetchDataMany();
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
// /deep/.el-table td,
// /deep/.el-table th {
//   padding: 10px 0;
// }
// /deep/.el-table .cell {
//   line-height: 15px;
// }
// /deep/.el-table th > .cell {
//   font-size: 13px;
// }
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
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
  // height: 600px;
  font-family: Arial, Helvetica, sans-serif;
  // display: block;
  // width: 90%;
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
</style>
