<template>
    <b-list-group>
        <div class="row">
            <div class="col-sm-6">
                <b-list-group-item button class="bg-secondary text-white">Original Column</b-list-group-item>
                <form @submit.prevent="submitForm">
                    <b-list-group-item class="p-0 m-0" v-for="(field, index) in originalcols" :key="index">
                        <b-input-group :prepend="'Col' + index" switch size="sm" class="p-0 m-0">
                            <b-form-input :type="field.type" :name="field.name" v-model="field.value" class="form-control"
                                disabled></b-form-input>
                            <b-input-group-append>
                            </b-input-group-append>
                        </b-input-group>
                    </b-list-group-item>
                </form>
            </div>
            <div class="col-sm-6">
                <b-list-group-item button class="bg-success text-white">Rename To</b-list-group-item>
                <form @submit.prevent="submitForm">
                    <b-list-group-item class="p-0 m-0" v-for="(field, index) in originalcols" :key="index">
                        <b-input-group :prepend="'NewCol' + index" switch size="sm" class="p-0 m-0">
                            <b-form-input :type="field.type" :name="field.name" v-model="field.value"
                                class="form-control"></b-form-input>
                            <b-input-group-append>
                            </b-input-group-append>
                        </b-input-group>
                    </b-list-group-item>
                </form>
            </div>
            <div class="row p-2 mt-4">
                <div class="right">
                    <b-button type="submit" variant="success" @click="comitDatimMOHCols()" v-if="!editmode">Rename
                    </b-button>
                    <b-button type="submit" variant="success" @click="updateDatimMOHCols()" v-if="editmode">Update
                        Names</b-button>
                </div>
            </div>
        </div>
    </b-list-group>
</template>
<script>
import appConfig from "@/app.config";
import Swal from "sweetalert2";
import axios from '../../../../Axiosconfig';
//import vue2Dropzone from "vue2-dropzone";

import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
    props: {
        newcols: Array,
        editmode: Boolean,
        originalcols: Array,
    },
    components: {},
    page: {
        title: "Mapping Rules",
        meta: [
            {
                name: "description",
                content: appConfig.description,
            },
        ],
    },
    data() {
        return {
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
            fields: [],
        };
    },
    mounted() {

    },
    methods: {
        comitRegexes() {
            var data = {};
            axios.post("rules/renamecols/", data).then((res) => {
                console.log(res)
                Swal.fire({
                    title: "Success!",
                    icon: "success",
                    html: "Changes committed to datastore!",
                    closeButtonHtml: "Close",
                    showCloseButton: true,
                    timer: 3000,
                })
            }).catch((e) => {
                Swal.fire({
                    title: "Error!",
                    icon: "danger",
                    html: e,
                    closeButtonHtml: "Close",
                    showCloseButton: true,
                    timer: 3000,
                })
            })
        }
    },
}
</script>