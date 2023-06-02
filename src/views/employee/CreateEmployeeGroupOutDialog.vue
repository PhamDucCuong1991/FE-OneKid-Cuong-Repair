<template>
  <el-dialog
    title="Thư mục lưu"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <div class="button-click-left">
      <span style="font-size: 16px; margin: 0 10px">Chọn thư mục</span>
      <!-- chọn trạng thái -->
      <el-select
        style="text-argin: right; width: 400px"
        class="button-left-status"
        v-model="dataSearch.idGroupOut"
        placeholder="Trạng thái"
      >
        <el-option
          v-for="item in employeeStatusList"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <div style="margin-top: 5px">
        <span style="font-size: 16px; margin: 0 6px">Ngày ra trường</span>
        <el-date-picker
          v-model="dataSearch.dateOut"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          placeholder="Ngày ra trường"
        >
        </el-date-picker>
      </div>
    </div>
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
import GroupOutService from "@/services/GroupOutService";
import moment from "moment";

export default {
  props: {
    dialogVisible: null,
    listEmployee: null,
  },
  data() {
    return {
      loadingButton: false,
      employeeStatusList: [],
      dataSearch: {
        idGroupOut: "",
        name: "",
        dateOut: moment().format("YYYY-MM-DD"),
      },
    };
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.dataSearch.dateOut = moment().format("YYYY-MM-DD");
      }, 500);
    },
    //click when click button
    closeDialogByButton() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.dataSearch.dateOut = moment().format("YYYY-MM-DD");
      }, 500);
    },
    submitForm() {
      this.loadingButton = true;
      let data = {
        idList: this.$props.listEmployee.map((x) => x.id),
        idGroupOut: this.dataSearch.idGroupOut,
        dateOut: this.dataSearch.dateOut,
      };
      GroupOutService.updateEmployeeGroupOut(data)
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
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loadingButton = false;
          }, 500);
        });
    },
    async getAllGroupOutEmployeeName() {
      await GroupOutService.getAllGroupOutEmployeeNameEmployee()
        .then((resp) => {
          this.employeeStatusList = resp.data.data;
          if (this.employeeStatusList.length > 0) {
            this.dataSearch.name = this.employeeStatusList[0].name;
            this.dataSearch.idGroupOut = this.employeeStatusList[0].id;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  beforeMount() {
    this.getAllGroupOutEmployeeName();
  },
};
</script>

<style lang="scss" scoped>
</style>
