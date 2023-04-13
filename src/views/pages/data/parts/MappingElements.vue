
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
            toggle_gender: false,
            toggle_similarity: false,
            toggle_group: false,
        };
    },
    created() {
    },
    computed: {
    },
    mounted() {
        this.updateFields();
    },
    methods: {
        updateFields() {
            axios
                .get("rules/elements/")
                .then((res) => {
                    if (res.data.length > 0) {
                        this.orderData = res.data;
                        this.id = this.orderData[0].id;
                        this.toggle_gender = this.orderData[0].gender;
                        this.toggle_group = this.orderData[0].age_group;
                        this.toggle_similarity = this.orderData[0].similar_words;
                    }
                }
                ).catch((e) => {
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
        comitElems() {
            var data = {
                gender: this.toggle_gender,
                age_group: this.toggle_group,
                similar_words: this.toggle_similarity,
            };
            axios.post("rules/misc/", data).then((res) => {
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
        updateElems() {
            var data = {
                id: this.id,
                gender: this.toggle_gender,
                age_group: this.toggle_group,
                similar_words: this.toggle_similarity,
            };
            axios.put("rules/misc/" + this.id + "/", data).then((res) => {
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
    <b-card header="Check All Three(Recommended)" header-tag="header" footer="Elements" footer-tag="footer" title=""
        header-class="bg-success text-white">
        <div class="row">
            <div class="col-sm-4">
                <b-input-group prepend="Age-Groups" switch size="sm" class="p-2">
                    <b-form-checkbox type="text" v-model="toggle_group" class="w-50"></b-form-checkbox>
                    <b-input-group-append>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <div class="col-sm-4">
                <b-input-group prepend="Gender" switch size="sm" class="p-2">
                    <b-form-checkbox type="text" v-model="toggle_gender" class="w-50"></b-form-checkbox>
                    <b-input-group-append>
                    </b-input-group-append>
                </b-input-group>
            </div>
            <div class="col-sm-4">
                <b-input-group prepend="Word Similarity" switch size="sm" class="p-2">
                    <b-form-checkbox type="text" v-model="toggle_similarity" class="w-50"></b-form-checkbox>
                    <b-input-group-append>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </div>
        <div class="row p-2 mt-4">
            <div class="right">
                <b-button type="submit" variant="success" @click="comitElems()" v-if="!editmode">Commit
                    Configurations</b-button>
                <b-button type="submit" variant="success" @click="updateElems()" v-if="editmode">Update
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
