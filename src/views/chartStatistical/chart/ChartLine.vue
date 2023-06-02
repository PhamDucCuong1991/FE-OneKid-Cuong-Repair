<script>
import { Line, mixins } from "vue-chartjs";
import ZoomPlugin from "chartjs-plugin-zoom";
import ChartJSPluginDatalabels from "chartjs-plugin-datalabels";
import Chart from "chart.js";

const { reactiveProp } = mixins;
export default {
  extends: Line,

  mixins: [reactiveProp],
  props: ["chartData", "options", "checkLable"],
  mounted() {
    Chart.Legend.prototype.afterFit = function () {
      this.height += 25;
    };
    if (this.checkLable) {
      this.addPlugin(ChartJSPluginDatalabels);
    }
    this.addPlugin(ZoomPlugin);
    this.renderChart(this.chartData, this.options);
  },
};
</script>