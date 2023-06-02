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
              label="Nội dung mẫu nhận xét"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="140" align="center">
              <template slot-scope="scope">
                <span>
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
          <div style="float: right; margin: 15px 0">
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
              label="Nội dung mẫu nhận xét"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="140" align="center">
              <template slot-scope="scope">
                <span>
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
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              @click="createAttendanceSampleMethod()"
              >Thêm mẫu điểm danh</el-button
            >
          </div>
        </el-tab-pane>
        <!-- mẫu lời chúc -->
        <el-tab-pane label="Mẫu lời chúc" name="wishesSampleTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableSample"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="wishesSampleList"
            :row-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="60"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="wishesContent"
              label="Nội dung"
            ></el-table-column>
            <el-table-column
              prop="receiverType"
              label="Đối tượng"
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column label="Ảnh" width="200" align="center">
              <template slot-scope="scope">
                <el-image
                  style="width: 150px; height: 150px"
                  :src="scope.row.urlPicture"
                  fit="fill"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="Tác vụ" width="140" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="success"
                  @click="updateWishesSampleMethod(scope.row)"
                  >Sửa</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteWishesSampleMethod(scope.row)"
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
              >Thêm mẫu lời chúc</el-button
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
    <WishesSampleCreate
      :dialogVisible="showWishesCreateDialog"
      @dialog-close="dialogCloseWishesCreateMethod()"
    />
    <WishesSampleUpdate
      :dialogVisible="showWishesUpdateDialog"
      @dialog-close="dialogCloseWishesUpdateMethod()"
      ref="WishesSampleUpdate"
    />
  </div>
</template>

<script>
import SystemConfigService from "@/services/SystemConfigService";

import AttendanceSampleUpdate from "./AttendanceSampleUpdate.vue";
import AttendanceSampleCreate from "./AttendanceSampleCreate.vue";
import WishesSampleCreate from "./WishesSampleCreate.vue";
import WishesSampleUpdate from "./WishesSampleUpdate.vue";

export default {
  components: {
    AttendanceSampleUpdate,
    AttendanceSampleCreate,
    WishesSampleCreate,
    WishesSampleUpdate,
  },
  data() {
    return {
      activeTabName: "arriveTab",
      attendanceSampleList: [],
      wishesSampleList: [],
      arriveDataList: [],
      leaveDataList: [],
      wishDataList: [],

      loaddingButton: false,
      textTableSample: "",
      textTableLeave: "",
      textTableArrive: "",
      loadingData: true,

      showUpdateDialog: false,
      showAddMediaDialog: false,
      showCreateDialog: false,
      showWishesCreateDialog: false,
      showWishesUpdateDialog: false,
      loaddingButtonClass: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    // tableRowStyle({ row }) {
    //   if (row.idSchool == 0) {
    //     return "color: #409EFF";
    //   }
    // },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "arriveTab") {
        this.findAllAttendanceSample();
      } else if (tabNameClick == "leaveTab") {
        this.findAllAttendanceSample();
      } else if (tabNameClick == "wishesSampleTab") {
        this.findAllWishesSample();
      }
    },
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelAttendanceDate();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.findAllAttendanceSample();
    },

    dialogCloseAddMediaMethod() {
      this.showAddMediaDialog = false;
      this.findAllAttendanceSample();
    },
    updateAttendanceSampleRow(row) {
      this.showUpdateDialog = true;
      this.$refs.AttendanceSampleUpdate.getAttendanceSampleUpdateInitial(row);
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.findAllAttendanceSample();
    },
    dialogCloseWishesCreateMethod() {
      this.showWishesCreateDialog = false;
      this.findAllWishesSample();
    },
    dialogCloseWishesUpdateMethod() {
      this.showWishesUpdateDialog = false;
      this.findAllWishesSample();
    },

    /**
     * thêm mới mẫu điểm danh
     */
    createAttendanceSampleMethod() {
      this.showCreateDialog = true;
    },
    createWishesSampleMethod() {
      this.showWishesCreateDialog = true;
    },
    updateWishesSampleMethod(row) {
      this.showWishesUpdateDialog = true;
      this.$refs.WishesSampleUpdate.getDataInitial(row);
    },
    /**
     * delete wishes sample
     */
    deleteWishesSampleMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa mẫu lời chúc đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SystemConfigService.deleteWishesSample(row.id)
          .then((resp) => {
            let data = resp.data.data;
            console.log(data);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.findAllWishesSample();
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
        SystemConfigService.deleteAttendanceSampleOne(row.id)
          .then((resp) => {
            let data = resp.data.data;
            console.log(data);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            this.findAllAttendanceSample();
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
     * tìm kiếm tất cả nhận xét học
     */
    getAllAttendanceArrive() {
      this.arriveDataList = this.attendanceSampleList.filter(
        (x) => x.attendanceType == "arrive"
      );
    },
    /**
     * tìm kiếm tất cả nhận xét ăn
     */
    getAllAttendanceLeave() {
      this.leaveDataList = this.attendanceSampleList.filter(
        (x) => x.attendanceType == "leave"
      );
    },

    /**
     * find all wishes sample
     */
    findAllWishesSample() {
      this.loadingData = true;
      SystemConfigService.findAllWishesSample()
        .then((resp) => {
          this.wishesSampleList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.wishesSampleList = null;
        })
        .finally(() => {
          if (this.wishesSampleList.length == 0) {
            this.textTableSample = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    /**
     * tìm kiếm tất cả các loại điểm danh đến và về
     */
    findAllAttendanceSample() {
      this.loadingData = true;
      SystemConfigService.findAllAttendanceSample()
        .then((resp) => {
          this.attendanceSampleList = resp.data.data;
          this.getAllAttendanceArrive();
          this.getAllAttendanceLeave();
        })
        .catch((err) => {
          console.log(err);
          this.attendanceSampleList = null;
        })
        .finally(() => {
          if (this.attendanceSampleList.length == 0) {
            this.textTableSample = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.findAllAttendanceSample();
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
/deep/.el-table td,
/deep/.el-table th {
  padding: 10px 0;
}
/deep/.el-table .cell {
  line-height: 15px;
}
/deep/.el-table th > .cell {
  font-size: 13px;
}
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
td {
  padding: 12px;
}
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
/deep/.el-table .cell {
  overflow-y: auto !important;
  white-space: pre-line;
  line-height: 20px;
  word-break: break-word;
  max-height: 156px !important;
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
