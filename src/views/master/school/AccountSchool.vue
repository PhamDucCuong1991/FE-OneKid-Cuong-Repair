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
        placeholder="Trạng thái"
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
        class="button-left-class"
        v-model="dataSearch.activated"
        @change="searchHeaderMethod()"
        placeholder="Trạng thái"
        clearable
      >
        <el-option
          v-for="item in statusSchoolList"
          :key="item.key"
          :value="item.key"
          :label="item.value"
        ></el-option>
      </el-select>
      <el-input
        style="width: 250px"
        placeholder="Nhập tên trường"
        v-model="dataSearch.nameOrPhone"
        clearable
        @clear="searchHeaderMethod()"
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
        @click="createAccountSchoolDialog()"
      >
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
      <el-dropdown @command="handleSchoolMethod">
        <el-button class="button-over" type="success">
          Tác vụ
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu>
          <el-dropdown-item command="smsSendAction"
            >Gửi tin SMS</el-dropdown-item
          >
          <el-dropdown-item command="activeAction">Kích hoạt</el-dropdown-item>
          <el-dropdown-item command="unActiveAction"
            >Hủy kích hoạt</el-dropdown-item
          >
          <el-dropdown-item command="exportAction"
            >Xuất danh sách</el-dropdown-item
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
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column prop="fullName" label="Họ tên"></el-table-column>
        <el-table-column
          label="Tên trường"
        >
        <template slot-scope="scope">
          <span> {{ scope.row.school.id }} - {{ scope.row.school.schoolName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Kích hoạt" align="center" width="80">
          <template slot-scope="scope">
            <el-checkbox
              @change="selectionSchoolActive(scope.row)"
              v-model="scope.row.maUser.activated"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="Số điện thoại"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="maUser.username"
          label="Username"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="maUser.passwordShow"
          label="Password"
          align="center"
        ></el-table-column>
        <el-table-column label="Tác vụ" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.row, false)"
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

    <CreateAccountSchool
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateAccountSchool"
    />
    <UpdateAccountSchool
      :dialogVisible="showUpdateDialog"
      :editSchool="updateSchool"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateAccountSchool"
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
  </div>
</template>

<script>
import SchoolService from "@/services/SchoolService";
import AgentService from "@/services/AgentService";
import CreateAccountSchool from "./AddAccountSchool.vue";
import UpdateAccountSchool from "./UpdateAccountSchool.vue";
import AddSmsSchool from "./AddSmsSchool.vue";
import SmsSchool from "./SmsSchool.vue";
export default {
  components: {
    CreateAccountSchool,
    UpdateAccountSchool,
    AddSmsSchool,
    SmsSchool,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      schoolListSearch: [],
      statusSchoolList: [
        {
          key: true,
          value: "Đã kích hoạt",
        },
        {
          key: false,
          value: "Chưa kích hoạt",
        },
      ],
      deleteList: [
        { key: true, value: "Chưa xóa" },
        { key: false, value: "Đã xóa" },
      ],
      responseDataList: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showAddSmsSchool: false,
      showSmsSchool: false,
      multipleSelection: [],
      accountSchoolResponseList: [],
      agentList: [],
      schoolList: [],
      seachOnFE: {
        active: "",
      },
      dataSearch: {
        idAgent: "",
        idSchool: "",
        deleteStatus: true,
        activated: "",
        nameOrPhone: "",
      },
      updateSchool: {
        id: "",
        agentName: "",
        schoolName: "",
      },
    };
  },
  methods: {
    //select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
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
    handleSchoolMethod(command) {
      if (command == "smsSendAction") {
        console.log(command);
      } else if (command == "activeAction") {
        this.activateSchoolManyMethod(true);
      } else if (command == "unActiveAction") {
        this.activateSchoolManyMethod(false);
      } else if (command == "exportAction") {
        console.log(command);
      }
    },

    //click edit at row
    handleEdit(row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateAccountSchool.getDataInitial(row);
    },
    //click delete at row
    handleDelete(index, row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa tài khoản trường đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolService.deleteAccountSchool(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa tài khoản trường thành công",
              type: "success",
            });
            setTimeout(() => {
              this.searchByProperties();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa tài khoản trường thất bại",
              type: "error",
            });
          });
      });
    },

    createAccountSchoolDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateAccountSchool.getAllSchool(this.dataSearch.idAgent);
      // this.$refs.CreateAccountSchool.resetFormData();
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      SchoolService.getAllAccountSchool(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.deleteStatus,
        this.dataSearch.idAgent,
        this.dataSearch.idSchool,
        this.dataSearch.activated,
        this.dataSearch.nameOrPhone
      )
        .then((resp) => {
          this.responseDataList = resp.data.data.dataList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          this.pageTotal = 1;
          this.responseDataList = [];
          console.log(err);
        })
        .finally(() => {
          if (this.responseDataList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    /**
     * activate one
     */
    selectionSchoolActive(row) {
      let textAlert = "";
      if (row.maUser.activated) {
        textAlert = "Kích hoạt";
      } else {
        textAlert = "Hủy kích hoạt";
      }
      SchoolService.updateAccountSchoolActive(row.maUser)
        .then((resp) => {
          let checkActive = resp.data.data;
          console.log(checkActive);
          this.$message({
            message: textAlert + " thành công",
            type: "success",
          });
          this.searchByProperties();
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
     * activate many
     */
    activateSchoolManyMethod(status) {
      let accountList = this.multipleSelection;
      if (accountList.length == 0) {
        this.$message({
          message: "Không có tài khoản nào được chọn",
          type: "error",
        });
        return;
      }
      let accountDataList = accountList.map((x) => x.maUser);
      let titleText = "";
      if (status) {
        titleText = "Kích hoạt";
        accountDataList.forEach((x) => {
          x.activated = true;
        });
      } else {
        titleText = "Hủy kích hoạt";
        accountDataList.forEach((x) => {
          x.activated = false;
        });
      }
      SchoolService.updateAccountSchoolActiveMany(accountDataList)
        .then((resp) => {
          let checkupdate = resp.data.data;
          console.log(checkupdate);
          this.$message({
            message: titleText + " thành công",
            type: "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: titleText + " thất bại",
            type: "error",
          });
        });
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
        .then((resp) => {
          console.log(resp);
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
