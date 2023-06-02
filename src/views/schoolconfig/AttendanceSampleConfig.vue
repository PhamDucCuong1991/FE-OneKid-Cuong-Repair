<template>
  <div>
    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- điểm danh đến -->
        <el-tab-pane label="Mẫu điểm danh đến" name="arriveTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableArrive"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="arriveDataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
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
              prop="attendanceContent"
              label="Nội dung mẫu điểm danh"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_attendanceSample_update'])"
              label="Tác vụ"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">
                  <el-button size="mini" type="success" disabled>Sửa</el-button>
                  <el-button size="mini" type="danger" disabled>Xóa</el-button>
                </span>
                <span v-else>
                  <el-button
                    size="mini"
                    type="success"
                    @click="updateAttendanceSampleRow(scope.row)"
                    >Sửa</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteAttendanceSampleOneMethod(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="checkPermission(['schoolConfig_attendanceSample_update'])"
            style="float: right; margin: 15px 0"
          >
            <el-button
              class="button-bottom"
              type="success"
              @click="createAttendanceSampleMethod()"
              >Thêm mẫu điểm danh</el-button
            >
          </div>
        </el-tab-pane>

        <!-- điểm danh về -->
        <el-tab-pane label="Mẫu điểm danh về" name="leaveTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableLeave"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="leaveDataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
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
              prop="attendanceContent"
              label="Nội dung mẫu điểm danh"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_attendanceSample_update'])"
              label="Tác vụ"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">
                  <el-button size="mini" type="success" disabled>Sửa</el-button>
                  <el-button size="mini" type="danger" disabled>Xóa</el-button>
                </span>
                <span v-else>
                  <el-button
                    size="mini"
                    type="success"
                    @click="updateEvaluateSampleRow(scope.row)"
                    >Sửa</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deleteAttendanceSampleOneMethod(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="checkPermission(['schoolConfig_attendanceSample_update'])"
            style="float: right; margin: 15px 0"
          >
            <el-button
              class="button-bottom"
              type="success"
              @click="createAttendanceSampleMethod()"
              >Thêm mẫu điểm danh</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <AttendanceSampleUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="AttendanceSampleUpdate"
    />
    <AttendanceSampleCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";

import AttendanceSampleUpdate from "./AttendanceSampleUpdate.vue";
import AttendanceSampleCreate from "./AttendanceSampleCreate.vue";

export default {
  components: {
    AttendanceSampleUpdate,
    AttendanceSampleCreate,
  },
  data() {
    return {
      activeTabName: "arriveTab",
      responseList: [],
      arriveDataList: [],
      leaveDataList: [],
      wishesSampleList: [],

      loaddingButton: false,
      loadingData: true,
      textTableArrive: "",
      textTableLeave: "",

      showUpdateDialog: false,
      showCreateDialog: false,
      loaddingButtonClass: false,
    };
  },
  methods: {
    checkPermission,
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    tableRowStyle({ row }) {
      if (row.idSchool == 0) {
        return "color: #409EFF";
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
    },
    updateAttendanceSampleRow(row) {
      this.showUpdateDialog = true;
      this.$refs.AttendanceSampleUpdate.getAttendanceSampleUpdateInitial(row);
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },

    /**
     * thêm mới mẫu điểm danh
     */
    createAttendanceSampleMethod() {
      this.showCreateDialog = true;
    },

    /**
     * xóa 1 mẫu điểm danh
     */
    deleteAttendanceSampleOneMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa mẫu điểm danh đã chọn?",
        "Xóa mẫu điểm danh",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteAttendanceSampleOne(row.id)
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

    /**
     * tìm kiếm tất cả điểm danh đến
     */
    getAllAttendanceArrive() {
      this.arriveDataList = this.responseList.filter(
        (x) => x.attendanceType == "arrive"
      );
    },
    /**
     * tìm kiếm tất cả điểm danh về
     */
    getAllAttendanceLeave() {
      this.leaveDataList = this.responseList.filter(
        (x) => x.attendanceType == "leave"
      );
    },
    /**
     * find all wishes sample
     */
    findAllWishesSampleMethod() {
      SchoolConfigService.findAllWishesSample()
        .then((resp) => {
          this.wishesSampleList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.wishesSampleList = [];
        });
    },

    /**
     * tìm kiếm tất cả các loại điểm danh đến và về
     */
    searchByProperties() {
      this.loadingData = true;
      SchoolConfigService.findAllAttendanceSample()
        .then((resp) => {
          this.responseList = resp.data.data;
          this.getAllAttendanceArrive();
          this.getAllAttendanceLeave();
        })
        .catch((err) => {
          console.log(err);
          this.responseList = [];
        })
        .finally(() => {
          this.responseList.filter((x) => x.attendanceType == "arrive") == 0
            ? (this.textTableArrive = this.$tableEmpty)
            : (this.textTableArrive = "");
          this.responseList.filter((x) => x.attendanceType == "leave") == 0
            ? (this.textTableLeave = this.$tableEmpty)
            : (this.textTableLeave = "");
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.searchByProperties();
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
// /deep/.el-table .cell {
//   white-space: pre-line;
//   // overflow-y: auto !important;
//   // line-height: 20px;
//   word-break: break-word;
//   max-height: 156px !important;
// }
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
// .wrapper-table {
//   height: 600px;
//   overflow-y: scroll;
//   border-bottom: 1px solid #ebeef5;
// }
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
