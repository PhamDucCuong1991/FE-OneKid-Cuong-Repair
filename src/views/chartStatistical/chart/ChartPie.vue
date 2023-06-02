<script>
import { Pie, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import ChartJSPluginDatalabels from "chartjs-plugin-datalabels";
import Chart from "chart.js";

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ["chartData", "options", "checkLable"],
  mounted() {
    Chart.Legend.prototype.afterFit = function () {
      this.height += 25;
    };
    if (this.checkLable) {
      this.addPlugin(ChartJSPluginDatalabels);
    }
    this.renderChart(this.chartData, this.options);
  },
};
</script>