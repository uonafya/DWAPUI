<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Swal from "sweetalert2";
//import VueGoogleAutocomplete from "vue-google-autocomplete";
import axios from "axios";
import countTo from "vue-count-to";
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
  components: { Layout, PageHeader, countTo },
  data() {
    return {
      stoped: true,
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
      patientId: 657578,
      patientName: "test1",
      patientDiagnosis: "testing",
      homeCounty: "kisumu",
      delete_status: 0,
      exported: 0,
      status: "0",
      records: [
        {
          id: "#MN0131",
          patienId: "#2536",
          status: "Available",
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
              formatter: function() {
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
              formatter: function() {
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
      currentPage: 1,
      perPage: 10,
      pageOptions: [
        10,
        25,
        50,
        100,
        500,
        1000,
        1500,
        2000,
        2500,
        3000,
        3500,
        4000,
        4500,
        5000,
        5500,
        6000,
      ],
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
          key: "patientId",
          label: "#Record Id",
          sortable: true,
        },
        {
          key: "exported",
          sortable: true,
        },
        {
          key: "status",
          label: "Status",
          sortable: true,
        },
        {
          key: "download",
          label: "Download Pdf",
        },
        {
          key: "action",
        },
      ],
    };
  },
  created() {
    setInterval(() => {
      if (this.stoped) {
        this.upadtearray();
      }
    }, 5000);
    this.upadtearray();
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
    upadtearray() {
      axios
        .get(window.$http + "Patients", {
          headers: window.$headers,
        })
        .then((res) => {
          console.log(res.data);
          this.records = res.data;
          axios
            .get(
              window.$http + "Patients/search?exported=1&limit=" + this.perPage,
              {
                headers: window.$headers,
              }
            )
            .then((res) => {
              console.log(res.data);
              this.synched = res.data.length;
            });
        })
        .then(() => {
          axios
            .get(
              window.$http + "Patients/search?exported=0&limit=" + this.perPage,
              {
                headers: window.$headers,
              }
            )
            .then((res) => {
              console.log(res.data);
              this.waiting = res.data.length;
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
    add() {
      var orderid = this.devicelist.length + 1;
      var data = {
        id: orderid,
        name: this.name,
        capacity: this.capacity,
        avslots: this.capacity,
        status: this.status,
        location: this.location,
      };
      this.devicelist.push(data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      axios
        .post(window.$http + "parkinginfo", data, { headers: window.$headers })
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    edit(id, index, name, pid, city, diag) {
      this.modaltitle = "Record Details";
      this.editmode = true;
      this.id = id;
      this.patientName = name;
      this.patienId = pid;
      this.homeCounty = city;
      this.patientDiagnosis = diag;
      this.myindex = index;
    },
    deleterec(myid, index, name) {
      this.id = myid;
      this.name = name;
      Swal.fire({
        title: "Are you sure, you want to delete " + this.name + "?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.records.splice(index, 1);
          Swal.fire(
            this.name + " Deleted!",
            "Your record has been deleted.",
            "success"
          );
        }
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
                  <p class="text-muted mb-0">Synched</p>
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
                    >{{ ((synched / rows) * 100).toFixed(2) }}%
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
                    >{{ ((waiting / rows) * 100).toFixed(2) }}%
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
    <!-- Table -->
    <div class="table-responsive mb-0">
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
        <template v-slot:cell(check)="data">
          <div class="custom-control custom-checkbox text-center">
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
        <template v-slot:cell(id)="data">
          <a href="javascript: void(0);" class="text-dark fw-bold">
            {{ data.item.id }}
          </a>
        </template>

        <template v-slot:cell(status)="data">
          <div class="custom-control custom-checkbox">
            <label
              class="custom-control-label badge rounded-pill bg-soft-success font-size-12"
              :for="`contacusercheck${data.item.status}`"
              v-show="data.item.status == 'S'"
            >
              Synched&nbsp;
            </label>
            <label
              class="custom-control-label badge rounded-pill bg-soft-warning font-size-12"
              :for="`contacusercheck${data.item.status}`"
              v-show="data.item.status == 'F'"
            >
              Failed&nbsp;
            </label>
            <label
              class="custom-control-label badge rounded-pill bg-soft-info font-size-12"
              :for="`contacusercheck${data.item.status}`"
              v-show="data.item.status == '0'"
            >
              Waiting...&nbsp;
            </label>
            <input
              type="checkbox"
              class="custom-control-input "
              :id="`contacusercheck${data.item.status}`"
              :checked="data.item.status == 'S' ? true : false"
            />
          </div>
        </template>

        <template v-slot:cell(name)="data">
          <a href="#" class="text-body">{{ data.item.name }}</a>
        </template>
        <template v-slot:cell(download)>
          <div>
            <button class="btn btn-light btn-sm w-xs">
              Pdf
              <i class="uil uil-download-alt ms-2"></i>
            </button>
          </div>
        </template>
        <template v-slot:cell(action)="data">
          <ul class="list-inline mb-0">
            <li class="list-inline-item">
              <a
                href="javascript:void(0);"
                class="px-2 text-primary"
                v-b-tooltip.hover
                title="Edit"
                @click="
                  edit(
                    data.item.id,
                    data.index,
                    data.item.patientName,
                    data.item.patientId,
                    data.item.homeCounty,
                    data.item.patientDiagnosis
                  )
                "
                v-b-modal.add-ground
              >
                <i class="uil uil-eye font-size-18"></i>
              </a>
            </li>
            <li class="list-inline-item">
              <a
                href="javascript:void(0);"
                class="px-2 text-danger"
                v-b-tooltip.hover
                title="Delete"
                @click="
                  deleterec(data.item.id, data.item.index, data.item.patientId)
                "
              >
                <i class="uil uil-trash-alt font-size-18"></i>
              </a>
            </li>
          </ul>
        </template>
      </b-table>
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
                      {{ title }}
                    </h5>
                    <form @submit.prevent="add()">
                      <div class="row">
                        <div class="col-md-6">
                          <b-form-group
                            label="ID Number"
                            label-for="formrow-name-input"
                            class="mb-3"
                          >
                            <b-form-input
                              id="formrow-idno-input"
                              type="number"
                              placeholder="patientId"
                              v-model="patientId"
                            >
                            </b-form-input>
                          </b-form-group>
                        </div>
                        <div class="col-md-6">
                          <b-form-group
                            label="Full Name"
                            label-for="formrow-idno-input"
                            class="mb-3"
                          >
                            <b-form-input
                              id="formrow-idno-input"
                              type="text"
                              placeholder="20"
                              v-model="patientName"
                            ></b-form-input>
                          </b-form-group>
                        </div>
                        <div class="col-md-6">
                          <b-form-group
                            label="Diagnosis"
                            label-for="formrow-diag-input"
                            class="mb-3"
                          >
                            <b-form-input
                              id="formrow-diag-input"
                              type="text"
                              v-model="patientDiagnosis"
                              :placeholder="patientDiagnosis"
                            />
                          </b-form-group>
                        </div>
                        <div class="col-md-6">
                          <b-form-group
                            label="Home County"
                            label-for="formrow-city-input"
                            class="mb-3"
                          >
                            <b-form-input
                              id="formrow-city-input"
                              type="text"
                              v-model="homeCounty"
                              :placeholder="homeCounty"
                            />
                          </b-form-group>
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
    <b-modal id="lock-device" size="lg" title="Lock/Unlock Device">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-lg-12">
                  <div class="mt-4">
                    <h5 class="font-size-14 mb-4">
                      <i class="mdi mdi-arrow-right text-primary me-1"></i>
                      {{ title }}
                    </h5>
                    <form @submit.prevent="addrec()">
                      <div class="row">
                        <div class="col-md-12">
                          <b-form-group
                            label="Reason"
                            label-for="formrow-reason-input"
                            class="mb-3"
                          >
                            <b-textarea
                              id="formrow-reason-input"
                              type="text"
                              placeholder="Payments made"
                            ></b-textarea>
                          </b-form-group>
                        </div>
                      </div>
                      <div class="mt-4">
                        <b-button type="submit" variant="primary"
                          >Apply</b-button
                        >
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
