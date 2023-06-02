<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- <p>kkkk{{phone}}</p>
    <p>bbb{{fullname}}</p>
    <p>sttus: {{isOpenClose}}</p>
    <p>sttus11: {{getIsOpenClose}}</p>
    <el-button @click="changeIsCollapse(getIsOpenClose=!getIsOpenClose)">conmeo</el-button>-->
    <!-- <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">OK123</el-button>
      <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
    </el-upload>-->
    <!-- <el-input v-model="data1"></el-input>
    <el-button type="success" @click="aaa()">OK</el-button>-->
    <!-- aaaa{{getData}} -->
    <!-- <div>{{ $browserDetect }}</div> -->
    <!-- <el-button @click="aaa()">Clear</el-button> -->
    <!-- <div v-if="!!checkTex">con meo 1</div>
    <div v-else>con meo 2</div> -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item>promotion management</el-breadcrumb-item>
      <el-breadcrumb-item>promotion list</el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb> -->

    <!-- <el-breadcrumb v-for="(item, index) in getBreadcrumbDataList" :key="index">
      <el-breadcrumb-item :to="{ path: item.url }"
        ><span style="cursor: pointer"
          >{{ item.name }}
          <span v-if="index != getMaxLength - 1">
            <i style="font-size: 15px" class="el-icon-arrow-right"></i
          ></span> </span
      ></el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="changeAA()">add</el-button>
    <br />
    {{ breadcrumbList }} -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">{{
        item.meta.title
      }}</el-breadcrumb-item>
    </el-breadcrumb>
    aaa: {{ breadList }}
    <el-button @click="testAA()">OK123</el-button>
    <currency-input disabled v-model="value" />
    <el-currency-input disabled v-model="value" />

    <br />
    {{ testWatch }}
    <el-button @click="changeWatch()">Change1</el-button>
    {{ test111 }}
    <br />
    {{ testWatchObject }}
    <el-button @click="changeWatchPro1Method()">Change2</el-button>
    {{ testObjectPro1 }} <br />
    <el-button @click="testAAFormat()">Format</el-button>
    <router-view />
  </div>
</template>

<script>
// import Vuex from "vuex";
import ElCurrencyInput from "@/components/ElCurrencyInput.vue";
export default {
  components: {
    ElCurrencyInput,
  },
  data() {
    return {
      value: 123123,
      breadList: [],
      number: 12312322,
      testWatch: "con watch",
      testWatchNew: 1,
      test111: "abc",
      test111New: "abc new",
      testWatchObject: {
        pro1: "con chim 1",
        pro2: "con chim 2",
      },
      testObjectPro1: "def",
      data1: "",
      checkText: null,
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      breadcrumbList: [
        { url: "/dashboard", name: "Trang chủ" },
        { url: "/student/class", name: "Danh sách lớp" },
        { url: "/student/grade", name: "Danh sách khối" },
      ],
    };
  },
  // monitor property
  watch: {
    testWatch() {
      this.test111 = "con meo non 123213";
    },
    changePro1() {
      this.testObjectPro1 = "con aaa 1";
    },
    testWatchNew() {
      this.test111New = this.testWatchNew + "vvvv";
    },
    // monitor route
    $route(val) {
      // call get route array method
      this.getBreadList(val);
    },
  },
  computed: {
    changePro1() {
      return this.testWatchObject.pro1;
    },
    // getData(){
    //   return this.$store.state.auth.initialState.status.loggedIn
    // },
    // ...Vuex.mapState(["phone", "fullname", "isOpenClose"]),
    // ...Vuex.mapGetters(["getIsOpenClose"]),
    message() {
      return this.data1 + "ff";
    },
    getBreadcrumbDataList() {
      return this.breadcrumbList;
    },
  },
  methods: {
    changeWatch() {
      this.testWatch = "con chim non";
    },
    changeWatchPro1Method() {
      this.testWatchObject.pro1 = "con chim non 213";
    },
    testAAFormat() {
      alert("ff");
      let a = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(23423234);
      console.log("df" + a);
    },
    testAA() {
      sessionStorage.setItem("aa", "con meo non");
    },
    getBreadList(val) {
      // Filter route matched objects
      if (val.matched) {
        let matched = val.matched.filter((item) => item.meta && item.meta.title);
        // Get the filtered route v-for and traverse it
        this.breadList = matched;
      }
    },
    // ...Vuex.mapActions({ changeIsCollapse: "getIsOpenCloseMenu" }),
    // ...Vuex.mapMutations({ changeIsCollapse: "SET_IS_OPEN_MENU" }),
    aaa() {
      // let a = this.message;
      // alert(a);
      this.$router.go();
    },
    changeAA() {
      let a = [
        { url: "student/students", name: "danh sach hs" },
        { url: "student/students1", name: "danh sach hs1" },
      ];
      this.breadcrumbList = this.breadcrumbList.concat(a);
    },
    handleRemove(file, fileList) {
      alert("remove");
      console.log(file, fileList);
    },
    handlePreview(file) {
      let a = file;
      alert("preview" + a);
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${
          files.length + fileList.length
        } totally`
      );
    },
    beforeRemove(file, fileList) {
      console.log(fileList);
      return this.$confirm(`Cancel the transfert of ${file.name} ?`);
    },
  },
};
</script>
<style lang="scss" scoped>
// .el-row {
//   margin-bottom: 15px;
// }
// /deep/.el-icon-arrow-right:before {
//   content: "";
// }
// .table-data {
//   width: 80%;
//   border-collapse: collapse;
//   margin: 0 auto;
// }
// thead {
//   background: red;
// }
// td {
//   padding: 10px;
// }
/* Breadcrumbs */
// .el-breadcrumb {
//   // @include ptrbl(16px, 16px, 16px, 16px);
//   box-sizing: border-box;
//   background: white;
//   border-bottom: 1px solid #eee;
// }
</style>
