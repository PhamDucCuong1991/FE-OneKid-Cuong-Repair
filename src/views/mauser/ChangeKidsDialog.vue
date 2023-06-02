<template>
  <div>
    <el-dialog
      title="Chọn con"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      top="15vh"
    >
      <el-table
        ref="multipleTable"
        :data="responseList"
        highlight-current-row
        :row-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
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
        <el-table-column prop="fullName" label="Họ tên"></el-table-column>
        <el-table-column prop="maClass.className" label="Lớp"></el-table-column>
        <el-table-column prop="gender" label="Giới tính" align="center"></el-table-column>
        <el-table-column label="Ngày sinh" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.birthDay | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column width="140" align="center">
          <template slot-scope="scope">
            <el-radio
              @change="changeKidsMethod(scope.row)"
              v-model="checkActive"
              :label="scope.row.status"
              >Chọn</el-radio
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="medium" @click="closeDialogByButton()">
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          @click="submitForm()"
          :loading="loadingButton"
        >
          <i class="el-icon-circle-check" />
          <span>{{ $t("button.save") }}</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ParentService from "@/services/ParentService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      // userData: {
      //   id: "",
      //   appType: "",
      //   oldPhone: "",
      //   newPhone: "",
      // },
      checkActive: true,
      responseList: [],
      loadingButton: false,
      rules: {
        newPhone: [
          {
            min: 10,
            max: 10,
            message: "Số điện thoại bao gồm 10 số",
            trigger: "change",
          },
          {
            required: true,
            message: "Số điện thoại không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      // this.resetFormData();
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      // this.resetFormData();
    },
    resetFormData() {
      setTimeout(() => {
        this.$refs["userData"].resetFields();
      }, 200);
    },
    changeKidsMethod(row) {
      this.responseList.forEach((x) => {
        x.status = false;
      });
      row.status = true;
      this.checkActive = true;
    },
    submitForm() {
      let schoolSchoose = this.responseList.filter((x) => x.status);
      let idActive = schoolSchoose[0].id;
      this.loadingButton = true;
      ParentService.updateChangeKidsParent(idActive)
        .then((resp) => {
          let responseData = resp.data.data;
          localStorage.setItem("user", JSON.stringify(responseData));
          this.$message({
            message: "Thay đổi thành công",
            type: "success",
          });
          this.$store.dispatch("auth/setUserActions", responseData);
          this.$router.push("/dashboard");
          setTimeout(() => {
            this.closeDialogByButton();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Lỗi thay đổi thông tin",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },

    getChangeKidsInitialData() {
      ParentService.getChangeKidsParent()
        .then((resp) => {
          this.responseList = resp.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
// .grid-content-over{
//     margin-bottom: 10px;
// }
.el-row {
  margin-bottom: 20px;
}
.space-right {
  margin-right: 15px;
}
</style>
