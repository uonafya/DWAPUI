<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Swal from "sweetalert2";
import axios from "../../../Axiosconfig";
//import vue2Dropzone from "vue2-dropzone";
import RenameCols from "./parts/RenameCols.vue";
import Elements from "@/views/pages/data/parts/MappingElements";
import Regex from "@/views/pages/data/parts/Regex";
import MiscSettings from "@/views/pages/data/parts/MiscSettings";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
/**
 * User list component
 */
export default {
  components: { Elements, Layout, MiscSettings, PageHeader, RenameCols, Regex },
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
      title: "Mapping Rules",
      modaltitle: "Add New",
      items: [
        {
          text: "Data Mapping",
        },
        {
          text: "Mapping Rules",
          active: true,
        },
      ],
      id: 1,
      myindex: "",
      orderData: [],
      regex: [],
      misc: [],
      newcols: [],
      elems: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 50,
      pageOptions: [
        1,
        5,
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
      //tabs
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false,
      //timeline1
      timeline1_status: "?",
      //&check;
      timeline1_last_updated: new Date(),
      timeline1_color: "red",
      //timeline2
      timeline2_last_updated: new Date(),
      timeline2_status: "?",
      //&check;
      timeline2_color: "red",
      //timeline3
      timeline3_last_updated: new Date(),
      timeline3_status: "?",
      //&check;
      timeline3_color: "red",
      //timeline4
      timeline4_last_updated: new Date(),
      timeline4_status: "?",
      //&check;
      timeline4_color: "red",
      editcols: false,
      editregex: false,
      editnewcols: false,
      editelems: false,
      editmisc: false,
      datim_col_name: "",
      moh_col_name: "",
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
  computed: {},
  mounted() {
    this.upadtearray();
  },
  methods: {
    upadtearray() {
      axios
        .get("rules/cols/")
        .then((res) => {
          console.log(res.data);
          this.orderData = res.data;
          if (this.orderData.length > 0) {
            this.editcols = true;
            this.id = res.data[0].id;
            this.datim_col_name = res.data[0].datim_main_comparison_column;
            this.moh_col_name = res.data[0].moh_main_comparison_column;
            this.timeline1_color = "blue";
            this.timeline1_last_updated = new Date(res.data[0].last_updated);
            this.timeline1_status = "&check;";
          }
        })
        .then(() => {
          axios.get("rules/regex/").then((res) => {
            this.regex = res.data;
            if (this.regex.length > 0) {
              this.editregex = true;
              this.timeline3_color = "blue";
              this.timeline3_last_updated = new Date(res.data[0].last_updated);
              this.timeline3_status = "&check;";
            }
            axios.get("rules/elements/").then((res) => {
              this.elems = res.data;
              if (this.elems.length > 0) {
                this.editelems = true;
                this.timeline2_color = "blue";
                this.timeline2_last_updated = new Date(res.data[0].last_updated);
                this.timeline2_status = "&check;";
              }
              axios.get("rules/rename/").then((res) => {
                this.newcols = res.data;
                axios.get("rules/misc/").then((res) => {
                  this.misc = res.data;
                  if (this.misc.length > 0) {
                    this.editmisc = true;
                    this.timeline4_color = "blue";
                    this.timeline4_last_updated = new Date(res.data[0].last_updated);
                    this.timeline4_status = "&check;";
                  }
                });
              });
            });
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
    comitDatimMOHCols() {
      var data = {
        datim_main_comparison_column: this.datim_col_name,
        moh_main_comparison_column: this.moh_col_name,
      };
      axios
        .post("rules/cols/", data)
        .then((res) => {
          console.log(res);
          Swal.fire({
            title: "Success!",
            icon: "success",
            html: "Changes committed to datastore!",
            closeButtonHtml: "Close",
            showCloseButton: true,
            timer: 3000,
          });
        })
        .catch((e) => {
          Swal.fire({
            title: "Error!",
            icon: "danger",
            html: e,
            closeButtonHtml: "Close",
            showCloseButton: true,
            timer: 3000,
          });
        });
    },
    updateDatimMOHCols() {
      var data = {
        id: this.id,
        datim_main_comparison_column: this.datim_col_name,
        moh_main_comparison_column: this.moh_col_name,
      };
      axios
        .put("rules/cols/" + this.id + "/", data)
        .then((res) => {
          console.log(res);
          Swal.fire({
            title: "Success!",
            icon: "success",
            html: "Changes committed to datastore!",
            closeButtonHtml: "Close",
            showCloseButton: true,
            timer: 3000,
          });
        })
        .catch((e) => {
          Swal.fire({
            title: "Error!",
            icon: "danger",
            html: e,
            closeButtonHtml: "Close",
            showCloseButton: true,
            timer: 3000,
          });
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
      <div class="col-sm-4">
        <!-- rule1-->
        <vue-timeline-update
          :date="timeline1_last_updated"
          :title="timeline1_status"
          description="Define at least one column from each dataset to be considered when mapping indicators"
          thumbnail="/images/vuetimeline/initial_d.jpg"
          category="Dataset Columns"
          icon="pill"
          :color="timeline1_color"
        />

        <!-- rule2 -->
        <vue-timeline-update
          :date="timeline2_last_updated"
          :title="timeline2_status"
          description="Key Elements to consider from the 2 columns in rule one when mapping."
          thumbnail="/images/vuetimeline/hunter_x_hunter.jpg"
          category="Key Mapping Elements"
          icon="pill"
          :color="timeline2_color"
        />

        <!-- rule3 -->
        <vue-timeline-update
          :date="timeline3_last_updated"
          :title="timeline3_status"
          description="Define Regex for extracting/comparing the the key defined elements in each column."
          thumbnail="/images/vuetimeline/ghost_in_the_shell.jpg"
          category="Series Regex"
          icon="pill"
          :color="timeline3_color"
        />
        <vue-timeline-update
          :date="timeline4_last_updated"
          :title="timeline4_status"
          description="Addtional mapping configurations."
          thumbnail="/images/vuetimeline/ghost_in_the_shell.jpg"
          category="More Settings"
          icon="pill"
          :color="timeline4_color"
          is-last
        />
      </div>
      <div class="col-sm-8">
        <div class="card mb-0">
          <b-tabs content-class="p-4" justified class="nav-tabs-custom">
            <b-tab :active="tab1">
              <template v-slot:title class="">
                <i class="uil uil-table font-size-20"></i>
                <span class="d-none d-sm-block">Series Columns</span>
              </template>
              <b-card
                header="Columns"
                header-tag="header"
                footer="Columns"
                footer-tag="footer"
                title=""
                header-class="bg-success text-white"
              >
                <div class="row">
                  <b-card
                    header="DATIM-MOH MAPPING COLUMNS"
                    header-tag="header"
                    footer=""
                    footer-tag=""
                    title=""
                    header-class="bg-light text-success"
                  >
                    <div class="col-sm-8">
                      <b-input-group prepend="Datim Column Name" class="p-2">
                        <b-form-input
                          type="text"
                          v-model="datim_col_name"
                          class="w-50"
                        ></b-form-input>
                        <b-input-group-append> </b-input-group-append>
                      </b-input-group>
                      <b-input-group prepend="MOH Column Name" class="p-2">
                        <b-form-input
                          type="text"
                          v-model="moh_col_name"
                          class="w-50"
                        ></b-form-input>
                        <b-input-group-append> </b-input-group-append>
                      </b-input-group>
                    </div>
                    <div class="row p-2 mt-4">
                      <div class="right">
                        <b-button
                          type="submit"
                          variant="success"
                          @click="comitDatimMOHCols()"
                          v-if="!editcols"
                          >Commit Configurations</b-button
                        >
                        <b-button
                          type="submit"
                          variant="success"
                          @click="updateDatimMOHCols()"
                          v-if="editcols"
                          >Update Configurations</b-button
                        >
                      </div>
                    </div>
                  </b-card>
                </div>
                <div class="row">
                  <div class="col-sm-12">
                    <b-card
                      header="Rename Columns"
                      header-tag="header"
                      footer="Rename Columns"
                      footer-tag="footer"
                      title=""
                    >
                      <RenameCols :orderData="newcols" :editmode="editnewcols" />
                    </b-card>
                  </div>
                </div>
              </b-card>
            </b-tab>
            <b-tab :active="tab2">
              <template v-slot:title class="">
                <i class="uil uil-data-sharing font-size-20"></i>
                <span class="d-none d-sm-block">Mapping Elements</span>
              </template>
              <Elements :orderData="elems" :editmode="editelems" />
            </b-tab>
            <b-tab :active="tab3">
              <template v-slot:title class="">
                <i class="uil uil-sync font-size-20"></i>
                <span class="d-none d-sm-block">Regex Definations</span>
              </template>
              <Regex :orderData="regex" :editmode="editregex" />
            </b-tab>
            <b-tab :active="tab4">
              <template v-slot:title class="">
                <i class="uil uil-cog font-size-20"></i>
                <span class="d-none d-sm-block">Misc Settings</span>
              </template>
              <MiscSettings :orderData="misc" :editmode="editmisc" />
            </b-tab>
          </b-tabs>
          <!-- Nav tabs -->
          <!-- Tab content -->
        </div>
      </div>
    </div>
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
