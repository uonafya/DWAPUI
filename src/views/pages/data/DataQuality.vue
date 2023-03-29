<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
// import Swal from "sweetalert2";
// import axios from '../../../Axiosconfig';
//import vue2Dropzone from "vue2-dropzone";

import "vue2-dropzone/dist/vue2Dropzone.min.css";
/**
 * User list component
 */
export default {
    components: { Layout, PageHeader },
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
            stoped: true,
            showsync: true,
            title: "Data",
            modaltitle: "Add New",
            items: [
                {
                    text: "Data",
                },
                {
                    text: "Data Quality",
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
            fields: [],
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
    },
    methods: {
    },
    middleware: "authentication",
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />


    </Layout>
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
