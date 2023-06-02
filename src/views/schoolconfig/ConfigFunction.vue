<template>
  <div class="content">
    <div class="table-content row-data">
      <el-form
        label-width="200px"
        :model="responseData"
        label-position="left"
        :rules="rules"
        ref="responseData"
      >
        <el-col :span="12">
          <span>Phụ huynh</span>
          <el-form-item label="Hiển thị điểm danh ngày">
            <el-checkbox v-model="responseData.showAttendanceDateParent"></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị iểm danh tháng">
            <el-checkbox v-model="responseData.showAttendanceMonthParent"></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị điểm danh ăn">
            <el-checkbox v-model="responseData.showAttendanceEatParent"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <span>Giáo viên/Chủ trường</span>
          <el-form-item label="Hiển thị điểm danh đến">
            <el-checkbox
              v-model="responseData.showAttendanceArriveTeacherPlus"
            ></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị điểm danh về">
            <el-checkbox
              v-model="responseData.showAttendanceLeaveTeacherPlus"
            ></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị điểm danh ăn">
            <el-checkbox
              v-model="responseData.showAttendanceEatTeacherPlus"
            ></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị nhận xét học tập">
            <el-checkbox
              v-model="responseData.showEvaluateLearnTeacherPlus"
            ></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị nhận xét ăn uống">
            <el-checkbox v-model="responseData.showEvaluateEatTeacherPlus"></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị nhận xét ngủ nghỉ">
            <el-checkbox
              v-model="responseData.showEvaluateSleepTeacherPlus"
            ></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị nhận xét vệ sinh">
            <el-checkbox
              v-model="responseData.showEvaluateSanitaryTeacherPlus"
            ></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị nhận xét sức khỏe">
            <el-checkbox
              v-model="responseData.showEvaluateHealthTeacherPlus"
            ></el-checkbox>
          </el-form-item>
          <el-form-item label="Hiển thị nhận xét chung">
            <el-checkbox
              v-model="responseData.showEvaluateCommonTeacherPlus"
            ></el-checkbox>
          </el-form-item>
        </el-col>
      </el-form>

      <el-button
        type="success"
        size="medium"
        style="float: right"
        :loading="loadingButton"
        @click="submitForm()"
        >Lưu</el-button
      >
    </div>
  </div>
</template>

<script>
import SupperPlusService from "@/services/SupperPlusService";

export default {
  data() {
    return {
      loadingButton: false,
      responseData: {},
    };
  },
  methods: {
    submitForm() {
      this.loadingButton = true;
      SupperPlusService.updateConfigFunction(this.responseData)
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
            this.loadingButton = false;
          }, 500);
        });
    },
    fetchData() {
      SupperPlusService.getConfigFunction()
        .then((resp) => {
          this.responseData = resp.data.data;
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
