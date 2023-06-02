<template>
  <div class="content">
    <div>
      <div style="margin-bottom: -20px; position: relative; z-index: 1">
        <el-input
          style="width: 280px"
          placeholder="Nhập tiêu đề tìm kiếm"
          clearable
          v-model="dataSearch.title"
          @keyup.enter.native="getAllNews()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getAllNews()"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="newsOneKids">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClickTab">
        <!--Tab Danh sách bài viết-->
        <el-tab-pane label="Danh sách bài viết" name="listNews">
          <!-- table -->
          <div class="table-content row-data">
            <el-table
              ref="multipleTable"
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="tableDataFilter"
              highlight-current-row
              :header-cell-style="tableHeaderColor"
              :max-height="$tableMaxHeight"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="createdBy"
                label="Người đăng"
                align="center"
              ></el-table-column>
              <el-table-column type="createdDate" label="Thời gian đăng" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createdDate | formatDateTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="title"
                label="Tiêu đề"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="link"
                label="Link bài viết"
                align="left"
              ></el-table-column>

              <el-table-column prop="appPlus" width="80" label="App Plus" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    @change="selectionActivated(scope.$index, scope.row, 'appPlusNews')"
                    v-model="scope.row.appPlus"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="appTeacher"
                width="80"
                label="Teacher"
                align="center"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    @change="
                      selectionActivated(scope.$index, scope.row, 'appTeacherNews')
                    "
                    v-model="scope.row.appTeacher"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="appParent" width="80" label="Onekids" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    @change="selectionActivated(scope.$index, scope.row, 'oneKidsNews')"
                    v-model="scope.row.appParent"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="appOneCame" width="80" label="OneCam" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    @change="selectionActivated(scope.$index, scope.row, 'oneCamNews')"
                    v-model="scope.row.appOneCame"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="urlAttachPicture"
                width="150"
                label="Ảnh"
                align="center"
              >
                <template slot-scope="scope">
                  <el-image
                    fit="fill"
                    style="width: 150px; height: 150px"
                    :src="scope.row.urlAttachPicture"
                  >
                    <i slot="default" class="el-icon-plus"></i>
                  </el-image>
                </template>
              </el-table-column>

              <el-table-column
                label="Tác vụ"
                width="150"
                style="float: right"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)"
                    >Sửa</el-button
                  >

                  <el-button
                    size="mini"
                    @click="handleDelete(scope.$index, scope.row)"
                    type="danger"
                    >Xóa</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div class="paging-click row-data">
              <el-pagination
                background
                :current-page="pageNumber"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="$pageListDefaultNew"
                :page-size="pageSize"
                :layout="layout"
                :total="total"
              ></el-pagination>
            </div>
            <div style="float: right; margin: 30px 0">
              <el-dropdown @command="handleCommand">
                <el-button class="button-over" type="success">
                  Tác vụ
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu class="el-dropdown-menu-container">
                  <el-dropdown-item command="createNews"
                    >Thêm bài viết mới</el-dropdown-item
                  >
                  <el-dropdown-item command="createLinkExpand"
                    >Thêm link mở rộng</el-dropdown-item
                  >
                  <el-dropdown-item command="deleteAll">Xóa tất cả</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-tab-pane>

        <!--Tab Link mở rộng-->
        <el-tab-pane label="Link mở rộng" name="linkExpand">
          <div class="table-content row-data">
            <el-table
              :empty-text="textTable"
              v-loading="loadingData"
              :element-loading-text="$tableLoadding"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255,255,255, 0)"
              :data="newsExtraList"
              highlight-current-row
              :header-cell-style="tableHeaderColor"
              :max-height="$tableMaxHeight"
              @selection-change="handleSelectionChange"
              border
            >
              <el-table-column
                type="selection"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                type="index"
                label="STT"
                width="50"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="link"
                label="Link mở rộng"
                align="left"
              ></el-table-column>

              <el-table-column prop="appPlus" label="App Plus" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    @change="
                      selectionActivatedExtra(
                        scope.$index,
                        scope.row,
                        'activeAppPlusExtra'
                      )
                    "
                    v-model="scope.row.appPlus"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="appTeacher" label="Teacher" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    @change="
                      selectionActivatedExtra(
                        scope.$index,
                        scope.row,
                        'activeAppTeacherExtra'
                      )
                    "
                    v-model="scope.row.appTeacher"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="appParent" label="Onekids" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    @change="
                      selectionActivatedExtra(
                        scope.$index,
                        scope.row,
                        'activeAppOnkidsExtra'
                      )
                    "
                    v-model="scope.row.appParent"
                  ></el-checkbox>
                </template>
              </el-table-column>

              <el-table-column label="Tác vụ" style="float: right" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleEditExtra(scope.$index, scope.row)"
                    >Sửa</el-button
                  >

                  <el-button
                    size="mini"
                    @click="handleDeleteExtra(scope.$index, scope.row)"
                    type="danger"
                    >Xóa</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div style="float: right; margin: 30px 0">
              <el-dropdown @command="handleCommand">
                <el-button class="button-over" type="success">
                  Tác vụ
                  <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu class="el-dropdown-menu-container">
                  <el-dropdown-item command="createNews"
                    >Thêm bài viết mới</el-dropdown-item
                  >
                  <el-dropdown-item command="createLinkExpand"
                    >Thêm link mở rộng</el-dropdown-item
                  >
                  <el-dropdown-item command="deleteAll">Xóa tất cả</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- <div class="paging-click row-data">
              <el-pagination
                background
                @size-change="handleSizeChangeExtra"
                @current-change="handleCurrentChangeExtra"
                :page-sizes="pageList"
                :page-size="pageSize"
                :layout="layout"
                :total="total"
              ></el-pagination>
            </div> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <CreateNews
      :dialogVisible="showCreateNewsDialog"
      @dialog-close="dialogCloseCreateMethod()"
      ref="CreateNews"
    />
    <CreateNewsExtra
      :dialogVisible="showCreateNewsExtraDialog"
      @dialog-close="dialogCloseCreateExtraMethod()"
      ref="CreateNewsExtra"
    />
    <UpdateNews
      :dialogVisible="showUpdateNewsDialog"
      @dialog-close="dialogCloseUpdateMethod()"
      ref="UpdateNews"
    />
    <UpdateNewsExtra
      :dialogVisible="showUpdateNewsExtraDialog"
      @dialog-close="dialogCloseUpdateExtraMethod()"
      ref="UpdateNewsExtra"
    />
  </div>
</template>

<script>
import NewsService from "@/services/NewsService";
import NewsExtraService from "@/services/NewsExtraService";
import CreateNews from "../notify/CreateNews";
import CreateNewsExtra from "../notify/CreateNewsExtra";
import UpdateNews from "../notify/UpdateNews";
import UpdateNewsExtra from "../notify/UpdateNewsExtra";
export default {
  components: {
    CreateNews,
    UpdateNews,
    CreateNewsExtra,
    UpdateNewsExtra,
  },
  data() {
    return {
      loadingData: true,
      textTable: "",
      url:
        "https://znews-photo.zadn.vn/w1920/Uploaded/lce_jwqqc/2019_06_25/60754257_170218003980398_5100202477246369416_n.jpg",
      layout: "sizes, prev, pager, next",
      total: 10,
      pageSize: 10,
      pageList: [2, 10, 20, 30, 40, 50],
      tableDataFilter: [],
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
      ],
      showCreateNewsDialog: false,
      showUpdateNewsDialog: false,
      showUpdateDialog: false,
      showUpdateBrandDialog: false,
      showUpdateAgentDialog: false,
      showCreateNewsExtraDialog: false,
      showUpdateNewsExtraDialog: false,
      activeName: "listNews",
      tabNameClick: "",
      showAdd: true,
      showHistory: false,
      newsList: [],
      multipleSelection: [],
      newsExtraList: [],
      checkDisable: false,
      agent: true,
      dataSearch: {
        title: "",
      },
    };
    // ----
  },
  methods: {
    handleCommand(command) {
      if (command == "createNews") {
        this.createNewsDialog();
      } else if (command == "createLinkExpand") {
        this.createNewsExtraDialog();
      } else if (command == "deleteAll") {
        console.log(this.tabNameClick);
        if (this.tabNameClick == "linkExpand") {
          this.deleteLinkExtended();
        } else {
          this.deleteNewsExtended();
        }
      }
    },
    deleteLinkExtended() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length < 1) {
        this.$message({
          message: "Bạn chưa chọn link cần xóa",
          type: "error",
        });
      } else {
        this.$confirm("Bạn có chắc chắn muốn xóa link mở rộng", "Thông báo!", {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }).then(() => {
          NewsExtraService.deleteMultiNewsExtra(list)
            .then(() => {
              this.$message({
                message: "Xóa link mở rộng thành công",
                type: "success",
              });
              setTimeout(() => {
                this.getAllNewsExtra();
              }, 500);
            })
            .catch(() => {
              this.$message({
                message: "Xóa link mở rộng thất bại",
                type: "error",
              });
              setTimeout(() => {
                this.getAllNewsExtra();
              }, 500);
            });
        });
      }
    },
    deleteNewsExtended() {
      let list = [];
      this.multipleSelection.forEach((x) => list.push(x.id));
      if (list.length < 1) {
        this.$message({
          message: "Bạn chưa chọn tin tức cần xóa",
          type: "error",
        });
      } else {
        this.$confirm("Bạn có chắc chắn muốn xóa tin tức không ", "Thông báo!", {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }).then(() => {
          NewsService.deleteMultiNews(list)
            .then(() => {
              this.$message({
                message: "Xóa tin tức thành công",
                type: "success",
              });
              setTimeout(() => {
                this.getAllNews();
              }, 500);
            })
            .catch(() => {
              this.$message({
                message: "Xóa tin tức thất bại",
                type: "error",
              });
              setTimeout(() => {
                this.getAllNews();
              }, 500);
            });
        });
      }
    },
    //click checkbox of row
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    tableHeaderColor() {
      return "background-color: #78a5e7;color: #fff;font-weight: bold";
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleClickTab(tab) {
      this.tabNameClick = tab.name;
      if (this.tabNameClick == "listNews") {
        this.visibleAttendanceArrive = true;
        this.smscongif = false;
        this.agent = false;
        this.showAdd = false;
        this.showHistory = true;
        this.checkDisable = true;
      } else if (this.tabNameClick == "linkExpand") {
        this.smscongif = true;
        this.visibleAttendanceArrive = false;
        this.agent = false;
        this.showAdd = false;
        this.showHistory = true;
        this.checkDisable = true;
      }
    },
    createNewsExtraDialog() {
      this.showCreateNewsExtraDialog = true;
      let lengthPlusNews = this.newsExtraList.filter((item) => item.appPlus == true)
        .length;
      let lengthTeacherNews = this.newsExtraList.filter((item) => item.appTeacher == true)
        .length;
      let lengthParentNews = this.newsExtraList.filter((item) => item.appParent == true)
        .length;
      this.$refs.CreateNewsExtra.getLength(
        lengthPlusNews,
        lengthTeacherNews,
        lengthParentNews
      );
    },
    createNewsDialog() {
      this.showCreateNewsDialog = true;
      let lengthPlusNews = this.newsList.filter((item) => item.appPlus == true).length;
      let lengthTeacherNews = this.newsList.filter((item) => item.appTeacher == true)
        .length;
      let lengthParentNews = this.newsList.filter((item) => item.appParent == true)
        .length;
      this.$refs.CreateNews.getLength(
        lengthPlusNews,
        lengthTeacherNews,
        lengthParentNews
      );
    },
    dialogCloseCreateMethod() {
      this.showCreateNewsDialog = false;
      this.getAllNews();
    },
    dialogCloseCreateExtraMethod() {
      this.showCreateNewsExtraDialog = false;
      this.getAllNewsExtra();
    },
    dialogCloseUpdateMethod() {
      this.showUpdateNewsDialog = false;
      this.getAllNews();
    },
    dialogCloseUpdateExtraMethod() {
      this.showUpdateNewsExtraDialog = false;
      this.getAllNewsExtra();
    },
    //click edit at row
    handleEdit(index, row) {
      this.showUpdateNewsDialog = true;
      let lengthPlusNews = this.newsList.filter((item) => item.appPlus == true).length;
      let lengthTeacherNews = this.newsList.filter((item) => item.appTeacher == true)
        .length;
      let lengthParentNews = this.newsList.filter((item) => item.appParent == true)
        .length;
      this.$refs.UpdateNews.getLength(
        lengthPlusNews,
        lengthTeacherNews,
        lengthParentNews
      );
      this.$refs.UpdateNews.getCreateNews(row);
    },
    handleEditExtra(index, row) {
      this.showUpdateNewsExtraDialog = true;
      let lengthPlusNews = this.newsExtraList.filter((item) => item.appPlus == true)
        .length;
      let lengthTeacherNews = this.newsExtraList.filter((item) => item.appTeacher == true)
        .length;
      let lengthParentNews = this.newsExtraList.filter((item) => item.appParent == true)
        .length;
      this.$refs.UpdateNewsExtra.getLength(
        lengthPlusNews,
        lengthTeacherNews,
        lengthParentNews
      );
      this.$refs.UpdateNewsExtra.getCreateNews(row);
    },
    handleDelete(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa tin tức", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        NewsService.deleteNews(row.id)
          .then(() => {
            this.$message({
              message: "Xóa bài viết thành công",
              type: "success",
            });
            setTimeout(() => {
              this.getAllNews();
            }, 500);
          })
          .catch(() => {
            this.$message({
              message: "Xóa bài viết thất bại",
              type: "error",
            });
            setTimeout(() => {
              this.getAllNews();
            }, 500);
          });
      });
    },

    handleDeleteExtra(index, row) {
      this.$confirm("Bạn có chắc chắn muốn xóa link mở rộng", "Thông báo!", {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(() => {
        NewsExtraService.deleteNewsExtra(row.id)
          .then(() => {
            this.$message({
              message: "Xóa link mở rộng thành công",
              type: "success",
            });
            setTimeout(() => {
              this.getAllNewsExtra();
            }, 500);
          })
          .catch(() => {
            this.$message({
              message: "Xóa link mở rộng thất bại",
              type: "error",
            });
            setTimeout(() => {
              this.getAllNewsExtra();
            }, 500);
          });
      });
    },

    handleSizeChange(maxPageItem) {
      this.tableDataFilter = this.newsList.slice(0, maxPageItem);
      this.pageSize = maxPageItem;
      this.total = this.newsList.length;
    },
    // handleSizeChangeExtra(maxPageItem) {
    //   this.tableDataFilterExtra = this.newsExtraList.slice(0, maxPageItem);
    //   this.pageSize = maxPageItem;
    //   this.total = this.newsExtraList.length;
    // },
    // click chọn số trang
    handleCurrentChange(pageNumber) {
      console.log("ho");
      let number = this.pageSize;
      this.tableDataFilter = this.newsList.slice(
        (pageNumber - 1) * number,
        pageNumber * number
      );
    },
    // click chọn số trang
    // handleCurrentChangeExtra(pageNumber) {
    //   let number = this.pageSize;
    //   this.tableDataFilterExtra = this.newsExtraList.slice(
    //     (pageNumber - 1) * number,
    //     pageNumber * number
    //   );
    // },
    getAllNews() {
      this.loadingData = true;
      NewsService.getAllNews(this.dataSearch.title)
        .then((res) => {
          this.newsList = res.data.data;
          this.tableDataFilter = this.newsList.slice(0, this.pageSize);
          this.total = this.newsList.length;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          if (this.newsList.length == 0) {
            this.textTable = this.$tableEmpty;
          }
          this.loadingData = false;
        });
    },
    getAllNewsExtra() {
      NewsExtraService.getAllNewsExtra(this.dataSearch.title)
        .then((res) => {
          this.newsExtraList = res.data.data;
          // this.tableDataFilterExtra = this.newsExtraList.slice(
          //   0,
          //   this.pageSize
          // );
          // this.total = this.newsExtraList.length;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectionActivated(index, row, status) {
      if (status == "appPlusNews") {
        let lengthCheckAppPlus = this.newsList.filter((item) => item.appPlus == true)
          .length;
        if (lengthCheckAppPlus <= 5) {
          NewsService.updateNews(row)
            .then(() => {
              if (row.appPlus) {
                this.$message({
                  message: "Kích hoạt App Plus thành công",
                  type: "success",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App Plus thành công",
                  type: "success",
                });
              }
              this.getAllNews();
            })
            .catch(() => {
              if (row.appPlus) {
                this.$message({
                  message: "Kích hoạt App Plus thất bại",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App Plus thất bại",
                  type: "error",
                });
              }
            });
        } else {
          this.$message({
            message: "Bạn chỉ được kích hoạt 5 App Plus",
            type: "error",
          });
          this.getAllNews();
        }
      } else if (status == "appTeacherNews") {
        let lengthCheckTeacher = this.newsList.filter((item) => item.appTeacher == true)
          .length;
        if (lengthCheckTeacher <= 9) {
          NewsService.updateNews(row)
            .then(() => {
              if (row.appTeacher) {
                this.$message({
                  message: "Kích hoạt App Teacher thành công",
                  type: "success",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App Teacher thành công",
                  type: "success",
                });
              }
              this.getAllNews();
            })
            .catch(() => {
              if (row.appTeacher) {
                this.$message({
                  message: "Kích hoạt App Teacher thất bại",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App Teacher thất bại",
                  type: "error",
                });
              }
            });
        } else {
          this.$message({
            message: "Bạn chỉ được kích hoạt 9 App Teacher",
            type: "error",
          });
          this.getAllNews();
        }
      } else if (status == "oneKidsNews") {
        let lengthCheckParent = this.newsList.filter((item) => item.appParent == true)
          .length;
        if (lengthCheckParent <= 9) {
          NewsService.updateNews(row)
            .then(() => {
              if (row.appParent) {
                this.$message({
                  message: "Kích hoạt App OneKids thành công",
                  type: "success",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App OneKids thành công",
                  type: "success",
                });
              }
              this.getAllNews();
            })
            .catch(() => {
              if (row.appParent) {
                this.$message({
                  message: "Kích hoạt App OneKids thất bại",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App OneKids thất bại",
                  type: "error",
                });
              }
            });
        } else {
          this.$message({
            message: "Bạn chỉ được kích hoạt 9 App OneKids",
            type: "error",
          });
          this.getAllNews();
        }
      } else if (status == "oneCamNews") {
        NewsService.updateNews(row)
          .then(() => {
            if (row.appOneCame) {
              this.$message({
                message: "Kích hoạt App OneCam thành công",
                type: "success",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt App OneCam thành công",
                type: "success",
              });
            }
            this.getAllNews();
          })
          .catch(() => {
            if (row.appOneCame) {
              this.$message({
                message: "Kích hoạt App OneCam thất bại",
                type: "error",
              });
            } else {
              this.$message({
                message: "Hủy kích hoạt App OneCam thất bại",
                type: "error",
              });
            }
          });
      }
    },

    selectionActivatedExtra(index, row, status) {
      if (status == "activeAppPlusExtra") {
        let a = this.newsExtraList;
        // console.log(this.newsExtraList);
        let lengthCheckAppPlus = a.filter((item) => {
          return item.appPlus == true;
        }).length;
        if (lengthCheckAppPlus <= 1) {
          NewsExtraService.updateNewsExtra(row)
            .then(() => {
              if (row.appPlus) {
                this.$message({
                  message: "Kích hoạt App Plus thành công",
                  type: "success",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App Plus thành công",
                  type: "success",
                });
              }
              this.getAllNewsExtra();
            })
            .catch(() => {
              if (row.appPlus) {
                this.$message({
                  message: "Kích hoạt App Plus thất bại",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App Plus thất bại",
                  type: "error",
                });
              }
              this.getAllNewsExtra();
            });
        } else {
          this.$message({
            message: "Bạn chỉ được kích hoạt 1 App Plus",
            type: "error",
          });
          this.getAllNewsExtra();
        }
      } else if (status == "activeAppTeacherExtra") {
        let a = this.newsExtraList;
        let lengthCheckTeacher = a.filter((item) => {
          return item.appTeacher == true;
        }).length;
        if (lengthCheckTeacher <= 1) {
          NewsExtraService.updateNewsExtra(row)
            .then(() => {
              if (row.appTeacher) {
                this.$message({
                  message: "Kích hoạt App Teacher thành công",
                  type: "success",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App Teacher thành công",
                  type: "success",
                });
              }
              this.getAllNewsExtra();
            })
            .catch(() => {
              if (row.appTeacher) {
                this.$message({
                  message: "Kích hoạt App Teacher thất bại",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App Teacher thất bại",
                  type: "error",
                });
              }
              this.getAllNewsExtra();
            });
        } else {
          this.$message({
            message: "Bạn chỉ được kích hoạt 1 App Teacher",
            type: "error",
          });
          this.getAllNewsExtra();
        }
      } else {
        let a = this.newsExtraList;
        let lengthCheckParent = a.filter((item) => {
          return item.appParent == true;
        }).length;
        if (lengthCheckParent <= 1) {
          NewsExtraService.updateNewsExtra(row)
            .then(() => {
              if (row.appParent) {
                this.$message({
                  message: "Kích hoạt App OneKids thành công",
                  type: "success",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App OneKids thành công",
                  type: "success",
                });
              }
              this.getAllNewsExtra();
            })
            .catch(() => {
              if (row.appParent) {
                this.$message({
                  message: "Kích hoạt App OneKids thất bại",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "Hủy kích hoạt App OneKids thất bại",
                  type: "error",
                });
              }
              this.getAllNewsExtra();
            });
        } else {
          this.$message({
            message: "Bạn chỉ được kích hoạt 1 App OneKids",
            type: "error",
          });
          this.getAllNewsExtra();
        }
      }
    },
  },

  beforeMount() {
    this.getAllNews();
    this.getAllNewsExtra();
  },
};
</script>
<style lang="scss" scoped>
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
li.el-select-dropdown__item.hover {
  background: rgb(111, 142, 189);
}
.date {
  margin-bottom: 8px;
}

.button-select {
  margin-right: 5px;
  width: 150px;
}

/deep/.el-table th {
  padding: 10px 0;
}

.paging-click {
  float: left;
  margin-top: 5px;
}
/deep/.el-tabs__nav-scroll {
  float: right;
}
/deep/[data-v-5ed4c166] .el-tabs--card > .el-tabs__header {
  border-bottom: none;
  margin-top: -8px;
}
/deep/.el-tabs__nav-wrap {
  margin-top: 0px;
  margin-bottom: -16px;
}
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
.btt {
  float: right;
  margin-top: 10px;
  // background-color: #4CAF50;
}
.buttonxemchitiet {
  background-color: #78a5e7;
}
.button-over {
  margin-right: 5px;
}
/deep/.date[data-v-5ed4c166] {
  margin-bottom: -25px;
  z-index: 2;
  position: relative;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: none;
}

.content .row-data {
  margin-bottom: 20px;
}
/deep/.el-table td,
/deep/.el-table th {
  padding: 6px 0;
}
.paging-click {
  .el-pagination {
    text-align: right;
    margin: 30px 0;
  }
}

/deep/.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}
/deep/.el-input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  /* border: red; */
  // border: 1px solid #dad6d6;
}
/deep/.el-table th.gutter {
  background-color: #78a5e7;
}
// /deep/.el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   margin-top: -1px;
// }
</style>
