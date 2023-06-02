<template>
  <div>
    <el-currency-input :value="dataInput.moneyWallet"> </el-currency-input>
    <div :class="{ showToggle: show == true }" class="toggle-money">
      <option
        @click="selectMoney(item)"
        class="select-money"
        v-for="item in moneyTotal"
        :key="item"
      >
        {{ item | formatCurrency }}
      </option>
    </div>
  </div>
</template>

<script>
import ElCurrencyInput from "@/components/ElCurrencyInput.vue";

export default {
  components: {
    ElCurrencyInput,
  },
  data() {
    return {
      moneyMax: [1, 10, 100],
      moneyMin: [1000, 10000, 100000],
      moneyTotal: [],
      show: false,
      active: true,
      dataInput: {
        moneyWallet: "",
      },
    };
  },
  watch: {
    changeMoneyWallet() {
      if (this.dataInput.moneyWallet > 0 && this.active) {
        if (this.moneyTotal.length > 2) {
          this.moneyTotal = [];
        }
        if (this.dataInput.moneyWallet >= 10000) {
          this.moneyMax.forEach((val) => {
            this.moneyTotal.push(this.dataInput.moneyWallet * val);
          });
        } else {
          this.moneyMin.forEach((val) => {
            this.moneyTotal.push(this.dataInput.moneyWallet * val);
          });
        }
        this.show = true;
      } else {
        this.active = true;
        this.show = false;
        this.moneyTotal = [];
      }
    },
  },
  computed: {
    changeMoneyWallet() {
      return this.dataInput.moneyWallet;
    },
  },
  methods: {
    selectMoney(data) {
      this.dataInput.moneyWallet = data;
      this.moneyTotal = [];
      this.active = false;
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle-money {
  border: solid 2px #888;
  z-index: 10px;
  position: absolute;
  z-index: 33;
  background-color: rgb(208, 210, 222);
  width: 100%;
  border-radius: 5px;
  display: none;
}
.showToggle {
  display: block !important;
}
.select-money {
  border-bottom: 1px solid #fff;
  padding: 0px 10px;
}
.select-money:hover {
  background-color: rgb(120, 165, 231);
}
</style>
