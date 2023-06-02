<template>
  <div class="content">
    <div style="float: left">
      <!-- chọn đại lý -->
      <el-select
        class="button-left-class"
        v-model="dataSearch.idAgent"
        @change="changeAgentMethod()"
        placeholder="Chọn đại lý"
      >
        <el-option
          v-for="item in agentList"
          :key="item.id"
          :value="item.id"
          :label="item.agentName"
        ></el-option>
      </el-select>
      <!-- trạng thái xóa -->
      <el-select
        class="button-left-class"
        v-model="dataSearch.deleteStatus"
        placeholder="Chọn trạng thái"
        @change="searchHeaderMethod()"
      >
        <el-option
          v-for="item in deleteList"
          :key="item.key"
          :value="item.key"
          :label="item.value"
        ></el-option>
      </el-select>

      <!-- chọn trường -->
      <el-select
        style="width: 250px; margin-right: 5px"
        filterable
        clearable
        v-model="dataSearch.idSchool"
        placeholder="Chọn trường"
        @change="searchHeaderMethod()"
      >
        <el-option
          v-for="item in schoolList"
          :key="item.id"
          :value="item.id"
          :label="item.id+' - '+item.schoolName"
        >
        <span>{{ item.id }}</span> - 
        <span>{{ item.schoolName }}</span>
        </el-option>
      </el-select>
      <el-select
        @change="searchHeaderMethod()"
        v-model="dataSearch.activated"
        class="button-left-class"
        placeholder="Trạng thái"
        clearable
      >
        <el-option
          v-for="item in statusSchool"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        ></el-option>
      </el-select>

      <el-input
        v-model="dataSearch.name"
        style="width: 250px"
        placeholder="Nhập tên trường"
        @clear="searchHeaderMethod()"
        clearable
        @keyup.enter.native="searchHeaderMethod()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchHeaderMethod()"
        ></el-button>
      </el-input>
    </div>
    <div class="button-click row-data">
      <el-button
        class="button-over"
        type="success"
        @click="createSchoolDialog()"
      >
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
      <el-button
        class="button-over"
        type="success"
        @click="addSmsSchoolDialog()"
        >Cấp SMS</el-button
      >
      <el-button class="button-over" type="success" @click="updateGroupMethod()"
        >Sửa nhóm</el-button
      >
      <el-dropdown @command="handleAction">
        <el-button class="button-over" type="success">
          Tác vụ
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu>
          <el-dropdown-item>Gửi tin SMS</el-dropdown-item>
          <el-dropdown-item command="activeSchool"
            >Kích hoạt trường</el-dropdown-item
          >
          <el-dropdown-item command="unActiveSchool"
            >Hủy kích hoạt</el-dropdown-item
          >
          <el-dropdown-item command="exportSchool"
            >Xuất file trường</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="table-content row-data">
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="responseDataList"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="selection"
          align="center"
          fixed
          width="55"
        ></el-table-column>
        <el-table-column
          fixed
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          fixed
          min-width="170px"
          prop="schoolName"
          label="Tên trường"
          align="left"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }} - {{ scope.row.schoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120px"
          prop="agent.agentName"
          label="Tên đại lý"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="createdDate"
          label="Thời gian tạo"
          align="center"
          min-width="135"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createdDate | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          prop="countStudy"
          label="HS đang học"
          align="center"
        ></el-table-column>
        <el-table-column
          width="90px"
          prop="groupType"
          label="Nhóm"
          align="center"
        ></el-table-column>
        <el-table-column
          width="80px"
          prop="schoolActive"
          label="Kích hoạt"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              @change="
                selectionSchoolActive(scope.$index, scope.row, 'activeSchool')
              "
              v-model="scope.row.schoolActive"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          width="110px"
          prop="smsBudget"
          label="SMS mặc định"
          align="center"
        ></el-table-column>
        <el-table-column
          width="95px"
          prop="smsActiveMore"
          label="More Active"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              @change="
                selectionSchoolActive(scope.$index, scope.row, 'activeMore')
              "
              v-model="scope.row.smsActiveMore"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          width="90px"
          prop="smsTotal"
          label="SMS Total"
          align="center"
        ></el-table-column>
        <el-table-column
          width="90px"
          prop="smsUsed"
          label="SMS Used"
          align="center"
        ></el-table-column>
        <el-table-column
          width="90px"
          prop="smsRemain"
          label="Còn lại"
          align="center"
        ></el-table-column>
        <el-table-column label="Lịch sử SMS" width="100px" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleViewSmsSchool(scope.$index, scope.row)"
              size="mini"
              type="text"
              >Xem</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="Tác vụ"
          width="150px"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.row)"
              >Sửa</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paging-click row-data">
      <el-pagination
        background
        :current-page="pageNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="$pageListDefaultNew"
        :page-size="maxPageItem"
        :layout="$pageLayoutDefault"
        :total="pageTotal"
      ></el-pagination>
    </div>

    <CreateSchool
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateSchool"
    />
    <UpdateSchool
      :dialogVisible="showUpdateDialog"
      :editSchool="updateSchool"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateSchool"
    />
    <AddSmsSchool
      :dialogVisible="showAddSmsSchool"
      @dialog-close="dialogCloseAddSmsSchoolMethod()"
      ref="AddSmsSchool"
    />
    <SmsSchool
      :dialogVisible="showSmsSchool"
      @dialog-close="dialogCloseSmsSchoolMethod()"
      ref="SmsSchool"
    />
    <UpdateGroupDialog
      :dialogVisible="showUpdateGroupDialog"
      :editGrade="updateGrade"
      @dialog-close="dialogCloseUpdateGroupMethod()"
      ref="UpdateGroupDialog"
    />
  </div>
</template>

<script>
import AgentService from "@/services/AgentService";
import SchoolService from "@/services/SchoolService";
import CreateSchool from "./CreateSchool.vue";
import UpdateSchool from "./UpdateSchool.vue";
import AddSmsSchool from "./AddSmsSchool.vue";
import SmsSchool from "./SmsSchool.vue";
import UpdateGroupDialog from "./UpdateGroupDialog.vue";
export default {
  components: {
    UpdateSchool,
    AddSmsSchool,
    SmsSchool,
    CreateSchool,
    UpdateGroupDialog,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      updateActiveRequest: {
        ids: [],
        activeOrUnActive: "",
      },
      agentList: [],
      schoolList: [],
      deleteList: [
        { key: true, value: "Chưa xóa" },
        { key: false, value: "Đã xóa" },
      ],
      dataSearch: {
        idAgent: "",
        idSchool: "",
        deleteStatus: true,
        activated: "",
        name: "",
      },
      statusSchool: [
        {
          key: true,
          value: "Đã kích hoạt",
        },
        {
          key: false,
          value: "Chưa kích hoạt",
        },
      ],
      responseDataList: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showUpdateGroupDialog: false,
      showAddSmsSchool: false,
      showSmsSchool: false,
      multipleSelection: [],

      updateSchool: {
        id: "",
        schoolName: "",
        schoolDescription: "",
      },
      styleCols1: [],
      styleCols2: [],
    };
  },
  methods: {
    handleAction(command) {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      if (selectRowList.length == 0) {
        this.$message({
          message: "Bạn chưa chọn trường nào",
          type: "error",
        });
        throw null;
      }
      if (command == "activeSchool") {
        this.updateMultiActiveSchool();
      } else if (command == "unActiveSchool") {
        this.updateMultiUnActiveSchool();
      } else if (command == "exportSchool") {
        this.exportSchoolDataMethod();
      }
    },
    //select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    findAllAgentUnique() {
      AgentService.getAll()
        .then((resp) => {
          this.agentList = resp.data.data.agentList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
      this.$refs.CreateSchool.resetFormData();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.searchByProperties();
      this.$refs.CreateSchool.resetFormData();
    },
    dialogCloseUpdateGroupMethod() {
      this.showUpdateGroupDialog = false;
      this.searchByProperties();
    },
    dialogCloseAddSmsSchoolMethod() {
      this.showAddSmsSchool = false;
      this.searchByProperties();
    },
    dialogCloseSmsSchoolMethod() {
      this.showSmsSchool = false;
      this.searchByProperties();
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.maxPageItem = maxPageItem;
      this.searchByProperties();
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.searchByProperties();
    },

    checkSelectBefore(rowList) {
      if (rowList.length == 0) {
        this.$message({
          message: "Chưa có trường nào được chọn",
          type: "error",
        });
        throw null;
      }
    },

    //click edit at row
    handleEdit(row) {
      setTimeout(() => {
        this.showUpdateDialog = true;
      }, 200);
      this.$refs.UpdateSchool.getDataInitial(row.id);
    },
    updateGroupMethod() {
      let idList = this.multipleSelection.map((x) => x.id);
      this.checkSelectBefore(idList);
      this.showUpdateGroupDialog = true;
      this.$refs.UpdateGroupDialog.getDataInitial(idList);
    },
    handleViewSmsSchool(index, row) {
      this.showSmsSchool = true;
      this.$refs.SmsSchool.getAllSchoolSms(row.id);
    },
    //click delete at row
    handleDelete(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa trường đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        SchoolService.delete(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa trường thành công",
              type: "success",
            });
            setTimeout(() => {
              this.searchByProperties();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa trường thất bại",
              type: "error",
            });
          });
      });
    },

    createSchoolDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateSchool.getAllAgent();
      this.$refs.CreateSchool.resetFormData();
    },
    addSmsSchoolDialog() {
      if (this.multipleSelection.length > 0) {
        this.showAddSmsSchool = true;
        // this.$refs.AddSmsSchool.resetFormData();
        let idSchoolList = [];
        this.multipleSelection.forEach((item) => idSchoolList.push(item.id));
        this.$refs.AddSmsSchool.getSchoolSelected(idSchoolList);
        // this.$refs.AddSmsSchool.getSchoolSelected(this.multipleSelection);
      } else {
        this.$message({
          message: "Mời bạn chọn trường muốn cấp thêm SMS",
          type: "error",
        });
      }
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      SchoolService.searchSchool(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.deleteStatus,
        this.dataSearch.idAgent,
        this.dataSearch.idSchool,
        this.dataSearch.activated,
        this.dataSearch.name
      )
        .then((resp) => {
          this.responseDataList = resp.data.data.schoolList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.responseDataList = [];
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    selectionSchoolActive(index, row, status) {
      if (row.smsBudgetDate == null) {
        row.smsBudgetDate = "";
      }
      if (row.demoStart == null) {
        row.demoStart = "";
      }
      if (row.demoEnd == null) {
        row.demoEnd = "";
      }
      if (row.dateContractStart == null) {
        row.dateContractStart = "";
      }
      if (row.dateContractEnd == null) {
        row.dateContractEnd = "";
      }
      if (row.dateStart == null) {
        row.dateStart = "";
      }
      if (row.dateEnd == null) {
        row.dateEnd = "";
      }
      let formData = new FormData();

      for (var key in row) {
        formData.append(key, row[key]);
      }

      SchoolService.updateSchool(formData)
        .then(() => {
          if (status == "activeSchool") {
            if (row.schoolActive) {
              this.$message({
                message: "Kích hoạt trường thành công",
                type: "success",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt trường thành công",
                type: "success",
              });
            }
          } else if (status == "activeMore") {
            if (row.smsActiveMore) {
              this.$message({
                message: "Kích hoạt vượt mức cho trường thành công",
                type: "success",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt vượt mức cho trường thành công",
                type: "success",
              });
            }
          }
        })
        .catch(() => {
          if (status == "activeSchool") {
            if (row.schoolActive) {
              this.$message({
                message: "Kích hoạt trường thất bại",
                type: "error",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt trường thất bại",
                type: "error",
              });
            }
          } else if (status == "activeMore") {
            if (row.smsActiveMore) {
              this.$message({
                message: "Kích hoạt vượt mức cho trường thất bại",
                type: "error",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt vượt mức cho trường thất bại",
                type: "error",
              });
            }
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },

    updateMultiActiveSchool() {
      this.updateActiveRequest.ids = this.multipleSelection.map(
        (item) => item.id
      );
      this.updateActiveRequest.ids;
      this.updateActiveRequest.activeOrUnActive = true;
      SchoolService.updateActiveMultiSchool(this.updateActiveRequest)
        .then(() => {
          this.$message({
            message: "Kích hoạt nhà trường thành công",
            type: "success",
          });
          this.searchByProperties();
        })
        .catch(() => {
          this.$message({
            message: "Kích hoạt nhà trường thất bại",
            type: "error",
          });
        });
    },

    updateMultiUnActiveSchool() {
      this.updateActiveRequest.ids = this.multipleSelection.map(
        (item) => item.id
      );
      this.updateActiveRequest.ids;
      this.updateActiveRequest.activeOrUnActive = false;
      SchoolService.updateActiveMultiSchool(this.updateActiveRequest)
        .then(() => {
          this.$message({
            message: "Hủy kích hoạt nhà trường thành công",
            type: "success",
          });
          this.searchByProperties();
        })
        .catch(() => {
          this.$message({
            message: "Hủy kích hoạt nhà trường thất bại",
            type: "error",
          });
        });
    },
    exportSchoolDataMethod() {
      let selectRowList = this.multipleSelection.map((x) => x.id);
      this.getStyleExcel();
      SchoolService.exportSchoolData(selectRowList)
        .then((resp) => {
          import("@/services/ExportExcel")
            .then((excel) => {
              let dataList = resp.data.data;
              let fileName = "DANH_SACH_TRUONG";
              const tHeader = [
                "STT",
                "Tên trường",
                "Tên đại lý",
                "Kích hoạt",
                "Đang học",
                "Chờ học",
                "Bảo lưu",
                "Nghỉ học",
                "SMS mặc định",
                "SMS Total",
                "SMS Used",
                "Còn lại",
                "Số điện thoại",
                "Email",
                "Địa chỉ",
              ];
              const filterVal = [
                "pro1",
                "pro2",
                "pro3",
                "pro4",
                "pro5",
                "pro6",
                "pro7",
                "pro8",
                "pro9",
                "pro10",
                "pro11",
                "pro12",
                "pro13",
                "pro14",
                "pro15",
              ];
              let columnList = [
                { col: 5 },
                { col: 35 },
                { col: 15 },
                { col: 15 },
                { col: 10 },
                { col: 10 },
                { col: 10 },
                { col: 10 },
                { col: 10 },
                { col: 10 },
                { col: 10 },
                { col: 10 },
                { col: 15 },
                { col: 15 },
                { col: 40 },
              ];
              excel.export_json_to_excel({
                header: tHeader,
                data: dataList,
                title: filterVal,
                filename: fileName,
                columnsWidth: columnList,
                styleCols1: this.styleCols1,
                styleCols2: this.styleCols2,
              });
              this.downloadLoading = false;
            })
            .finally(() => {
              this.styleCols1 = [];
              this.styleCols2 = [];
            });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    getStyleExcel() {
      let style = {
        font: { bold: true },
        fill: { fgColor: { rgb: "67C23A" } },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
      let styleCol1 = {
        name: [
          "A2",
          "B2",
          "C2",
          "D2",
          "E2",
          "F2",
          "G2",
          "H2",
          "I2",
          "J2",
          "K2",
          "L2",
          "M2",
          "N2",
          "O2",
        ],
        style,
      };
      let styleCol2 = {
        name: ["A1"],
        style: { font: { bold: true, color: { rgb: "ff0000" } } },
      };
      this.styleCols1.push(styleCol1);
      this.styleCols1.push(styleCol2);
    },
    /**
     * thay đổi đại lý
     */
    async changeAgentMethod() {
      await this.getSchoolMethod();
      this.searchHeaderMethod();
    },

    /**
     * danh sách đại lý
     */
    async getAgentMethod() {
      await AgentService.getAllCommon()
        .then((resp) => {
          this.agentList = resp.data.data;
          if (this.agentList.length > 0) {
            this.dataSearch.idAgent = this.agentList[0].id;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * danh sách trường theo đại lý đã chọn
     */
    async getSchoolMethod() {
      await SchoolService.getSchoolInAgent(this.dataSearch.idAgent)
        .then((resp) => {
          this.schoolList = resp.data.data;
          this.dataSearch.idSchool = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * get data initial
     */
    async fetchDataMany() {
      await this.getAgentMethod();
      await Promise.all([this.getSchoolMethod()])
        .then(() => {
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  beforeMount() {
    this.fetchDataMany();
  },
};
</script>

<style lang="scss" scoped>
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
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-pagination .el-select .el-input {
  width: 75px;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
.button-left-class {
  margin-right: 5px;
  width: 140px;
}
.content {
  .row-data {
    margin-bottom: 20px;
  }
  .button-over {
    border-radius: 0;
    margin-left: 3px;
  }
  .button-click {
    text-align: right;
  }
  .table-content {
    .el-table {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #78a5e7;
    }
  }
  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
}
</style>
