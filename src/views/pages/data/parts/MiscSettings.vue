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
            max_similarity: 0,
            merge_25_plus: false,
            merger_1_to_9: false,
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
            this.merge_25_plus = this.orderData[0].merge_25_plus_ages;
            this.merger_1_to_9 = this.orderData[0].merger_1_to_9_ages;
            this.max_similarity = this.orderData[0].max_word_similarity;
        },
        comitMiscSettings() {
            var data = {
                merge_25_plus_ages: this.merge_25_plus,
                merger_1_to_9_ages: this.merger_1_to_9,
                max_word_similarity: this.max_similarity,
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
        updateMiscSettings() {
            var data = {
                id: this.id,
                merge_25_plus_ages: this.merge_25_plus,
                merger_1_to_9_ages: this.merger_1_to_9,
                max_word_similarity: this.max_similarity,
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
    <b-card header="Misc." header-tag="header" footer="Misc." footer-tag="footer" title=""
        header-class="bg-success text-white">
        <div class="row">
            <div class="col-sm-7 col-sm-6 col-sm-3">
                <b-form-checkbox switch size="sm" class="ml-2" v-model="merge_25_plus"><span
                        class="badge badge-pill badge-secondary text-dark">Merge all
                        Datim
                        Elements with
                        25-29,...64+ ages as 25+ age-group</span>
                </b-form-checkbox>
                <b-form-checkbox switch size="sm" class="ml-2" v-model="merger_1_to_9"><span
                        class="badge badge-pill badge-secondary text-dark">Merge all
                        Datim Elements with
                        1-9,5-9,1-4
                        ages as 1-9 age-group</span></b-form-checkbox>
                <b-input-group prepend="Maximum Word Similarities" class="p-2 overflow-auto word-wrap">
                    <b-form-input type="number" v-model="max_similarity" class="w-50"></b-form-input>
                    <b-input-group-append>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </div>
        <div class="row p-2 mt-4">
            <div class="right">
                <b-button type="submit" variant="success" @click="comitMiscSettings()" v-if="!editmode">Commit
                    Configurations</b-button>
                <b-button type="submit" variant="success" @click="updateMiscSettings()" v-if="editmode">Update
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
