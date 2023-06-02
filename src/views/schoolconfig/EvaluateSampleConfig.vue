<template>
  <div>
    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- học tập -->
        <el-tab-pane label="Học tập" name="learnTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableLearn"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="learnDataList"
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
              prop="evaluateContent"
              label="Nội dung mẫu nhận xét"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_evaluateSample_update'])"
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
                    @click="deleteEvlauateSampleOneMethod(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- ăn uống -->
        <el-tab-pane label="Ăn uống" name="eatTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableEat"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="eatDataList"
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
              prop="evaluateContent"
              label="Nội dung mẫu nhận xét"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_evaluateSample_update'])"
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
                    @click="deleteEvlauateSampleOneMethod(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- ngủ nghỉ -->
        <el-tab-pane label="Ngủ nghỉ" name="sleepTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableSleep"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="sleepDataList"
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
              prop="evaluateContent"
              label="Nội dung mẫu nhận xét"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_evaluateSample_update'])"
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
                    @click="deleteEvlauateSampleOneMethod(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- vệ sinh -->
        <el-tab-pane label="Vệ sinh" name="sanitaryTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableSanitary"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="sanitaryDataList"
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
              prop="evaluateContent"
              label="Nội dung mẫu nhận xét"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_evaluateSample_update'])"
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
                    @click="deleteEvlauateSampleOneMethod(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- sức khỏe -->
        <el-tab-pane label="Sức khỏe" name="healtTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableHealt"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="healtDataList"
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
              prop="evaluateContent"
              label="Nội dung mẫu nhận xét"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_evaluateSample_update'])"
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
                    @click="deleteEvlauateSampleOneMethod(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- chung -->
        <el-tab-pane label="Nhận xét chung" name="commonTab">
          <el-table
            ref="multipleTable"
            :empty-text="textTableCommon"
            v-loading="loadingData"
            :element-loading-text="$tableLoadding"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255,255,255, 0)"
            highlight-current-row
            :data="commonDataList"
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
              prop="evaluateContent"
              label="Nội dung mẫu nhận xét"
            ></el-table-column>
            <el-table-column label="Nguồn" width="130" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.idSchool == 0">Hệ thống</span>
                <span v-else>Nhà trường</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="checkPermission(['schoolConfig_evaluateSample_update'])"
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
                    @click="deleteEvlauateSampleOneMethod(scope.row)"
                    >Xóa</el-button
                  >
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <div
          v-if="checkPermission(['schoolConfig_evaluateSample_update'])"
          style="float: right; margin: 15px 0"
        >
          <el-button
            type="success"
            style="border-radius: 0"
            @click="addEvaluateSampleMethod()"
            >Thêm mẫu</el-button
          >
        </div>
      </el-tabs>
    </div>
    <EvaluateSampleUpdate
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="EvaluateSampleUpdate"
    />
    <EvaluateSampleCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";

import EvaluateSampleUpdate from "./EvaluateSampleUpdate.vue";
import EvaluateSampleCreate from "./EvaluateSampleCreate.vue";

export default {
  components: {
    EvaluateSampleUpdate,
    EvaluateSampleCreate,
  },
  data() {
    return {
      activeTabName: "learnTab",
      mediaList: [],
      evaluateSampleList: [],
      learnDataList: [],
      eatDataList: [],
      sleepDataList: [],
      sanitaryDataList: [],
      healtDataList: [],
      commonDataList: [],
      loaddingButton: false,
      showUpdateDialog: false,
      showCreateDialog: false,
      loaddingButtonClass: false,

      loadingData: true,
      textTableSanitary: "",
      textTableLearn: "",
      textTableCommon: "",
      textTableHealt: "",
      textTableSleep: "",
      textTableEat: "",
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
    handleCommand(command) {
      if (command == "exportDate") {
        this.exportExcelAttendanceDate();
      } else if (command == "exportMonth") {
        this.exportExcelAttendanceMonth();
      }
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.findAllEvaluateSample();
    },
    updateEvaluateSampleRow(row) {
      this.showUpdateDialog = true;
      this.$refs.EvaluateSampleUpdate.getEvaluateSampleUpdateInitial(row);
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.findAllEvaluateSample();
    },
    /**
     * thêm mẫu
     */
    addEvaluateSampleMethod() {
      this.showCreateDialog = true;
    },
    /**
     * xóa 1 mẫu nhận xét
     */
    deleteEvlauateSampleOneMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa mẫu nhận xét đã chọn?",
        "Xóa mẫu nhận xét",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteEvaluateSampleOne(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.findAllEvaluateSample();
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
     * tìm kiếm tất cả nhận xét học
     */
    getAllEvaluateLearn() {
      this.learnDataList = this.evaluateSampleList.filter(
        (x) => x.evaluateType == "learn"
      );
    },
    /**
     * tìm kiếm tất cả nhận xét ăn
     */
    getAllEvaluateEat() {
      this.eatDataList = this.evaluateSampleList.filter(
        (x) => x.evaluateType == "eat"
      );
    },
    /**
     * tìm kiếm tất cả nhận ngủ nghỉ
     */
    getAllEvaluateSleep() {
      this.sleepDataList = this.evaluateSampleList.filter(
        (x) => x.evaluateType == "sleep"
      );
    },
    /**
     * tìm kiếm tất cả nhận vệ sinh
     */
    getAllEvaluateSanitary() {
      this.sanitaryDataList = this.evaluateSampleList.filter(
        (x) => x.evaluateType == "sanitary"
      );
    },
    /**
     * tìm kiếm tất cả nhận xét sức khỏa
     */
    getAllEvaluateHealt() {
      this.healtDataList = this.evaluateSampleList.filter(
        (x) => x.evaluateType == "healt"
      );
    },
    /**
     * tìm kiếm tất cả nhận xét chung
     */
    getAllEvaluateCommon() {
      this.commonDataList = this.evaluateSampleList.filter(
        (x) => x.evaluateType == "common"
      );
    },
    /**
     * tìm kiếm tất cả các loại nhận xét
     */
    findAllEvaluateSample() {
      this.loadingData = true;
      SchoolConfigService.findAllEvaluateSample()
        .then((resp) => {
          this.evaluateSampleList = resp.data.data;
          this.getAllEvaluateLearn();
          this.getAllEvaluateEat();
          this.getAllEvaluateSleep();
          this.getAllEvaluateSanitary();
          this.getAllEvaluateHealt();
          this.getAllEvaluateCommon();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          this.evaluateSampleList.filter((x) => x.evaluateType == "learn") == 0
            ? (this.textTableLearn = this.$tableEmpty)
            : (this.textTableLearn = "");
          this.evaluateSampleList.filter((x) => x.evaluateType == "eat") == 0
            ? (this.textTableEat = this.$tableEmpty)
            : (this.textTableEat = "");
          this.evaluateSampleList.filter((x) => x.evaluateType == "sleep") == 0
            ? (this.textTableSleep = this.$tableEmpty)
            : (this.textTableSleep = "");
          this.evaluateSampleList.filter((x) => x.evaluateType == "sanitary") ==
          0
            ? (this.textTableSanitary = this.$tableEmpty)
            : (this.textTableSanitary = "");
          this.evaluateSampleList.filter((x) => x.evaluateType == "healt") == 0
            ? (this.textTableHealt = this.$tableEmpty)
            : (this.textTableHealt = "");
          this.evaluateSampleList.filter((x) => x.evaluateType == "common") == 0
            ? (this.textTableCommon = this.$tableEmpty)
            : (this.textTableCommon = "");
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.findAllEvaluateSample();
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
// /deep/.el-table .cell {
//   white-space: pre-line;
//   word-break: break-word;
// }
// /deep/.el-table .cell {
//   white-space: pre-line;
//   overflow-y: auto !important;
//   line-height: 20px;
//   word-break: break-word;
//   max-height: 60px !important;
// }
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
