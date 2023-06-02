<template>
  <div>
    <el-dialog
      :title="'Danh sách đưa đón: ' + fullName + ' - ' + className"
      :visible.sync="dialogVisible"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="5vh"
    >
      <el-table
        ref="multipleTable"
        :empty-text="textTable"
        v-loading="loadingData"
        :element-loading-text="$tableLoadding"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255, 0)"
        :data="dataList"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="$funcCommon.tableHeaderColorFunction"
        @selection-change="handleSelectionChange"
        :max-height="$tableMaxHeight"
        border
      >
        <el-table-column
          type="index"
          label="STT"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column label="Đưa" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.inStatus"
              @change="inStatusChangeMethod(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Đón" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.outStatus"
              @change="outStatusChangeMethod(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="Họ tên" min-width="150" prop="fullName">
        </el-table-column>
        <el-table-column
          label="Số điện thoại"
          min-width="100"
          align="center"
          prop="phone"
        >
        </el-table-column>
        <el-table-column
          label="Số định danh"
          min-width="100"
          align="center"
          prop="identify"
        >
        </el-table-column>
        <el-table-column label="Quan hệ" min-width="100" prop="relationship">
        </el-table-column>
        <el-table-column label="Ghi chú" min-width="150" prop="note">
        </el-table-column>
        <el-table-column label="Ảnh" width="180" align="center">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.url != null"
              style="width: 140px; height: 140px"
              :src="scope.row.url"
              fit="fill"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Tác vụ"
          width=" 150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="dialogTransferOneUpdateMethod(scope.row)"
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
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialog()">
          <i class="el-icon-circle-close" />
          <span>Đóng</span>
        </el-button>
      </span>
    </el-dialog>
    <StudentTransferDialog
      :dialogVisible="showDialogTransfer"
      @dialog-close="closeDialogTransfer"
      ref="StudentTransferDialog"
    />
  </div>
</template>

<script>
import StudentService from "@/services/StudentService";
import StudentTransferDialog from "./StudentTransferDialog.vue";
export default {
  props: {
    dialogVisible: null,
  },
  components: {
    StudentTransferDialog,
  },
  data() {
    return {
      loadingButton: false,
      showUpload: true,
      showPicutreInitial: true,
      showDialogTransfer: false,
      imageUrl: "",
      fullName: "",
      className: "",
      idKid: "",
      dataList: [],
      rules: {
        fullName: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.dataList = [];
      }, 300);
    },
    closeDialogTransfer() {
      this.showDialogTransfer = false;
      this.searchByProperties();
    },
    dialogTransferOneUpdateMethod(row) {
      this.$refs.StudentTransferDialog.initialDataUpdate(
        this.fullName,
        this.className,
        row
      );
      this.showDialogTransfer = true;
    },
    handleDelete(row) {
      this.$confirm("Bạn có chắc chắn muốn xóa không?", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        StudentService.kidsTransferDeleteById(row.id)
          .then((response) => {
            this.$message({
              message: response.data.message,
              type: "success",
            });
            this.searchByProperties();
          })
          .catch((err) => {
            this.$message({
              message: err.response.data.message,
              type: "error",
            });
          });
      });
    },
    inStatusChangeMethod(row) {
      StudentService.kidsTransferInSatusService(row.id, row.inStatus)
        .then((response) => {
          this.$message({
            message: response.data.message,
            type: "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    outStatusChangeMethod(row) {
      StudentService.kidsTransferOutSatusService(row.id, row.outStatus)
        .then((response) => {
          this.$message({
            message: response.data.message,
            type: "success",
          });
          this.searchByProperties();
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    searchByProperties() {
      StudentService.kidsTransferByIdKid(this.idKid)
        .then((resp) => {
          this.dataList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    initialData(id, fullName, className) {
      this.fullName = fullName;
      this.className = className;
      this.idKid = id;
      this.searchByProperties();
    },
  },
};
</script>

<style >
.hideUpload > div {
  display: none;
}
.input-class {
  width: 200px;
  margin-right: 15px;
}
.text-class {
  margin-right: 10px;
}
</style>
