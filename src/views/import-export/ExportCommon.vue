<template>
  <div class="app-container">
    <div>
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button
        :loading="downloadLoading"
        style="margin: 0 0 20px 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        Export Excel
      </el-button>
      <a
        href="https://panjiachen.github.io/vue-element-admin-site/feature/component/excel.html"
        target="_blank"
        style="margin-left: 15px"
      >
        <el-tag type="info">Documentation</el-tag>
      </a>
    </div>

    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="Loading..."
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Id" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.pro2 }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.pro3 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Readings" width="115" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="Date" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
// import { fetchList } from "@/api/article";
// import { parseTime } from "@/utils";
// options components
// import { Export2Excel } from "@/services/Export2Excel";
import FilenameOption from "./FilenameOption";
import AutoWidthOption from "./AutoWidthOption";
import BookTypeOption from "./BookTypeOption";
export default {
  name: "ExportExcel",
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      dataList: [
        {
          sheetName: "hs 11",
          headerList: [
            { pro1: "hs 1 f asn ssoafhsfhoisf fs fs sfh h ashf", pro3: "noi dung 1" },
            { pro1: "33333", pro3: "tieu de 3" },
          ],
          bodyList: [
            { pro1: "1", pro2: "tieu de 1" },
            { pro1: "2", pro2: "tieu de 2" },
            { pro1: "3", pro2: "tieu de 3" },
          ],
        },
        {
          sheetName: "hs 12",
          headerList: [
            { pro1: "hs 2", pro3: "noi dung 2", pro4: "noi dung 4", pro5: "noi dung 5" },
            { pro1: "33333", pro3: "tieu de 3" },
          ],
          bodyList: [
            { pro1: "4", pro2: "tieu de 4" },
            { pro1: "5", pro2: "tieu de 4" },
            { pro1: "6", pro2: "tieu de 5" },
          ],
        },
      ],
      listLoading: false,
      downloadLoading: false,
      autoWidth: true,
      bookType: "xlsx",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true;
      import("@/services/ExportExcel").then((excel) => {
        let fileName = "XuatHocSinh";
        const tHeader = ["Id", "Title", "Author"];
        const filterVal = ["pro1", "pro2", "pro3", "pro4"];
        const merges = ["A1:B1", "A2:B2"];
        let columnList = [{ col: 5 }, { col: 10 }, { col: 30 }, { col: 5 }, { col: 2 }];
        excel.export_json_to_excel({
          header: tHeader,
          data: this.dataList,
          title: filterVal,
          filename: fileName,
          merges: merges,
          columnsWidth: columnList,
        });
        this.downloadLoading = false;
      });
    },
  },
};
</script>
