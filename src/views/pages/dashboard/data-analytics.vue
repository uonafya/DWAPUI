<script>
//import VueApexCharts from 'vue-apexcharts';
//import countTo from "vue-count-to";
// import Activity from "./activity";
// import Activity2 from "./activity2";
// import Topfacilities from "./top-facilities";
import Multiselect from "vue-multiselect";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  components: {
    //countTo,
    // Activity,
    // Activity2,
    // Topfacilities,
    Multiselect,
    //apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          type: "bar",
          height: 550,
          stacked: true,
          selection: {
            enabled: true,
          },
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
          },
        },

        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
          enabledOnSeries: [1],
        },
        stroke: {
          width: [0, 4],
        },
        title: {
          text: "COUNTY SUMMARY",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: undefined,
            color: "#263238",
          },
        },
        xaxis: {
          type: "category",
          categories: [],
          labels: {
            formatter: function (val) {
              return val;
            },
          },
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            },
          },
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 40,
          fontSize: "14px",
          fontFamily: "Helvetica, Arial",
          fontWeight: 400,
        },
      },
      Options: {
        chart: {
          animations: {
            enabled: true,
          },
        },
        // xaxis: {
        //   title: {
        //     text: 'Concordance Category'
        //   }
        // },
        yaxis: {
          title: {
            text: "Concordance (%)",
          },
        },
        series: [],
      },
      chartSeries: [
        {
          name: "Concordance",
          data: [],
        },
      ],
      indicators: ["TX_CURR", "TX_NEW", "PMTCT_STAT"],
      indicator: "TX_CURR",
      fromdate: new Date(),
      todate: new Date(),
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Swal.fire({
        title: "Please Wait !",
        html: "Loading data...", // add html attribute if you want or remove
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      axios
        .get(
          `insights/group_concodance?from_date=2021-10-01&to_date=2022-12-31&category=${this.indicator}`
        )
        .then((response) => {
          const categories = response.data.map((item) => item.county.toString());
          const less90Data = response.data.map((item) => item.less_90);
          const between90_100Data = response.data.map((item) => item.between_90_100);
          const more100Data = response.data.map((item) => item.more_100);
          this.chartOptions.xaxis.categories = categories;
          //updating chart options dynamically
          this.chartOptions.xaxis.categories = categories;
          // Call the $refs to update the chart with new options
          this.$refs.chart.updateOptions(this.chartOptions);
          this.series = [
            {
              name: "Less 90%",
              data: less90Data,
            },
            {
              name: "90-100%",
              data: between90_100Data,
            },
            {
              name: "More 100%",
              data: more100Data,
            },
          ];
          axios
            .get(
              `insights/facilty_concodance?from_date=2021-10-01&to_date=2022-12-31&category=${this.indicator}`
            )
            .then((response) => {
              this.chartSeries = [
                {
                  name: "concodance(%)",
                  data: response.data,
                },
              ];
            });
          Swal.close();
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "" + e,
            showConfirmButton: true,
          }).then((e) => {
            Swal.close(e);
          });
        });
    },
  },
};
</script>

<template>
  <div class="col-xl-8">
    <div class="card">
      <div class="card-body">
        <div class="float-end">
          <b-dropdown
            variant="white"
            toggle-class="text-reset p-0"
            menu-class="dropdown-menu-end"
          >
            <template v-slot:button-content>
              <span class="fw-semibold">Sort By:</span>
              <span class="text-muted">
                Yearly
                <i class="mdi mdi-chevron-down ms-1"></i>
              </span>
            </template>
            <a class="dropdown-item" href="#">Monthly</a>
            <a class="dropdown-item" href="#">Yearly</a>
            <a class="dropdown-item" href="#">Weekly</a>
          </b-dropdown>
        </div>
        <h4 class="card-title mb-4">Data Insights</h4>

        <div class="col-xl-12">
          <div class="card" style="background-color: beige; padding: 10px">
            <div class="card-body">
              <h4 class="card-title mb-4">Data Analytics 1</h4>
              <h5 class="card-title mb-4">SUMMARY OF CONCODANCE BY COUNTY</h5>
              <div class="float-left">
                <div class="row">
                  <div class="col-sm-3">
                    <span>Indicator:</span>
                    <multiselect
                      @input="fetchData()"
                      v-model="indicator"
                      :options="indicators"
                      class=""
                    >
                    </multiselect>
                  </div>
                  <div class="col-sm-3">
                    <span>From Date:</span>
                    <date-picker
                      value="2021-01-01"
                      v-model="fromdate"
                      :first-day-of-week="1"
                      lang="en"
                      @change="fetchData()"
                    ></date-picker>
                  </div>
                  <div class="col-sm-3">
                    <span>To Date:</span>
                    <date-picker
                      @change="fetchData()"
                      value="2022-12-31"
                      v-model="todate"
                      :first-day-of-week="1"
                      lang="en"
                    ></date-picker>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <apexchart
                  type="bar"
                  ref="chart"
                  class="apex-charts"
                  dir="ltr"
                  height="400"
                  :options="chartOptions"
                  :series="series"
                >
                </apexchart>
              </div>
            </div>
          </div>
          <div class="card" style="background-color: beige; padding: 10px">
            <div class="card-body">
              <h4 class="card-title mb-4">Data Analytics 2</h4>
              <h5 class="card-title mb-4">SUMMARY OF CONCODANCE BY FACILITY</h5>
              <div class="mt-3">
                <div>
                  <apexchart
                    ref="chart2"
                    type="scatter"
                    :options="Options"
                    :series="chartSeries"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end card-body-->
    </div>
    <!-- end card-->
    <!--card 2-->
    <!-- <div class="row">
      <Topfacilities />
      <Activity />
      <Activity2 />
    </div> -->
  </div>
  <!-- end col-->
</template>
