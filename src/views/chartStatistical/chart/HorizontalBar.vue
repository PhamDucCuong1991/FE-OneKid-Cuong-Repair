<script>
import { HorizontalBar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import ChartJSPluginDatalabels from "chartjs-plugin-datalabels";
import ZoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js";

export default {
  extends: HorizontalBar,

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