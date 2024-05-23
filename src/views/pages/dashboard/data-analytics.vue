<template>
  <div>
    <div class="form-group">
      <label for="filterCategory">Filter by Category:</label>
      <select v-model="selectedCategory" @change="updateChart" class="form-control" id="filterCategory">
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>
    <vue-highcharts :options="chartOptions"></vue-highcharts>
  </div>
</template>

<script>
//import Highcharts from 'highcharts';
import VueHighcharts from 'vue2-highcharts'
import dhis_data from './dhs';

export default {
  name: 'DataAnalytics',
  components: {
    VueHighcharts,
  },
  data() {
    return {
      selectedCategory: 'Total',
      categories: ['Total', 'Residence', 'Region'],
      chartOptions: {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Total Fertility Rate 15-49 in Kenya'
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: 'Fertility Rate'
          }
        },
        series: [{
          name: 'Fertility Rate',
          data: []
        }]
      }
    };
  },
  methods: {
    updateChart() {
      var dhisData=dhis_data;
      const filteredData = dhisData//.filter(item => item['Characteristic Category'] === this.selectedCategory);
      this.chartOptions.xAxis.categories = filteredData.map(item => item['Characteristic Label']);
      this.chartOptions.series[0].data = filteredData.map(item => parseFloat(item['Value']));
    }
  },
  mounted() {
    this.updateChart();
  }
};
</script>
