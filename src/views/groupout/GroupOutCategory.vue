<template>
  <div class="content">
    <div
      style="margin-bottom: -20px; position: relative; z-index: 1; height: 40px"
    ></div>
    <div class="tab-group-out">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="Học sinh" name="student">
          <!-- table -->
          <div class="table-content row-data">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="groupOutKidsList"
              highlight-current-row
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChange"
              :max-height="$tableMaxHeight"
              border
            >
              <el-table-column
                align="center"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="Tên thư mục"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="note"
                label="Nội dung"
                align="left"
              ></el-table-column>
              <el-table-column
                width="200"
                prop="number"
                label="Số học sinh"
                align="center"
              ></el-table-column>
              <el-table-column
                label="Tác vụ"
                width="160"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="handleEdit(scope.row, ['student'])"
                    >Sửa</el-button
                  >
                  <el-button
                    :disabled="scope.row.defaultStatus"
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)"
                    >Xóa</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- -- -->
        </el-tab-pane>

        <!-- nhân sự -->
        <el-tab-pane label="Nhân sự" name="employee">
          <!-- table -->
          <div class="table-content row-data">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="groupOutEmployeeList"
              highlight-current-row
              :header-cell-style="tableHeaderColor"
              @selection-change="handleSelectionChange"
              :max-height="$tableMaxHeight"
              border
            >
              <el-table-column
                align="center"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="Tên thư mục"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="note"
                label="Nội dung"
                align="left"
              ></el-table-column>
              <el-table-column
                width="200"
                prop="number"
                label="Số nhân sự"
                align="center"
              ></el-table-column>
              <el-table-column
                label="Tác vụ"
                width="160"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="handleEdit(scope.row, ['employee'])"
                    >Sửa</el-button
                  >
                  <el-button
                    :disabled="scope.row.defaultStatus"
                    size="mini"
                    type="danger"
                    @click="handleDeleteEmployee(scope.row)"
                    >Xóa</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="btt">
        <el-button
          v-if="showAdd"
          class="button-over"
          type="success"
          @click="createGroupDialog(['student'])"
          ><i class="el-icon-plus" /> Thêm mới</el-button
        >
        <el-button
          v-else
          class="button-over"
          type="success"
          @click="createGroupDialog(['employee'])"
          ><i class="el-icon-plus" /> Thêm mới</el-button
        >
      </div>
    </div>
    <CreateGroupOut
      :typeView="typeView"
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateGroupOut"
    />
    <UpdateGroupOut
      :typeView="typeView"
      :dialogVisible="showUpdateDialog"
      :updateGroup="updateGroup"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateGroupOut"
    />
  </div>
</template>

<script>
import GroupOutService from "@/services/GroupOutService";
import CreateGroupOut from "./CreateGroupOut.vue";
import UpdateGroupOut from "./UpdateGroupOut.vue";
export default {
  components: {
    CreateGroupOut,
    UpdateGroupOut,
  },
  data() {
    return {
      typeView: "",
      loadingData: true,
      textTable: "",
      activeName: "student",

      multipleSelection: [],
      groupOutEmployeeList: [],
      groupOutKidsList: [],
      updateGroup: {
        id: "",
        name: "",
        note: "",
        defaultStatus: "",
      },
      showAdd: true,
      showCreateDialog: false,
      showUpdateDialog: false,
      showUpdateEmployeeDialog: false,
      showCreateEmployeeDialog: false,
    };
  },
  computed: {
    getAppTypeUserLogin() {
      return this.$store.state.auth.user.appType;
    },
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    //select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    searchByPropertiesKids() {
      this.loadingData = true;
      this.textTable = "";
      GroupOutService.getAllGroupOutKids()
        .then((resp) => {
          this.groupOutKidsList = resp.data.data.groupOutResponseList;
        })
        .catch((err) => {
          this.groupOutKidsList = [];
          console.log(err.response.data.message);
        })
        .finally(() => {
          if (this.groupOutKidsList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    searchByPropertiesEmployee() {
      this.loadingData = true;
      this.textTable = "";
      GroupOutService.getAllGroupOutEmployee()
        .then((resp) => {
          this.groupOutEmployeeList = resp.data.data.groupOutResponseList;
        })
        .catch((err) => {
          this.groupOutEmployeeList = [];
          console.log(err.response.data.message);
        })
        .finally(() => {
          if (this.groupOutKidsList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "student") {
        this.showAdd = true;
      } else if (tabNameClick == "employee") {
        this.showAdd = false;
      }
    },
    createGroupDialog(type) {
      if (type == "student") {
        this.typeView = type;
      } else {
        this.typeView = type;
      }
      this.showCreateDialog = true;
    },
    dialogCloseCreateMethod() {
      this.searchByPropertiesKids();
      this.searchByPropertiesEmployee();
      this.showCreateDialog = false;
    },
    dialogCloseUpdateMethod() {
      this.searchByPropertiesKids();
      this.searchByPropertiesEmployee();
      this.showUpdateDialog = false;
    },
    //delete
    handleDelete(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa thư mục đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        GroupOutService.delete(row.id)
          .then((response) => {
            this.$message({
              message: response.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.searchByPropertiesKids();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    //click edit at row
    handleEdit(row, type) {
      if (type == "student") {
        this.typeView = type;
      } else {
        this.typeView = type;
      }
      this.showUpdateDialog = true;
      this.updateGroup.id = row.id;
      this.updateGroup.name = row.name;
      this.updateGroup.note = row.note;
      this.updateGroup.defaultStatus = row.defaultStatus;
    },
    //delete
    handleDeleteEmployee(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa thư mục đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        GroupOutService.deleteEmployee(row.id)
          .then((response) => {
            this.$message({
              message: response.data.message,
              type: "success",
            });
            setTimeout(() => {
              this.searchByPropertiesEmployee();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
        console.log(row);
      });
    },
    //click edit at row
    handleEditEmployee(row) {
      this.showUpdateEmployeeDialog = true;
      this.updateGroupEmployee.id = row.id;
      this.updateGroupEmployee.name = row.name;
      this.updateGroupEmployee.note = row.note;
      this.updateGroupEmployee.defaultStatus = row.defaultStatus;
    },
  },
  beforeMount() {
    this.searchByPropertiesKids();
    this.searchByPropertiesEmployee();
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-table th {
  padding: 10px 0;
}
.button-over {
  border-radius: 0;
  margin-left: 3px;
}
.btt {
  float: right;
}
.paging-click {
  float: left;
  margin-top: 5px;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/[data-v-5ed4c166] .el-tabs--card > .el-tabs__header {
  border-bottom: none;
  margin-top: -8px;
}
/deep/.el-tabs__nav-wrap {
  margin-top: 0px;
  margin-bottom: -15px;
}
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-icon-loading:before {
  content: "\e6cf";
}
/deep/.el-loading-spinner .el-loading-text {
  color: #606266;
  font-size: 15px;
}
/deep/.el-loading-spinner {
  top: 67%;
  width: 100%;
  text-align: center;
  position: absolute;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}

/deep/.el-table th > .cell {
  text-align: center !important;
}
.buttonxemchitiet {
  background-color: #78a5e7;
}
/deep/.date[data-v-5ed4c166] {
  margin-bottom: -25px;
  z-index: 2;
  position: relative;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}

.content .row-data {
  margin-bottom: 20px;
}
.table-content {
  .el-table {
    border-top-left-radius: 5px;
    border: 1px solid #78a5e7;
  }
}
// .el-dropdown-menu li {
//   color: white;
//   border-top: 1px solid white;
//   font-family: Arial, Helvetica, sans-serif;
// }
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}
/deep/.el-input__inner1998 {
  border: 1px solid #ffffff;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}
/deep/.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  /* border: red; */
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: rgb(95, 180, 74);
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
