<template>
  <el-dialog
    :title="'Xem lịch học'"
    :visible.sync="dialogVisible"
    width="1000px"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    top="3vh"
  >
    <spinner-custom v-if="showSpinner" />
    <el-calendar v-else v-model="nowDate">
      <template slot="dateCell" slot-scope="{ data }">
        <div>
          <div class="calendar-day">{{ data.day.split("-").slice(2).join("-") }}</div>
          <div v-for="item in responseList" :key="item.id">
            <span v-if="item.date == data.day">
              <el-tooltip :content="item.note" placement="top">
                <div class="mark">{{ item.note }}</div>
              </el-tooltip>
            </span>
          </div>
        </div>
      </template>
    </el-calendar>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" size="medium" @click="closeDialog()">
        <i class="el-icon-circle-close" />
        <span>{{ $t("button.close") }}</span>
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import AttendanceService from "@/services/AttendanceService";
export default {
  props: {
    dialogVisible: null,
  },
  data() {
    return {
      showSpinner: true,
      nowDate: this.moment(),
      dataInput: {
        date: "",
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit("dialog-close");
      setTimeout(() => {
        this.showSpinner = true;
        this.responseList = [];
      }, 300);
    },
    getCalendarInitial(idClass) {
      AttendanceService.getCalendarClass(idClass)
        .then((resp) => {
          this.responseList = resp.data.data;
          this.showSpinner = false;
        })
        .catch((err) => {
          this.responseList = [];
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
/deep/.el-calendar-table .el-calendar-day {
  font-size: 20px;
  text-align: center;
  height: 65px;
  background: lightgrey;
}
.mark {
  font-size: 15px;
  color: white;
  background: #e74b4b;
  height: 33px;
  overflow: hidden;
  line-height: 33px;
  word-break: break-word;
}
</style>
