<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Swal from "sweetalert2";
import axios from "axios";
//import vue2Dropzone from "vue2-dropzone";

import "vue2-dropzone/dist/vue2Dropzone.min.css";
/**
 * User list component
 */
export default {
  components: { Layout, PageHeader },
  page: {
    title: "Patients",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      stoped: true,
      title: "KHIS Data",
      modaltitle: "Add New",
      items: [
        {
          text: "KHIS Data",
        },
        {
          text: "Patient Details",
          active: true,
        },
      ],
      id: "",
      myindex: "",
      patientId: 657578,
      patientName: "test1",
      patientDiagnosis: "testing",
      homeCounty: "kisumu",
      delete_status: 0,
      exported: 0,
      status: "0",
      id_snapshot: "",
      patients: [
        {
          id: 1,
          patientId: 657578,
          patientName: "test1",
          patientDiagnosis: "testing",
          homeCounty: "kisumu",
          delete_status: 0,
          exported: 1,
          status: "S",
        },
        {
          id: 2,
          patientId: 654578,
          patientName: "test123",
          patientDiagnosis: "testing",
          homeCounty: "kisumu",
          delete_status: 0,
          exported: -1,
          status: "F",
        },
        {
          id: 3,
          patientId: 1127578,
          patientName: "test2199",
          patientDiagnosis: "testing",
          homeCounty: "kisumu",
          delete_status: 0,
          exported: 0,
          status: "0",
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 100,
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
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: {
          "My-Awesome-Header": "header value",
        },
      },
      fields: [
        {
          key: "check",
          label: "",
          sortable: true,
        },
        {
          key: "patientId",
          label: "Patient ID",
          sortable: true,
        },
        {
          key: "patientName",
          lable: "Full Name",
          sortable: true,
        },
        {
          key: "patientDiagnosis",
          label: "Diagnosis",
          sortable: true,
        },
        {
          key: "homeCounty",
          sortable: true,
        },
        {
          key: "exported",
          sortable: true,
        },
        {
          key: "status",
          sortable: true,
        },
        "action",
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
      return this.patients.length;
    },
  },
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
          this.patients = res.data;
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
      //var orderid = this.patients.length + 1;
      const data = {
        patientName: this.patientName,
        patientDiagnosis: this.patientDiagnosis,
        patientId: this.patientId,
        homeCounty: this.homeCounty,
        exported: 0,
        status: "0",
      };
      axios
        .post(window.$http + "Patients/", data, { headers: window.$headers })
        .then((res) => {
          console.log(res.data);
          this.patients.push(res.data);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
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
    editrec() {
      // JSON responses are automatically parsed.
      this.patients[this.myindex].id = this.id;
      this.patients[this.myindex].patientName = this.patientName;
      this.patients[this.myindex].patientId = this.patientId;
      this.patients[this.myindex].patientDiagnosis = this.patientDiagnosis;
      this.patients[this.myindex].homeCounty = this.homeCounty;
      this.patients[this.myindex].exported = this.exported;
      this.patients[this.myindex].status = this.status;

      if (this.patients[this.myindex].id != "") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 3000,
        });
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    edit(id, index, pid, name, city, diag) {
      this.modaltitle = "Edit Record";
      this.editmode = true;
      this.id = id;
      this.patientName = name;
      this.patientId = pid;
      this.homeCounty = city;
      this.patientDiagnosis = diag;
      this.myindex = index;
    },
    deleterec(myid, index, name, pid) {
      this.id = myid;
      this.patientName = name;
      this.patientId = pid;
      Swal.fire({
        title:
          "Are you sure, you want to delete " +
          this.patientName +
          " from  the system?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.patients.splice(index, 1);
          Swal.fire(
            this.patientName + " Deleted!",
            "Your record has been deleted.",
            "success"
          );
        }
      });
    },
  },
  middleware: "authentication",
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <a
                    href="javascript:void(0);"
                    class="btn btn-success"
                    v-b-modal.add-slot
                    ><i class="mdi mdi-plus me-2"></i> Add New</a
                  >
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
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
                  <label class="d-inline-flex align-items-center">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      placeholder="Search..."
                      class="form-control rounded bg-light border-0 ms-2"
                    ></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                class="table table-centered table-nowrap"
                :items="patients"
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
                <template v-slot:cell(status)="data">
                  <div class="custom-control custom-checkbox">
                    <label
                      class="custom-control-label badge rounded-pill bg-soft-success font-size-12"
                      :for="`contacusercheck${data.item.status}`"
                      v-show="data.item.exported == 1"
                    >
                      Synched&nbsp;
                    </label>
                    <label
                      class="custom-control-label badge rounded-pill bg-soft-warning font-size-12"
                      :for="`contacusercheck${data.item.status}`"
                      v-show="data.item.exported == -1"
                    >
                      Failed&nbsp;
                    </label>
                    <label
                      class="custom-control-label badge rounded-pill bg-soft-info font-size-12"
                      :for="`contacusercheck${data.item.status}`"
                      v-show="data.item.exported == 0"
                    >
                      Waiting...&nbsp;
                    </label>
                    <input
                      type="checkbox"
                      class="custom-control-input "
                      :id="`contacusercheck${data.item.status}`"
                      :checked="
                        data.item.status == 'S' || data.item.exported == 1
                          ? true
                          : false
                      "
                    />
                  </div>
                </template>
                <template v-slot:cell(name)="data">
                  <img
                    v-if="data.item.profile"
                    :src="data.item.profile"
                    alt
                    class="avatar-xs rounded-circle me-2"
                  />
                  <div
                    v-if="!data.item.profile"
                    class="avatar-xs d-inline-block me-2"
                  >
                    <div
                      class="avatar-title bg-soft-primary rounded-circle text-primary"
                    >
                      <i class="mdi mdi-account-circle m-0"></i>
                    </div>
                  </div>
                  <a href="#" class="text-body">{{ data.item.patientName }}</a>
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
                            data.item.patientId,
                            data.item.patientName,
                            data.item.patientDiagnosis,
                            data.item.homeCounty,
                            data.item.exported,
                            data.item.status
                          )
                        "
                        v-b-modal.add-slot
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
                            data.item.id,
                            data.index,
                            data.item.patientName,
                            data.item.patientId,
                            data.item.patientDiagnosis,
                            data.item.homeCounty
                          )
                        "
                      >
                        <i class="uil uil-trash-alt font-size-18"></i>
                      </a>
                    </li>
                    <b-dropdown
                      class="list-inline-item"
                      variant="white"
                      right
                      toggle-class="text-muted font-size-18 px-2"
                    >
                      <template v-slot:button-content>
                        <i class="uil uil-ellipsis-v"></i>
                      </template>

                      <a class="dropdown-item" href="#">Action</a>
                      <a class="dropdown-item" href="#">Another action</a>
                      <a class="dropdown-item" href="#">Something else here</a>
                    </b-dropdown>
                  </ul>
                </template>
              </b-table>
            </div>
            <!--modals-->
            <b-modal id="add-slot" size="xl" :title="modaltitle">
              <div class="row">
                <div class="col-lg-12">
                  <div class="card">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-lg-12">
                          <div class="mt-4">
                            <h5 class="font-size-14 mb-4">
                              <i
                                class="mdi mdi-arrow-right text-primary me-1"
                              ></i>
                              New Record
                            </h5>
                            <form @submit.prevent="add()">
                              <div class="row">
                                <div class="col-md-6">
                                  <b-form-group
                                    label="ID Number"
                                    label-for="formrow-idno-input"
                                    class="mb-3"
                                  >
                                    <b-form-input
                                      id="formrow-idno-input"
                                      type="number"
                                      :placeholder="patientId"
                                      v-model="patientId"
                                    ></b-form-input>
                                  </b-form-group>
                                </div>
                                <div class="col-md-6">
                                  <b-form-group
                                    label="Full Name"
                                    label-for="formrow-idno-input"
                                    class="mb-3"
                                  >
                                    <b-form-input
                                      id="formrow-name-input"
                                      type="text"
                                      :placeholder="patientName"
                                      v-model="patientName"
                                    ></b-form-input>
                                  </b-form-group>
                                </div>
                                <div class="col-md-6">
                                  <b-form-group
                                    label="Home County"
                                    label-for="formrow-county-input"
                                    class="mb-3"
                                  >
                                    <b-form-input
                                      id="formrow-county-input"
                                      type="text"
                                      v-model="homeCounty"
                                      :placeholder="homeCounty"
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
                                    ></b-form-input>
                                  </b-form-group>
                                </div>
                              </div>
                              <div class="mt-4">
                                <b-button type="submit" variant="primary"
                                  >Submit</b-button
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
                <div
                  class="dataTables_paginate paging_simple_numbers float-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
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
  </Layout>
</template>
