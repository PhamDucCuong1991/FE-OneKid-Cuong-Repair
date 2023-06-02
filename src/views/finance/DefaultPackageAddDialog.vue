<template>
  <el-dialog
    title="Thêm khoản mặc định cho học sinh"
    :visible.sync="dialogVisible"
    width="1150px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="4vh"
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
          <el-form-item label="Chọn khoản" prop="idPackage">
            <el-select
              v-model="dataInput.idPackage"
              placeholder="Chọn khoản"
              filterable
              @change="selectPackageMethod()"
              style="width: 100%"
            >
              <el-option
                v-for="item in responseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Loại" prop="category">
            <el-select
              disabled
              v-model="dataInput.category"
              @change="changeDiscountTypeMethod()"
              placeholder="Loại"
            >
              <el-option label="Thu" value="in"></el-option>
              <el-option label="Chi" value="out"></el-option>
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
            <el-input
              disabled
              v-model="dataInput.unit"
              placeholder="Nhập đơn vị tính"
            ></el-input>
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
          <el-form-item label="Tự động đăng ký" prop="active">
            <el-radio-group v-model="dataInput.active">
              <el-radio :label="true">Có</el-radio>
              <el-radio :label="false">Không</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Kiểu đóng" prop="type">
            <span v-if="dataInput.type == 'single'">Một lần</span>
            <span v-else-if="dataInput.type == 'multiple'">Nhiều lần</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="dataInput.type == 'multiple'" :gutter="20">
        <el-col :span="24">
          <el-form-item label="Tháng áp dụng">
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
      <el-row v-if="!!dataInput.type" :gutter="20">
        <el-col :span="8">
          <el-form-item label="Hết hạn" prop="expired">
            <el-radio-group v-model="dataInput.expired">
              <el-radio :label="true">Có</el-radio>
              <el-radio :label="false">Không</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="!!dataInput.type && dataInput.expired" :span="12">
          <el-form-item
            v-if="dataInput.type == 'single'"
            label="Hạn thu"
            prop="endDateExpired"
          >
            <el-date-picker
              v-model="dataInput.endDateExpired"
              type="date"
              placeholder="Chọn ngày"
              value-format="yyyy-MM-dd"
              format="dd-MM-yyyy"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="dataInput.type == 'multiple'"
            label="Hạn tháng thu"
            prop="monthNumber"
          >
            <el-radio-group v-model="dataInput.monthNumber">
              <el-radio :label="0">Tháng hiện tại</el-radio>
              <el-radio :label="1">Tháng kế tiếp</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="dataInput.type == 'multiple' && dataInput.expired" :gutter="20">
        <el-col :span="8">
          <el-form-item label="Tháng 2" prop="febNumberExpired">
            <el-input-number v-model="dataInput.febNumberExpired" :min="1" :max="28">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Tháng 4,6,9,11" prop="smallNumberExpired">
            <el-input-number v-model="dataInput.smallNumberExpired" :min="1" :max="30">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Tháng 1,3,5,7,8,10,12" prop="largeNumberExpired">
            <el-input-number v-model="dataInput.largeNumberExpired" :min="1" :max="31">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="dataInput.type == 'multiple'">
        <el-col :span="8">
          <el-form-item label="Áp dụng điểm danh" prop="attendance">
            <span v-if="dataInput.attendance">Có</span>
            <span v-else>Không</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="dataInput.attendance">
          <el-form-item label="Kiểu trả" prop="attendancePaid">
            <span v-if="dataInput.attendancePaid == 'before'">Trả trước</span>
            <span v-else-if="dataInput.attendancePaid == 'after'">Trả sau</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="dataInput.type == 'multiple' && dataInput.attendance">
        <span v-if="dataInput.attendancePaid == 'before'">
          <el-col :span="8">
            <el-form-item label="Loại điểm danh" prop="attendanceType">
              <el-select
                disabled
                v-model="dataInput.attendanceType"
                placeholder="Chọn loại điểm danh"
              >
                <el-option
                  v-for="item in this.$funcData.funcAttendanceTypeNewList()"
                  :key="item.key"
                  :value="item.key"
                  :label="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="dataInput.attendanceType != 'pickupLate'">
            <el-form-item label="Chi tiết" prop="attendanceDetail">
              <el-select
                disabled
                v-model="dataInput.attendanceDetail"
                placeholder="Chọn chi tiết"
                style="width: 250px"
              >
                <el-option
                  v-for="item in getAttendanceDetailList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </span>
        <span v-else-if="dataInput.attendancePaid == 'after'">
          <el-col :span="8">
            <el-form-item label="Loại điểm danh" prop="attendanceType">
              <el-select
                disabled
                v-model="dataInput.attendanceType"
                placeholder="Chọn loại điểm danh"
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
          <el-col :span="8" v-if="dataInput.attendanceType != 'pickupLate'">
            <el-form-item label="Chi tiết" prop="attendanceDetail">
              <el-select
                disabled
                v-model="dataInput.attendanceDetail"
                placeholder="Chọn chi tiết"
                style="width: 250px"
              >
                <el-option
                  v-for="item in getAttendanceDetailList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </span>
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
import FnFeesService from "@/services/FnFeesService";
const valAttendanceDetailInNewList = [
  { key: "eatBreakfast1", value: "Thu tiền bữa sáng (1)" },
  { key: "eatRemain1", value: "Thu tiền bữa còn lại (1)" },
  { key: "eatDay2", value: "Thu tiền gói một ngày (2)" },
];
// const valAttendanceDetailOutNewList = [
//   { key: "eatBreakfastOut1", value: "Trả lại tiền bữa sáng (1)" },
//   { key: "eatRemainOut1", value: "Trả lại tiền bữa còn lại (1)" },
//   { key: "eatDayOut2", value: "Trả lại tiền gói một ngày (2)" },
//   { key: "eatBreakfastOut2", value: "Trả lại tiền bữa sáng (2)" },
// ];
// const valAttendanceDetailArriveInNewList = [
//   { key: "arriveGoSchool", value: "Thu tiền đi học" },
// ];
// const valAttendanceDetailArriveOutNewList = [
//   { key: "arriveAbsentYes", value: "Trả lại tiền nghỉ có phép" },
//   { key: "arriveAbsentNo", value: "Trả lại tiền nghỉ không phép" },
// ];
export default {
  components: {
    ElCurrencyInput,
  },
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      idKid: "",
      dataInput: {
        idPackage: "",
        number: 1,
      },
      responseList: [],
      attendanceTypeList: [
        { key: "goSchool", value: "Điểm danh đi học" },
        { key: "absentYes", value: "Nghỉ có phép" },
        { key: "absentNo", value: "Nghỉ không phép" },
        { key: "eat", value: "Điểm danh ăn" },
        { key: "pickupLate", value: "Đón muộn" },
      ],
      attendanceGoSchoolList: [
        { key: "morning", value: "Buổi sáng" },
        { key: "afternoon", value: "Buổi chiều" },
        { key: "evening", value: "Buổi tối" },
        { key: "allDay", value: "Cả ngày" },
      ],
      attendanceEatList: [
        { key: "eatBreakfast", value: "Bữa sáng" },
        { key: "eatBreakfastSecond", value: "Bữa phụ sáng" },
        { key: "eatLunch", value: "Bữa trưa" },
        { key: "eatAfternoon", value: "Bữa chiều" },
        { key: "eatAfternoonSecond", value: "Bữa phụ chiều" },
        { key: "allDay", value: "Cả ngày" },
      ],
      attendanceDetailInNewList: valAttendanceDetailInNewList,
      // attendanceDetailOutNewList: valAttendanceDetailOutNewList,
      // attendanceDetailArriveInNewList: valAttendanceDetailArriveInNewList,
      // attendanceDetailArriveOutNewList: valAttendanceDetailArriveOutNewList,
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
        startDate: [
          {
            required: true,
            message: "Ngày bắt đầu không được để trống",
            trigger: "change",
          },
        ],
        endDate: [
          {
            required: true,
            message: "Ngày kết thúc không được để trống",
            trigger: "change",
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
        idPackage: [
          {
            required: true,
            message: "Chọn khoản",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "Kiểu đóng không được để trống",
            trigger: "change",
          },
        ],
        endDateExpired: [
          {
            required: true,
            message: "Ngày hết hạn không được để trống",
            trigger: "change",
          },
        ],
        febNumberExpired: [
          {
            required: true,
            message: "Số ngày không được để trống",
            trigger: "blur",
          },
        ],
        smallNumberExpired: [
          {
            required: true,
            message: "Số ngày không được để trống",
            trigger: "blur",
          },
        ],
        largeNumberExpired: [
          {
            required: true,
            message: "Số ngày không được để trống",
            trigger: "blur",
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
  },
  computed: {
    getAttendanceDetailList() {
      let detailList = [];
      let dataInputComputed = this.dataInput;
      if (dataInputComputed.attendancePaid == "before") {
        if (dataInputComputed.attendanceType == "eatNew") {
          detailList =
            dataInputComputed.category == "in"
              ? this.attendanceDetailInNewList
              : this.$funcData.getAttendanceDetailOutNewList();
        } else if (dataInputComputed.attendanceType == "arriveNew") {
          detailList =
            dataInputComputed.category == "in"
              ? this.$funcData.getAttendanceDetailArriveInList()
              : this.$funcData.getAttendanceDetailArriveOutList();
        }
      } else if (dataInputComputed.attendancePaid == "after") {
        if (
          dataInputComputed.attendanceType == "absentYes" ||
          dataInputComputed.attendanceType == "absentNo"
        ) {
          detailList = this.attendanceGoSchoolList;
        } else if (dataInputComputed.attendanceType == "goSchool") {
          detailList = this.$funcData.getAttendanceGoSchooList();
        } else if (dataInputComputed.attendanceType == "eat") {
          detailList = this.attendanceEatList;
        }
      }
      return detailList;
    },
  },
  methods: {
    //reset when click x
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.loadingButton = false;
        this.$refs["dataInput"].resetFields();
      }, 300);
    },
    selectPackageMethod() {
      let idPackageSelected = this.dataInput.idPackage;
      this.dataInput = this.responseList.filter((x) => x.id == idPackageSelected)[0];
      this.dataInput.idPackage = idPackageSelected;
    },
    checkBeforeSubmitMonth() {
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
      this.checkBeforeSubmit();
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.checkBeforeSubmitMonth();
          this.loadingButton = true;
          FnFeesService.createPackageForDefaultPackageAdd(this.idKid, this.dataInput)
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
    checkBeforeSubmit() {
      if (this.dataInput.idPackage == "") {
        this.$message({
          message: "Chọn khoản",
          type: "error",
        });
        throw null;
      }
    },
    getDataInitialAddDefaultPackage(idKid) {
      this.idKid = idKid;
      FnFeesService.getPackageForDefaultPackageAdd(idKid)
        .then((resp) => {
          this.responseList = resp.data.data;
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
/deep/.el-input.is-disabled .el-input__inner {
  color: #606266;
  background: #e7e9ec;
  border: 1px solid #dcdfe6;
}
/deep/.el-input-number__decrease,
/deep/.el-input-number__increase {
  z-index: 1;
}
.el-input-number {
  width: 100%;
}
</style>
