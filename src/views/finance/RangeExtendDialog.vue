<template>
  <div>
    <el-dialog
      :title="
        buttonType == 'insert'
          ? 'Thêm khoảng tính toán'
          : 'Sửa khoảng tính toán'
      "
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :showClose="false"
      top="2vh"
    >
      <el-form
        label-width="130px"
        :model="dataInput"
        label-position="left"
        :rules="rules"
        ref="dataInput"
      >
        <el-form-item
          label="Chọn kiểu"
          prop="category1"
          style="display: inline-block; width: 45%"
        >
          <el-radio-group
            v-model="dataInput.category1"
            @change="changeCategory1()"
          >
            <el-radio label="reduce">Giảm tiền</el-radio>
            <el-radio label="increase">Thêm tiền</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :style="dataInput.category1 == 'reduce' ? '' : 'visibility:hidden'"
          label="Loại tính toán"
          prop="category2"
          style="display: inline-block; width: 45%; float: right"
        >
          <el-radio-group v-model="dataInput.category2">
            <el-radio label="dynamic">Điểm danh</el-radio>
            <el-radio label="fixed">Cố định</el-radio>
          </el-radio-group>
        </el-form-item>
        <span v-if="dataInput.category2 == 'fixed'">
          <el-form-item
            label="Chọn loại"
            prop="typeFixed"
            style="display: inline-block; width: 45%"
          >
            <el-radio-group v-model="dataInput.typeFixed">
              <el-radio label="percent">Phần trăm</el-radio>
              <el-radio label="money">Tiền</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="
              dataInput.typeFixed == 'money' ? 'Nhập Tiền' : 'Nhập phần trăm'
            "
            style="display: inline-block; width: 45%; float: right"
            prop="fixedData"
          >
            <el-input-number
              v-if="dataInput.typeFixed == 'percent'"
              v-model="dataInput.fixedData"
              :precision="0"
              :min="0"
              :max="100"
            >
            </el-input-number>
            <el-currency-input
              v-else-if="dataInput.typeFixed == 'money'"
              v-model="dataInput.fixedData"
              style="width: 180px"
            />
          </el-form-item>
        </span>
        <span
          v-if="
            dataInput.category1 == 'reduce' && dataInput.category2 == 'dynamic'
          "
        >
          <el-form-item label="Loại nghỉ" prop="category3">
            <el-radio-group
              v-model="dataInput.category3"
              @change="changeCategogy3()"
            >
              <el-tooltip
                content="Nghỉ không phân biệt có phép, ko phép, chưa điểm danh"
                placement="top"
              >
                <el-radio label="absentAll">Nghỉ chung </el-radio></el-tooltip
              >
              <el-tooltip
                content="Nghỉ có phân biệt có phép, ko phép, chưa điểm danh"
                placement="top"
              >
                <el-radio label="absentDetail">Nghỉ chi tiết</el-radio>
              </el-tooltip>
            </el-radio-group>
          </el-form-item>

          <!-- this is part 2 -->
          <span>
            <hr />
            <el-form-item
              label="Chọn loại khoảng"
              prop="typeDynamic"
              style="display: inline-block; width: 45%"
            >
              <el-radio-group
                v-model="dataInput.typeDynamic"
                @change="clearDataRangeMethod()"
              >
                <el-radio label="percent">Phần trăm</el-radio>
                <el-radio label="number">Số lượng</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="Chọn loại giảm"
              prop="typeDiscount"
              style="display: inline-block; width: 45%; float: right"
            >
              <el-radio-group
                v-model="dataInput.typeDiscount"
                @change="clearDataRangeMethod()"
              >
                <el-radio label="percent">Phần trăm</el-radio>
                <el-radio label="money">Tiền</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- insert data -->
            <span v-if="dataInput.category3 == 'absentAll'">
              <el-form-item
                v-for="(data, index) in dataInput.dataList"
                :label="'Giá trị ' + (index + 1)"
                :key="data.key"
                :prop="'dataList.' + index + '.range'"
                :rules="{
                  required: true,
                  message: 'Thông tin ko được để trống',
                  trigger: 'blur',
                }"
              >
                <span
                  v-if="dataInput.typeDynamic == 'percent'"
                  class="text-class"
                  >Khoảng phần trăm</span
                >
                <span v-else class="text-class">Khoảng số lượng</span>
                <el-input-number
                  v-if="dataInput.typeDynamic == 'percent'"
                  size="medium"
                  class="input-class"
                  :precision="0"
                  :min="0"
                  :max="100"
                  v-model="data.range"
                ></el-input-number>
                <el-input-number
                  v-else
                  :min="0"
                  size="medium"
                  class="input-class"
                  v-model="data.range"
                ></el-input-number>
                <span
                  v-if="dataInput.typeDiscount == 'percent'"
                  class="text-class"
                  >Phần trăm giảm</span
                >
                <span v-else class="text-class">Số tiền giảm</span>
                <el-input-number
                  v-if="dataInput.typeDiscount == 'percent'"
                  size="medium"
                  class="input-class"
                  :precision="0"
                  :min="0"
                  :max="100"
                  v-model="data.value"
                ></el-input-number>
                <el-currency-input
                  v-else
                  class="input-class"
                  v-model="data.value"
                />
                <el-button
                  size="medium"
                  type="danger"
                  @click.prevent="removeDomain(data)"
                  >Xóa</el-button
                >
              </el-form-item>
            </span>
            <span v-if="dataInput.category3 == 'absentDetail'">
              <el-radio-group
                v-model="dataInput.absentType"
                style="margin-bottom: 10px; margin-left: 300px"
              >
                <el-radio-button label="absentYes"
                  >Nghỉ có phép</el-radio-button
                >
                <el-radio-button label="absentNo"
                  >Nghỉ không phép</el-radio-button
                >
                <el-radio-button label="noAttendance"
                  >Chưa điểm danh</el-radio-button
                >
              </el-radio-group>
              <span v-if="dataInput.absentType == 'absentYes'">
                <el-form-item
                  v-for="(data, index) in dataInput.absentYesList"
                  :label="'Nghỉ có phép ' + (index + 1)"
                  :key="data.key"
                  :prop="'absentYesList.' + index + '.range'"
                  :rules="{
                    required: true,
                    message: 'Thông tin ko được để trống',
                    trigger: 'blur',
                  }"
                >
                  <span
                    v-if="dataInput.typeDynamic == 'percent'"
                    class="text-class"
                    >Khoảng phần trăm</span
                  >
                  <span v-else class="text-class">Khoảng số lượng</span>
                  <el-input-number
                    v-if="dataInput.typeDynamic == 'percent'"
                    size="medium"
                    class="input-class"
                    :precision="0"
                    :min="0"
                    :max="100"
                    v-model="data.range"
                  ></el-input-number>
                  <el-input-number
                    v-else
                    :min="0"
                    size="medium"
                    class="input-class"
                    v-model="data.range"
                  ></el-input-number>
                  <span
                    v-if="dataInput.typeDiscount == 'percent'"
                    class="text-class"
                    >Phần trăm giảm</span
                  >
                  <span v-else class="text-class">Số tiền giảm</span>
                  <el-input-number
                    v-if="dataInput.typeDiscount == 'percent'"
                    size="medium"
                    class="input-class"
                    :precision="0"
                    :min="0"
                    :max="100"
                    v-model="data.value"
                  ></el-input-number>
                  <el-currency-input
                    v-else
                    class="input-class"
                    v-model="data.value"
                  />
                  <el-button
                    size="medium"
                    type="danger"
                    @click.prevent="removeDomain(data)"
                    >Xóa</el-button
                  >
                </el-form-item>
              </span>
              <span v-if="dataInput.absentType == 'absentNo'">
                <el-form-item
                  v-for="(data, index) in dataInput.absentNoList"
                  :label="'Nghỉ có phép ' + (index + 1)"
                  :key="data.key"
                  :prop="'absentNoList.' + index + '.range'"
                  :rules="{
                    required: true,
                    message: 'Thông tin ko được để trống',
                    trigger: 'blur',
                  }"
                >
                  <span
                    v-if="dataInput.typeDynamic == 'percent'"
                    class="text-class"
                    >Khoảng phần trăm</span
                  >
                  <span v-else class="text-class">Khoảng số lượng</span>
                  <el-input-number
                    v-if="dataInput.typeDynamic == 'percent'"
                    size="medium"
                    class="input-class"
                    :precision="0"
                    :min="0"
                    :max="100"
                    v-model="data.range"
                  ></el-input-number>
                  <el-input-number
                    v-else
                    :min="0"
                    size="medium"
                    class="input-class"
                    v-model="data.range"
                  ></el-input-number>
                  <span
                    v-if="dataInput.typeDiscount == 'percent'"
                    class="text-class"
                    >Phần trăm giảm</span
                  >
                  <span v-else class="text-class">Số tiền giảm</span>
                  <el-input-number
                    v-if="dataInput.typeDiscount == 'percent'"
                    size="medium"
                    class="input-class"
                    :precision="0"
                    :min="0"
                    :max="100"
                    v-model="data.value"
                  ></el-input-number>
                  <el-currency-input
                    v-else
                    class="input-class"
                    v-model="data.value"
                  />
                  <el-button
                    size="medium"
                    type="danger"
                    @click.prevent="removeDomain(data)"
                    >Xóa</el-button
                  >
                </el-form-item>
              </span>
              <span v-if="dataInput.absentType == 'noAttendance'">
                <el-form-item
                  v-for="(data, index) in dataInput.noAttendanceList"
                  :label="'Nghỉ có phép ' + (index + 1)"
                  :key="data.key"
                  :prop="'noAttendanceList.' + index + '.range'"
                  :rules="{
                    required: true,
                    message: 'Thông tin ko được để trống',
                    trigger: 'blur',
                  }"
                >
                  <span
                    v-if="dataInput.typeDynamic == 'percent'"
                    class="text-class"
                    >Khoảng phần trăm</span
                  >
                  <span v-else class="text-class">Khoảng số lượng</span>
                  <el-input-number
                    v-if="dataInput.typeDynamic == 'percent'"
                    size="medium"
                    class="input-class"
                    :precision="0"
                    :min="0"
                    :max="100"
                    v-model="data.range"
                  ></el-input-number>
                  <el-input-number
                    v-else
                    :min="0"
                    size="medium"
                    class="input-class"
                    v-model="data.range"
                  ></el-input-number>
                  <span
                    v-if="dataInput.typeDiscount == 'percent'"
                    class="text-class"
                    >Phần trăm giảm</span
                  >
                  <span v-else class="text-class">Số tiền giảm</span>
                  <el-input-number
                    v-if="dataInput.typeDiscount == 'percent'"
                    size="medium"
                    class="input-class"
                    :precision="0"
                    :min="0"
                    :max="100"
                    v-model="data.value"
                  ></el-input-number>
                  <el-currency-input
                    v-else
                    class="input-class"
                    v-model="data.value"
                  />
                  <el-button
                    size="medium"
                    type="danger"
                    @click.prevent="removeDomain(data)"
                    >Xóa</el-button
                  >
                </el-form-item>
              </span>
            </span>
            <el-form-item>
              <el-button size="small" type="primary" @click="addDomain()"
                >Thêm khoảng</el-button
              >
            </el-form-item>
          </span>
        </span>
      </el-form>

      <!-- this is part 3 -->
      <span
        v-if="
          dataInput.category1 == 'reduce' && dataInput.category2 == 'dynamic'
        "
      >
        <hr />
        <div
          v-if="dataInput.category3 == 'absentAll'"
          style="width: 50%; margin: 0 auto"
        >
          <div style="text-align: center">Thông tin giảm</div>
          <el-table :data="dataInput.dataList">
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column label="Khoảng" align="center">
              <template slot-scope="scope">
                <span
                  v-if="
                    dataInput.dataList.indexOf(scope.row) + 1 <
                    dataInput.dataList.length
                  "
                  >{{ scope.row.range
                  }}<span v-if="dataInput.typeDynamic == 'percent'">%</span>
                  &lt;&#61;
                  {{
                    dataInput.dataList[
                      dataInput.dataList.indexOf(scope.row) + 1
                    ].range
                  }}
                  <span v-if="dataInput.typeDynamic == 'percent'">%</span>
                </span>
                <span v-else
                  >{{ scope.row.range
                  }}<span v-if="dataInput.typeDynamic == 'percent'">%</span>
                  &lt;</span
                >
              </template>
            </el-table-column>
            <el-table-column label="Giá trị giảm" align="center">
              <template slot-scope="scope">
                <span v-if="dataInput.typeDiscount == 'percent'"
                  >{{ scope.row.value }}%</span
                >
                <span v-if="dataInput.typeDiscount == 'money'">{{
                  scope.row.value | formatCurrencyNew
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span v-if="dataInput.category3 == 'absentDetail'">
          <span class="table-3">
            <div style="text-align: center">Nghỉ có phép</div>
            <el-table :data="dataInput.absentYesList">
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column label="Khoảng" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="
                      dataInput.absentYesList.indexOf(scope.row) + 1 <
                      dataInput.absentYesList.length
                    "
                    >{{ scope.row.range
                    }}<span v-if="dataInput.typeDynamic == 'percent'">%</span>
                    &lt;&#61;
                    {{
                      dataInput.absentYesList[
                        dataInput.absentYesList.indexOf(scope.row) + 1
                      ].range
                    }}
                    <span v-if="dataInput.typeDynamic == 'percent'">%</span>
                  </span>
                  <span v-else
                    >{{ scope.row.range
                    }}<span v-if="dataInput.typeDynamic == 'percent'">%</span>
                    &lt;</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="Giá trị giảm" align="center">
                <template slot-scope="scope">
                  <span v-if="dataInput.typeDiscount == 'percent'"
                    >{{ scope.row.value }}%</span
                  >
                  <span v-if="dataInput.typeDiscount == 'money'">{{
                    scope.row.value | formatCurrencyNew
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </span>
          <span class="table-3">
            <div style="text-align: center">Nghỉ không phép</div>
            <el-table :data="dataInput.absentNoList">
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column label="Khoảng" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="
                      dataInput.absentNoList.indexOf(scope.row) + 1 <
                      dataInput.absentNoList.length
                    "
                    >{{ scope.row.range
                    }}<span v-if="dataInput.typeDynamic == 'percent'">%</span>
                    &lt;&#61;
                    {{
                      dataInput.absentNoList[
                        dataInput.absentNoList.indexOf(scope.row) + 1
                      ].range
                    }}
                    <span v-if="dataInput.typeDynamic == 'percent'">%</span>
                  </span>
                  <span v-else
                    >{{ scope.row.range
                    }}<span v-if="dataInput.typeDynamic == 'percent'">%</span>
                    &lt;</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="Giá trị giảm" align="center">
                <template slot-scope="scope">
                  <span v-if="dataInput.typeDiscount == 'percent'"
                    >{{ scope.row.value }}%</span
                  >
                  <span v-if="dataInput.typeDiscount == 'money'">{{
                    scope.row.value | formatCurrencyNew
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </span>
          <span class="table-3">
            <div style="text-align: center">Chưa điểm danh</div>
            <el-table :data="dataInput.noAttendanceList">
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column label="Khoảng" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="
                      dataInput.noAttendanceList.indexOf(scope.row) + 1 <
                      dataInput.noAttendanceList.length
                    "
                    >{{ scope.row.range
                    }}<span v-if="dataInput.typeDynamic == 'percent'">%</span>
                    &lt;&#61;
                    {{
                      dataInput.noAttendanceList[
                        dataInput.noAttendanceList.indexOf(scope.row) + 1
                      ].range
                    }}
                    <span v-if="dataInput.typeDynamic == 'percent'">%</span>
                  </span>
                  <span v-else
                    >{{ scope.row.range
                    }}<span v-if="dataInput.typeDynamic == 'percent'">%</span>
                    &lt;</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="Giá trị giảm" align="center">
                <template slot-scope="scope">
                  <span v-if="dataInput.typeDiscount == 'percent'"
                    >{{ scope.row.value }}%</span
                  >
                  <span v-if="dataInput.typeDiscount == 'money'">{{
                    scope.row.value | formatCurrencyNew
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </span>
        </span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="buttonType == 'insert'"
          type="danger"
          size="medium"
          @click="closeDialog()"
        >
          <i class="el-icon-circle-close" />
          <span>{{ $t("button.close") }}</span>
        </el-button>
        <el-button
          type="success"
          size="medium"
          :loading="loadingButton"
          @click="submitForm()"
        >
          <i class="el-icon-circle-check" />
          <span>OK</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      dataInput: {},
      buttonType: "",
      loadingButton: false,
      showRangeExtendDialog: false,
      rules: {
        name: [
          {
            required: true,
            message: "Tên khối không được để trống",
            trigger: "blur",
          },
        ],
        typeFixed: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
        category1: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
        category2: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "change",
          },
        ],
        fixedData: [
          {
            required: true,
            message: "Thông tin không được để trống",
            trigger: "blur",
          },
        ],
        category3: [
          {
            required: true,
            message: "Loại nghỉ không được để trống",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    closeDialog(click, data) {
      this.$emit("dialog-close", this.buttonType, click, data);
    },
    changeCategory1() {
      if (this.dataInput.category1 == "increase") {
        this.dataInput.category2 = "fixed";
      }
    },
    removeDomain(item) {
      //ví trí click của mảng
      let list = this.getListMethod();
      var index = list.indexOf(item);
      //xóa 1 phần tử từ vị trí index
      if (index !== -1) {
        list.splice(index, 1);
      }
    },
    addDomain() {
      let list = this.getListMethod();
      list.push({
        key: Date.now(),
        range: 0,
        value: 0,
      });
    },
    getListMethod() {
      let localList = this.dataInput;
      if (localList.category3 == "absentAll") {
        return localList.dataList;
      } else if (localList.category3 == "absentDetail") {
        if (localList.absentType == "absentYes") {
          return localList.absentYesList;
        } else if (localList.absentType == "absentNo") {
          return localList.absentNoList;
        } else {
          return localList.noAttendanceList;
        }
      }
    },
    clearDataRangeMethod() {
      this.dataInput.dataList.forEach((x) => {
        x.range = 0;
        x.value = 0;
      });
      this.dataInput.absentYesList.forEach((x) => {
        x.range = 0;
        x.value = 0;
      });
      this.dataInput.absentNoList.forEach((x) => {
        x.range = 0;
        x.value = 0;
      });
      this.dataInput.noAttendanceList.forEach((x) => {
        x.range = 0;
        x.value = 0;
      });
    },
    checkBeforeSubmit(list, text) {
      if (list.length > 0) {
        list.forEach((x) => {
          if (typeof x.value != "number") {
            this.$message({
              message: text + "Thông tin giảm không được để trống",
              type: "error",
            });
            throw null;
          }
        });
        if (list.length == 1) {
          if (list[0].range == 0 || list[0].value == 0) {
            this.$message({
              message: text + "Vui lòng nhập giá trị",
              type: "error",
            });
            throw null;
          }
        } else {
          for (let i = 1; i < list.length; i++) {
            if (list[i - 1].range >= list[i].range) {
              this.$message({
                message: text + "Nhập khoảng theo thứ tự tăng dần",
                type: "error",
              });
              throw null;
            }
          }
        }
        if (list.filter((x) => x.value > 0).length == 0) {
          this.$message({
            message: text + "Nhập ít nhất một giá trị giảm khác 0",
            type: "error",
          });
          throw null;
        }
      }
    },
    checkDataSubmitMethod() {
      let dataLocal = this.dataInput;
      if (dataLocal.category1 == "reduce" && dataLocal.category2 == "dynamic") {
        if (dataLocal.category3 == "absentAll") {
          if (dataLocal.dataList.length == 0) {
            this.$message({
              message: "Không có khoảng nào được thêm",
              type: "error",
            });
            throw null;
          } else {
            this.checkBeforeSubmit(dataLocal.dataList, "");
          }
          dataLocal.absentYesList = [];
          dataLocal.absentNoList = [];
          dataLocal.noAttendanceList = [];
        } else if (dataLocal.category3 == "absentDetail") {
          let checkLength =
            dataLocal.absentYesList.length == 0 &&
            dataLocal.absentNoList.length == 0 &&
            dataLocal.noAttendanceList.length == 0;
          if (checkLength) {
            this.$message({
              message: "Không có khoảng nào được thêm",
              type: "error",
            });
            throw null;
          } else {
            this.checkBeforeSubmit(dataLocal.absentYesList, "Nghỉ có phép: ");
            this.checkBeforeSubmit(dataLocal.absentNoList, "Nghỉ không phép: ");
            this.checkBeforeSubmit(
              dataLocal.noAttendanceList,
              "Chưa điểm danh: "
            );
          }
          dataLocal.dataList = [];
        }
      } else {
        dataLocal.dataList = [];
        dataLocal.absentYesList = [];
        dataLocal.absentNoList = [];
        dataLocal.noAttendanceList = [];
      }
    },
    submitForm() {
      this.$refs["dataInput"].validate((valid) => {
        if (valid) {
          this.checkDataSubmitMethod();
          this.closeDialog("ok", this.dataInput);
        }
      });
    },
    getDataRangeInitial(type, data) {
      this.buttonType = type;
      if (type == "updateMoney") {
        this.dataInput = data;
      } else if (type == "insert") {
        this.dataInput = {
          category1: "reduce",
          category2: "dynamic",
          category3: "absentAll",
          typeFixed: "percent",
          typeDynamic: "percent",
          typeDiscount: "percent",
          absentType: "absentYes",
          dataList: [
            {
              key: 1,
              range: 0,
              value: 0,
            },
            {
              key: 2,
              range: 0,
              value: 0,
            },
            {
              key: 3,
              range: 0,
              value: 0,
            },
          ],
          absentYesList: [
            {
              key: 1,
              range: 0,
              value: 0,
            },
            {
              key: 2,
              range: 0,
              value: 0,
            },
            {
              key: 3,
              range: 0,
              value: 0,
            },
          ],
          absentNoList: [
            {
              key: 1,
              range: 0,
              value: 0,
            },
            {
              key: 2,
              range: 0,
              value: 0,
            },
            {
              key: 3,
              range: 0,
              value: 0,
            },
          ],
          noAttendanceList: [
            {
              key: 1,
              range: 0,
              value: 0,
            },
            {
              key: 2,
              range: 0,
              value: 0,
            },
            {
              key: 3,
              range: 0,
              value: 0,
            },
          ],
        };
      }
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
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  content: "";
  color: #f56c6c;
  margin-left: -4px;
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:after {
  content: "*";
  color: #f56c6c;
  margin-left: 3px;
}
/deep/.el-dialog__body {
  padding-bottom: 5px;
}
.input-class {
  width: 200px;
  margin-right: 15px;
}
.text-class {
  margin-right: 10px;
}
.table-3 {
  width: 30%;
  display: inline-block;
  margin-right: 3%;
}
</style>
