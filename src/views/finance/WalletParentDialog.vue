<template>
  <el-dialog
    :title="'Nạp/rút tiền từ ví cho học sinh: ' + kidName"
    :visible.sync="dialogVisible"
    width="900px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="10vh"
  >
    <el-form
      label-width="130px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-form-item label="Số dư trong ví">
        <span style="color: #409eff; font-weight: bold">
          <span v-if="walletBalance == 0">0</span>
          <span v-else>{{ walletBalance | formatCurrency }}</span>
        </span>
      </el-form-item>
      <el-form-item
        label="Loại"
        prop="category"
        style="width: 45%; display: inline-block"
      >
        <el-select
          v-model="dataInput.category"
          style="width: 100%"
          placeholder="Chọn loại"
          @change="changeCategoryMethod()"
        >
          <el-option value="in" label="Nạp tiền"></el-option>
          <el-option value="out" label="Rút tiền"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Ngày nạp/rút"
        prop="date"
        style="display: inline-block; float: right; width: 45%"
      >
        <el-date-picker
          v-model="dataInput.date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          style="width: 100%"
          :clearable="false"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item
        label="Số tiền"
        prop="money"
        style="display: inline-block; width: 45%"
      >
        <el-currency-input v-model="dataInput.money" />
      </el-form-item>
      <el-form-item
        label="Người nạp/rút"
        prop="name"
        style="display: inline-block; width: 45%; float: right"
      >
        <el-input v-model="dataInput.name" placeholder="Nhập tên người nạp/rút" />
      </el-form-item>
      <el-form-item label="Nội dung" prop="description">
        <el-input
          :rows="3"
          type="textarea"
          v-model="dataInput.description"
          placeholder="Nhập nội dung"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="dataInput.category == 'in'"
        label="Nạp đến tài khoản"
        prop="idBank"
      >
        <el-select
          v-model="dataInput.idBank"
          style="width: 100%"
          placeholder="Chọn tài khoản nạp"
          clearable
        >
          <el-option
            v-for="item in bankList"
            :key="item.id"
            :label="item.fullName + ' - ' + item.accountNumber + ' - ' + item.bankName"
            :value="item.id"
          >
            <span
              >{{ item.fullName }} - {{ item.accountNumber }} - {{ item.bankName }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-upload
          :on-remove="handleRemove"
          :on-change="handleChangeUpload"
          :auto-upload="false"
          limit="1"
          :show-file-list="true"
          ref="upload"
        >
          <el-button size="small" type="text" style="text-decoration: underline"
            >Thêm ảnh</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>{{ $t("button.save") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import ElCurrencyInput from "@/components/ElCurrencyInput.vue";
import FnFeesService from "@/services/FnFeesService";
import moment from "moment";
export default {
  components: {
    ElCurrencyInput,
  },
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      kidName: "",
      idWalletParent: "",
      walletBalance: "",
      dataInput: {
        idKid: "",
        money: Number,
        category: "in",
        idBank: "",
        description: "Thực hiện giao dịch nạp tiền",
        name: "",
      },
      imageUrl: "",
      bankList: [],
      loadingButton: false,
      rules: {
        category: [
          {
            required: true,
            message: "Loại không được để trống",
            trigger: "change",
          },
        ],
        money: [
          {
            required: true,
            message: "Số tiền không được để trống",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "Người nạp không được để trống",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "Ngày không được để trống",
            trigger: "change",
          },
        ],
        description: [
          {
            required: true,
            message: "Nội dung không được để trống",
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
        this.loadingButton = false;
        this.handleRemove();
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    handleRemove() {
      this.imageUrl = "";
      this.$refs.upload.clearFiles();
    },
    handleChangeUpload(file) {
      this.beforeAvatarUpload(file);
      this.imageUrl = file.raw;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt5M = file.raw.size / 1024 / 1024 <= 5;
      if (!isJPG && !isPNG) {
        this.$message.error("Bạn phải chọn dạng ảnh");
        this.$refs.upload.clearFiles();
        throw "file not valid";
      }
      if (!isLt5M) {
        this.$message.error("Ảnh không được quá 5MB!");
        this.$refs.upload.clearFiles();
        throw "over size";
      }
    },
    changeCategoryMethod() {
      let inputData = this.dataInput;
      if (inputData.category == "in") {
        inputData.description = "Thực hiện giao dịch nạp tiền";
      } else {
        inputData.description = "Thực hiện giao dịch rút tiền";
      }
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.loadingButton = true;
          let inputData = this.dataInput;
          let formDatas = new FormData();
          for (let key in inputData) {
            formDatas.append(key, inputData[key]);
          }
          if (this.imageUrl != "") {
            formDatas.append("multipartFile", this.imageUrl);
          }
          formDatas.append("idWalletParent", this.idWalletParent);
          FnFeesService.createWalletParentHisotry(formDatas)
            .then((resp) => {
              this.$message({
                message: resp.data.message,
                type: "success",
              });
              setTimeout(() => {
                this.closeDialog();
              }, 500);
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
            })
            .finally(() => {
              setTimeout(() => {
                this.loadingButton = false;
              }, 500);
            });
        } else {
          console.log("error validate data!");
          return false;
        }
      });
    },
    getCurrentDate() {
      this.dataInput.date = moment(String(new Date())).format("YYYY-MM-DD");
    },
    getDataInitial(row) {
      this.dataInput.idKid = row.id;
      this.kidName = row.fullName;
      this.idWalletParent = row.walletParent.id;
      this.walletBalance = row.walletParent.moneyIn - row.walletParent.moneyOut;
      this.getCurrentDate();
      FnFeesService.getBankInfo()
        .then((resp) => {
          this.bankList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
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
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
</style>
