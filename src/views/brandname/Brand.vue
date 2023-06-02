<template>
  <div class="content">
    <div v-if="smscongif">
      <div style="margin-bottom: -20px; position: relative; z-index: 1">
        <el-input
          style="width: 280px"
          placeholder="Nhập tên nhà cung cấp"
          clearable
          v-model="dataSearchSmsConfig.name"
          @clear="searchByProperties()"
          @keyup.enter.native="searchByProperties()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchByProperties()"
          ></el-button>
        </el-input>
      </div>
    </div>

    <div v-else-if="visibleAttendanceArrive">
      <div style="margin-bottom: -20px; position: relative; z-index: 1">
        <el-input
          style="width: 280px"
          placeholder="Nhập tên brand name"
          clearable
          v-model="dataSearchBrandConfig.name"
          @clear="searchBrandproperties()"
          @keyup.enter.native="searchBrandproperties()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchBrandproperties()"
          ></el-button>
        </el-input>
      </div>
    </div>

    <div class="agentbrand">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="Brand Config" name="brandconfig">
          <div class="table-content row-data">
            <el-table
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="brandconfiglist"
              highlight-current-row
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
              <el-table-column label="Ngày tạo" width="165" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createdDate | formatDate }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="supplierNameShow"
                label="Nhà cung cấp"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="brandName"
                label="Brand name"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="brandType"
                label="Loại brand name"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="note"
                label="Ghi chú"
                align="left"
              ></el-table-column>
              <el-table-column label="Tác vụ" width="160" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleUpdateBrandconfig(scope.$index, scope.row)"
                    >Sửa</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDeleteBrandConfig(scope.$index, scope.row)"
                    >Xóa</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="btt">
              <el-button
                class="button-over"
                type="success"
                @click="handleAddBrand()"
                >Thêm brand</el-button
              >
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Sms Link config" name="smsLinkConfig">
          <div class="table-content row-data">
            <el-table
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="smslinklist"
              highlight-current-row
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
                prop="supplierName"
                label="Nhà cung cấp"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="supplierLink"
                label="Link connect"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="usernameLink"
                label="User name"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="passwordLink"
                label="Pass word"
                align="left"
              ></el-table-column>
              <el-table-column
                prop="supplierNote"
                label="Ghi chú"
                align="left"
              ></el-table-column>
              <el-table-column label="Tác vụ" width="160" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)"
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
            <div class="btt">
              <el-button
                class="button-over"
                type="success"
                @click="handleAddSupplier()"
                >Thêm nhà cung cấp</el-button
              >
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <CreateSupplierBrand
      :dialogVisible="showCreateDialog"
      @dialog-close="dialogCloseCreateMethod()"
    />

    <CreateBrand
      :dialogVisible="showCreatebrandDialog"
      @dialog-close="dialogCloseCreateBrandMethod()"
      ref="CreateBrand"
    />

    <UpdateSmsLinkConfig
      :dialogVisible="showUpdateDialog"
      :editGrade="UpdateSupplier"
      @dialog-close="dialogCloseUpdateMethod()"
    />
    <UpdateBrandConfig
      :dialogVisible="showUpdateBrandDialog"
      :editGrade="UpdateBrand"
      @dialog-close="dialogCloseUpdateBrandMethod()"
    />
    <UpdateAgentBrand
      :dialogVisible="showUpdateAgentDialog"
      :editGrade="UpdateAgent"
      @dialog-close="dialogCloseUpdateAgentMethod()"
    />
  </div>
</template>

<script>
import BrandNameService from "@/services/BrandNameService";
import CreateSupplierBrand from "./CreateSupplierBrand.vue";
import CreateBrand from "./CreateBrand.vue";
import UpdateSmsLinkConfig from "./UpdateSmsLinkConfig.vue";
import UpdateBrandConfig from "./UpdateBrandConfig.vue";
import UpdateAgentBrand from "./UpdateAgentBrand.vue";
export default {
  components: {
    CreateSupplierBrand,
    UpdateSmsLinkConfig,
    CreateBrand,
    UpdateBrandConfig,
    UpdateAgentBrand,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
      ],
      showUpdateDialog: false,
      showUpdateBrandDialog: false,
      showUpdateAgentDialog: false,
      activeName: "brandconfig",
      showAdd: true,
      showHistory: false,
      pageTotal: this.$pageTotalDefault,
      pageSize: this.$pageSizeDefault,
      showCreateDialog: false,
      showCreatebrandDialog: false,
      smslinklist: [],
      brandconfiglist: [],
      agentbrandlist: [],
      checkDisable: false,
      // smscongif: true,
      visibleAttendanceArrive: true,
      agent: true,
      dataSearchSmsConfig: {
        name: "",
      },
      dataSearchBrandConfig: {
        name: "",
      },
      dataSearchagentbrand: {
        name: "",
      },
      UpdateSupplier: {
        id: "",
        supplierName: "",
        supplierLink: "",
        usernameLink: "",
        passwordLink: "",
        supplierNote: " ",
      },
      UpdateBrand: {
        id: "",
        brandName: "",
        brandTypeCskh: "",
        brandTypeAds: "",
        note: " ",
      },
      UpdateAgent: {
        id: "",
        brandName: "",
        brandTypeCskh: "",
        brandTypeAds: "",
        brandActive: "",
        note: " ",
      },
      dataSearch: {
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    activeOneSMSMethod(row) {
      BrandNameService.updateActiveBrand(row)
        .then((resp) => {
          let data = resp.data.data;
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleCommandAdd(command) {
      if (command == "createSupplierBrandCommand") {
        this.showCreateDialog = true;
      }
      if (command == "createBrand") {
        this.showCreatebrandDialog = true;
        this.$refs.CreateBrand.getAllSupplierInitial();
      }
    },
    handleAddSupplier() {
      this.showCreateDialog = true;
    },
    handleAddBrand() {
      this.showCreatebrandDialog = true;
      this.$refs.CreateBrand.getAllSupplierInitial();
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "AgentBrand") {
        this.showAdd = true;
        this.smscongif = false;
        this.agent = true;
        this.visibleAttendanceArrive = false;
        this.showHistory = false;
        this.checkDisable = false;
      } else if (tabNameClick == "brandconfig") {
        this.visibleAttendanceArrive = true;
        this.smscongif = false;
        this.agent = false;
        this.showAdd = false;
        this.showHistory = true;
        this.checkDisable = true;
      } else if (tabNameClick == "smsLinkConfig") {
        this.smscongif = true;
        this.visibleAttendanceArrive = false;
        this.agent = false;
        this.showAdd = false;
        this.showHistory = true;
        this.checkDisable = true;
      }
    },
    dialogCloseUpdateMethod() {
      this.searchByProperties();
      this.showUpdateDialog = false;
    },
    dialogCloseUpdateBrandMethod() {
      this.searchBrandproperties();
      this.showUpdateBrandDialog = false;
    },
    dialogCloseCreateMethod() {
      this.searchByProperties();
      this.showCreateDialog = false;
    },
    dialogCloseCreateBrandMethod() {
      this.searchBrandproperties();
      this.showCreatebrandDialog = false;
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateDialog = true;
      this.UpdateSupplier.id = row.id;
      this.UpdateSupplier.supplierName = row.supplierName;
      this.UpdateSupplier.supplierLink = row.supplierLink;
      this.UpdateSupplier.usernameLink = row.usernameLink;
      this.UpdateSupplier.passwordLink = row.passwordLink;
      this.UpdateSupplier.supplierNote = row.supplierNote;
    },
    handleUpdateBrandconfig(index, row) {
      this.showUpdateBrandDialog = true;
      this.UpdateBrand.id = row.id;
      this.UpdateBrand.brandName = row.brandName;
      this.UpdateBrand.brandTypeCskh = row.brandTypeCskh;
      this.UpdateBrand.brandTypeAds = row.brandTypeAds;
      this.UpdateBrand.note = row.note;
    },
    handleEditagent(index, row) {
      this.showUpdateAgentDialog = true;
      this.UpdateAgent.id = row.id;
      this.UpdateAgent.brandName = row.brandName;
      this.UpdateAgent.brandTypeCskh = row.brandTypeCskh;
      this.UpdateAgent.brandTypeAds = row.brandTypeAds;
      this.UpdateAgent.brandActive = row.brandActive;
      this.UpdateAgent.note = row.note;
    },
    searchByProperties() {
      this.loadingData = true;
      BrandNameService.searchSmsConfig(this.dataSearchSmsConfig.name)
        .then((resp) => {
          this.smslinklist = resp.data.data.smsLinkConfigResponses;
        })
        .catch((err) => {
          this.smslinklist = null;
          console.log(err);
        })
        .finally(() => {
          if (this.smslinklist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    searchBrandproperties() {
      this.loadingData = true;
      BrandNameService.searchBrand(this.dataSearchBrandConfig.name)
        .then((resp) => {
          this.brandconfiglist = resp.data.data.brandResponses;
        })
        .catch((err) => {
          this.brandconfiglist = null;
          console.log(err);
        })
        .finally(() => {
          if (this.brandconfiglist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    searchByPropertiesAgentBrand() {
      this.loadingData = true;
      BrandNameService.searchAgentBrand(this.dataSearchagentbrand.name)
        .then((resp) => {
          this.agentbrandlist = resp.data.data.brandResponses;
        })
        .catch((err) => {
          this.agentbrandlist = null;
          console.log(err);
        })
        .finally(() => {
          if (this.agentbrandlist.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },

    handleDeleteBrandConfig(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa brand", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        BrandNameService.deletebrand(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            setTimeout(() => {
              this.searchBrandproperties();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Brand còn trường đang sử dụng, Xóa thất bại!",
              type: "error",
            });
          });
      });
    },
    handleDelete(index, row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa nhà cung cấp brand",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        BrandNameService.delete(row.id)
          .then((response) => {
            console.log(response);
            this.$message({
              message: "Xóa thành công",
              type: "success",
            });
            setTimeout(() => {
              this.searchByProperties();
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message({
              message: "Nhà cung cấp có brand đang sử dụng, Xóa thất bại !",
              type: "error",
            });
          });
      });
    },

    //click chọn số trang
    handleCurrentChange(pageNumber) {
      let number = this.pageSize;
      this.tableDataFilter = this.studentList.slice(
        (pageNumber - 1) * number,
        pageNumber * number
      );
    },
  },

  beforeMount() {
    this.searchByProperties();
    this.searchBrandproperties();
    this.searchByPropertiesAgentBrand();
  },
};
</script>
<style lang="scss" scoped>
.date {
  margin-bottom: 8px;
}

.button-select {
  margin-right: 5px;
  width: 150px;
}

/deep/.el-table th {
  padding: 10px 0;
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
  margin-bottom: -16px;
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

.content .row-data {
  margin-bottom: 20px;
}
// .table-content {
//   // .el-table {
//   //   // border-top-left-radius: 5px;
//   //   // border: 1px solid #78a5e7;
//   // }
// }

// .button-left-class {
//   margin-right: 5px;
//   width: 170px;
//   border: 1px solid #dcdfe6;
// }
// .button-left-status {
//   margin-right: 5px;
//   width: 110px;
//   border: 1px solid #dcdfe6;
// }
// .button-left-class1 {
//   margin-right: 5px;
//   width: 150px;
//   border: 1px solid #dcdfe6;
// }
// .button-left-class0 {
//   margin-right: 5px;
//   width: 150px;
// }
// /deep/.el-input__inner {
//   border: 1px solid #ffffff;
// }
// .button-left-class9 {
//   margin-right: 5px;
//   width: 150px;
// }
// .button-left-class2 {
//   margin-right: -50px;
//   width: 140px;
// }
// .button-left-class3 {
//   margin-left: -10px;
//   width: 140px;
// }
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
.buttonadd {
  float: right;
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
