<script>
import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import ChartJSPluginDatalabels from "chartjs-plugin-datalabels";
import ZoomPlugin from "chartjs-plugin-zoom";
import Chart from "chart.js";

export default {
  extends: Bar,

  mixins: [reactiveProp],
  props: ["chartData", "options", "checkLable", "checkZoom"],
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