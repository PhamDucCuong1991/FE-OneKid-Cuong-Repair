<template>
  <div>
    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- sinh nhật -->
        <el-tab-pane label="Sinh nhật" name="birthdayTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableBirthDay"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="birthdaySampleList"
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
              prop="birthdayType"
              label="Đối tượng"
              width="200"
            ></el-table-column>
            <el-table-column prop="content" label="Nội dung"></el-table-column>
            <el-table-column label="Kích hoạt" width="90" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  @change="activeMutipleRow(scope.row, 'activeColumn')"
                  v-model="scope.row.active"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Gửi qua App" width="110" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  @change="activeMutipleRow(scope.row, 'activeAppColumn')"
                  v-model="scope.row.appSend"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Gửi qua SMS" width="110" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  @change="activeMutipleRow(scope.row, 'activeSMSColumn')"
                  v-model="scope.row.smsSend"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Ảnh" width="150" align="center">
              <template slot-scope="scope">
                <el-image
                  style="width: 120px; height: 120px"
                  :src="scope.row.urlPicture"
                  fit="fill"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="110" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateBirthdaySample(scope.row)"
                  >Sửa</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ngày lễ -->
        <el-tab-pane label="Ngày lễ" name="celebrateTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableCelebrate"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="celebrateSampleList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeMedia"
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
            <el-table-column fixed label="Ngày lễ" width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.date }}/{{ scope.row.month }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="Tiêu đề"
              min-width="300"
            ></el-table-column>
            <el-table-column
              prop="content"
              label="Nội dung"
              min-width="400"
            ></el-table-column>
            <el-table-column
              prop="gender"
              label="Giới tính"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="Đối tượng"
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column label="Kích hoạt" width="90" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  @change="activeMutipleCelebrateRow(scope.row, 'activeColumn')"
                  v-model="scope.row.active"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Gửi qua App" width="110" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  @change="
                    activeMutipleCelebrateRow(scope.row, 'activeAppColumn')
                  "
                  v-model="scope.row.appSend"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="Gửi qua SMS" width="110" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  @change="
                    activeMutipleCelebrateRow(scope.row, 'activeSMSColumn')
                  "
                  v-model="scope.row.smsSend"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="Tác vụ"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateCelebrateSampleMethod(scope.row)"
                  >Sửa</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteCelebrateSampleMethod(scope.row)"
                  >Xóa</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              @click="createWishesSampleMethod()"
              >Thêm ngày lễ</el-button
            >
          </div>
        </el-tab-pane>

        <!-- Tiêu đề tin -->
        <el-tab-pane label="Tiêu đề tin" name="titleSmsTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableTitle"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="titleSmsList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            @selection-change="handleSelectionChangeMedia"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              prop="titleSms"
              label="Nội dung tiêu đề"
            ></el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <BirthdaySampleUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="BirthdaySampleUpdate"
    />
    <CelebrateSampleCreate
      :dialogVisible="showCreateCelebrateDialog"
      @dialog-close="dialogCloseCreateCelebrateMethod()"
    />
    <CelebrateSampleUpdate
      :dialogVisible="showUpdateCelebrateDialog"
      @dialog-close="dialogCloseUpdateCelebrateMethod()"
      ref="CelebrateSampleUpdate"
    />
  </div>
</template>


<script>
import SchoolConfigService from "@/services/SchoolConfigService";

import BirthdaySampleUpdate from "./BirthdaySampleUpdate.vue";
import CelebrateSampleCreate from "./CelebrateSampleCreate.vue";
import CelebrateSampleUpdate from "./CelebrateSampleUpdate.vue";

export default {
  components: {
    BirthdaySampleUpdate,
    CelebrateSampleCreate,
    CelebrateSampleUpdate,
  },
  data() {
    return {
      loadingData: true,
      textTableBirthDay: "",
      textTableCelebrate: "",
      textTableTitle: "",
      activeTabName: "birthdayTab",
      showDataSearch: true,
      titleSmsList: [{ titleSms: "" }],
      birthdaySampleList: [],
      celebrateSampleList: [],
      noSelect: "",
      multipleSelectionMedia: [],
      albumRadio: false,
      loaddingButton: false,
      showUpdateDialog: false,
      showUpdateCelebrateDialog: false,
      showCreateCelebrateDialog: false,
      loaddingButtonClass: false,
      gradeList: [],
      classFirstGradeList: [],
      classList: [],
      dataSearch: {
        idGrade: "",
        idClass: "",
        className: "",
      },
    };
  },
  methods: {
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
      if (tabNameClick == "birthdayTab") {
        this.findAllBirthdaySampleMethod();
      } else if (tabNameClick == "celebrateTab") {
        this.findAllCelebrateSampleMethod();
      } else if (tabNameClick == "titleSmsTab") {
        this.fillAllTitleSmsMethod();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.findAllBirthdaySampleMethod();
    },
    dialogCloseUpdateCelebrateMethod() {
      this.showUpdateCelebrateDialog = false;
      this.findAllCelebrateSampleMethod();
    },
    updateBirthdaySample(row) {
      this.showUpdateDialog = true;
      this.$refs.BirthdaySampleUpdate.getDataInitial(row);
    },
    updateCelebrateSampleMethod(row) {
      this.$refs.CelebrateSampleUpdate.getDataInitial(row);
      setTimeout(() => {
        this.showUpdateCelebrateDialog = true;
      }, 100);
    },
    dialogCloseCreateCelebrateMethod() {
      this.showCreateCelebrateDialog = false;
      this.findAllCelebrateSampleMethod();
    },
    findAllCelebrateSampleMethod() {
      this.loadingData = true;
      SchoolConfigService.findAllCelebrateSample()
        .then((resp) => {
          this.celebrateSampleList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.celebrateSampleList = null;
        })
        .finally(() => {
          if (this.celebrateSampleList.length == 0) {
            this.textTableCelebrate = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * cập nhật kích hoạt celebrate
     */
    activeMutipleCelebrateRow(row, type) {
      let textAlert = "";
      if (type == "activeColumn") {
        if (row.active) {
          textAlert = "Kích hoạt";
        } else {
          textAlert = "Hủy kích hoạt";
        }
      } else if (type == "activeAppColumn") {
        if (row.appSend) {
          textAlert = "Kích hoạt gửi qua App";
        } else {
          textAlert = "Hủy kích hoạt gửi qua App";
        }
      } else if (type == "activeSMSColumn") {
        if (row.smsSend) {
          textAlert = "Kích hoạt gửi qua SMS";
        } else {
          textAlert = "Hủy kích hoạt gửi qua SMS";
        }
      }
      SchoolConfigService.updateActiveCelebrateSample(row)
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
    createWishesSampleMethod() {
      this.showCreateCelebrateDialog = true;
    },
    /**
     * cập nhật kích hoạt sinh nhật
     */
    activeMutipleRow(row, type) {
      let textAlert = "";
      if (type == "activeColumn") {
        if (row.active) {
          textAlert = "Kích hoạt";
        } else {
          textAlert = "Hủy kích hoạt";
        }
      } else if (type == "activeAppColumn") {
        if (row.appSend) {
          textAlert = "Kích hoạt gửi qua App";
        } else {
          textAlert = "Hủy kích hoạt gửi qua App";
        }
      } else if (type == "activeSMSColumn") {
        if (row.smsSend) {
          textAlert = "Kích hoạt gửi qua SMS";
        } else {
          textAlert = "Hủy kích hoạt gửi qua SMS";
        }
      }
      SchoolConfigService.updateActiveBirthdaySample(row)
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
     * delete celebrate
     */
    deleteCelebrateSampleMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa ngày lễ đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteCelebrateSample(row.id)
          .then((resp) => {
            let data = resp.data.data;
            console.log(data);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.findAllCelebrateSampleMethod();
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
     * tìm kiếm title sms
     */
    fillAllTitleSmsMethod() {
      this.loadingData = true;
      SchoolConfigService.getConfigCommon()
        .then((resp) => {
          this.titleSmsList[0].titleSms =
            resp.data.data.sysConfigShowResponse.titleContentSms;
        })
        .catch((err) => {
          console.log(err);
          this.titleSmsList = null;
        })
        .finally(() => {
          if (this.titleSmsList[0].titleSms == null) {
            this.textTableTitle = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * tìm kiếm tất cả mẫu sinh nhật
     */
    findAllBirthdaySampleMethod() {
      this.loadingData = true;
      SchoolConfigService.findAllBirthdaySample()
        .then((resp) => {
          this.birthdaySampleList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.birthdaySampleList = null;
        })
        .finally(() => {
          if (this.birthdaySampleList.length == 0) {
            this.textTableBirthDay = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },
  beforeMount() {
    this.findAllBirthdaySampleMethod();
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
//   white-space: pre-line;
//   line-height: 20px;
//   word-break: break-word;
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