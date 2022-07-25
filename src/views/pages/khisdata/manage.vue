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
import Multiselect from "vue-multiselect";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
/**
 * Invoice-list component
 */
const newheaders = window.$headers;
newheaders["Content-Type"] = "multipart/form-data";
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
  components: {
    Layout,
    PageHeader,
    countTo,
    DatePicker,
    reportdet,
    Multiselect,
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      stoped: true,
      showme: true,
      synched: 0,
      waiting: 0,
      failed: 0,
      scheduled: 0,
      title: "KHIS Data",
      files: new FormData(),
      file: "",
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 1024,
        includeStyling: true,
        addRemoveLinks: true,
        headers: newheaders,
      },
      items: [
        {
          text: "KHIS Data",
        },
        {
          text: "Data Sync",
          active: true,
        },
      ],
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
      date_range: "",
      exported: 0,
      status: "0",
      totalrecords: 0,
      records: [],
      sheduledesc: "Weekly data sync",
      scheduleTime: new Date().getTime(),
      weekdays: false,
      sync_m: 0,
      sync_t: 0,
      sync_w: 0,
      sync_th: 0,
      sync_f: 0,
      sync_s: 0,
      sync_su: 0,
      scheduleday: "Monday",
      Days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
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
      total: 0,
      currentPage: 1,
      perPage: 100,
      pageOptions: [
        10, 25, 50, 100, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500,
        5000, 5500, 6000,
      ],
      showsync: true,
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: false,
      schedules: [],
      editmode: false,
      modaltitle: "Schedules",
      tab1: true,
      tab2: false,
      tab3: false,
      schedulefields: [
        {
          key: "check",
          label: "#",
          sortable: true,
        },
        {
          key: "id",
          sortable: true,
        },
        {
          key: "shedule_description",
          label: "Description",
          sortable: true,
        },
        {
          key: "sync_time",
          label: "Time",
          sortable: true,
        },
        {
          key: "days",
          sortable: true,
        },
        "action",
      ],
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
    srows() {
      return this.schedules.length;
    },
  },
  watch: {},
  mounted() {
    // Set the initial number of items
    this.upadtearray();
    this.getTotalRecords();
    this.updateDataSync();
    this.totalRows = this.items.length;
  },
  methods: {
    /**
     * Search the table data with search input
     */
    handleFileUpload() {
      //this.file = this.$refs.file.files[0];
      this.file = event.target.files[0];
    },
    vfileAdded() {
      this.file = this.$refs.myVueDropzone.getAcceptedFiles()[0];
      console.log(this.$refs.myVueDropzone.getAcceptedFiles()[0]); //your origin image data url
    },
    submitFile() {
      let formData = new FormData();
      formData.append("file", this.file);
      axios
        .post(window.$http + "listfiles/", formData, {
          headers: newheaders,
        })
        .then((response) => {
          console.log(response.data);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "File submitted successfully!",
            html: "Please click on the Mapping tab to initiate data mapping",
            showConfirmButton: false,
            timer: 3000,
          });
          this.tab2 = true;
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
    triggerMapping() {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Please wait...",
        html: "Data mapping in progress..",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      setInterval(() => {
        5000;
        if (this.tab2 == true) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Done!",
            html: "Data mapping complete!",
            showConfirmButton: false,
            timer: 3000,
          });
          this.tab3 = true;
        }
      }, 10000);
      this.tab2 = false;
    },
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
    getTotalRecords() {
      axios
        .get(window.$http + "total_records_count/", {
          headers: window.$headers,
        })
        .then((res) => {
          console.log(res.data);
          this.totalrecords = Number(res.data.totalrecords);
          this.waiting = Number(this.totalrecords - this.synched);
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
              this.waiting = Number(this.totalrecords - this.synched);
            })
            .then(() => {
              axios
                .get(window.$http + "listschedules/", {
                  headers: window.$headers,
                })
                .then((res) => {
                  console.log(res.data);
                  this.schedules = res.data;
                });
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
    schedule() {
      this.modaltitle = "Add Schedule";
      console.log(this.scheduleTime);
      if (this.weekdays) {
        this.sync_m = 1;
        this.sync_t = 1;
        this.sync_w = 1;
        this.sync_th = 1;
        this.sync_f = 1;
        this.sync_s = 1;
        this.sync_su = 1;
      } else {
        if (this.scheduleday.includes("Monday")) {
          this.sync_m = 1;
        } else {
          this.sync_m = 0;
        }
        if (this.scheduleday.includes("Tuesday")) {
          this.sync_t = 1;
        } else {
          this.sync_t = 0;
        }
        if (this.scheduleday.includes("Wednesday")) {
          this.sync_w = 1;
        } else {
          this.sync_w = 0;
        }
        if (this.scheduleday.includes("Thursday")) {
          this.sync_th = 1;
        } else {
          this.sync_th = 0;
        }
        if (this.scheduleday.includes("Friday")) {
          this.sync_f = 1;
        } else {
          this.sync_f = 0;
        }
        if (this.scheduleday.includes("Saturday")) {
          this.sync_s = 1;
        } else {
          this.sync_s = 0;
        }
        if (this.scheduleday.includes("Sunday")) {
          this.sync_su = 1;
        } else {
          this.sync_su = 0;
        }
      }
      var data = {
        shedule_description: this.sheduledesc,
        sync_time: this.scheduleTime,
        sync_m: this.sync_m,
        sync_t: this.sync_t,
        sync_w: this.sync_w,
        sync_th: this.sync_th,
        sync_f: this.sync_f,
        sync_s: this.sync_s,
        sync_su: this.sync_su,
      };
      console.log(data);
      axios
        .post(window.$http + "listschedules/", data, {
          headers: window.$headers,
        })
        .then((response) => {
          console.log(response.data);
          Swal.fire({
            title: "Success!",
            html: "Your work has been saved!",
            icon: "success",
            showCancelButton: true,
          });
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "danger",
            title: "Error!",
            html: e,
            showConfirmButton: true,
          });
        });
    },
    handleSubmit() {
      console.log("Errot on submit");
    },
    edit(index, id, shedule_description, sync_time) {
      this.modaltitle = "Edit Schedule";
      this.editmode = true;
      this.id = id;
      this.scheduledesc = shedule_description;
      this.scheduleTime = sync_time;
    },
    editrec() {
      if (this.weekdays) {
        this.sync_m = 1;
        this.sync_t = 1;
        this.sync_w = 1;
        this.sync_th = 1;
        this.sync_f = 1;
        this.sync_s = 1;
        this.sync_su = 1;
      } else {
        if (this.scheduleday.includes("Monday")) {
          this.sync_m = 1;
        } else {
          this.sync_m = 0;
        }
        if (this.scheduleday.includes("Tuesday")) {
          this.sync_t = 1;
        } else {
          this.sync_t = 0;
        }
        if (this.scheduleday.includes("Wednesday")) {
          this.sync_w = 1;
        } else {
          this.sync_w = 0;
        }
        if (this.scheduleday.includes("Thursday")) {
          this.sync_th = 1;
        } else {
          this.sync_th = 0;
        }
        if (this.scheduleday.includes("Friday")) {
          this.sync_f = 1;
        } else {
          this.sync_f = 0;
        }
        if (this.scheduleday.includes("Saturday")) {
          this.sync_s = 1;
        } else {
          this.sync_s = 0;
        }
        if (this.scheduleday.includes("Sunday")) {
          this.sync_su = 1;
        } else {
          this.sync_su = 0;
        }
      }
      var data = {
        shedule_description: this.sheduledesc,
        sync_time: this.scheduleTime,
        sync_m: this.sync_m,
        sync_t: this.sync_t,
        sync_w: this.sync_w,
        sync_th: this.sync_th,
        sync_f: this.sync_f,
        sync_s: this.sync_s,
        sync_su: this.sync_su,
      };
      axios
        .put(window.$http + "listschedules/" + this.id + "/", data, {
          headers: window.$headers,
        })
        .then((res) => {
          console.log(res.data);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: true,
            timer: 3000,
          });
          this.$bvModal.hide("modal-schedule");
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "danger",
            title: "Error!",
            html: e,
            showConfirmButton: true,
          });
        });
    },
    deleterec(index, id, desc) {
      //alert(rolename);
      this.id = id;
      Swal.fire({
        title:
          "Are you sure, you want to delete " + desc + "#id:" + this.id + "?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, delete it!",
      })
        .then((result) => {
          if (result.value) {
            axios.delete(
              window.$http + "listschedules/" + this.id,
              { delete_status: 1 },
              { headers: window.$headers }
            );
            this.orderData.splice(index, 1);
            //this.$delete(this.orderData, this.id - 1);
            Swal.fire("Deleted!", this.desc + " has been deleted.", "success");
          }
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "danger",
            title: "Error!",
            html: e,
            showConfirmButton: true,
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
          this.stoped = true;
          this.getTotalRecords();
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
              class="btn btn-secondary waves-effect waves-light uil-search-alt text-white outline-dark"
              @click="search()"
            >
              Search
            </button>
          </label>
        </div>
      </div>
      <div class="col-sm-6 col-md-2">
        <b-button
          variant="outline-dark bg-secondary text-white uil uil-sync"
          @click="Sync()"
          v-show="showsync"
          >Sync Data</b-button
        >
        <b-button
          variant="outline-dark bg-danger text-white uil uil-stop-circle"
          @click="Stop()"
          v-show="!showsync"
          >Stop Sync</b-button
        >
      </div>
      <div class="col-sm-6 col-md-2">
        <b-button
          variant="outline-dark"
          class="btn btn-secondary waves-effect waves-light uil-clock text-white"
          v-b-modal.modal-schedule
          @click="[(editmode = false), (modaltitle = 'Add Schedule')]"
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
                      class="btn btn-secondary waves-effect waves-light uil-export btn-outline-dark"
                      @click="getrpt()"
                    >
                      Export to CSV
                    </button>
                  </div>

                  <div class="col-sm-2">
                    <button
                      @click="printpdf('p')"
                      v-b-modal.modal-Print
                      class="btn btn-secondary waves-effect waves-light uil-file-alt outline-dark"
                    >
                      Print PDF
                    </button>
                  </div>
                  <div class="col-sm-2">
                    <button
                      v-b-modal.data-mapping
                      class="btn btn-secondary waves-effect waves-light uil-database-alt outline-dark"
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
                            <template v-slot:cell(action)>
                              <ul class="list-inline mb-0">
                                <li class="list-inline-item">
                                  <a
                                    href="javascript:void(0);"
                                    class="px-2 text-primary"
                                    v-b-tooltip.hover
                                    title="Edit"
                                    v-b-modal.modal-Edit
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
    <b-modal
      id="modal-schedule-table"
      title="Manage Schedule"
      hide-footer
      size="xl"
      centered
    >
      <div class="col-xl-12">
        <div class="card mb-0">
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
                          :items="schedules"
                          :fields="schedulefields"
                          responsive="sm"
                          :per-page="perPage"
                          :current-page="currentPage"
                          :sort-by.sync="sortBy"
                          :sort-desc.sync="sortDesc"
                          :filter="filter"
                          :filter-included-fields="filterOn"
                          @filtered="onFiltered"
                        >
                          <template v-slot:cell(check)="data">
                            <div class="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                :id="`contacusercheck${data.item.id}`"
                              />
                              <label
                                class="custom-control-label"
                                :for="`contacusercheck${data.item.id}`"
                              ></label>
                            </div>
                          </template>
                          <template v-slot:cell(days)="data">
                            <a
                              href="javascript: void(0);"
                              class="text-dark fw-bold"
                              ><span v-if="data.item.sync_m == 1"
                                >{{ "M" }},</span
                              ><span v-if="data.item.sync_t == 1"
                                >{{ "T" }},</span
                              ><span v-if="data.item.sync_w == 1"
                                >{{ "W" }},</span
                              ><span v-if="data.item.sync_th == 1"
                                >{{ "TH" }},</span
                              ><span v-if="data.item.sync_f == 1"
                                >{{ "F" }},</span
                              ><span v-if="data.item.sync_s == 1"
                                >{{ "S" }},</span
                              ><span v-if="data.item.sync_su == 1">{{
                                "SU"
                              }}</span>
                            </a>
                          </template>
                          <template v-slot:cell(action)="data">
                            <ul class="list-inline mb-0">
                              <li class="list-inline-item">
                                <a
                                  href="javascript:void(0);"
                                  class="px-2 text-primary"
                                  v-b-tooltip.hover
                                  title="Edit"
                                  v-b-modal.modal-schedule
                                  @click="
                                    edit(
                                      data.index,
                                      data.item.id,
                                      data.item.shedule_description,
                                      data.item.sync_time,
                                      data.item.sync_m,
                                      data.item.sync_t,
                                      data.item.sync_w,
                                      data.item.sync_th,
                                      data.item.sync_f,
                                      data.item.sync_s,
                                      data.item.sync_su
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
                                      data.item.shedule_description
                                    )
                                  "
                                >
                                  <i class="uil uil-trash-alt font-size-18"></i>
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
                                :total-rows="srows"
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
        </div>
      </div>
    </b-modal>
    <b-modal
      id="modal-schedule"
      :title="modaltitle"
      hide-footer
      size="lg"
      centered
    >
      <div class="col-xl-8">
        <div class="card mb-0">
          <b-tabs content-class="p-4" justified class="nav-tabs-custom">
            <b-tab active>
              <form @submit.prevent="handleSubmit">
                <div class="row">
                  <div class="col-sm-6">
                    <b-form-group
                      class="mb-3"
                      label="Schedule Description"
                      label-for="desc-input"
                    >
                      <input
                        class="form-control"
                        type="text"
                        :placeholder="sheduledesc"
                        v-model="sheduledesc"
                      />
                    </b-form-group>
                  </div>
                  <div class="col-sm-6 pt-4">
                    <b-form-checkbox
                      id="checkbox-1"
                      name="checkbox-1"
                      v-model="weekdays"
                      unchecked-value="false"
                      >&nbsp; Week Days
                    </b-form-checkbox>
                  </div>
                  <div class="col-sm-6">
                    <b-form-group
                      class="mb-3"
                      label="Schedule Time"
                      label-for="backupTime-input"
                    >
                      <b-form-timepicker
                        v-model="scheduleTime"
                        locale="en"
                      ></b-form-timepicker>
                    </b-form-group>
                  </div>
                  <div class="col-sm-6" v-show="weekdays">
                    <span v-show="weekdays">M,T,W,TH,S,SU</span>
                  </div>
                  <div class="col-sm-6" v-show="!weekdays">
                    <b-form-group
                      class="mb-3"
                      label="Schedule Days"
                      label-for="ScheduleDay-input"
                    >
                      <multiselect
                        v-model="scheduleday"
                        :options="Days"
                        placeholder="Monday"
                        :multiple="true"
                        :editable="true"
                      ></multiselect>
                    </b-form-group>
                  </div>
                </div>
              </form>
            </b-tab>
          </b-tabs>
          <!-- Nav tabs -->
          <!-- Tab content -->
        </div>
      </div>
      <div class="row">
        <div class="col-sm-0 mb-2 mt-2"></div>
        <div class="col-sm-0 mb-2">
          <b-button v-show="!editmode" variant="dark" @click="schedule()"
            >Add Schedule</b-button
          >&nbsp;
          <b-button
            variant="dark"
            v-b-modal.modal-schedule-table
            @click="$bvModal.hide('modal-schedule')"
            v-show="!editmode"
            >Manage Schedule</b-button
          >
          <b-button v-show="editmode" variant="dark" @click="editrec()"
            >Edit Schedule</b-button
          >
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
    <b-modal
      id="data-mapping"
      title="Data Mapping"
      header-class="bg-secondary bg-gradient bg-opacity-50"
      hide-footer
      modal-class=""
      size="xl"
      centered
    >
      <div>
        <!-- <PageHeader :title="title" :items="items" /> -->
        <div class="row mb-4">
          <div class="col-xl-4">
            <div class="card h-100">
              <div class="card-body bg-secondary bg-gradient bg-opacity-75">
                <div class="text-center">
                  <div>
                    <img
                      src="@/assets/images/datamapping.png"
                      alt
                      class="img-fluid m-auto"
                    />
                  </div>
                </div>

                <div class="text-muted"></div>
              </div>
            </div>
          </div>
          <div class="col-xl-8">
            <div class="card mb-0">
              <b-tabs content-class="p-4" justified class="nav-tabs-custom">
                <b-tab :active="tab1">
                  <template v-slot:title class="">
                    <i class="uil uil-file-alt font-size-20"></i>
                    <span class="d-none d-sm-block">Upload File</span>
                  </template>
                  <div>
                    <div>
                      <div class="row d-flex flex-row">
                        <div class="col-lg-6 col-md-3">
                          <div class="my-3">Upload Datim Data Mapping File</div>
                          <vue-dropzone
                            id="dropzone"
                            ref="myVueDropzone"
                            :use-custom-slot="true"
                            :options="dropzoneOptions"
                            @vdropzone-file-added="vfileAdded"
                            @vdropzone-success="vfileAdded"
                          >
                            <div class="dropzone-custom-content">
                              <i
                                class="display-4 text-muted bx bxs-cloud-upload"
                              ></i>
                              <h4>Drop files here or click to upload.</h4>
                            </div>
                          </vue-dropzone>
                        </div>
                        <div class="col-lg-6 m-auto">
                          <div class="mt-lg-5">
                            <b-button
                              type="submit"
                              variant="dark"
                              class="uil uil-upload-alt m-4"
                              @click="submitFile()"
                              >Finish Upload</b-button
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab>
                <b-tab :active="tab2">
                  <template v-slot:title class="">
                    <i class="uil uil-database-alt font-size-20"></i>
                    <span class="d-none d-sm-block">Mapping</span>
                  </template>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="border-top">
                        <div class="row">
                          <div class="col-md-12">
                            <div class="card">
                              <div class="card-body">
                                <div class="row">
                                  <div
                                    class="input-group-text col-sm-12 m-auto"
                                  >
                                    Proceed to Map Data
                                  </div>
                                  <div class="row">
                                    <div class="col-sm-6 mb-2">
                                      <div class="border-top">
                                        <div class="mt-lg-5">
                                          <b-button
                                            type="submit"
                                            variant="dark"
                                            class="uil uil-database-alt"
                                            @click="triggerMapping()"
                                            >Initiate Data Mapping</b-button
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab>
                <b-tab :active="tab3">
                  <template v-slot:title class="">
                    <i class="uil uil-download-alt font-size-20"></i>
                    <span class="d-none d-sm-block">Download Mapped File</span>
                  </template>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="border-top">
                        <div class="row">
                          <div class="col-md-12">
                            <div class="card">
                              <div class="card-body">
                                <div class="row">
                                  <div class="input-group-text col-sm-12">
                                    Generate Final PDF | CSV document for Mapped
                                    File
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!----@click="position(), $bvModal.hide('modal-1') --->
                            <div class="row">
                              <div class="col-sm-12 mb-2 d-flex flex-row">
                                <div class="col-sm-3 mb-2">
                                  <b-button
                                    variant="dark"
                                    @click="
                                      generatePDF('Excel'),
                                        $bvModal.hide('modal-1')
                                    "
                                    >Print Excel
                                  </b-button>
                                </div>
                                <div class="col-sm-3 mb-2">
                                  <b-button
                                    variant="dark"
                                    @click="
                                      generatePDF('pdf'),
                                        $bvModal.hide('modal-1')
                                    "
                                    >Print PDF
                                  </b-button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab>
              </b-tabs>
              <!-- Nav tabs -->
              <!-- Tab content -->
            </div>
          </div>
        </div>
        <!-- end row -->
      </div>
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
