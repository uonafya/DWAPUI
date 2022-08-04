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
    title: "Indicators",
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
      showsync: true,
      title: "KHIS Data",
      modaltitle: "Add New",
      items: [
        {
          text: "KHIS Data",
        },
        {
          text: "Indicators",
          active: true,
        },
      ],
      id: "",
      myindex: "",
      indicators: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 50,
      pageOptions: [
        1, 5, 10, 25, 50, 100, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000,
        4500, 5000, 5500, 6000,
      ],
      filter: null,
      filterOn: [],
      sortBy: "id",
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
          key: "MOH_Indicator_ID",
          sortable: true,
        },
        {
          key: "MOH_Indicator_Name",
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
          key: "displayName",
          sortable: true,
        },
        {
          key: "displayNumeratorDescription",
          sortable: true,
        },
        {
          key: "denominatorDescription",
          sortable: true,
        },
        {
          key: "displayDenominatorDescription",
          sortable: true,
        },
        {
          key: "numeratorDescription",
          sortable: true,
        },
        {
          key: "dimensionItem",
          sortable: true,
        },
        {
          key: "displayFormName",
          sortable: true,
        },
        {
          key: "numerator",
          sortable: true,
        },
        {
          key: "denominator",
          sortable: true,
        },
        {
          key: "dimensionItemType",
          sortable: true,
        },
        {
          key: "indicatorType",
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
    //this.upadtearray();
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.indicators.length;
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
        .get(window.$http + "indicators/" + this.perPage, {
          headers: window.$headers,
        })
        .then((res) => {
          console.log(res.data);
          this.indicators = res.data;
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
    editrec() {},
    edit() {},
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
                class="table table-centered table-nowrap specifictd"
                fixed
                :items="indicators"
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
                <template v-slot:cell(action)>
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-primary"
                        v-b-tooltip.hover
                        title="Edit"
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
                      <a class="dropdown-item" href="#">Action 1</a>
                      <a class="dropdown-item" href="#">Action 2</a>
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
                                      v-model="id"
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
                                      v-model="id"
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
                                      v-model="id"
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
                                      v-model="id"
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
<style scoped>
@media (max-width: 768px) {
  /* use the max to specify at each container level */
  .specifictd {
    width: 360px; /* adjust to desired wrapping */
    display: table;
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }
}
</style>
