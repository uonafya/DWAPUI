<script
  type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js"
></script>
<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import jsPDF from "jspdf";

import DatePicker from "vue2-datepicker";
import Multiselect from "vue-multiselect";

import axios from "../../../Axiosconfig";
import Swal from "sweetalert2";
import reportdet from "@/components/report/header";

export default {
  page: {
    title: "Reporting",
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
    DatePicker,
    Multiselect,
    reportdet,
  },
  data() {
    return {
      hour: "",
      //watch user logs
      viewReports: false,
      printedpdf: true,
      reportfor: "",
      genReportStarted: "",
      printReport: false,
      rpt: "",
      sendEmail:"",
      filter: "",
      hourlydata: "",
      headers: null,
      uniqueCars: null,
      showme: true,
      pl: "",
      orderData: [],
      title: "Reporting",
      items: [
        {
          text: "USER: "+JSON.parse(localStorage.user).username,
        },
        {
          text: "Reporting",
          active: true,
        },
      ],
      exceldata: [],
      excelpdf: "",
      county: "All",
      counties: ["All", "Kisumu County"],
      cats: ["All", "TX_CURR"],
      category: "All",
      data_to_use: "Select a data source",
      data_options: ["api data", "csv data"],
      report: "Select report",
      show_upload_file: false,
      togglequaters: false,
      selected_report: false,
      qt1: "",
      qt2: "",
      qt3: "",
      qt4: "",
      qtryear: 2022,
      from: new Date().getFullYear() + "-09-01",
      to: new Date().getFullYear() + "-10-01",
      //quater 1
      qt1from: "",
      //qt1from: "2020-10-01",
      qt1to: "",
      //quater 2
      qt2from: "",
      qt2to: "",
      //quater 3
      qt3from: "",
      qt3to: "",
      //quater 4
      qt4from: "",
      qt4to: "",
      showdata: false,
      showhour: false,
      showdate: false,
      autoClose: "",
      autoClose2: "",
      mail_checkbox: true,
      day_checkbox: "",
      week_checkbox: "",
      month_checkbox: "",
      year_checkbox: "",
      specify_checkbox: "",
      time_checkbox: "",
      status_checkbox: "",
      user_checkbox: "",
      report: null,
      mod: "",
      picked: "",
      modules: [
        "All",
        "Data Alignment",
        "DataQuality",
        "Indicators",
        "Security",
      ],
      report:"",
      reports:[],
      toggleFilter:false,
      email: "",
      user: null,
      users: [],
      fromhour: "00:00",
      hours: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      tohour: "23:59",
    };
  },
  watch: {
    viewReports(newValue) {
      var curentuser = JSON.parse(localStorage.user).email;
      var currentdate = new Date();
      const data = {
        datetime: currentdate,
        useremail: curentuser,
        application: window.navigator.userAgent,
        details: `Opened Reports page:${newValue}`,
        computer: window.localStorage.clientip,
      };
      axios
        .post("AuditLogs", data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    printReport() {
      var curentuser = JSON.parse(localStorage.user).email;
      var currentdate = new Date();
      const data = {
        datetime: currentdate,
        useremail: curentuser,
        application: window.navigator.userAgent,
        details: `Reporting:${this.genReportStarted}`,
        computer: window.localStorage.clientip,
      };
      axios
        .post("AuditLogs", data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  created() {
    this.updateDates();
  },
  mounted() {
    // Set the initial number of items
    //alert(localStorage.user)
    this.getrptstate();
    this.updatefilters();
    this.email = JSON.parse(localStorage.user).email;
    this.updatefields();
    this.totalRows = this.items.length;
    this.viewReports = true;
},
  methods: {
    updateDates() {
      this.from = this.qtryear + "-09-01";
      this.to = this.qtryear + "-10-01";
      //quater 1
      this.qt1from = this.qtryear - 1 + "-10-01";
      //qt1from: "2020-10-01",
      this.qt1to = this.qtryear + "-12-31";
      //quater 2
      this.qt2from = this.qtryear + "-01-01";
      this.qt2to = this.qtryear + "-03-31";
      //quater 3
      this.qt3from = this.qtryear + "-04-01";
      this.qt3to = this.qtryear + "-06-31";
      //quater 4
      this.qt4from = this.qtryear + "-07-01";
      this.qt4to = this.qtryear + "-09-30";
    },
    updatefilters() {
      axios
        .get("listcategories")
        .then((res) => {
          res.data.forEach((item) => {
            this.cats.push(item.category_name);
          });
          axios
            .get("listcounties")
            .then((res) => {
              res.data.forEach((item) => {
                this.counties.push(item.county_name);
              });
            });
        })
        .catch((e) => {
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
    getdataStatus() {
      this.togglequaters = false;
      this.selected_report = false;
      this.toggleFilter=false;
      if (this.category == "TX_CURR") {
        this.togglequaters = true;
      } else {
        this.togglequaters = false;
      }
      if (this.report == "Comparison Data") {
        this.selected_report = true;
        this.toggleFilter=true;
      } else if (this.report == "Mapping Data" || this.mod == "Security") {
        this.selected_report = true;
        this.toggleFilter=false
      } else {
        this.selected_report = false;
      }
    },
    getcurrentdate(mydate) {
      let d = new Date(mydate);
      let year = d.getFullYear();
      let month = this.getmonth(d.getMonth() + 1);
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
    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
      genrpt(pl){
              this.pl = pl;
      if (this.report == "Comparison Data") {
        this.getComparisonData()
      }
      if (this.report == "Mapping Data") {
        this.getmappedData()
      }
      if (this.report == "Users") {
        this.getUserdata()
      }
      this.$emit("myrecords", {
        records: this.records,
        uniqueCars: this.uniqueCars,
        headers: this.headers,
        title: this.county + " " + this.category + " " + this.title,
        pl: this.pl,
        concodance: this.concodance,
      });
    },
    getUserdata() {
        var data=[];
        Swal.fire({
        position: "center",
        icon: "info",
        title: "Please wait...",
        html: "Pulling data...",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      axios
        .get(`listusers/`)
        .then((response) => {
         this.orderData=response.data;
          Swal.close();
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error!" + e,
            showConfirmButton: true,
          }).then((e) => {
            Swal.close(e);
          });
        });
        console.log(this.orderData)
        let id=1;
        data = this.orderData.map((row) => ({
          ID: id++,
          //DATIM_Indicator_ID: row.DATIM_Indicator_ID,
          "username": row.username,
          "Full Name": row.first_name+" "+row.last_name,
          "Email": row.email,
          //Operation: row.Operation,
          "Organisation": row.organisation,
          "Roles": row.groups__name,
        }));
        console.log(data)
      //get headers
      this.title = this.report;
      const headers = Object.keys(data[0]);
      const cars = [];
      Object.entries(data).forEach((val) => {
        const [key] = val;
        console.log(key, val);
        cars.push(Object.values(data[key]));
      });
      const uniqueCars = Array.from(new Set(cars));
      this.headers = headers;
      this.uniqueCars = uniqueCars;
      this.records = data;
      this.title = this.report;
    },
    getmappedData(){
        var data = [];
        Swal.fire({
        position: "center",
        icon: "info",
        title: "Please wait...",
        html: "Pulling data...",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      axios
          .get("get_mapped_data")
          .then((response) => {
            //console.log(response.data);
            this.orderData = response.data;
            Swal.close();
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
        data = this.mappeddata.map((row) => ({
          Category: row.DATIM_Indicator_Category,
          //DATIM_Indicator_ID: row.DATIM_Indicator_ID,
          "DATIM Disag Name": row.DATIM_Disag_Name,
          "MOH Indicator Name": row.MOH_Indicator_Name,
          "DATIM Disag ID": row.DATIM_Disag_ID,
          //Operation: row.Operation,
          "MOH Indicator ID": row.MOH_Indicator_ID,
          "Disag Type": row.Disaggregation_Type,
        }));
      //get headers
      this.title = this.report;
      const headers = Object.keys(data[0]);
      const cars = [];
      Object.entries(data).forEach((val) => {
        const [key] = val;
        console.log(key, val);
        cars.push(Object.values(data[key]));
      });
      const uniqueCars = Array.from(new Set(cars));
      this.headers = headers;
      this.uniqueCars = uniqueCars;
      this.records = data;
      this.title = this.report;
    },
    getComparisonData(){
        var startdate = new Date();
        var enddate = new Date();
        if (this.category === "TX_CURR") {
          if (this.qt1 == true) {
            startdate = this.qt1from;
            enddate = this.qt1to;
          } else if (this.qt2 == true) {
            startdate = this.qt2from;
            enddate = this.qt2to;
          } else if (this.qt3 == true) {
            startdate = this.qt3from;
            enddate = this.qt3to;
          } else if (this.qt4 == true) {
            startdate = this.qt4from;
            enddate = this.qt4to;
          }
        } else {
          startdate = this.mydatenew(new Date(this.from));
          enddate = this.mydatenew(new Date(this.to));
        }
        Swal.fire({
        position: "center",
        icon: "info",
        title: "Please wait...",
        html: "Pulling data...",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
        axios
          .get("get_comparison_data/" +
            this.county +
            "/" +
            this.category +
            "/" +
            startdate +
            "/" +
            enddate +
            "/")
          .then((response) => {
            //console.log(response.data);
            this.orderData = response.data;
            this.genrpt("l");
            Swal.close();
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
      var data = [];
      this.concodance = 0;
      this.orderData.forEach((val) => {
          this.concodance += Number(val["concodance"]);
        });
        data = this.orderData.map((row) => ({
          facility: row.facility,
          ward: row.ward,
          subcounty: row.subcounty,
          county: row.county,
          MOH_UID: row.MOH_FacilityID,
          DATIM_ID: row.DATIM_Disag_ID,
          MOH_IndicatorID: row.MOH_IndicatorCode,
          indicators: row.indicators,
          DATIM_Name: row.DATIM_Disag_Name,
          khis_data: row.khis_data,
          datim_data: row.datim_data,
          weight: row.weight,
          "concodance(%)": row.concodance,
          "khis-datim": row.khis_minus_datim,
        }));
      //get headers
      this.title = this.report;
      const headers = Object.keys(data[0]);
      const cars = [];
      Object.entries(data).forEach((val) => {
        const [key] = val;
        console.log(key, val);
        cars.push(Object.values(data[key]));
      });
      const uniqueCars = Array.from(new Set(cars));
      this.headers = headers;
      this.uniqueCars = uniqueCars;
      this.records = data;
      this.title = this.report;
    },
    getrptstate() {
      //alert(this.report);
      this.showdata = false;
      this.showhour = false;
      this.showdate = false;
      //this.reports=[]
      this.reports=[]
    if(this.mod=="Data Alignment"){
        this.reports.push(
        "Data Quality Analytics",
        "Facility Data",
        "Mapping Configurations",
        "Comparison Data",
        "Mapping Data",
        "Yearly Comparison Data",)
    }
     if(this.mod==="DataQuality"){
        this.reports.push()
    }
    if(this.mod=="DataQuality"){
        this.reports.push()
    }
    if(this.mod=="Indicators"){
        this.reports.push("Indicators")
    }
    if(this.mod=="Security"){
        this.reports.push(
        "Users",
        "Roles",
        )
    }
    this.getdataStatus();
    },
    mydatenew(d) {
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      //alert("month" + month);
      let date = d.getDate();
      date = this.getv(date);
      month = this.getv(month);

      //const msec = d.getMilliseconds();
      const datetime = year + "-" + month + "-" + date;
      return datetime;
    },
    mydate(d, day, mon, yea) {
      let year = d.getFullYear() - yea;
      let month = d.getMonth() + 1 - mon;
      //alert("month" + month);
      let date = d.getDate() - day;
      date = this.getv(date);
      month = this.getv(month);

      //const msec = d.getMilliseconds();
      const datetime = year + "-" + month + "-" + date;
      return datetime;
    },
    getv(val) {
      if (val < 10) {
        val = "0" + val;
      }
      return val;
    },
    getmydate(mydate) {
      let d = new Date(mydate);
      let year = d.getFullYear();
      let month = this.getmonth(d.getMonth());
      let date = d.getDate();
      date = this.getv(date);
      //month = this.getv(month);

      //const msec = d.getMilliseconds();
      const datetime = date + "/" + month + "/" + year;
      return datetime;
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
    getdatefilter() {
      //alert(this.mydate(new Date(), 0, 0, 0));
      this.todate = new Date(this.mydate(new Date(), 0, 0, 0));
      if (this.picked == "Day") {
        this.fromdate = new Date(this.mydate(new Date(), 1, 0, 0));
      }
      if (this.picked == "week") {
        this.fromdate = new Date(this.mydate(new Date(), 7, 0, 0));
      }
      if (this.picked == "month") {
        this.fromdate = new Date(this.mydate(new Date(), 0, 1, 0));
      }
      if (this.picked == "year") {
        this.fromdate = new Date(this.mydate(new Date(), 0, 0, 1));
      }
    },
    handleSubmit() {
      console.log("Error on submit");
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="card col-md-2"></div>
              <div class="card col-md-8 changebg">
                <div class="card-body">
                  <div class="card">
                    <div class="card-body">
                      <div class="col-sm-12">
                        <div class="input-group">
                          <div class="input-group-text col-sm-2 mb-3">
                            Module:
                          </div>
                          <div class="col-sm-10">
                            <multiselect @input="getrptstate()" v-model="mod" :options="modules"
                              placeholder="Select Report"></multiselect>
                          </div>
                        </div>
                      </div>

                      <div class="col-sm-12">
                        <div class="input-group">
                          <div class="input-group-text col-sm-2 mb-3">
                            Report For:
                          </div>
                          <div class="col-sm-10">
                            <multiselect @input="getrptstate()" v-model="report" :options="reports"
                              placeholder="Select Report">
                            </multiselect>
                          </div>
                        </div>
                      </div>

                      <div class="col-sm-12">
                        <div class="input-group">
                          <div class="input-group-text col-sm-2">
                            <input type="checkbox" id="mail_checkbox" v-model="mail_checkbox" :checked="mail_checkbox" />
                            <label for="checkbox"></label>
                            Send Mail:
                          </div>
                          <input class="form-control" type="text" placeholder="Type in Your Email Address"
                            v-model="email" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--Download files-->
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="border-top">
                        <div class="row">
                          <div class="col-md-12">
                            <div class="card" v-if="toggleFilter">
                              <div class="card-body">
                                <div class="row d-flex flex-row">
                                  <div class="col-lg-12 col-md-6">
                                    <div class="row">
                                      <div class="d-flex flex-column">
                                        <div class="row">
                                          <div class="col-sm-6 col-md-6">
                                            <b-form-group label="County" label-for="county-input">
                                              <multiselect class="form-control" v-model="county" :options="counties"
                                                placeholder="Kisumu County" :multiple="false" :editable="true">
                                              </multiselect>
                                            </b-form-group>
                                          </div>
                                          <div class="col-sm-6 col-md-6">
                                            <b-form-group label="Category" label-for="Category-input">
                                              <multiselect class="form-control" v-model="category" :options="cats"
                                                placeholder="TX_CURR" :multiple="false" :editable="true"
                                                @input="getdataStatus()">
                                              </multiselect>
                                            </b-form-group>
                                          </div>
                                        </div>
                                        <div class="row">
                                          <div class="col-sm-6 col-md-6 mt-2" v-if="!togglequaters">
                                            <div id="tickets-table-date-picker">
                                              <label>
                                                From&nbsp;
                                                <date-picker class="form-control" v-model="from" placeholder="2022-09-27"
                                                  type="date"></date-picker>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="col-sm-6 col-md-6 mt-2" v-if="!togglequaters">
                                            <div id="tickets-table-date-picker">
                                              <label>
                                                To&nbsp;
                                                <date-picker class="form-control" v-model="to" placeholder="2022-09-27"
                                                  type="date"></date-picker>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="col-sm-6 col-md-6 mt-2" v-if="togglequaters">
                                            <div id="tickets-table-date-picker">
                                              <label class="d-inline-flex m-2">
                                                Quater 1(Oct to Dec) &nbsp;
                                                <b-form-checkbox class="mr-n2" v-model="qt1">
                                                </b-form-checkbox>
                                              </label>
                                            </div>
                                            <div id="tickets-table-date-picker" v-show="togglequaters">
                                              <label class="d-inline-flex m-2">
                                                Quater 2(Jan to Mar) &nbsp;
                                                <b-form-checkbox class="mr-n2" v-model="qt2">
                                                </b-form-checkbox>
                                              </label>
                                            </div>
                                          </div>
                                          <div class="col-sm-6 col-md-6 mt-2" v-if="togglequaters">
                                            <div id="tickets-table-date-picker">
                                              <label class="d-inline-flex m-2">
                                                Quater 3(Apr to Jun) &nbsp;
                                                <b-form-checkbox class="mr-n2" v-model="qt3">
                                                </b-form-checkbox>
                                              </label>
                                            </div>
                                            <div id="tickets-table-date-picker" class="d-block" v-show="togglequaters">
                                              <label class="d-inline-flex m-2">
                                                Quater 4(Jul to Sept) &nbsp;
                                                <b-form-checkbox class="mr-n2" v-model="qt4">
                                                </b-form-checkbox>
                                              </label>
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
                    </div>
                  </div>
                  <!-- ///buttons -->
                  <div class="row">
                    <div class="col-sm-8 text-right">{{ report }}</div>
                    <div class="col-sm-2">
                      <b-button pill variant="outline-primary" @click="
                        [
                          genrpt('l'),
                          $bvModal.hide('modal-1'),
                        ]
                        " v-b-modal.modal-Print style="margin-right: 10px">
                        Generate</b-button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <reportdet :title="report" :reportfor="report" :orderData="orderData" :pl="pl" :headers="headers"
      :uniqueCars="uniqueCars" :printedpdf="printedpdf" :rpt="rpt" :exceldata="exceldata" v-show="false"
      ref="uploadComponent"></reportdet>
    <b-modal id="modal-Print" :title="report" hide-footer size="bg" centered>
      <reportdet :title="report" :reportfor="report" :orderData="orderData" :pl="pl" :headers="headers"
        :uniqueCars="uniqueCars" :shome="showme" :printedpdf="printedpdf" :rpt="rpt" :v-show="showme"
        @sendEmail="sendEmail" :exceldata="exceldata" :mail_checkbox="mail_checkbox"></reportdet>
    </b-modal>
  </Layout>
</template>
<style scoped>
.changebg {
  background-color: rgb(240, 240, 240);
}
</style>
