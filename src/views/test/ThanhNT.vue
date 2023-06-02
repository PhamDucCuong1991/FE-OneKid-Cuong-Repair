<template>
  <div class="test-table" style="width: 50%; margin: 50px auto">
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="Date" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column property="name" label="Name" width="120">
      </el-table-column>
      <el-table-column property="address" label="Address" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div style="margin: 20px">
      <el-button
        :loading="downloadLoading"
        style="margin-bottom: 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
        >Export</el-button
      >
      <el-button
        :loading="downloadLoading"
        style="margin-bottom: 20px"
        type="primary"
        icon="el-icon-document"
        @click="doctien"
        >Đọc</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: "2016-05-03",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          id: 2,
          date: "2016-05-02",
          name: "Tom2",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          id: 3,
          date: "2016-05-04",
          name: "Tom3",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          id: 4,
          date: "2016-05-01",
          name: "Tom4",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          id: 5,
          date: "2016-05-08",
          name: "Tom5",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          id: 6,
          date: "2016-05-06",
          name: "Tom6",
          address: "No. 189, Grove St, Los Angeles",
        },
        {
          id: 7,
          date: "2016-05-07",
          name: "Tom7",
          address: "No. 189, Grove St, Los Angeles",
        },
      ],
      multipleSelection: [],
      downloadLoading: false,
      filename: "",
      autoWidth: true,
      bookType: "xlsx",
      listLoading: true,
    };
  },

  methods: {
    doctien() {},
    handleDownload() {
      this.downloadLoading = true;
      import("./Test").then((excel) => {
        const tHeader = ["ID", "Date", "Name", "ADD"];
        const filterVal = ["id", "date", "name", "address"];
        const list = this.multipleSelection;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data: data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });

        this.downloadLoading = false;
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
  },
};
</script>