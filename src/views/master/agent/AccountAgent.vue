<template>
  <div class="content">
    <div style="float: left">
      <el-select
        style="width: 200px"
        v-model="dataSearch.idAgent"
        @change="getAllAccountAgent()"
        placeholder="Chọn đại lý"
        clearable
      >
        <el-option
          v-for="item in agentList"
          :key="item.id"
          :label="item.agentName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        style="width: 200px; margin-left: 10px"
        v-model="seachOnFE.active"
        @change="getAllAccountAgent()"
        placeholder="Chọn trạng thái"
        clearable
      >
        <el-option
          v-for="item in statusAccountList"
          :key="item.key"
          :value="item.key"
          :label="item.value"
        ></el-option>
      </el-select>
      <el-input
        style="width: 300px; margin-left: 10px"
        placeholder="Nhập họ tên"
        v-model="dataSearch.fullName"
        @clear="getAllAccountAgent()"
        @keyup.enter.native="getAllAccountAgent()"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getAllAccountAgent()"
        ></el-button>
      </el-input>
    </div>
    <div class="button-click row-data">
      <el-button
        class="button-over"
        type="success"
        @click="createAccountAgentDialog()"
      >
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
      <el-dropdown @command="handleAgentMethod">
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
        :data="tableDataFilterAccountAgent"
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
        <el-table-column
          prop="fullName"
          sortable
          label="Họ tên"
        ></el-table-column>
        <el-table-column
          prop="agent.agentName"
          sortable
          label="Tên đại lý"
        ></el-table-column>
        <el-table-column
          prop="maUser.activated"
          label="Kích hoạt"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-checkbox
              @change="activeAccountRow(scope.row)"
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
            <el-button size="mini" type="success" @click="handleEdit(scope.row)"
              >Sửa</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <CreateAccountAgent
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateAccountAgent"
    />
    <UpdateAccountAgent
      :dialogVisible="showUpdateDialog"
      :editAgent="updateAgent"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateAccountAgent"
    />
    <AddSmsAgent
      :dialogVisible="showAddSmsAgent"
      @dialog-close="dialogCloseAddSmsAgentMethod()"
      ref="AddSmsAgent"
    />
    <SmsAgent
      :dialogVisible="showSmsAgent"
      @dialog-close="dialogCloseSmsAgentMethod()"
      ref="SmsAgent"
    />
  </div>
</template>

<script>
import AgentService from "@/services/AgentService";
import CreateAccountAgent from "./AddAccountAgent.vue";
import UpdateAccountAgent from "./UpdateAccountAgent.vue";
import AddSmsAgent from "./AddSmsAgent.vue";
import SmsAgent from "./SmsAgent.vue";
export default {
  components: {
    CreateAccountAgent,
    UpdateAccountAgent,
    AddSmsAgent,
    SmsAgent,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      agentListSearch: [],

      statusAccountList: [
        {
          key: "yes",
          value: "Đã kích hoạt",
        },
        {
          key: "no",
          value: "Chưa kích hoạt",
        },
      ],
      pageTotal: this.$pageTotalDefault,
      pageSize: this.$pageSizeDefault,
      tableDataFilterAccountAgent: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showAddSmsAgent: false,
      showSmsAgent: false,
      multipleSelection: [],
      accountAgentResponseList: [],
      seachOnFE: {
        active: "",
      },
      sorting: -1,
      dataSearch: {
        idAgent: "",
        fullName: "",
      },
      updateAgent: {
        id: "",
        agentName: "",
        agentDescription: "",
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
      this.getAllAccountAgent();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.getAllAccountAgent();
    },
    dialogCloseAddSmsAgentMethod() {
      this.showAddSmsAgent = false;
      this.getAllAccountAgent();
    },
    dialogCloseSmsAgentMethod() {
      this.showSmsAgent = false;
      this.getAllAccountAgent();
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.tableDataFilterAccountAgent = this.accountAgentResponseList.slice(
        0,
        maxPageItem
      );
      this.pageSize = maxPageItem;
    },
    //click chọn số trang
    handleCurrentChange(pageNumber) {
      let number = this.pageSize;
      this.tableDataFilterAccountAgent = this.accountAgentResponseList.slice(
        (pageNumber - 1) * number,
        pageNumber * number
      );
    },
    handleAgentMethod(command) {
      if (command == "smsSendAction") {
        console.log(command);
      } else if (command == "activeAction") {
        this.activateAgentManyMethod(true);
      } else if (command == "unActiveAction") {
        this.activateAgentManyMethod(false);
      } else if (command == "exportAction") {
        console.log(command);
      }
    },
    //click edit at row
    handleEdit(row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateAccountAgent.getDataInitial(row);
    },
    //click delete at row
    handleDelete(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa đại lý đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        AgentService.deleteAccountAgent(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa tài khoản đại lý thành công",
              type: "success",
            });
            this.getAllAccountAgent();
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa tài khoản đại lý thất bại",
              type: "error",
            });
          });
      });
    },
    activateAgentManyMethod(status) {
      let accountList = this.multipleSelection;
      if (accountList.length == 0) {
        this.$message({
          message: "Không có tài khoản nào được chọn",
          type: "error",
        });
        return;
      }
      let accountDataList = [];
      let titleText = "";
      if (status) {
        titleText = "Kích hoạt";
        accountList.forEach((x) => {
          let dataObject = x.maUser;
          dataObject.activated = true;
          accountDataList.push(dataObject);
        });
      } else {
        titleText = "Hủy kích hoạt";
        accountList.forEach((x) => {
          let dataObject = x.maUser;
          dataObject.activated = false;
          accountDataList.push(dataObject);
        });
      }
      AgentService.updateAccountAgentActiveMany(accountDataList)
        .then((resp) => {
          let checkupdate = resp.data.data;
          console.log(checkupdate);
          this.$message({
            message: titleText + " thành công",
            type: "success",
          });
          this.getAllAccountAgent();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: titleText + " thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButtonSaveEvaluateWeek = false;
          }, 500);
        });
    },

    createAccountAgentDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateAccountAgent.getAllAgent();
    },
    /**
    find all account
     */
    getAllAccountAgent() {
      AgentService.getAllAccountAgent(
        this.dataSearch.idAgent,
        this.dataSearch.fullName
      )
        .then((resp) => {
          this.accountAgentResponseList = resp.data.data;
          this.tableDataFilterAccountAgent =
            this.accountAgentResponseList.slice(0, this.pageSize);
          this.pageTotal = this.accountAgentResponseList.length;
          if (this.seachOnFE.active != "") {
            this.searchOnFEMethod();
          }
        })
        .catch((err) => {
          console.log(err);
          this.tableDataFilterAccountAgent = null;
        });
    },
    /**
     * search on FE
     */
    searchOnFEMethod() {
      let data = this.seachOnFE.active;
      if (data != "") {
        if (data == "yes") data = true;
        if (data == "no") data = false;
        this.tableDataFilterAccountAgent =
          this.tableDataFilterAccountAgent.filter((x) => {
            return x.maUser.activated == data;
          });
      }
    },
    /**
     * active account
     */
    activeAccountRow(row) {
      let textAlert = "";
      if (row.maUser.activated) {
        textAlert = "Kích hoạt";
      } else {
        textAlert = "Hủy kích hoạt";
      }
      AgentService.updateAccountAgentActive(row.maUser)
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
    findAllAgentUnique() {
      this.loadingData = true;
      AgentService.getAllAgentUnique()
        .then((resp) => {
          this.agentList = resp.data.data;
          this.agentList = this.agentList
            .slice(0)
            .sort((a, b) =>
              a.agentName < b.agentName ? this.sorting : -this.sorting
            );
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          if (this.agentList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.getAllAccountAgent();
    this.findAllAgentUnique();
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