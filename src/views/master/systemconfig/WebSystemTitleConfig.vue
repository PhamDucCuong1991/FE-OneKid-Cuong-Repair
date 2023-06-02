<template>
  <div>
    <div>
      <el-tabs type="card" @tab-click="handleClickTab" v-model="activeTabName">
        <!-- web nhà trường -->
        <el-tab-pane label="Web nhà trường" name="webTab">
          <el-table
            ref="multipleTable"
            highlight-current-row
            :data="webDataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              label="Id"
              prop="id"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column label="Tiêu đề" width="300">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.title"
                  placeholder="Nhập tiêu đề"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Nội dung" min-width="400">
              <template slot-scope="scope">
                <el-input v-model="scope.row.content" type="textarea" disabled></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="Nguồn"
              prop="source"
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column label="SMS" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.sms"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Firebase" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.sms"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="OTT" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.ott"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Chức năng" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.note1"
                  placeholder="Nhập chức năng"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Đối tượng nhận" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.note2"
                  placeholder="Nhập đối tượng nhận"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateWebSystemTileMethod(webDataList)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- app plus -->
        <el-tab-pane label="App Plus" name="plusTab">
          <el-table
            ref="multipleTable"
            highlight-current-row
            :data="appPlusDataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              label="Id"
              prop="id"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column label="Tiêu đề" width="300">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.title"
                  placeholder="Nhập tiêu đề"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Nội dung" min-width="400">
              <template slot-scope="scope">
                <el-input
                  :disabled="scope.row.id == 3 || scope.row.id == 4"
                  v-model="scope.row.content"
                  type="textarea"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="Nguồn"
              prop="source"
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column label="SMS" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.sms"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Firebase" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.sms"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="OTT" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.ott"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Chức năng" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.note1"
                  placeholder="Nhập chức năng"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Đối tượng nhận" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.note2"
                  placeholder="Nhập đối tượng nhận"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateWebSystemTileMethod(appPlusDataList)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- app teacher -->
        <el-tab-pane label="App Teacher" name="teacherTab">
          <el-table
            ref="multipleTable"
            highlight-current-row
            :data="appTeacherDataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              label="Id"
              prop="id"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column label="Tiêu đề" width="300">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.title"
                  placeholder="Nhập tiêu đề"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Nội dung" min-width="400">
              <template slot-scope="scope">
                <el-input
                  :disabled="scope.row.id == 9 || scope.row.id == 10"
                  v-model="scope.row.content"
                  type="textarea"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="Nguồn"
              prop="source"
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column label="SMS" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.sms"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Firebase" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.sms"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="OTT" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.ott"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Chức năng" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.note1"
                  placeholder="Nhập chức năng"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Đối tượng nhận" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.note2"
                  placeholder="Nhập đối tượng nhận"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateWebSystemTileMethod(appTeacherDataList)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>

        <!-- app system -->
        <el-tab-pane label="OneKids System" name="systemTab">
          <el-table
            ref="multipleTable"
            highlight-current-row
            :data="appSystemDataList"
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            :max-height="$tableMaxHeight"
            border
          >
            <el-table-column
              type="index"
              label="STT"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column
              label="Id"
              prop="id"
              width="50"
              align="center"
            ></el-table-column>
            <el-table-column label="Tiêu đề" width="300">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.title"
                  placeholder="Nhập tiêu đề"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Nội dung" min-width="400">
              <template slot-scope="scope">
                <el-input
                  :disabled="
                    scope.row.id == 15 ||
                    scope.row.id == 16 ||
                    scope.row.id == 17 ||
                    scope.row.id == 22 ||
                    scope.row.id == 25 ||
                    scope.row.id == 26 ||
                    scope.row.id == 27 ||
                    scope.row.id == 30 ||
                    scope.row.id == 31 ||
                    scope.row.id == 32 ||
                    scope.row.id == 35 ||
                    scope.row.id == 36 ||
                    scope.row.id == 37 ||
                    scope.row.id == 39 ||
                    scope.row.id == 40 ||
                    scope.row.id == 41 ||
                    scope.row.id == 43 ||
                    scope.row.id == 44 ||
                    scope.row.id == 45 ||
                    scope.row.id == 47 ||
                    scope.row.id == 48 ||
                    scope.row.id == 49 ||
                    scope.row.id == 51 ||
                    scope.row.id == 52 ||
                    scope.row.id == 53 ||
                    scope.row.id == 54 ||
                    scope.row.id == 56 ||
                    scope.row.id == 57 ||
                    scope.row.id == 59
                  "
                  type="textarea"
                  v-model="scope.row.content"
                  :rows="scope.row.content != null ? 3 : 1"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="Nguồn"
              prop="source"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column label="SMS" width="70" align="center">
              <template slot-scope="scope">
                <span
                  v-if="
                    scope.row.id == 18 ||
                    scope.row.id == 19 ||
                    scope.row.id == 20 ||
                    scope.row.id == 21 ||
                    scope.row.id == 70 ||
                    scope.row.id == 71 ||
                    scope.row.id == 72
                  "
                >
                  <el-checkbox v-model="scope.row.sms"></el-checkbox>
                </span>
                <span v-else>
                  <i
                    v-if="scope.row.sms"
                    class="el-icon-circle-check"
                    style="margin-left: 10px; color: #409eff"
                  />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Firebase" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.firebase"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="OTT" width="70" align="center">
              <template slot-scope="scope">
                <i
                  v-if="scope.row.ott"
                  class="el-icon-circle-check"
                  style="margin-left: 10px; color: #409eff"
                />
              </template>
            </el-table-column>
            <el-table-column label="Chức năng" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.note1"
                  placeholder="Nhập chức năng"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Đối tượng nhận" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.note2"
                  placeholder="Nhập đối tượng nhận"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div style="float: right; margin: 15px 0">
            <el-button
              class="button-bottom"
              type="success"
              :loading="loaddingButton"
              @click="updateWebSystemTileMethod(appSystemDataList)"
            >
              <i class="el-icon-circle-check" />
              <span>Lưu</span>
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import SystemConfigService from "@/services/SystemConfigService";

export default {
  data() {
    return {
      activeTabName: "webTab",
      webSystemTitleList: [],
      webDataList: [],
      appPlusDataList: [],
      appTeacherDataList: [],
      appSystemDataList: [],
      loaddingButton: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold;";
    },
    handleClickTab(tab) {
      let tabNameClick = tab.name;
      if (tabNameClick == "webTab") {
        console.log(tabNameClick);
      } else if (tabNameClick == "plusTab") {
        console.log(tabNameClick);
      } else if (tabNameClick == "teacherTab") {
        console.log(tabNameClick);
      } else if (tabNameClick == "systemTab") {
        console.log(tabNameClick);
      }
    },

    /**
     * cập nhật thông tin
     */
    updateWebSystemTileMethod(data) {
      this.loaddingButton = true;
      SystemConfigService.updateWebSystemTitle(data)
        .then((resp) => {
          let checkUpdate = resp.data.data;
          console.log(checkUpdate);
          this.$message({
            message: "Cập nhật thành công",
            type: "success",
          });
          this.findAllWebSystemTitleMethod();
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "Cập nhật thất bại",
            type: "error",
          });
        })
        .finally(() => {
          setTimeout(() => {
            this.loaddingButton = false;
          }, 500);
        });
    },

    getWebMethod() {
      this.webDataList = this.webSystemTitleList.filter((x) => x.type == "web");
    },
    getAppPlusMethod() {
      this.appPlusDataList = this.webSystemTitleList.filter((x) => x.type == "plus");
    },
    getAppTeacherMethod() {
      this.appTeacherDataList = this.webSystemTitleList.filter(
        (x) => x.type == "teacher"
      );
    },
    getAppSystemMethod() {
      this.appSystemDataList = this.webSystemTitleList.filter((x) => x.type == "system");
    },

    /**
     * tìm kiếm tất cả tiều đề, nội dung
     */
    findAllWebSystemTitleMethod() {
      SystemConfigService.findAllWebSystemTitle()
        .then((resp) => {
          this.webSystemTitleList = resp.data.data;
          this.getWebMethod();
          this.getAppPlusMethod();
          this.getAppTeacherMethod();
          this.getAppSystemMethod();
        })
        .catch((err) => {
          console.log(err);
          this.webSystemTitleList = null;
        });
    },
  },

  beforeMount() {
    this.findAllWebSystemTitleMethod();
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs__nav {
  background: #a0a19ce0;
}
/deep/.el-tabs__item {
  color: white;
}
/deep/.el-tabs__item.is-active {
  color: white;
  background: #78a5e7;
}
/deep/.el-form-item__label {
  font-family: Arial, Helvetica, sans-serif;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/.el-tabs__header {
  margin-bottom: 0;
}
/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #78a5e7;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 10px 0;
}
// /deep/.el-table .cell {
//   line-height: 15px;
// }
/deep/.el-table th > .cell {
  font-size: 13px;
}
/deep/.el-checkbox__inner {
  border: 1px solid gray;
}
.input-common {
  margin-right: 5px;
}
.button-bottom {
  border-radius: 0;
  margin-left: 3px;
}
.button-click {
  float: right;
  margin: 20px 0 40px 0;
}
.el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 0;
  margin: 3px 0;
  background-color: #5fb44a;
  border: 1px solid #ebeef5;
  border-radius: 0;
  box-shadow: 0 2px 12px 0 #0000001a;
}
.el-dropdown-menu li {
  color: white;
  border-top: 1px solid white;
  font-family: Arial, Helvetica, sans-serif;
}
.over-table {
  width: 97%;
  margin: 0 auto;
}
.table-data {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;
}
// .wrapper-table {
//   height: 600px;
//   overflow-y: scroll;
//   border-bottom: 1px solid #ebeef5;
// }
thead {
  background: #78a5e7;
  color: white;
  font-weight: bold;
}
// tbody {
//   color: #606266;
//   font-size: 14px;
//   overflow: auto;
//   font-family: Arial, Helvetica, sans-serif;
// }
td {
  padding: 12px;
}
.table-index {
  width: 10px;
  text-align: center;
}
.table-item-name {
  width: 200px;
  text-align: center;
}
.table-action {
  width: 200px;
  text-align: center;
}
.color-text-reply {
  color: #4177e2;
}
.input-data {
  width: 60%;
}
.disable-row {
  background: #e4e7ed;
}
</style>
