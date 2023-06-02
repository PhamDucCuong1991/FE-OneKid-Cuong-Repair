<template>
  <div>
    <el-table
      ref="multipleTable"
      :empty-text="textTable"
      v-loading="loadingData"
      :element-loading-text="$tableLoadding"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255, 0)"
      highlight-current-row
      :data="wishesSampleList"
      :cell-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
      :max-height="$tableMaxHeight"
      border
    >
      <el-table-column
        type="index"
        label="STT"
        width="60"
        align="center"
      ></el-table-column>
      <el-table-column prop="wishesContent" label="Nội dung"></el-table-column>
      <el-table-column
        prop="receiverType"
        label="Đối tượng"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column label="Nguồn" width="130" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.idSchool == 0">Hệ thống</span>
          <span v-else>Nhà trường</span>
        </template>
      </el-table-column>
      <el-table-column label="Ảnh" width="200" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.urlPicture != null"
            style="width: 150px; height: 150px"
            :src="scope.row.urlPicture"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['schoolConfig_wishSample_update'])"
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
              @click="updateWishesSampleMethod(scope.row)"
              >Sửa</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteWishesSampleMethod(scope.row)"
              >Xóa</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="checkPermission(['schoolConfig_wishSample_update'])"
      style="float: right; margin: 15px 0"
    >
      <el-button
        class="button-bottom"
        type="success"
        @click="createWishesSampleMethod()"
        >Thêm mẫu lời chúc</el-button
      >
    </div>
    <WishesSampleCreate
      :dialogVisible="showWishSampleCreateDialog"
      @dialog-close="dialogCloseWishSampleCreateMethod()"
    />
    <WishesSampleUpdate
      :dialogVisible="showWishSampleUpdateDialog"
      @dialog-close="dialogCloseWishSampleUpdateMethod()"
      ref="WishesSampleUpdate"
    />
  </div>
</template>
<script>
import checkPermission from "@/utils/permission.js";
import SchoolConfigService from "@/services/SchoolConfigService";
import WishesSampleCreate from "./WishesSampleCreate.vue";
import WishesSampleUpdate from "./WishesSampleUpdate.vue";
export default {
  components: {
    WishesSampleCreate,
    WishesSampleUpdate,
  },
  data() {
    return {
      wishesSampleList: [],
      showWishSampleCreateDialog: false,
      showWishSampleUpdateDialog: false,
      loadingData: true,
      textTable: "",
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
    createWishesSampleMethod() {
      this.showWishSampleCreateDialog = true;
    },
    dialogCloseWishSampleCreateMethod() {
      this.showWishSampleCreateDialog = false;
      this.searchByProperties();
    },
    updateWishesSampleMethod(row) {
      this.showWishSampleUpdateDialog = true;
      this.$refs.WishesSampleUpdate.getDataInitial(row);
    },
    dialogCloseWishSampleUpdateMethod() {
      this.showWishSampleUpdateDialog = false;
      this.searchByProperties();
    },
    /**
     * delete wishes sample
     */
    deleteWishesSampleMethod(row) {
      this.$confirm(
        "Bạn có chắc chắn muốn xóa mẫu lời chúc đã chọn?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        SchoolConfigService.deleteWishesSample(row.id)
          .then((resp) => {
            this.$message({
              message: resp.data.message,
              type: "success",
            });
            this.findAllWishesSampleMethod();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    searchByProperties() {
      this.loadingData = true;
      SchoolConfigService.findAllWishesSample()
        .then((resp) => {
          this.wishesSampleList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
          this.wishesSampleList = null;
        })
        .finally(() => {
          if (this.wishesSampleList.length == 0) {
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
<style scoped>
.button-bottom {
  border-radius: 0;
}
</style>
