<template>
  <el-dialog
    title="Sửa mẫu công lương"
    :visible.sync="dialogVisible"
    width="1150px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-form
      label-width="160px"
      :model="dataInput"
      label-position="left"
      :rules="rules"
      ref="dataInput"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="Tên khoản" prop="name">
            <el-input v-model="dataInput.name" placeholder="Nhập tên khoản"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Loại" prop="category">
            <el-select
              v-model="dataInput.category"
              @change="changeDiscountTypeMethod()"
              placeholder="Loại"
            >
              <el-option label="Chi" value="out"></el-option>
              <el-option label="Thu" value="in"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Mô tả" prop="description">
        <el-input
          :rows="1"
          type="textarea"
          autosize
          v-model="dataInput.description"
          placeholder="Nhập mô tả"
        ></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Đơn vị tính" prop="unit">
            <el-input v-model="dataInput.unit" placeholder="Nhập đơn vị tính"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Số lượng" prop="number">
            <el-input-number
              v-model="dataInput.number"
              :precision="0"
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Đơn giá" prop="price">
            <el-currency-input v-model="dataInput.price" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Giảm giá" prop="discount">
            <el-radio-group v-model="dataInput.discount">
              <el-radio :label="true">Có</el-radio>
              <el-radio :label="false">Không</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dataInput.discount">
          <el-form-item label="Loại giảm giá" prop="discountType">
            <el-select
              v-model="dataInput.discountType"
              @change="changeDiscountTypeMethod()"
              placeholder="Loại"
            >
              <el-option label="Phần trăm" value="percent"></el-option>
              <el-option label="Tiền" value="money"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dataInput.discount">
          <el-form-item
            :label="dataInput.discountType == 'percent' ? 'Phần trăm giảm' : 'Tiền giảm'"
            prop="discountNumber"
          >
            <el-input-number
              v-if="dataInput.discountType == 'percent'"
              v-model="dataInput.discountNumber"
              :precision="0"
              :min="0"
              :max="100"
            >
            </el-input-number>
            <el-currency-input
              v-else-if="dataInput.discountType == 'money'"
              v-model="dataInput.discountNumber"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col v-if="dataInput.discount">
          <el-form-item label="Đơn giá khi giảm" prop="discountPrice">
            <currency-input
              disabled
              style="
                padding: 10px;
                width: 98%;
                text-align: right;
                background: #e7e9ec;
                border: 1px solid #dcdfe6;
                font-weight: bold;
              "
              v-model="dataInput.discountPrice"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Tự động áp dụng" prop="active">
            <el-radio-group v-model="dataInput.active">
              <el-radio :label="true">Có</el-radio>
              <el-radio :label="false">Không</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Tháng áp dụng">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
              >Tất cả</el-checkbox
            >
            <el-checkbox v-model="dataInput.t1" label="T1"></el-checkbox>
            <el-checkbox v-model="dataInput.t2" label="T2"></el-checkbox>
            <el-checkbox v-model="dataInput.t3" label="T3"></el-checkbox>
            <el-checkbox v-model="dataInput.t4" label="T4"></el-checkbox>
            <el-checkbox v-model="dataInput.t5" label="T5"></el-checkbox>
            <el-checkbox v-model="dataInput.t6" label="T6"></el-checkbox>
            <el-checkbox v-model="dataInput.t7" label="T7"></el-checkbox>
            <el-checkbox v-model="dataInput.t8" label="T8"></el-checkbox>
            <el-checkbox v-model="dataInput.t9" label="T9"></el-checkbox>
            <el-checkbox v-model="dataInput.t10" label="T10"></el-checkbox>
            <el-checkbox v-model="dataInput.t11" label="T11"></el-checkbox>
            <el-checkbox v-model="dataInput.t12" label="T12"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Áp dụng điểm danh" prop="attendance">
            <el-radio-group v-model="dataInput.attendance">
              <el-radio :label="true">Có</el-radio>
              <el-radio :label="false">Không</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dataInput.attendance">
          <el-form-item label="Loại điểm danh" prop="attendanceType">
            <el-select
              v-model="dataInput.attendanceType"
              placeholder="Chọn loại điểm danh"
              @change="changeAttendanceTypeMethod()"
            >
              <el-option
                v-for="item in attendanceTypeList"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dataInput.attendance">
          <el-form-item label="Chi tiết" prop="attendanceDetail">
            <el-select v-model="dataInput.attendanceDetail" placeholder="Chọn chi tiết">
              <el-option
                v-for="item in attendanceDetailList"
                :key="item.key"
                :value="item.key"
                :label="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
import EmployeeSalaryService from "@/services/EmployeeSalaryService";

const valAttendanceGoSchoolList = [{ key: "pickupLate", value: "Muộn" }];
const valAttendanceLeaveSchoolList = [{ key: "pickupSoon", value: "Sớm" }];

const valAttendanceList = [
  { key: "morning", value: "Buổi sáng" },
  { key: "afternoon", value: "Buổi chiều" },
  { key: "evening", value: "Buổi tối" },
  { key: "allDay", value: "Cả ngày" },
];

const valAttendanceEatList = [
  { key: "eatBreakfast", value: "Bữa sáng" },
  { key: "eatLunch", value: "Bữa trưa" },
  { key: "eatDinner", value: "Bữa tối" },
  { key: "allDay", value: "Cả ngày" },
];

export default {
  components: {
    ElCurrencyInput,
  },
  props: {
    dialogVisible: null,
    idSalaryDefault: null,
  },

  data() {
    return {
      dataInput: [],
      attendanceTypeList: this.$funcData.getAttendanceEmployeeTypeFuncList(),
      attendanceGoSchoolList: valAttendanceGoSchoolList,
      attendanceEatList: valAttendanceEatList,
      attendanceList: valAttendanceList,
      attendanceLeanveSchoolList: valAttendanceLeaveSchoolList,
      attendanceDetailList: [],
      checkAll: false,
      loadingButton: false,
      rules: {
        name: [
          {
            required: true,
            message: "Tên khoản không được để trống",
            trigger: "blur",
          },
        ],
        unit: [
          {
            required: true,
            message: "Đơn vị tính không được để trống",
            trigger: "blur",
          },
        ],
        number: [
          {
            required: true,
            message: "Số lượng không được để trống",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "Đơn giá không được để trống",
            trigger: "blur",
          },
        ],
        discountType: [
          {
            required: true,
            message: "Loại giảm giá không được để trống",
            trigger: "change",
          },
        ],
        discountNumber: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
        attendanceType: [
          {
            required: true,
            message: "Loại điểm danh không được để trống",
            trigger: "change",
          },
        ],
        attendanceDetail: [
          {
            required: true,
            message: "Chi tiết không được để trống",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "Kiểu đóng không được để trống",
            trigger: "change",
          },
        ],
        category: [
          {
            required: true,
            message: "Loại không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    dataInput: {
      handler: function () {
        let dataInputWatch = this.dataInput;
        let discountNumberWatch = dataInputWatch.discountNumber;
        let discountPriceWatch = dataInputWatch.price;
        let priceWatch = dataInputWatch.price;
        if (
          discountNumberWatch != undefined &&
          discountNumberWatch != "" &&
          discountNumberWatch != 0 &&
          priceWatch != undefined &&
          priceWatch != "" &&
          priceWatch != 0
        ) {
          if (dataInputWatch.discountType == "percent") {
            discountPriceWatch = Number.parseInt(
              discountPriceWatch * ((100 - discountNumberWatch) / 100)
            );
          } else if (dataInputWatch.discountType == "money") {
            if (discountNumberWatch <= priceWatch) {
              discountPriceWatch = discountPriceWatch - discountNumberWatch;
            } else {
              this.$alert("Số tiền giảm không thể lớn hơn đơn giá", "Thông báo!", {
                confirmButtonText: "Đã hiểu",
                callback: () => {
                  this.dataInput.discountNumber = 0;
                },
              });
            }
          }
        }
        this.dataInput.discountPrice = discountPriceWatch;
      },
      deep: true,
    },
    changeAttendanceTypeComputed() {
      if (this.dataInput.attendanceType == "goSchool") {
        this.attendanceDetailList = this.attendanceGoSchoolList;
        this.dataInput.attendanceDetail = "pickupLate";
      } else if (this.dataInput.attendanceType == "leave") {
        this.attendanceDetailList = this.attendanceLeanveSchoolList;
        this.dataInput.attendanceDetail = "pickupSoon";
      } else if (this.dataInput.attendanceType == "eat") {
        this.attendanceDetailList = this.attendanceEatList;
      } else if (this.dataInput.attendanceType == "goWork") {
        this.attendanceDetailList = this.$funcData.getAttendanceEmployeeFuncList();
      } else if (this.dataInput.attendanceType == "absentYes") {
        this.attendanceDetailList = this.attendanceList;
      } else if (this.dataInput.attendanceType == "absentNo") {
        this.attendanceDetailList = this.attendanceList;
      } else if (this.dataInput.attendanceType == "absentCommon") {
        this.attendanceDetailList = this.$funcData.getAbsentCommonFuncList();
        this.dataInput.attendanceDetail = "absentTime";
      } else if (this.dataInput.attendanceType == "absentDateToDate") {
        this.attendanceDetailList = this.$funcData.getAbsentDateToDateDetailList();
      } else if (this.dataInput.attendanceType == "goWorkDateToDate") {
        this.attendanceDetailList = this.$funcData.getGoWorkDateToDateDetailList();
      }
    },
  },
  computed: {
    changeAttendanceTypeComputed() {
      return this.dataInput.attendanceType;
    },
  },
  methods: {
    detailSalarySample(id) {
      EmployeeSalaryService.detailSalarySample(id)
        .then((resp) => {
          this.dataInput = resp.data.data;
        })
        .catch((err) => {
          this.$message({
            message: err.response.data.message,
            type: "error",
          });
        });
    },
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.resetData();
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    changeAttendanceTypeMethod() {
      this.dataInput.attendanceDetail = "";
    },
    resetData() {
      this.dataInput.t1 = false;
      this.dataInput.t2 = false;
      this.dataInput.t3 = false;
      this.dataInput.t4 = false;
      this.dataInput.t5 = false;
      this.dataInput.t6 = false;
      this.dataInput.t7 = false;
      this.dataInput.t8 = false;
      this.dataInput.t9 = false;
      this.dataInput.t10 = false;
      this.dataInput.t11 = false;
      this.dataInput.t12 = false;
    },
    handleCheckAllChange(val) {
      let dataInputLocal = this.dataInput;
      dataInputLocal.t1 = val;
      dataInputLocal.t2 = val;
      dataInputLocal.t3 = val;
      dataInputLocal.t4 = val;
      dataInputLocal.t5 = val;
      dataInputLocal.t6 = val;
      dataInputLocal.t7 = val;
      dataInputLocal.t8 = val;
      dataInputLocal.t9 = val;
      dataInputLocal.t10 = val;
      dataInputLocal.t11 = val;
      dataInputLocal.t12 = val;
    },
    checkBeforeSubmit() {
      let dataInputCheck = this.dataInput;
      if (dataInputCheck.type == "multiple") {
        if (
          !dataInputCheck.t1 &&
          !dataInputCheck.t2 &&
          !dataInputCheck.t3 &&
          !dataInputCheck.t4 &&
          !dataInputCheck.t5 &&
          !dataInputCheck.t6 &&
          !dataInputCheck.t7 &&
          !dataInputCheck.t8 &&
          !dataInputCheck.t9 &&
          !dataInputCheck.t10 &&
          !dataInputCheck.t11 &&
          !dataInputCheck.t12
        ) {
          this.$message({
            message: "Chưa chọn tháng áp dụng",
            type: "error",
          });
          throw null;
        }
      }
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.checkBeforeSubmit();
          this.loadingButton = true;
          EmployeeSalaryService.updateSalarySample(this.dataInput)
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
        } else {
          console.log("error validate data!");
          return false;
        }
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
.el-input-number {
  width: 100%;
}
</style>
