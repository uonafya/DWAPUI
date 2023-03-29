<script>
import appConfig from "@/app.config";
import Swal from "sweetalert2";
import axios from '../../../../Axiosconfig';
//import vue2Dropzone from "vue2-dropzone";

import "vue2-dropzone/dist/vue2Dropzone.min.css";
/**
 * User list component
 */
export default {
    props: {
        orderData: Array,
        editmode: Boolean,
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
            id: 1,
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
            gender_regex: "",
            age_group_regex: "",
        };
    },
    created() {
        setInterval(() => {
            if (this.stoped) {
                //this.upadtearray();
            }
        }, 5000);
        //this.upadtearray();
    },
    computed: {
    },
    mounted() {
        this.updateFields();
    },
    methods: {
        updateFields() {
            this.id = this.orderData[0].id;
            this.age_group_regex = this.orderData[0].age_group_regex;
            this.gender_regex = this.orderData[0].gender_regex;
        },
        comitRegexes() {
            var data = {
                age_group_regex: this.age_group_regex,
                gender_regex: this.gender_regex,
            };
            axios.post("rules/regex/", data).then((res) => {
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
        },
        updateRegexes() {
            var data = {
                id: this.id,
                age_group_regex: this.age_group_regex,
                gender_regex: this.gender_regex,
            };
            axios.put("rules/regex/" + this.id + "/", data).then((res) => {
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
    middleware: "authentication",
};
</script>

<template>
    <b-card header="Regex" header-tag="header" footer="Regex" footer-tag="footer" title=""
        header-class="bg-success text-white">
        <div class="row">
            <div class="col-sm-8">
                <b-input-group prepend="Age-Group Regex" class="p-2">
                    <b-form-input type="text" v-model="age_group_regex" class="w-50"></b-form-input>
                    <b-input-group-append>
                    </b-input-group-append>
                </b-input-group>
                <b-input-group prepend="Gender Regex" class="p-2">
                    <b-form-input type="text" v-model="gender_regex" class="w-50"></b-form-input>
                    <b-input-group-append>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </div>
        <div class="row p-2 mt-4">
            <div class="right">
                <b-button type="submit" variant="success" @click="comitRegexes()" v-if="!editmode">Commit
                    Configurations</b-button>
                <b-button type="submit" variant="success" @click="updateRegexes()" v-if="editmode">Update
                    Configurations</b-button>
            </div>
        </div>
    </b-card>
</template>
<style scoped>
@media (max-width: 768px) {

    /* use the max to specify at each container level */
    .specifictd {
        width: 360px;
        /* adjust to desired wrapping */
        display: table;
        white-space: pre-wrap;
        /* css-3 */
        white-space: -moz-pre-wrap;
        /* Mozilla, since 1999 */
        white-space: -pre-wrap;
        /* Opera 4-6 */
        white-space: -o-pre-wrap;
        /* Opera 7 */
        word-wrap: break-word;
        /* Internet Explorer 5.5+ */
    }
}
</style>
