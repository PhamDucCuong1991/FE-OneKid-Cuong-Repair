<template>
  <div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="name" label="Ho ten"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableHeader"
        :key="index"
        :prop="item.key"
        :label="item.value"
      >
        <template slot="header" slot-scope="scope">
          <el-popover
            placement="bottom-start"
            width="200"
            trigger="hover"
            :content="item.value"
          >
            <span slot="reference">Khoản {{ index + 1 }}</span>
          </el-popover>
          <br />
          <el-checkbox
            @change="checkHeaderMethod(scope.$index, item.key, item.check)"
            v-model="item.check"
          ></el-checkbox>
        </template>

        <template slot-scope="scope">
          <el-checkbox
            v-if="scope.row.conmeo.filter((x) => x.id == item.key).length == 1"
            v-model="scope.row.conmeo.filter((x) => x.id == item.key)[0].mang"
          ></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="CheckB()">click B</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeader: [
        {
          key: 1,
          value: "khoan 1 a fhasif asfiasf à ashuifsa fas fho ầ á fh ấ fh",
          check: false,
        },
        { key: 2, value: "khoan 2", check: true },
        { key: 3, value: "khoan 3", check: false },
      ],
      tableData: [
        {
          name: "la van viet",
          address: "ha noi",
          check: true,
          bbb: [1, 2],
          conmeo: [
            { id: 1, mang: true },
            { id: 2, mang: false },
          ],
        },
        {
          name: "la van viet 1",
          address: "ha noi 1",
          check: false,
          bbb: [],
          conmeo: [
            { id: 1, mang: true },
            { id: 2, mang: true },
            { id: 3, mang: true },
            { id: 4, mang: true },
          ],
        },
        {
          name: "la van viet 2",
          address: "ha noi 2",
          check: false,
          bbb: [],
          conmeo: [
            { id: 1, mang: false },
            { id: 2, mang: false },
            { id: 3, mang: true },
          ],
        },
      ],
      arrayTest1: [
        { id: 4, a1: "meo1", a2: "vit1" },
        { id: 5, a1: "meo1", a2: "vit2" },
        { id: 6, a1: "meo3", a2: "vit3" },
      ],
      arrayTest2: [
        { a1: "ga", a2: "ngan" },
        { a1: "ga1", a2: "ngan1" },
      ],
      object1: {
        a6: "chim",
        ha: "lon",
      },
      dataFi: 4,
    };
  },
  methods: {
    //change array
    //- push()
    //- pop()
    //- shift()
    //- unshift()
    //- splice()
    //- sort()
    //- reverse()
    // no change array: filter(), concat(),slice()
    checkHeaderMethod(index, key, check) {
      this.tableData.forEach((x) => {
        let dataList = x.conmeo.filter((a) => a.id == key);
        if (dataList.length == 1) {
          dataList[0].mang = check;
        }
      });
    },
    CheckB() {
      let v = this.tableData;
      console.log(v);
      let v1 = v.filter((x) => {
        return x.check == false;
      });
      let v2 = this.arrayTest1.map((x) => x.a1);

      this.arrayTest1.forEach((x) => {
        console.log(x);
      });
      console.log(v2);
      console.log(v1);
    },
  },
};
</script>
