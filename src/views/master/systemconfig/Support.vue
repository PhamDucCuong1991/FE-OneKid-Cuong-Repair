<template>
  <div class="content">
    <div class="button-click row-data" style="margin-top: 5px">
      <el-button class="button-over" type="success" @click="createSupportDialog()">
        <i class="el-icon-plus" />
        Thêm mới
      </el-button>
    </div>
    <div class="table-content row-data">
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="responseList"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="$funcCommon.tableHeaderColorFunction"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="Tên">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Link" prop="link">
          <template slot-scope="scope">
            <el-input v-model="scope.row.link"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Nhà trường" align="center" width="120">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.plusStatus"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Giáo viên" align="center" width="120">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.teacherStatus"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Phụ huynh" align="center" width="120">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.parentStatus"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Tác vụ" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleUpdate(scope.row)"
              >Lưu</el-button
            >
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
              >Xóa</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <SupportCreateDialog
      :dialogVisible="showCreateDialog"
      @dialog-close="closeSupportDialog()"
      ref="SupportCreateDialog"
    />
  </div>
</template>

<script>
import MenuSupportService from "@/services/MenuSupportService";
import SupportCreateDialog from "./SupportCreateDialog.vue";

export default {
  components: {
    SupportCreateDialog,
  },
  data() {
    return {
      loadingData: true,
      loaddingExcel: false,
      textTable: "",
      responseList: [],
      showCreateDialog: false,
    };
  },
  methods: {
    createSupportDialog() {
      this.showCreateDialog = true;
    },
    closeSupportDialog() {
      this.showCreateDialog = false;
      this.fetchData();
    },

    //click delete at row
    handleDelete(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        MenuSupportService.deleteSupport(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.fetchData();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    handleUpdate(row) {
      MenuSupportService.updateSupport(row)
        .then((resp) => {
          this.$message({
            message: resp.data.message,
            type: "success",
          });
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    fetchData() {
      this.loadingData = true;
      this.textTable = "";
      MenuSupportService.getSupportSearch()
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          if (this.responseList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
  },

  beforeMount() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
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
  /deep/.el-table th > .cell {
    text-align: center !important;
  }

  .paging-click {
    .el-pagination {
      text-align: right;
      margin: 30px 0;
    }
  }
  /deep/.el-pagination .el-select .el-input {
    width: 75px;
  }
  /deep/.el-checkbox__inner {
    border: 1px solid gray;
  }
  /deep/.el-table th > .cell {
    text-align: center !important;
  }
  /deep/.el-table th.gutter {
    background-color: #78a5e7;
  }
  .click-fullname {
    border: none;
    padding: 0;
    color: blue;
  }
  .click-fullname:hover {
    color: blue;
    background: none;
  }
  .content {
    .row-data {
      margin-bottom: 20px;
    }
    .button-left-status {
      margin-right: 5px;
      width: 110px;
    }
    .button-left-class {
      margin-right: 5px;
      width: 140px;
    }
    .button-over {
      border-radius: 0;
      margin-left: 3px;
    }
    .button-click-left {
      display: inline-block;
    }
    .button-click {
      float: right;
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
    color: red;
    border-top: 1px solid white;
    font-family: Arial, Helvetica, sans-serif;
  }
  .click-in-row {
    border: none;
    padding: 0;
    color: #3a3ace;
  }
  .click-in-row:hover {
    color: #fa03d9;
    // background: none;
  }

  .handle-account {
    border: none;
    padding: 0;
    color: red;
  }
  .handle-account:hover {
    color: #fa03d9;
  }
}
</style>
