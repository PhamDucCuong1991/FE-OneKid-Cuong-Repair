<template>
  <div class="content">
    <div style="float: left">
      <el-select
        @change="getAllAgent()"
        v-model="dataSearch.activeOrUnActive"
        class="button-left"
        placeholder="Trạng thái"
        clearable
      >
        <el-option
          v-for="item in statusAgent"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-input
        v-model="dataSearch.agentName"
        style="width: 300px; margin-left: 10px"
        placeholder="Tìm kiếm tên đại lý"
        clearable
        @clear="getAllAgent()"
        @keyup.enter.native="getAllAgent()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getAllAgent()"
        ></el-button>
      </el-input>
    </div>
    <div class="button-click row-data">
      <el-button
        class="button-over"
        type="success"
        @click="createAgentDialog()"
      >
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
      <el-button class="button-over" type="success" @click="addSmsAgentDialog()"
        >Cấp SMS</el-button
      >
      <el-dropdown @command="handleAction">
        <el-button class="button-over" type="success">
          Tác vụ
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu>
          <el-dropdown-item>Gửi tin SMS</el-dropdown-item>
          <el-dropdown-item command="activeMultiAgent"
            >Kích hoạt đại lý</el-dropdown-item
          >
          <el-dropdown-item command="unActiveMultiAgent"
            >Hủy kích hoạt</el-dropdown-item
          >
          <el-dropdown-item>Xuất file đại lý</el-dropdown-item>
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
        :data="tableDataFilterAgent"
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
          prop="agentName"
          sortable
          label="Tên đại lý"
        ></el-table-column>
        <el-table-column
          prop="agentActive"
          sortable
          label="Kích hoạt"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              @change="selectionAgentActive(scope.$index, scope.row, 'active')"
              v-model="scope.row.agentActive"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="smsBudget"
          sortable
          label="SMS mặc định"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="smsActiveMore"
          sortable
          label="More Active"
          align="center"
        >
          <template slot-scope="scope">
            <el-checkbox
              @change="
                selectionAgentActive(scope.$index, scope.row, 'moreActive')
              "
              v-model="scope.row.smsActiveMore"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="smsTotal"
          label="SMS Total"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="smsUsed"
          sortable
          label="SMS Used"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="smsRemain"
          sortable
          label="Còn lại"
          align="center"
        ></el-table-column>
        <el-table-column label="Lịch sử SMS" align="center">
          <template slot-scope="scope">
            <el-button
              @click="handleViewSmsAgent(scope.$index, scope.row)"
              size="mini"
              type="text"
              >Xem</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" width="210" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row, true)"
              >Xem</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row, false)"
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

    <CreateAgent
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateAgent"
    />
    <UpdateAgent
      :dialogVisible="showUpdateDialog"
      :editAgent="updateAgent"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateAgent"
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
import CreateAgent from "./CreateAgent.vue";
import UpdateAgent from "./UpdateAgent.vue";
import AddSmsAgent from "./AddSmsAgent.vue";
import SmsAgent from "./SmsAgent.vue";
export default {
  components: {
    CreateAgent,
    UpdateAgent,
    AddSmsAgent,
    SmsAgent,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      statusAgent: [
        {
          key: true,
          value: "Đã kích hoạt",
        },
        {
          key: false,
          value: "Chưa kích hoạt",
        },
      ],
      pageTotal: this.$pageTotalDefault,
      pageSize: this.$pageSizeDefault,
      tableDataFilterAgent: [],
      agentList: [],
      showCreateDialog: false,
      showUpdateDialog: false,
      showAddSmsAgent: false,
      showSmsAgent: false,
      multipleSelection: [],
      updateActiveRequest: {
        ids: [],
        activeOrUnActive: false,
      },
      updateAgent: {
        id: "",
        agentName: "",
        agentDescription: "",
      },
      dataSearch: {
        activeOrUnActive: "",
        agentName: "",
      },
    };
  },
  methods: {
    handleAction(command) {
      if (command == "activeMultiAgent") {
        this.updateMultiActiveAgent();
      }
      if (command == "unActiveMultiAgent") {
        this.updateMultiUnActiveAgent();
      }
    },
    //select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.getAllAgent();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateDialog = false;
      this.getAllAgent();
    },
    dialogCloseAddSmsAgentMethod() {
      this.showAddSmsAgent = false;
      this.getAllAgent();
    },
    dialogCloseSmsAgentMethod() {
      this.showSmsAgent = false;
      this.getAllAgent();
    },

    //click edit at row
    handleEdit(index, row, status) {
      this.showUpdateDialog = true;
      this.updateAgent.id = row.id;
      this.$refs.UpdateAgent.getAgentById(row, status);
      this.$refs.UpdateAgent.getAccountAgentByIdAgent(row.id, status);
    },
    handleViewSmsAgent(index, row) {
      this.showSmsAgent = true;
      this.$refs.SmsAgent.getAllAgentSms(row.id);
    },
    //click delete at row
    handleDelete(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa đại lý đã chọn?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        AgentService.delete(row.id)
          .then((response) => {
            if (response.data.data) {
              this.$message({
                message: "Xóa đại lý thành công",
                type: "success",
              });
            } else {
              this.$message({
                message: "Không thể xóa do đại lý vẫn còn trường",
                type: "error",
              });
            }
            setTimeout(() => {
              this.getAllAgent();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa đại lý thất bại",
              type: "error",
            });
          });
      });
    },

    createAgentDialog() {
      this.showCreateDialog = true;
      this.$refs.CreateAgent.resetFormData();
    },
    addSmsAgentDialog() {
      if (this.multipleSelection.length > 0) {
        this.showAddSmsAgent = true;
        // this.$refs.AddSmsAgent.resetFormData();
        let idAgentList = [];
        this.multipleSelection.forEach((item) => idAgentList.push(item.id));
        this.$refs.AddSmsAgent.getAgentSelected(idAgentList);
        // this.$refs.AddSmsAgent.getAgentSelected(this.multipleSelection);
      } else {
        this.$message({
          message: "Mời bạn chọn đại lý muốn cấp thêm SMS",
          type: "error",
        });
      }
    },
    getAllAgent() {
      this.loadingData = true;
      AgentService.getAllAgent(
        this.dataSearch.agentName,
        this.dataSearch.activeOrUnActive
      )
        .then((resp) => {
          this.agentList = resp.data.data.agentList;
          this.tableDataFilterAgent = this.agentList;
          this.pageTotal = this.agentList.length;
        })
        .catch((err) => {
          console.log(err);
          this.tableDataFilterAgent = null;
        })
        .finally(() => {
          if (this.tableDataFilterAgent.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    selectionAgentActive(index, row, condition) {
      AgentService.updateAgent(row.id, row)
        .then(() => {
          if (condition == "active") {
            if (row.agentActive) {
              this.$message({
                message: "Kích hoạt đại lý thành công",
                type: "success",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt đại lý thành công",
                type: "success",
              });
            }
          } else if (condition == "moreActive") {
            if (row.smsActiveMore) {
              this.$message({
                message: "Kích hoạt vượt mức cho đại lý thành công",
                type: "success",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt vượt mức cho đại lý thành công",
                type: "success",
              });
            }
          }
        })
        .catch(() => {
          if (condition == "active") {
            if (row.agentActive) {
              this.$message({
                message: "Kích hoạt đại lý thất bại",
                type: "error",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt đại lý thất bại",
                type: "error",
              });
            }
          } else if (condition == "moreActive") {
            if (row.smsActiveMore) {
              this.$message({
                message: "Kích hoạt vượt mức cho đại lý thất bại",
                type: "error",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt vượt mức cho đại lý thất bại",
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

    updateMultiActiveAgent() {
      if (this.multipleSelection.length > 0) {
        this.updateActiveRequest.ids = this.multipleSelection.map(
          (item) => item.id
        );
        this.updateActiveRequest.ids;
        this.updateActiveRequest.activeOrUnActive = true;
        let a = this.updateActiveRequest;
        console.log(a);
        AgentService.updateActiveMultiAgent(this.updateActiveRequest)
          .then(() => {
            this.$message({
              message: "Kích hoạt đại lý thành công",
              type: "success",
            });
            this.getAllAgent();
          })
          .catch(() => {
            this.$message({
              message: "Kích hoạt đại lý thất bại",
              type: "error",
            });
          });
      } else {
        this.$message({
          message: "Bạn chưa chọn đại lý nào",
          type: "error",
        });
      }
    },
    updateMultiUnActiveAgent() {
      if (this.multipleSelection.length > 0) {
        this.updateActiveRequest.ids = this.multipleSelection.map(
          (item) => item.id
        );
        this.updateActiveRequest.ids;
        this.updateActiveRequest.activeOrUnActive = false;
        let a = this.updateActiveRequest;
        console.log(a);
        AgentService.updateActiveMultiAgent(this.updateActiveRequest)
          .then(() => {
            this.$message({
              message: "Kích hoạt đại lý thành công",
              type: "success",
            });
            this.getAllAgent();
          })
          .catch(() => {
            this.$message({
              message: "Kích hoạt đại lý thất bại",
              type: "error",
            });
          });
      } else {
        this.$message({
          message: "Bạn chưa chọn đại lý",
          type: "error",
        });
      }
    },
  },

  beforeMount() {
    this.getAllAgent();
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
