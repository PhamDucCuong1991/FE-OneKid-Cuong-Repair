<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">1. Tạo dữ liệu chung cho hệ thống</el-col>
      <el-col :span="5">
        <el-button size="small" @click="createDataCommonMethod()" type="primary"
          >Tạo dữ liệu</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">2. Tạo folder '0' cho hệ thống</el-col>
      <el-col :span="5">
        <el-button size="small" @click="createFolderSystemMethod()" type="primary"
          >Tạo folder</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">3. Kiểm tra backend</el-col>
      <el-col :span="5">
        <el-button size="small" @click="checkBackendMethod()" type="primary"
          >Kiểm tra</el-button
        >
        &nbsp;
        {{ dataBackend }}
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">4. Tạo điểm danh, nhận xét cho một ngày</el-col>
      <el-col :span="4">
        <el-button
          size="small"
          :loading="buttonLoadding"
          @click="createAttendanceEvaluateManual()"
          type="primary"
          >Tạo điểm danh-nhận xét</el-button
        >
      </el-col>
      <el-col :span="5">
        <el-date-picker
          size="medium"
          v-model="dataInput.date"
          type="date"
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          placeholder="Chọn ngày"
          :clearable="false"
        ></el-date-picker>
      </el-col>
      <el-col :span="6">
        <el-select
          size="medium"
          v-model="dataInput.idSchool"
          placeholder="Chọn trường"
          filterable
          clearable
          style="width: 250px"
        >
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.schoolName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OtherService from "@/services/OtherService";
export default {
  data() {
    return {
      dataBackend: "",
      dataInput: {
        date: "",
        idSchool: "",
      },
      buttonLoadding: false,
      schoolList: [],
    };
  },
  methods: {
    createDataCommonMethod() {
      OtherService.createDataSystem()
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
    createFolderSystemMethod() {
      OtherService.createFolderSystem()
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
    checkBackendMethod() {
      OtherService.checkBackend()
        .then((resp) => {
          this.dataBackend = resp.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    createAttendanceEvaluateManual() {
      if (this.dataInput.date == "") {
        this.$message({
          message: "Chọn ngày tạo điểm danh, nhận xét",
          type: "error",
        });
        throw null;
      }
      let alertText = this.dataInput.idSchool == "" ? "cho TOÀN BỘ các trường" : "";
      this.$confirm(
        "Bạn có chắc chắn muốn tạo điểm danh-nhận xét " + alertText + " không?",
        "Thông báo!",
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }
      ).then(() => {
        this.buttonLoadding = true;
        OtherService.createAttendanceEvaluateFromDate(
          this.dataInput,
          this.dataInput.idSchool
        )
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
          })
          .finally(() => {
            setTimeout(() => {
              this.buttonLoadding = false;
            }, 1000);
          });
      });
    },
    getAllSchoolMethod() {
      OtherService.getSchoolAllService()
        .then((resp) => {
          this.schoolList = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
  },
  beforeMount() {
    this.getAllSchoolMethod();
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
