<template>
  <div class="content">
    <div class="abcxyz">
      <!-- <el-button class="button-over" type="success" @click="handleUpdateSchoolBand1()">
        <i class="el-icon-plus" />
        Thêm mới
      </el-button> -->

      <el-button class="button-over" type="success" @click="handleExport()"
        >Xuất file excel</el-button
      >
    </div>
    <!-- add -->
    <div class="hasagi">
      <el-select
        style="width: 200px; margin-right: 6px"
        v-model="dataSearch.idAgent"
        @change="getAllMessage()"
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

      <el-input
        class="button-left-class"
        style="width: 260px"
        placeholder="Nhập tên trường"
        clearable
        v-model="dataSearch.name"
        @change="getAllMessage()"
        @keyup.enter.native="getAllMessage()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getAllMessage()"
        ></el-button>
      </el-input>
    </div>

    <div class="table-content row-data">
      <el-table
        ref="multipleTable"
        :data="schoolbrand"
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        :cell-style="tableRowStyle"
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
          prop="schoolName"
          label="Tên trường"
          align="left "
          sortable
        ></el-table-column>
        <el-table-column
          prop="agent.agentName"
          label="Tên đại lý"
          align="left"
          sortable
        ></el-table-column>

        <el-table-column
          prop="brand.brandName"
          label="Brand name"
          align="left "
        >
        </el-table-column>

        <el-table-column label="Tác vụ" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.brand != null"
              size="mini"
              type="success"
              @click="handleUpdateSchoolBand(scope.$index, scope.row)"
              >Sửa</el-button
            >
            <el-button
              v-else
              type="primary"
              size="mini"
              @click="handleUpdateSchoolBand1(scope.$index, scope.row)"
              >Thêm</el-button
            >
            <el-button
              size="mini"
              v-if="scope.row.brand != null"
              type="danger"
              @click="handleDeleteIdBrand(scope.$index, scope.row)"
              >Xóa</el-button
            >
            <el-button size="mini" v-else disabled type="info">Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <UpdateSchoolBrand
      :dialogVisible="showUpdateSchoolBrandDialog"
      @dialog-close="dialogCloseUpdateSchoolBrandMethod()"
      ref="UpdateSchoolBrand"
    />
    <CreateSchoolBrand
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateSchoolBrand"
    />
  </div>
</template>

<script>
import BrandNameService from "@/services/BrandNameService";
import AgentService from "@/services/AgentService";
import CreateSchoolBrand from "./CreateSchoolBrand.vue";
import UpdateSchoolBrand from "./UpdateSchoolBrand.vue";
export default {
  components: {
    CreateSchoolBrand,
    UpdateSchoolBrand,
  },
  data() {
    return {
      activeStatus: [
        { status: true, label: "Đã kích hoạt" },
        { status: false, label: "Chưa kích hoạt" },
      ],

      showCreateDialog: false,
      showUpdateSchoolBrandDialog: false,
      kidStatusList: [],
      agentlistbrand: [],
      maClassList: [],
      checkDisable: false,
      schoolbrand: [],
      value: "",
      date: "",
      dataSearch: {
        idAgent: "",
        status: "",
        name: "",
      },
      CreateSchool: {
        id: "",
        idSchool: "",
        schoolName: "",
        brandName: "",
      },
      UpdateSchool: {
        id: "",
        brandName: "",
      },
    };
    // ----
  },
  computed: {
    isEditing: function () {
      return this.editing !== null;
    },
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dialogCloseCreateMethod() {
      this.getAllMessage();
      this.showCreateDialog = false;
    },
    dialogCloseUpdateSchoolBrandMethod() {
      this.getAllMessage();
      this.showUpdateSchoolBrandDialog = false;
    },
    handleCommandActionDetailDate(command) {
      if (command == "approvedTrue") {
        this.handleApprovedDetailDate(true);
      } else if (command == "approvedFalse") {
        this.handleApprovedDetailDate(false);
      }
    },
    handleUpdateSchoolBand(index, row) {
      this.showUpdateSchoolBrandDialog = true;
      this.$refs.UpdateSchoolBrand.getAllBrand(row);
    },
    handleUpdateSchoolBand1(index, row) {
      this.showCreateDialog = true;
      this.$refs.CreateSchoolBrand.getAllBrand(row);
      // this.$refs.CreateSchoolBrand.getAllSupplierInitial(row);
    },

    handleDeleteIdBrand(index, row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa brand của trường",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        BrandNameService.deletebramd(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa brand trường thành công",
              type: "success",
            });
            setTimeout(() => {
              this.getAllMessage();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Xóa brand trường thất bại thất bại",
              type: "error",
            });
          });
      });
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // click chọn số bản ghi trên 1 trang
    handleSizeChange(maxPageItem) {
      this.tableDataFilter = this.studentList.slice(0, maxPageItem);
      this.pageSize = maxPageItem;
      this.pageTotal = this.studentList.length;
    },

    // tableRowStyle({ row }) {
    //   if (!row.teacherUnread) {
    //     return "color: #409EFF";
    //   }
    // },
    getAllMessage() {
      BrandNameService.searchSchoolBrand(
        this.dataSearch.idAgent,
        this.dataSearch.status,
        this.dataSearch.name
      )
        .then((resp) => {
          this.schoolbrand = resp.data.data.schoolList;
          console.log(this.schoolbrand);
        })
        .catch((err) => {
          this.schoolbrand = null;
          console.log(err);
        });
    },

    // chon đại lý
    findAllAgentUnique() {
      AgentService.getAll()
        .then((resp) => {
          this.agentList = resp.data.data.agentList;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  beforeMount() {
    this.getAllMessage();
    this.findAllAgentUnique();
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
}
.buttondropdown {
  float: right;
  border-radius: 0;
  margin-left: 3px;
  margin-top: 15px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
/deep/.el-button--mini,
.el-button--mini.is-round {
  padding: 7px 15px;
  width: 60px;
}
/deep/.el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
  max-height: 50px;
  text-overflow: ellipsis;
}
.button-select {
  margin-right: 5px;
  width: 150px;
}
.hasagi {
  // margin-top:-20px
  margin-bottom: 20px;
}
/deep/.el-table th {
  padding: 10px 0;
}
/deep/.el-table th > .cell {
  text-align: center !important;
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
.abcxyz {
  float: right;
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
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
.btt {
  float: right;
  margin-top: 10px;
  // background-color: #4CAF50;
}
.buttonxemchitiet {
  background-color: #78a5e7;
}
.button-over {
  margin-right: 5px;
}
/deep/.date[data-v-5ed4c166] {
  margin-bottom: -25px;
  z-index: 2;
  position: relative;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}

.table-content {
  .el-table {
    border-top-left-radius: 5px;
    border: 1px solid #78a5e7;
  }
}

.button-left-class {
  margin-right: 5px;
  width: 170px;
  // border: 1px solid #dcdfe6;
}
.button-left-status {
  margin-right: 5px;
  width: 110px;
  // border: 1px solid #dcdfe6;
}
.button-left-class1 {
  margin-right: 5px;
  width: 150px;
  // border: 1px solid #dcdfe6;
}
.button-left-class0 {
  margin-right: 5px;
  width: 150px;
}
.button-left-class9 {
  margin-right: 5px;
  width: 150px;
}
.button-left-class2 {
  margin-right: -50px;
  width: 140px;
}

.button-left-class3 {
  margin-left: -10px;
  width: 140px;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
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
/deep/.el-textarea.is-disabled .el-textarea__inner {
  background-color: #ffffff;
  border-color: #e4e7ed;
  color: #606266;
  cursor: not-allowed;
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
  border: red;
  // border: 1px solid #dad6d6;
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
</style>
