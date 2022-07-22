<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Swal from "sweetalert2";
//import VueGoogleAutocomplete from "vue-google-autocomplete";
import axios from "axios";
import countTo from "vue-count-to";
import DatePicker from "vue2-datepicker";
import reportdet from "@/components/report/header";

/**
 * Invoice-list component
 */
export default {
  page: {
    title: "Data Sync",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: { Layout, PageHeader, countTo, DatePicker, reportdet },
  data() {
    return {
      stoped: true,
      showme: true,
      synched: 0,
      waiting: 0,
      failed: 0,
      scheduled: 0,
      title: "KHIS Data",
      items: [
        {
          text: "KHIS Data",
        },
        {
          text: "Data Sync",
          active: true,
        },
      ],
      //parking
      query: "",
      capacity: "12",
      location: window.navigator.lat + "," + window.location.lng,
      name: "",
      category: "Available",
      avslots: "12",
      cat: ["Available", "Busy"],
      /**
       * When the location found
       *        */
      //end
      addressData: {},
      placeResultData: {},
      contid: "",
      id: "",
      myindex: "",
      from: new Date(),
      to: new Date(),
      time: new Date().getTime(),
      patientName: "test1",
      patientDiagnosis: "testing",
      homeCounty: "kisumu",
      delete_status: 0,
      date_range: "",
      exported: 0,
      status: "0",
      records: [
        {
          id: "#MN0131",
          patienId: "#2536",
          status: "0",
        },
      ],
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
      orderseries: [70],
      orderRadial: {
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
      customerseries: [55],
      customerRadial: {
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
      totalRows: 1,
      totalrecords: 0,
      currentPage: 1,
      perPage: 100,
      pageOptions: [
        10, 25, 50, 100, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500,
        5000, 5500, 6000,
      ],
      showsync: true,
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
      fields: [
        {
          key: "check",
          label: "#",
        },
        {
          key: "id",
          label: "Indicator ID",
          sortable: true,
        },
        {
          key: "name",
          sortable: true,
        },
        {
          key: "shortName",
          sortable: true,
        },
        {
          key: "lastUpdated",
          sortable: true,
        },
        {
          key: "created",
          sortable: true,
        },

        {
          key: "action",
        },
      ],
    };
  },
  created() {
    setInterval(() => {
      if (this.stoped && !this.showsync) {
        this.upadtearray();
      }
    }, 5000);
    //this.upadtearray();
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.records.length;
    },
  },
  watch: {},
  mounted() {
    // Set the initial number of items
    this.upadtearray();
    this.updateDataSync();
    this.totalRows = this.items.length;
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    printpdf(pl) {
      this.pl = pl;
      const data = this.records.map((row) => ({
        "MOH Indicator ID": row.id,
        "MOH Indicator Name": row.name,
        "Short Name": row.shortName,
      }));

      //get headers
      const headers = Object.keys(data[0]);
      const cars = [];
      Object.entries(data).forEach((val) => {
        const [key] = val;
        // console.log(key, value);
        cars.push(Object.values(data[key]));
      });

      const uniqueCars = Array.from(new Set(cars));
      this.headers = headers;
      this.uniqueCars = uniqueCars;
      this.records = data;
      //alert(headers);
    },
    getrpt() {
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      const date = d.getDate();

      const hour = d.getHours();
      const min = d.getMinutes();
      const sec = d.getSeconds();
      const msec = d.getMilliseconds();
      const filename =
        year +
        "-" +
        month +
        "-" +
        date +
        "-" +
        hour +
        "-" +
        min +
        "-" +
        sec +
        "-" +
        msec;
      //alert(filename);
      const data = this.records.map((row) => ({
        "DATIM Indicator Category": "HTS_TST",
        "DATIM Indicator ID": "",
        DATIM_Disag_Name: "",
        DATIM_Disag_ID: "",
        Operation: "",
        "MOH Indicator Name": row.name,
        MOH_Indicator_ID: row.id,
        MOH_Disag_Name: "",
        MOH_Disag_ID: "",
        "Disaggregation Type": "Coarse",
      }));
      //alert("");
      const csvRows = [];
      //get headers
      const headers = Object.keys(data[0]);

      csvRows.push(headers.join(","));
      //alert(csvRows);
      //loop over the headers
      for (const row of data) {
        const values = headers.map((header) => {
          const escaped = ("" + row[header]).replace(/"/g, '\\"');
          // alert(escaped);
          return '"' + escaped + '"'; //'" + escaped + "';
        });
        csvRows.push(values.join(","));
      }
      //alert(csvData);
      const csvData = csvRows.join("\n");
      //alert(csvData);

      const blob = new Blob([csvData], { type: "textcsv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", this.title + filename + ".csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    getmonth(d) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthNames[d];
    },
    getcurrentdate(mydate) {
      let d = new Date(mydate);
      let year = d.getFullYear();
      let month = this.getmonth(d.getMonth());
      let date = d.getDate();
      date = this.getv(date);
      //month = this.getv(month);

      let hour = d.getHours();
      let min = d.getMinutes();
      let sec = d.getSeconds();
      hour = this.getv(hour);
      min = this.getv(min);
      sec = this.getv(sec);

      //const msec = d.getMilliseconds();
      const datetime =
        date + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
      return datetime;
    },
    getv(val) {
      if (val < 10) {
        val = "0" + val;
      }
      return val;
    },
    upadtearray() {
      axios
        .get(window.$http + "indicators/" + this.perPage, {
          headers: window.$headers,
        })
        .then((res) => {
          console.log(res.data);
          this.records = res.data;
        })
        .then(() => {
          axios
            .get(window.$http + "indicatorscount/", {
              headers: window.$headers,
            })
            .then((res) => {
              console.log(res.data);
              this.synched = Number(res.data.total);
              this.totalrecords = Number(res.data.total);
            });
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Error!",
            html: "" + e,
            showConfirmButton: true,
            timer: 3000,
          });
        });
    },
    updateDataSync() {
      axios
        .get(window.$http + "listmiddleware_settings/1/", {
          headers: window.$headers,
        })
        .then((res) => {
          console.log(res.data);
          this.showsync = res.data.syncdata;
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Error!",
            html: "" + e,
            showConfirmButton: true,
            timer: 3000,
          });
        });
    },
    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
    Sync() {
      this.stoped = true;
      this.showsync = false;
      axios
        .put(
          window.$http + "listmiddleware_settings/1/",
          {
            id: 1,
            syncdata: true,
            client_url: "https://test.hiskenya.org/dhiske/",
          },
          {
            headers: window.$headers,
          }
        )
        .then((res) => {
          console.log(res.data);
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Success!",
            html: "Data Sync triggered!",
            showConfirmButton: false,
            timer: 3000,
          });
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Error!",
            html: "" + e,
            showConfirmButton: true,
            timer: 3000,
          });
        });
    },
    Stop() {
      this.stoped = false;
      this.showsync = true;
      axios
        .put(
          window.$http + "listmiddleware_settings/1/",
          {
            id: 1,
            syncdata: false,
            client_url: "https://test.hiskenya.org/dhiske/",
          },
          {
            headers: window.$headers,
          }
        )
        .then((res) => {
          console.log(res.data);
          Swal.fire({
            position: "center",
            icon: "info",
            title: "Success!",
            html: "Data Sync stopped!",
            showConfirmButton: false,
            timer: 3000,
          });
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Error!",
            html: "" + e,
            showConfirmButton: true,
            timer: 3000,
          });
        });
    },
    search(fromdate, todate) {
      fromdate = this.formatDate(this.from);
      todate = this.formatDate(this.to);
      axios
        .get(
          window.$http +
            "indicators/filter/" +
            fromdate +
            "/" +
            todate +
            "/" +
            this.perPage,
          {
            headers: window.$headers,
          }
        )
        .then((res) => {
          console.log(res.data);
          this.records = res.data;
          this.synched = Number(res.data.length);
          this.totalrecords = Number(res.data.length);
          this.stoped = true;
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Error!",
            html: "" + e,
            showConfirmButton: true,
            timer: 3000,
          });
        });
    },
  },
  middleware: "authentication",
  //    capacity = models.IntegerField()
  //     location = models.PointField(blank=True, null=True)
  //     name = models.CharField(max_length=120)
  //     category = models.CharField(max_length=20,choices=CHOICES_TYPE, default=1)
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-6 col-xl-3">
            <div class="card">
              <div class="card-body">
                <div class="float-end mt-2">
                  <apexchart
                    class="apex-charts"
                    dir="ltr"
                    width="70"
                    height="40"
                    :options="chartOptions"
                    :series="series"
                  ></apexchart>
                </div>
                <div>
                  <h4 class="mb-1 mt-1">
                    <span data-plugin="counterup">
                      <countTo
                        :startVal="1"
                        :endVal="synched"
                        :duration="1"
                      ></countTo>
                    </span>
                  </h4>
                  <p class="text-muted mb-0">Synced</p>
                </div>
                <p class="text-muted mt-3 mb-0">
                  <span
                    class="text-success me-1"
                    :class="{
                      'text-danger': waiting > synched,
                    }"
                  >
                    <i
                      class="mdi mdi-arrow-down-bold me-1"
                      :class="{
                        'mdi mdi-arrow-up-bold': waiting < synched,
                      }"
                    ></i
                    >{{ ((synched / totalrecords) * 100).toFixed(2) }}%
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
                  <apexchart
                    class="apex-charts"
                    type="radialBar"
                    dir="ltr"
                    width="45"
                    height="45"
                    :options="orderRadial"
                    :series="orderseries"
                  ></apexchart>
                </div>
                <div>
                  <h4 class="mb-1 mt-1">
                    <span data-plugin="counterup">
                      <countTo
                        :startVal="1"
                        :endVal="waiting"
                        :duration="1"
                      ></countTo>
                    </span>
                  </h4>
                  <p class="text-muted mb-0">Waiting</p>
                </div>
                <p class="text-muted mt-3 mb-0">
                  <span
                    class="text-success me-1"
                    :class="{
                      'text-danger': waiting < synched,
                    }"
                  >
                    <i
                      class="mdi mdi-arrow-down-bold me-1"
                      :class="{
                        'mdi mdi-arrow-up-bold': waiting > synched,
                      }"
                    ></i
                    >{{ ((waiting / totalrecords) * 100).toFixed(2) }}%
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
                  <apexchart
                    class="apex-charts"
                    type="radialBar"
                    dir="ltr"
                    width="45"
                    height="45"
                    :options="customerRadial"
                    :series="customerseries"
                  ></apexchart>
                </div>
                <div>
                  <h4 class="mb-1 mt-1">
                    <span data-plugin="counterup">
                      <countTo
                        :startVal="1000"
                        :endVal="0"
                        :duration="2000"
                      ></countTo>
                    </span>
                  </h4>
                  <p class="text-muted mb-0">Failed</p>
                </div>
                <p class="text-muted mt-3 mb-0">
                  <span class="text-danger me-1">
                    <i class="mdi mdi-arrow-down-bold me-1"></i>0.00%
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
                  <apexchart
                    class="apex-charts"
                    dir="ltr"
                    width="70"
                    height="40"
                    :options="growthChartOptions"
                    :series="series"
                  ></apexchart>
                </div>
                <div>
                  <h4 class="mb-1 mt-1">
                    <span data-plugin="counterup">
                      <countTo
                        :startVal="1000"
                        :endVal="0"
                        :duration="2000"
                      ></countTo>
                    </span>
                  </h4>
                  <p class="text-muted mb-0">Scheduled</p>
                </div>
                <p class="text-muted mt-3 mb-0">
                  <span class="text-danger me-1">
                    <i class="mdi mdi-arrow-down-bold me-1"></i>0.00%
                  </span>
                  since last week
                </p>
              </div>
            </div>
          </div>
          <!-- end col-->
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div id="tickets-table_length" class="dataTables_length">
          <label class="d-inline-flex align-items-center fw-normal">
            Show&nbsp;
            <b-form-select
              v-model="perPage"
              size="sm"
              :options="pageOptions"
            ></b-form-select
            >&nbsp;entries
          </label>
        </div>
      </div>
      <!-- Search -->
      <div class="col-sm-12 col-md-6">
        <div id="tickets-table_filter" class="dataTables_filter text-md-end">
          <label class="d-inline-flex align-items-center fw-normal">
            Search:
            <b-form-input
              v-model="filter"
              type="search"
              class="form-control form-control-sm ms-2"
            ></b-form-input>
          </label>
        </div>
      </div>
      <!-- End search -->
    </div>

    <div class="row">
      <div class="col-sm-6 col-md-2">
        <div id="tickets-table-date-picker" class="dataTables_length">
          <label class="d-inline-flex align-items-center fw-normal">
            From&nbsp;
            <date-picker v-model="from" type="date"></date-picker>
          </label>
        </div>
      </div>
      <div class="col-sm-6 col-md-2">
        <div id="tickets-table-date-picker" class="dataTables_length">
          <label class="d-inline-flex align-items-center fw-normal">
            To&nbsp;
            <date-picker v-model="to" type="date"></date-picker>
          </label>
        </div>
      </div>
      <div class="col-sm-6 col-md-2">
        <div id="tickets-table-date-picker" class="dataTables_length">
          <label class="d-inline-flex align-items-center fw-normal">
            Range&nbsp;
            <date-picker v-model="time_range" range></date-picker>
          </label>
        </div>
      </div>
      <div class="col-sm-6 col-md-2">
        <div id="tickets-table-date-picker" class="dataTables_length">
          <label class="d-inline-flex align-items-center fw-normal">
            <button
              class="btn btn-info waves-effect waves-light uil-search-alt text-white"
              @click="search()"
            >
              Search
            </button>
          </label>
        </div>
      </div>
      <div class="col-sm-6 col-md-2">
        <b-button
          variant="outline-primary bg-primary text-white"
          @click="Sync()"
          v-show="showsync"
          >Sync Data</b-button
        >
        <b-button
          variant="outline-danger bg-danger text-white"
          @click="Stop()"
          v-show="!showsync"
          >Stop Sync</b-button
        >
      </div>
      <div class="col-sm-6 col-md-2">
        <b-button
          variant="outline-primary"
          class="btn btn-success waves-effect waves-light uil-focus-add text-white"
          v-b-modal.add-ground
          >&nbsp;Schedule</b-button
        >
      </div>
    </div>
    <div ref="content">
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="card">
              <div class="card-body">
                <div class="row justify-content-between">
                  <div class="col-sm-6">
                    <button
                      class="btn btn-success waves-effect waves-light uil-export"
                      @click="getrpt()"
                    >
                      Export to CSV
                    </button>
                  </div>

                  <div class="col-sm-2">
                    <button
                      @click="printpdf('p')"
                      v-b-modal.modal-Print
                      class="btn btn-success waves-effect waves-light uil-file-alt"
                    >
                      Print PDF
                    </button>
                  </div>
                  <div class="col-sm-2">
                    <button
                      v-b-modal.modal-Edit
                      class="btn btn-success waves-effect waves-light uil-database-alt"
                      @click="clearvalues()"
                    >
                      Indicator Mapping
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <div class="card">
                  <div class="card-body changebg">
                    <div class="row" id="print">
                      <div class="col-12">
                        <div>
                          <div class="float-end">
                            <form class="d-inline-flex mb-3"></form>
                          </div>
                        </div>
                        <div
                          class="table table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline"
                        >
                          <div class="row">
                            <div class="col-sm-12 col-md-6">
                              <div
                                id="tickets-table_length"
                                class="dataTables_length"
                              >
                                <label
                                  class="d-inline-flex align-items-center fw-normal"
                                >
                                  Show&nbsp;
                                  <b-form-select
                                    v-model="perPage"
                                    size="sm"
                                    :options="pageOptions"
                                  ></b-form-select
                                  >&nbsp;entries
                                </label>
                              </div>
                            </div>
                            <!-- Search -->
                            <div class="col-sm-12 col-md-6">
                              <div
                                id="tickets-table_filter"
                                class="dataTables_filter text-md-end"
                              >
                                <label
                                  class="d-inline-flex align-items-center fw-normal"
                                >
                                  Search:
                                  <b-form-input
                                    v-model="filter"
                                    type="search"
                                    placeholder="Search..."
                                    class="form-control form-control-sm ms-2"
                                  ></b-form-input>
                                </label>
                              </div>
                            </div>
                            <!-- End search -->
                          </div>
                          <!-- Table -->

                          <b-table
                            table-class="table table-centered datatable table-card-list"
                            thead-tr-class="bg-transparent"
                            :items="records"
                            :fields="fields"
                            responsive="sm"
                            :per-page="perPage"
                            :current-page="currentPage"
                            :sort-by.sync="sortBy"
                            :sort-desc.sync="sortDesc"
                            :filter="filter"
                            :filter-included-fields="filterOn"
                            @filtered="onFiltered"
                          >
                            <template v-slot:cell(cargo)="data">
                              <a
                                href="javascript: void(0);"
                                class="text-dark fw-bold"
                                v-for="cargo in data.item.cargo_name"
                                :key="cargo"
                                >{{ cargo }} <br
                              /></a>
                            </template>
                            <template v-slot:cell(action)="data">
                              <ul class="list-inline mb-0">
                                <li class="list-inline-item">
                                  <a
                                    href="javascript:void(0);"
                                    class="px-2 text-primary"
                                    v-b-tooltip.hover
                                    title="Edit"
                                    v-b-modal.modal-Edit
                                    @click="
                                      edit(
                                        data.index,
                                        data.item.id,
                                        data.item.cargo_name
                                      )
                                    "
                                  >
                                    <i class="uil uil-pen font-size-18"></i>
                                  </a>
                                </li>
                                <li class="list-inline-item">
                                  <a
                                    href="javascript:void(0);"
                                    class="px-2 text-danger"
                                    v-b-tooltip.hover
                                    title="Delete"
                                    @click="
                                      deleterec(
                                        data.index,
                                        data.item.id,
                                        data.item.cargo_name
                                      )
                                    "
                                  >
                                    <i
                                      class="uil uil-trash-alt font-size-18"
                                    ></i>
                                  </a>
                                </li>
                              </ul>
                            </template>
                          </b-table>
                        </div>
                        <div class="row">
                          <div class="col">
                            <div
                              class="dataTables_paginate paging_simple_numbers float-end"
                            >
                              <ul class="pagination pagination-rounded">
                                <!-- pagination -->
                                <b-pagination
                                  v-model="currentPage"
                                  :total-rows="rows"
                                  :per-page="perPage"
                                ></b-pagination>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!--modals-->
    <b-modal id="add-ground" size="xl" :title="modaltitle">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="mt-4">
                    <h5 class="font-size-14 mb-4">
                      <i class="mdi mdi-arrow-right text-primary me-1"></i>
                      Schedule Data Sync Activity
                    </h5>
                    <form @submit.prevent="add()">
                      <div class="row">
                        <div class="col-md-6">
                          <b-form-group
                            label="Schedule Time:"
                            label-for="formrow-time-input"
                            class="mb-3"
                          >
                            <b-form-input
                              id="formrow-time-input"
                              type="number"
                              :placeholder="new Date()"
                              v-model="time"
                            >
                            </b-form-input>
                          </b-form-group>
                        </div>
                        <div class="col-md-6">
                          <b-form-group
                            label="Indicator Group:"
                            label-for="formrow-idno-input"
                            class="mb-3"
                          >
                            <b-form-input
                              id="formrow-idno-input"
                              type="text"
                              placeholder="XTUW_3yG"
                              v-model="indicatorgroup"
                            ></b-form-input>
                          </b-form-group>
                        </div>
                        <div class="mt-4">
                          <b-button type="submit" variant="primary"
                            ><i class="fa fa-plus"></i> Add Schedule</b-button
                          >
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-Print" title="Print PDF" hide-footer size="bg" centered>
      <reportdet
        :title="title"
        :records="records"
        :pl="pl"
        :headers="headers"
        :uniqueCars="uniqueCars"
        :shome="showme"
        v-show="showme"
      ></reportdet>
    </b-modal>
    <!--end modals-->
    <div class="row">
      <div class="col">
        <div class="dataTables_paginate paging_simple_numbers float-end">
          <ul class="pagination pagination-rounded">
            <!-- pagination -->
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
            ></b-pagination>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
</template>
