<template>
  <el-dialog
    title="Mẫu nhận xét"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
      <el-tab-pane label="Học tập" name="learnTab">
        <el-transfer
          style="margin-top: 10px"
          filterable
          filter-placeholder="Mẫu nhận xét học tập"
          v-model="dataTarget.learnList"
          :titles="['Chọn mẫu nhận xét học tập', 'Nội dung nhận xét']"
          :button-texts="['<', '>']"
          :data="dataSource"
          @change="handleChange"
        ></el-transfer>
      </el-tab-pane>

      <el-tab-pane label="Ăn uống" name="eatTab">
        <el-transfer
          style="margin-top: 10px"
          filterable
          filter-placeholder="Mẫu nhận xét ăn uống"
          v-model="dataTarget.eatList"
          :titles="['Chọn mẫu nhận xét ăn uống', 'Nội dung nhận xét']"
          :button-texts="['<', '>']"
          :data="dataSource"
          @change="handleChange"
        ></el-transfer>
      </el-tab-pane>

      <el-tab-pane label="Ngủ nghỉ" name="sleepTab">
        <el-transfer
          style="margin-top: 10px"
          filterable
          filter-placeholder="Mẫu nhận xét ngủ nghỉ"
          v-model="dataTarget.sleepList"
          :titles="['Chọn mẫu nhận xét ngủ nghỉ', 'Nội dung nhận xét']"
          :button-texts="['<', '>']"
          :data="dataSource"
          @change="handleChange"
        ></el-transfer>
      </el-tab-pane>

      <el-tab-pane label="Vệ sinh" name="sanitaryTab">
        <el-transfer
          style="margin-top: 10px"
          filterable
          filter-placeholder="Mẫu nhận xét vệ sinh"
          v-model="dataTarget.sanitaryList"
          :titles="['Chọn mẫu nhận xét vệ sinh', 'Nội dung nhận xét']"
          :button-texts="['<', '>']"
          :data="dataSource"
          @change="handleChange"
        ></el-transfer>
      </el-tab-pane>

      <el-tab-pane label="Sức khỏe" name="healtTab">
        <el-transfer
          style="margin-top: 10px"
          filterable
          filter-placeholder="Mẫu nhận xét sức khỏe"
          v-model="dataTarget.healtList"
          :titles="['Chọn mẫu nhận xét sức khỏe', 'Nội dung nhận xét']"
          :button-texts="['<', '>']"
          :data="dataSource"
          @change="handleChange"
        ></el-transfer>
      </el-tab-pane>

      <el-tab-pane label="Nhận xét chung" name="commonTab">
        <el-transfer
          style="margin-top: 10px"
          filterable
          filter-placeholder="Mẫu nhận xét chung"
          v-model="dataTarget.commonList"
          :titles="['Chọn mẫu nhận xét chung', 'Nội dung nhận xét']"
          :button-texts="['<', '>']"
          :data="dataSource"
          @change="handleChange"
        ></el-transfer>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialogByButton(false)">
        <i class="el-icon-circle-close" />
        <span>Đóng</span>
      </el-button>
      <el-button
        type="success"
        size="medium"
        :loading="loadingButton"
        mini
        @click="submitForm()"
      >
        <i class="el-icon-circle-check" />
        <span>Áp dụng</span>
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import EvaluateService from "@/services/EvaluateService";
export default {
  props: {
    dialogVisible: null,
  },

  data() {
    return {
      activeTabName: "learnTab",
      dataSource: [],
      dataTarget: {
        learnList: [],
        eatList: [],
        sleepList: [],
        sanitaryList: [],
        healtList: [],
        commonList: [],
        attachFileList: [],
      },
      evaluateSampleDateList: [],
      evaluateSampleDateConstantList: [],
      loadingButton: false,
      checkUpdateTransfer: "",
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close", false);
      this.resetFormData();
    },
    closeDialogByButton(data) {
      this.$emit("dialog-close", data);
      this.resetFormData();
    },
    resetFormData() {
      this.dataTarget.learnList = [];
      this.dataTarget.eatList = [];
      this.dataTarget.sleepList = [];
      this.dataTarget.sanitaryList = [];
      this.dataTarget.healtList = [];
      this.dataTarget.commonList = [];
      this.dataTarget.attachFileList = [];
    },
    handleChange(value, direction, movedKeys) {
      let a = value;
      console.log(a);
      console.log(value, direction, movedKeys);
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "learnTab") {
        this.showCurrtentTab("Học tập");
      } else if (tabNameClick == "eatTab") {
        this.showCurrtentTab("Ăn uống");
      } else if (tabNameClick == "sleepTab") {
        this.showCurrtentTab("Ngủ nghỉ");
      } else if (tabNameClick == "sanitaryTab") {
        this.showCurrtentTab("Vệ sinh");
      } else if (tabNameClick == "healtTab") {
        this.showCurrtentTab("Sức khỏe");
      } else if (tabNameClick == "commonTab") {
        this.showCurrtentTab("Nhận xét chung");
      }
    },
    submitForm() {
      this.closeDialogByButton(this.dataTarget);
    },

    setDataSource() {
      const dataResponse = [];
      const states = this.evaluateSampleDateList;
      states.forEach((x) => {
        dataResponse.push({
          label: x.evaluateContent,
          key: x.evaluateContent,
        });
      });
      this.dataSource = dataResponse;
    },

    getEvaluateSampleDateInitial(type) {
      EvaluateService.getSampleDate()
        .then((resp) => {
          this.evaluateSampleDateList = resp.data.data;
          this.evaluateSampleDateConstantList = this.evaluateSampleDateList;
          this.showCurrtentTab(type);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showCurrtentTab(type) {
      if (type == "Học tập") {
        this.activeTabName = "learnTab";
        this.evaluateSampleDateList = this.evaluateSampleDateConstantList.filter(
          (x) => x.evaluateType == "learn"
        );
      } else if (type == "Ăn uống") {
        this.activeTabName = "eatTab";
        this.evaluateSampleDateList = this.evaluateSampleDateConstantList.filter(
          (x) => x.evaluateType == "eat"
        );
      } else if (type == "Ngủ nghỉ") {
        this.activeTabName = "sleepTab";
        this.evaluateSampleDateList = this.evaluateSampleDateConstantList.filter(
          (x) => x.evaluateType == "sleep"
        );
      } else if (type == "Vệ sinh") {
        this.activeTabName = "sanitaryTab";
        this.evaluateSampleDateList = this.evaluateSampleDateConstantList.filter(
          (x) => x.evaluateType == "sanitary"
        );
      } else if (type == "Sức khỏe") {
        this.activeTabName = "healtTab";
        this.evaluateSampleDateList = this.evaluateSampleDateConstantList.filter(
          (x) => x.evaluateType == "healt"
        );
      } else if (type == "Nhận xét chung") {
        this.activeTabName = "commonTab";
        this.evaluateSampleDateList = this.evaluateSampleDateConstantList.filter(
          (x) => x.evaluateType == "common"
        );
      } else if (type == "File đính kèm") {
        this.activeTabName = "attachFileTab";
        this.evaluateSampleDateList = this.evaluateSampleDateConstantList.filter(
          (x) => x.evaluateType == "attachFile"
        );
      }
      this.setDataSource();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-transfer-panel {
  width: 40%;
}
/deep/.el-dialog__title {
  font-size: 25px;
  color: #606266;
}
/deep/.el-dialog__body {
  padding-top: 10px;
}
/deep/.el-transfer-panel__body {
  height: 300px;
}
/deep/.el-transfer-panel__list.is-filterable {
  height: 245px;
  padding-top: 0;
}
/deep/.el-transfer-panel .el-transfer-panel__header {
  background: #78a5e7;
}
/deep/.el-icon-arrow-left:before {
  content: "";
}
/deep/.el-transfer-panel
  .el-transfer-panel__header
  .el-checkbox
  .el-checkbox__label
  span {
  color: white;
}
/deep/.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
  color: white;
}
.button-left-class {
  margin-right: 15px;
  width: 160px;
}
</style>
