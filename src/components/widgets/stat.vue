<script>
import countTo from "vue-count-to";
import Swal from "sweetalert2";
import axios from "axios";
export default {
  components: {
    countTo,
  },
  data() {
    return {
      series: [
        {
          data: [25, 66, 41, 89, 63, 25, 44, 20, 36, 40, 54],
        },
      ],
      chartOptions: {
        fill: {
          colors: ["#5b73e8"],
        },
        chart: {
          type: "bar",
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
          },
        },
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        xaxis: {
          crosshairs: {
            width: 1,
          },
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          x: {
            show: false,
          },
          y: {
            title: {
              formatter: function () {
                return "";
              },
            },
          },
          marker: {
            show: false,
          },
        },
      },
      growthChartOptions: {
        fill: {
          colors: ["#f1b44c"],
        },
        chart: {
          type: "bar",
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
          },
        },
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        xaxis: {
          crosshairs: {
            width: 1,
          },
        },
        tooltip: {
          fixed: {
            enabled: false,
          },
          x: {
            show: false,
          },
          y: {
            title: {
              formatter: function () {
                return "";
              },
            },
          },
          marker: {
            show: false,
          },
        },
      },
      counties: [41],
      CountyRadial: {
        fill: {
          colors: ["#34c38f"],
        },
        chart: {
          sparkline: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: "60%",
            },
            track: {
              margin: 0,
            },
            dataLabels: {
              show: false,
            },
          },
        },
      },
      facilties: [55],
      FacilityRadial: {
        fill: {
          colors: ["#5b73e8"],
        },
        chart: {
          sparkline: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: "60%",
            },
            track: {
              margin: 0,
            },
            dataLabels: {
              show: false,
            },
          },
        },
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios
        .get(`insights/assets/`)
        .then((response) => {
          this.counties = [response.data[0].counties];
          this.facilities = [response.data[0].facilities];
          console.log(this.counties);
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "" + e,
            showConfirmButton: true,
          }).then((e) => {
            Swal.close(e);
          });
        });
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col-md-6 col-xl-3">
      <div class="card">
        <div class="card-body">
          <div class="float-end mt-2">
            <apexchart class="apex-charts" dir="ltr" width="70" height="40" :options="chartOptions" :series="series">
            </apexchart>
          </div>
          <div>
            <h4 class="mb-1 mt-1">
              <span data-plugin="counterup">
                <countTo :startVal="47" :endVal="counties" :duration="3000"></countTo>
              </span>
            </h4>
            <p class="text-muted mb-0">Counties Synced</p>
          </div>
          <p class="text-muted mt-3 mb-0">
            <span class="text-success me-1">
              <i class="mdi mdi-arrow-up-bold me-1"></i>2.65%
            </span>
            since last week
          </p>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card">
        <div class="card-body">
          <div class="float-end mt-2">
            <apexchart class="apex-charts" type="radialBar" dir="ltr" width="45" height="45" :options="orderRadial"
              :series="counties"></apexchart>
          </div>
          <div>
            <h4 class="mb-1 mt-1">
              <span data-plugin="counterup">
                <countTo :startVal="100" :endVal="facilities" :duration="2000"></countTo>
              </span>
            </h4>
            <p class="text-muted mb-0">Total Facilities Synced</p>
          </div>
          <p class="text-muted mt-3 mb-0">
            <span class="text-success me-1">
              <i class="mdi mdi-arrow-up-bold me-1"></i>0.82%
            </span>
            since last week
          </p>
        </div>
      </div>
    </div>
    <!-- end col-->

    <div class="col-md-6 col-xl-3">
      <div class="card">
        <div class="card-body">
          <div class="float-end mt-2">
            <apexchart class="apex-charts" type="radialBar" dir="ltr" width="45" height="45" :options="FacilityRadial"
              :series="facilties"></apexchart>
          </div>
          <div>
            <h4 class="mb-1 mt-1">
              <span data-plugin="counterup">
                <countTo :startVal="1000" :endVal="148" :duration="2000"></countTo>
              </span>
            </h4>
            <p class="text-muted mb-0">Sub Counties Synced</p>
          </div>
          <p class="text-muted mt-3 mb-0">
            <span class="text-success me-1">
              <i class="mdi mdi-arrow-up-bold me-1"></i>6.24%
            </span>
            since last week
          </p>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-xl-3">
      <div class="card">
        <div class="card-body">
          <div class="float-end mt-2">
            <apexchart class="apex-charts" dir="ltr" width="70" height="40" :options="growthChartOptions"
              :series="series"></apexchart>
          </div>
          <div>
            <h4 class="mb-1 mt-1">
              +
              <span data-plugin="counterup">12.58</span>%
            </h4>
            <p class="text-muted mb-0">New Facilities Discovered</p>
          </div>
          <p class="text-muted mt-3 mb-0">
            <span class="text-success me-1">
              <i class="mdi mdi-arrow-up-bold me-1"></i>10.51%
            </span>
            since last week
          </p>
        </div>
      </div>
    </div>
    <!-- end col-->
  </div>
  <!-- end row-->
</template>
