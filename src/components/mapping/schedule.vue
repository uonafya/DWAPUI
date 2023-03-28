<script>
import appConfig from "@/app.config";
import Swal from "sweetalert2";
//import VueGoogleAutocomplete from "vue-google-autocomplete";
//import DatePicker from "vue2-datepicker";
//import Multiselect from "vue-multiselect";
//import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from '../../Axiosconfig';
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
    //DatePicker,
    //reportdet,
    //Multiselect,
    //vueDropzone: vue2Dropzone,
  },
  props: {
    modaltitle: String,
    editmode: Boolean,
    schedules: Array,
    scheduleTime: Date,
    scheduledesc: String,
    id: Number,
    myindex: Number,
  },
  data() {
    return {
      showme: true,
      contid: "",
      sheduledesc: "Weekly data sync",
      totalRows: 1,
      total: 0,
      currentPage: 1,
      perPage: 100,
      pageOptions: [
        10, 25, 50, 100, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500,
        5000, 5500, 6000,
      ],
      filter: null,
      filterOn: [],
      sortBy: "id",
      sortDesc: false,
      index: 1,
      count: 0,
    };
  },
  created() {
    setInterval(() => {
      if (this.stoped && !this.showsync) {
        this.upadtearray();
      }
    }, 3000);
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
    this.totalRows = this.items.length;
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    printpdf(pl) {
      this.pl = pl;
      const data = this.records.map((row) => ({
        "S/NO": this.index++,
        MOH_Indicator_ID: row.MOH_Indicator_ID,
        MOH_Indicator_Name: row.MOH_Indicator_Name,
      }));

      //get headers
      const headers = Object.keys(data[0]);
      const cars = [];
      Object.entries(data).forEach((index, val) => {
        const [key] = index;
        console.log(key, val);
        cars.push(Object.values(data[key]));
      });

      const uniqueCars = Array.from(new Set(cars));
      this.headers = headers;
      this.uniqueCars = uniqueCars;
      this.records = data;
      //alert(headers);
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
    formatDate(date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },
    schedule() {
      this.modaltitle = "Add Schedule";
      console.log(this.scheduleTime);

      var data = {
        id: 0,
        shedule_description: this.sheduledesc,
        sync_time: this.scheduleTime,
      };
      console.log(data);
      axios
        .post("listschedules/", data)
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
      console.log("Error on submit");
    },
    editrec() {
      var data = {
        id: this.id,
        sync_time: this.scheduleTime,
        shedule_description: this.scheduledesc,
      }
      axios.put("listschedules/" + this.id + "/", data).then((response) => {
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
  },
  middleware: "authentication",
};
</script>

<template>
  <div class="row">
    <div class="col-xl-8">
      <div class="card mb-0">
        <b-tabs content-class="p-4" justified class="nav-tabs-custom">
          <b-tab active>
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-sm-6">
                  <b-form-group class="mb-3" label="Schedule Description" label-for="desc-input">
                    <input class="form-control" type="text" :placeholder="sheduledesc" v-model="sheduledesc" />
                  </b-form-group>
                </div>
                <div class="col-sm-6">
                  <b-form-group class="mb-3" label="Schedule Time" label-for="backupTime-input">
                    <input type="datetime-local" v-model="scheduleTime" locale="en" class="form-control" />
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
        <b-button v-show="!editmode" variant="dark" @click="schedule()">Add Schedule</b-button>&nbsp;
        <b-button v-show="editmode" variant="dark" @click="editrec()">Edit Schedule</b-button>
      </div>
    </div>
  </div>
</template>
