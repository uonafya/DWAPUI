<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import addroles from "@/components/widgets/security/addroles";
import reportdet from "@/components/report/header";

import Swal from "sweetalert2";
import axios from "../../../Axiosconfig";
var CryptoJS = require("crypto-js");

export default {
    page: {
        title: "Roles",
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
        reportdet,
        addroles,
    },
    data() {
        return {
            headers: null,
            uniqueCars: null,
            showme: true,
            pl: "",
            selectedlists: [],
            rname: "",
            description: "",
            editmode: false,
            title: "Roles",
            items: [
                {
                    text: "USER: " + JSON.parse(localStorage.user).username.charAt(0)
                        .toUpperCase() +
                        JSON.parse(localStorage.getItem("user"))
                            .username.slice(1),
                },
                {
                    text: "Role List",
                    active: true,
                },
            ],
            orderData: [],
            deleteroleslog: false,
            viewRoles: false,
            tokenString: CryptoJS.AES.decrypt(
                JSON.parse(localStorage.user).token,
                "mnopqr"
            )
                .toString(CryptoJS.enc.Utf8)
                .trim(), //
            myid: 0,
            id: 0,
            myindex: 0,
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [1, 10, 25, 50, 100],
            filter: null,
            filterOn: [],
            sortBy: "id",
            sortDesc: false,
            fields: [
                {
                    key: "id",
                    label: "#",
                    sortable: true,
                },
                {
                    key: "role_name",
                    label: "Role Name",
                    sortable: true,
                },
                {
                    key: "screens",
                    label: "Screen Access",
                    sortable: true,
                },
                "action",
            ],
        };
    },
    watch: {
        viewRoles(newValue) {
            var curentuser = JSON.parse(localStorage.user).email;
            var currentdate = new Date();
            const data = {
                datetime: currentdate,
                useremail: curentuser,
                application: window.navigator.appCodeName,
                details: `Opened roles' list:${newValue}`,
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
        deleteroleslog(newValue) {
            var curentuser = JSON.parse(localStorage.user).email;
            var currentdate = new Date();
            const data = {
                datetime: currentdate,
                useremail: curentuser,
                application: window.navigator.appCodeName,
                details: `Delete role:${newValue},role name:${this.rname}`,
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
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.orderData.length;
        },
    },
    mounted() {
        this.viewRoles = true;
        this.totalRows = this.items.length;
        this.fetchroles();
    },
    methods: {
        async fetchroles() {
            //screen and roles combination

            Swal.fire({
                title: "Please Wait !",
                html: "Loading data...", // add html attribute if you want or remove
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                },
            });
            await axios
                .get(`listroles/`)
                .then((response) => {
                    // JSON responses are automatically parsed.
                    this.orderData = response.data;
                    console.log(response.data);
                    Swal.close();
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

                    //throw e;
                });
        },
        printpdf(pl) {
            this.pl = pl;
            const data = this.orderData.map((row) => ({
                ID: row.id,
                Role_Name: row.role_name,
                Screens: row.screens,
            }));

            //get headers
            const headers = Object.keys(data[0]);
            const cars = [];
            Object.entries(data).forEach((val) => {
                const [key, value] = val;
                console.log(key, value);
                cars.push(Object.values(data[key]));
            });

            const uniqueCars = Array.from(new Set(cars));
            this.headers = headers;
            this.uniqueCars = uniqueCars;
            //alert(headers);
        },

        getrpt() {
            //alert(new Date());
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
            const data = this.orderData.map((row) => ({
                ID: row.id,
                Cargo_Name: row.name,
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
        /**
         * Search the table data with search input
         */
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        handleSubmit() {
            console.log("Error on submit");
        },
        /* ---------------------------------------------------------------------------------edit----------------- */
        // edit(index, id, name, description, screens) {
        //   this.editmode = true;
        //   //alert(name);
        //   this.myid = index;
        //   this.id = id;
        //   this.rname = name;
        //   this.description = description;
        //   this.selectedlists = screens;
        // },
        deleterec(index, myid, rname, description) {
            this.myid = myid;
            this.rname = rname;
            this.description = description;

            Swal.fire({
                title: "Are you sure, you want to delete? " + this.rname,
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Yes, delete it!",
            }).then((result) => {
                if (result.value) {
                    this.orderData.splice(index, 1);
                    axios
                        .delete(window.$http + `UserRoles/` + this.myid, {
                            headers: window.$headers,
                        })
                        .then((response) => {
                            // JSON responses are automatically parsed.
                            console.log(response);
                            this.deleteroleslog = true;
                            Swal.fire(
                                this.rname + " Deleted!",
                                "Your record has been deleted.",
                                "success"
                            );
                        })
                        .catch((e) => {
                            this.errors.push(e);
                        });
                }
            });
        },
        clearvalues() {
            this.rname = "";
            this.description = "";
            this.editmode = false;
            this.modaltitle = "Add Role";
        },
    },
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />

        <div class="card">
            <div class="card-body">
                <form @submit.prevent="handleSubmit">
                    <div class="card">
                        <div class="card-body">
                            <div class="row justify-content-between">
                                <div class="col-sm-6">
                                    <button class="btn btn-success waves-effect waves-light uil-export" @click="getrpt()">
                                        Export to CSV
                                    </button>
                                </div>

                                <div class="col-sm-2">
                                    <button @click="printpdf('p')" v-b-modal.modal-Print
                                        class="
                                                                                                                              btn btn-success
                                                                                                                              waves-effect waves-light
                                                                                                                              mdi-file-pdf
                                                                                                                            ">
                                        Print PDF
                                    </button>
                                </div>
                                <div class="col-sm-2">
                                    <button v-b-modal.modal-Add
                                        class="
                                                                                                                              btn btn-success
                                                                                                                              waves-effect waves-light
                                                                                                                              uil-focus-add
                                                                                                                            "
                                        @click="clearvalues()">
                                        Add {{ title }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 overflow-auto">
                            <div class="card">
                                <div class="card-body changebg">
                                    <div class="row">
                                        <div class="col-12">
                                            <div
                                                class="
                                                                                                                                  table table-centered
                                                                                                                                  datatable
                                                                                                                                  dt-responsive
                                                                                                                                  nowrap
                                                                                                                                  table-card-list
                                                                                                                                  dataTable
                                                                                                                                  no-footer
                                                                                                                                  dtr-inline
                                                                                                                                ">
                                                <div class="row">
                                                    <div class="col-sm-12 col-md-6">
                                                        <div id="tickets-table_length" class="dataTables_length"
                                                            style="word-wrap: break-word;">
                                                            <label
                                                                class="
                                                                                                                                          d-inline-flex
                                                                                                                                          align-items-center
                                                                                                                                          fw-normal
                                                                                                                                        ">
                                                                Show&nbsp;
                                                                <b-form-select v-model="perPage" size="sm"
                                                                    :options="pageOptions"></b-form-select>&nbsp;entries
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <!-- Search -->
                                                    <div class="col-sm-12 col-md-6">
                                                        <div id="tickets-table_filter"
                                                            class="dataTables_filter text-md-end">
                                                            <label
                                                                class="
                                                                                                                                          d-inline-flex
                                                                                                                                          align-items-center
                                                                                                                                          fw-normal
                                                                                                                                        ">
                                                                Search:
                                                                <b-form-input v-model="filter" type="search"
                                                                    placeholder="Search..."
                                                                    class="form-control form-control-sm ms-2"></b-form-input>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <!-- End search -->
                                                </div>
                                                <!-- Table -->

                                                <b-table fixed table-class="table table-centered datatable table-card-list"
                                                    thead-tr-class="bg-transparent" :items="orderData" :fields="fields"
                                                    responsive="sm" :per-page="perPage" :current-page="currentPage"
                                                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :filter="filter"
                                                    :filter-included-fields="filterOn" @filtered="onFiltered">
                                                    <template v-slot:cell(check)="data">
                                                        <div class="">
                                                            <input type="button" class="custom-control-input"
                                                                :id="`contacusercheck${data.item.id}`" value="Submit" />
                                                            <label class="custom-control-label"
                                                                :for="`contacusercheck${data.item.id}`"></label>
                                                        </div>
                                                    </template>
                                                    <template v-slot:cell(id)="data">
                                                        <a href="javascript: void(0);"
                                                            class="text-dark fw-bold">{{ data.item.id }}</a>
                                                    </template>

                                                    <template v-slot:cell(screens)="data">
                                                        <a href="#" class="text-body text-wrap"
                                                            style="word-wrap: break-word;">{{ data.item.screens }}</a>
                                                    </template>

                                                    <template v-slot:cell(action)="data">
                                                        <ul class="list-inline mb-0">
                                                            <li class="list-inline-item">
                                                                <a href="#" class="px-2 text-success" v-b-tooltip.hover
                                                                    v-b-modal.modal-Add title="Edit"
                                                                    @click="
                                                                        edit(
                                                                            data.index,
                                                                            data.item.id,
                                                                            data.item.role_name,
                                                                        )
                                                                    ">
                                                                    <i class="uil uil-pen font-size-18"></i>
                                                                </a>
                                                            </li>
                                                            <li class="list-inline-item">
                                                                <a href="javascript:void(0);" class="px-2 text-danger"
                                                                    v-b-tooltip.hover title="Delete" @click="
                                                                        deleterec(
                                                                            data.index,
                                                                            data.item.id,
                                                                            data.item.role_name,
                                                                        )
                                                                    ">
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
                                                        class="
                                                                                                                                      dataTables_paginate
                                                                                                                                      paging_simple_numbers
                                                                                                                                      float-end
                                                                                                                                    ">
                                                        <ul class="pagination pagination-rounded">
                                                            <!-- pagination -->
                                                            <b-pagination v-model="currentPage" :total-rows="rows"
                                                                :per-page="perPage"></b-pagination>
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

        <b-modal id="modal-1" title="Delete Record" hide-footer size="sm" centered>
            <div>
                Are you sure you want to delete
                <a class="text-dark fw-bold">{{ rname }}</a>

                for record Number {{ myid }}
            </div>
            <div>Description{{ description }}</div>
            <div class="row">
                <div class="col-sm-6">
                    <button class="btn btn-primary waves-effect waves-light">
                        Delete
                    </button>
                </div>
                <div class="col-sm-6">
                    <b-button class="" block @click="$bvModal.hide('modal-1')">Cancel</b-button>
                </div>
            </div>
        </b-modal>
        <b-modal id="modal-Print" title="Print PDF" hide-footer size="bg" centered>
            <reportdet :title="title" :orderData="orderData" :pl="pl" :headers="headers" :uniqueCars="uniqueCars"
                :shome="showme" v-show="showme"></reportdet>
        </b-modal>
        <b-modal id="modal-Add" title="Add Roles" hide-footer size="xl" centered>
            <addroles :rname="rname" :description="description" :editmode="editmode" :orderData="orderData"
                :selectedlists="selectedlists">
            </addroles>
        </b-modal>
    </Layout>
</template>
<style scoped>
.changebg {
    background-color: #f7f6ebfb;
}

td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 1px;
}
</style>