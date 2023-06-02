<template>
  <div class="content">
    <div style="margin-top: 5px">
      <!-- button left -->
      <div class="button-click-left">
        <el-select
          class="button-left-class"
          v-model="dataSearch.type"
          @change="searchHeaderMethod()"
          clearable
          width:140
          placeholder="Loại đối tượng"
          style="margin-right: 5px; width: 140px"
        >
          <el-option
            v-for="item in type"
            :key="item.status"
            :value="item.status"
            :label="item.label"
          ></el-option>
        </el-select>

        <el-input
          style="width: 280px"
          placeholder="Nhập tên hoặc số điện thoại"
          clearable
          v-model="dataSearch.nameOrPhone"
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

      <div class="button-click-right row-data">
        <el-button
          v-if="checkPermission(['cashInternal_people_update'])"
          class="button-over"
          type="success"
          @click="createDialogMethod()"
        >
          <i class="el-icon-plus" />
          Thêm mới
        </el-button>
      </div>
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
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="selection"
          align="center"
          width="55"
        ></el-table-column>
        <el-table-column
          align="center"
          type="index"
          fixed
          label="STT"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="name"
          fixed
          label="Tên đối tượng"
        ></el-table-column>

        <el-table-column label="Loại đối tượng" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 'internal'">Nhà trường</span>
            <span v-else>Khác</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          width="140"
          align="center"
          label="Số điện thoại"
        ></el-table-column>

        <el-table-column
          prop="birthday"
          width="140"
          label="Ngày sinh"
        ></el-table-column>

        <el-table-column
          prop="gender"
          label="Giới tính"
          width="100"
          align="center"
        ></el-table-column>

        <el-table-column prop="description" label="Mô tả"></el-table-column>

        <el-table-column
          v-if="checkPermission(['cashInternal_people_update'])"
          label="Tác vụ"
          fixed="right"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleUpdate(scope.row)"
            >
              Sửa</el-button
            >
            <el-button
              v-if="!scope.row.defaultStatus"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >Xóa</el-button
            >
            <el-button size="mini" v-else type="danger" disabled>Xóa</el-button>
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
    <PeopleTypeCreate
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />
    <UpdatePeopleType
      :dialogVisible="showUpdateDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdatePeopleType"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission.js";
import CashInternalService from "@/services/CashInternalService";
import UpdatePeopleType from "./UpdatePeopleType.vue";
import PeopleTypeCreate from "./PeopleTypeCreate.vue";

export default {
  components: {
    PeopleTypeCreate,
    UpdatePeopleType,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      pageTotal: this.$pageTotalDefault,
      maxPageItem: this.$pageSizeDefaultNew,
      pageNumber: 1,

      responseList: [],
      type: [
        { status: "internal", label: "Nhà trường" },
        { status: "external", label: "Khác" },
      ],
      showCreateDialog: false,
      showUpdateDialog: false,
      dataSearch: {
        pageNumber: "",
        maxPageItem: "",
        type: "",
        nameOrPhone: "",
      },
    };
  },
  methods: {
    checkPermission,
    handleDelete(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa đối tượng", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        CashInternalService.deletePeopleType(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            let messageText =
              err.response.status == 403
                ? this.$permissionDenied
                : err.response.data.message;
            this.$message({
              message: messageText,
              type: "error",
            });
          });
      });
    },
    dialogCloseCreateMethod() {
      this.showCreateDialog = false;
      this.searchByProperties();
    },
    //select rows
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    handleUpdate(row) {
      this.showUpdateDialog = true;
      this.$refs.UpdatePeopleType.getDataInitial(row.id);
    },

    dialogCloseUpdateMethod() {
      this.searchByProperties();
      this.showUpdateDialog = false;
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
    //click edit at row
    handleEdit(row) {
      this.showUpdateDialog = true;
      this.$refs.UpdateMaClass.getDataInitial(row.id);
    },
    createDialogMethod() {
      this.showCreateDialog = true;
    },
    searchHeaderMethod() {
      this.pageNumber = 1;
      this.searchByProperties();
    },
    searchByProperties() {
      this.loadingData = true;
      this.textTable = "";
      CashInternalService.searchPeopleType(
        this.pageNumber,
        this.maxPageItem,
        this.dataSearch.type,
        this.dataSearch.nameOrPhone
      )
        .then((resp) => {
          this.responseList = resp.data.data.responseList;
          this.pageTotal = resp.data.data.total;
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$router.push("/error/forbidden");
          } else {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          }
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
    this.searchByProperties();
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
/deep/.el-table .cell {
  white-space: pre-line;
  word-break: break-word;
  line-height: 23px;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.click-number-teacher {
  border: none;
  padding: 0;
  color: blue;
}
.click-number-teacher:hover {
  color: blue;
  background: none;
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
  .button-click-left {
    display: inline-block;
    margin-bottom: 20px;
  }
  .button-click-right {
    float: right;
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
}
</style>
