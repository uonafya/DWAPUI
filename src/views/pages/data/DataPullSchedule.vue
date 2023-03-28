<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Swal from "sweetalert2";
//import VueGoogleAutocomplete from "vue-google-autocomplete";
//import DatePicker from "vue2-datepicker";
import reportdet from "@/components/report/header";
import schedule from "../../../components/mapping/schedule.vue";
//import Multiselect from "vue-multiselect";
//import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from '../../../Axiosconfig';
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
        //DatePicker,
        reportdet,
        schedule,
        //Multiselect,
        //vueDropzone: vue2Dropzone,
    },
    data() {
        return {
            title: "Data Pull Schedule",
            items: [
                {
                    text: "Data Pull Schedule",
                },
                {
                    text: "Schedule data Sync",
                    active: true,
                },
            ],
            id: 0,
            myindex: 0,
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
            scheduleTime: new Date(),
            scheduledesc: "",
            schedules: [],
            editmode: false,
            modaltitle: "Schedules",
            index: 1,
            count: 0,
            fields: [
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
                    label: "Schedule Time",
                    sortable: true,
                },
                "action",
            ],
            headers: [],
            uniqueCars: [],
            pl: "",
        };
    },
    created() {
        // setInterval(() => {
        //     if (this.stoped && !this.showsync) {
        //         //this.upadtearray();
        //     }
        // }, 3000);
        //this.upadtearray();
    },
    computed: {
        /**
         * Total no. of records
         */
        rows() {
            return this.schedules.length;
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
            const data = this.schedules.map((row) => ({
                "S/NO": this.index++,
                Description: row.shedule_description,
                "Sync Time": row.sync_time,
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
            const data = this.schedules.map((row) => ({
                "ID": row.id,
                "Sync Time": row.sync_time,
                "Description": row.shedule_description,
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
                .get("listschedules/")
                .then((res) => {
                    console.log(res.data);
                    this.schedules = res.data;
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
        handleSubmit() {
            console.log("Error on submit");
        },
        edit(index, id, shedule_description, sync_time) {
            this.modaltitle = "Edit Schedule";
            this.editmode = true;
            this.id = id;
            this.myindex = index;
            this.scheduledesc = shedule_description;
            this.scheduleTime = sync_time;
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
                        axios.delete("listschedules/" + this.id,
                            { delete_status: 1 });
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
        clearvalues() {
            this.editmode = false
            this.modaltitle = "Add Schedule"
        },
    },
    middleware: "authentication",
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />

        <div class="row">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-xl-12">
                        <div class="card mb-0">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row justify-content-between">
                                                <div class="col-sm-6">
                                                    <button class="btn btn-success waves-effect waves-light uil-export"
                                                        @click="getrpt()">
                                                        Export to CSV
                                                    </button>
                                                </div>
                                                <div class="col-sm-2">
                                                    <button @click="printpdf('p')" v-b-modal.modal-Print
                                                        class="btn btn-success waves-effect waves-light mdi-file-pdf ">
                                                        Print PDF
                                                    </button>
                                                </div>
                                                <div class="col-sm-2">
                                                    <button v-b-modal.modal-schedule
                                                        class="btn btn-success waves-effect waves-light uil-focus-add "
                                                        @click="clearvalues()">
                                                        Add {{ title }}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                        class="table table-centered datatable dt-responsive nowrap table-card-list dataTable no-footer dtr-inline">
                                                        <div class="row">
                                                            <div class="col-sm-12 col-md-6">
                                                                <div id="tickets-table_length" class="dataTables_length">
                                                                    <label
                                                                        class="d-inline-flex align-items-center fw-normal">
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
                                                                        class="d-inline-flex align-items-center fw-normal">
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

                                                        <b-table
                                                            table-class="table table-centered datatable table-card-list"
                                                            thead-tr-class="bg-transparent" :items="schedules"
                                                            :fields="fields" responsive="sm" :per-page="perPage"
                                                            :current-page="currentPage" :sort-by.sync="sortBy"
                                                            :sort-desc.sync="sortDesc" :filter="filter"
                                                            :filter-included-fields="filterOn" @filtered="onFiltered">
                                                            <template v-slot:cell(check)="data">
                                                                <div class="custom-control custom-checkbox">
                                                                    <input type="checkbox" class="custom-control-input"
                                                                        :id="`contacusercheck${data.item.id}`" />
                                                                    <label class="custom-control-label"
                                                                        :for="`contacusercheck${data.item.id}`"></label>
                                                                </div>
                                                            </template>
                                                            <template v-slot:cell(action)="data">
                                                                <ul class="list-inline mb-0">
                                                                    <li class="list-inline-item">
                                                                        <a href="javascript:void(0);"
                                                                            class="px-2 text-success" v-b-tooltip.hover
                                                                            title="Edit" v-b-modal.modal-schedule @click="
                                                                                edit(
                                                                                    data.index,
                                                                                    data.item.id,
                                                                                    data.item.shedule_description,
                                                                                    data.item.sync_time,
                                                                                )
                                                                            ">
                                                                            <i class="uil uil-pen font-size-18"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li class="list-inline-item">
                                                                        <a href="javascript:void(0);"
                                                                            class="px-2 text-danger" v-b-tooltip.hover
                                                                            title="Delete" @click="
                                                                                deleterec(
                                                                                    data.index,
                                                                                    data.item.id,
                                                                                    data.item.shedule_description
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
                                                                class="dataTables_paginate paging_simple_numbers float-end">
                                                                <ul class="pagination pagination-rounded">
                                                                    <!-- pagination -->
                                                                    <b-pagination v-model="currentPage" :total-rows="srows"
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
                        </div>
                    </div>
                </div>
                <b-modal id="modal-schedule" :title="modaltitle" hide-footer size="lg" centered>
                    <schedule :modaltitle="modaltitle" :editmode="editmode" :id="id" :myindex="myindex"
                        :schedules="schedules" :scheduleTime="scheduleTime" :scheduledesc="scheduledesc" />
                </b-modal>
                <b-modal id="modal-Print" title="Print PDF" hide-footer size="bg" centered>
                    <reportdet :title="title" :schedules="schedules" :pl="pl" :headers="headers" :uniqueCars="uniqueCars"
                        :shome="showme" v-if="showme"></reportdet>
                </b-modal>
            </div>
        </div>
    </Layout>
</template>
