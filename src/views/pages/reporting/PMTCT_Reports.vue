<script
  type="text/javascript"
  src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js"
></script>
<script>
import appConfig from "@/app.config";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "@/Axiosconfig";
import Swal from "sweetalert2";
import moment from "moment";

export default {
  props: {
    from: Date,
    county: String,
    org_level: String,
    report: String,
    title: String,
  },
  page: {
    title: "Reporting",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {},
  data() {
    return {
      pmtct_data: [],
      eid_vl_data: [],
      pl: "p",
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getPMTCTData();
  },
  methods: {
    getPMTCTData() {
      var data = [];
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Please wait...",
        html: "Pulling PMTCT data...",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      //   axios
      //     .post(
      //       `pmtct-data/?period=${moment(this.from).format("YYYYMM")}&org_level=${
      //         "-" + this.org_level.toString()
      //       }&org_name=${this.county}`,
      //       {}
      //     )
      //     .then((response) => {
      //       this.pmtct_data = response.data["data"];
      axios
        .post(
          `eid-data/?period=${moment(this.from).format("YYYYMM")}&org_name=nyandarua`,
          {}
        )
        .then((response) => {
          this.eid_vl_data = response.data;
          Swal.close();
        })
        //})
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error!" + e,
            showConfirmButton: true,
          }).then((e) => {
            Swal.close(e);
          });
        });
      let id = 1;
      //   data = this.pmtct_data.map((row) => ({
      //     "Org Unit": row.ou_name,
      //     "New ANC Clients": row.moh_711_new,
      //     "Known Positive at 1st ANC": row.moh_731_HV02_03,
      //     "Initial test at ANC": row.moh_731_HV02_04,
      //     "Initial test at L&D": row.moh_731_HV02_05,
      //     "Initial test at PNC_PNC<=6wks": row.moh_731_HV02_06,
      //     Status: row.missed_opp_status,
      //     Total: row.moh_711_new + row.moh_731_HV02_01,
      //   }));
      data = this.eid_vl_data.map((row) => ({
        County: row.county,
        Subcounty: row.subcounty,
        Ward: row.ward,
        Facility: row.facility,
        "MFL Code": row.facilitycode,
        Enrolled: row.enrolled,
        Positives: row.positives,
        Total: row.total,
      }));
      //console.log(data);
      //get headers
      this.title = this.report;
      const headers = Object.keys(data[0]);
      const headers1 = headers;
      const cars = [];
      const cars1 = [];
      Object.entries(data).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        cars.push(Object.values(data[key]));
      });
      Object.entries(data).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        cars1.push(Object.values(data[key]));
      });
      const uniqueCars = Array.from(new Set(cars));
      const uniqueCars1 = Array.from(new Set(cars));
      this.generateReport(headers, uniqueCars, headers1, uniqueCars1);
    },
    generateReport(h, d, h1, d1) {
      console.log(h1);
      console.log(d1);
      //print doc
      const filename = moment(new Date()).format("YYYY-MM-DD-HH:MM:SS");
      var doc = new jsPDF(this.pl);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(5, 5, 200, 30, 1, 1, "FD");
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(10);
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFont("Tahoma");
      doc.text(70, 10, "MINISTRY OF HEALTH");
      doc.text(70, 15, "Division of National AIDs & STI Control Program");
      doc.text(70, 20, "P.O. Box 19361 – 00202 NAIROBI, KENYA");
      doc.text(70, 25, "Phone: 1-800-7878-09 | Email: info@nascop.or.ke");
      doc.text(155, 30, "Print Date: " + moment(new Date()).format("DD-MM-YYYY HH:MM"));
      //doc.text(10, 40, this.title);
      doc.text(70, 33, "System Unit: Integrated Data IL");
      doc.setFontSize(14);
      doc.addFont("Tahoma", "Tahoma", "bold");

      const logo = require("@/assets/nascoplogo.png");
      const klogo = require("@/assets/images/client.png");
      var imgLogo = new Image();
      var imgKLogo = new Image();
      imgLogo.src = logo;
      imgKLogo.src = klogo;
      doc.addImage(imgLogo, "PNG", 10, 5, 60, 25, 5, 5);
      doc.setFillColor(255, 255, 254);
      doc.roundedRect(1, 1, 14, 9, 1, 1, "F");
      doc.addImage(imgKLogo, "PNG", 1, 1, 12, 7, 3, 3);

      doc.setFillColor(0, 255, 0);
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFontSize(14);
      try {
        doc.text(5, 40, this.report);
      } catch (e) {
        console.log(e);
      }
      //report intro
      doc.text(5, 50, "INTRODUCTION");
      doc.line(5, 51, 42, 51);
      doc.addFont("Tahoma", "Tahoma", "light");
      doc.setFontSize(12);
      let intro =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";
      var introp = doc.splitTextToSize(intro, this.pl === "l" ? 280 : 200);
      doc.text(5, 56, introp);
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFontSize(14);
      //section 1A - Indicator Defination
      doc.text(5, 85, "Section 1A: Indicator Defination");
      doc.setFontSize(12);
      let table_heads = ["Indicator", "Defination"];
      let table_body = [
        ["A", ""],
        ["B", ""],
      ];
      doc.autoTable({
        head: [table_heads],
        body: table_body,
        startY: 90,
        margin: { horizontal: 4 },
        styles: {
          columnWidth: "wrap",
          fontSize: 7,
          overflow: "linebreak",
          cellWidth: "auto",
        },
        columnStyles: {
          2: { cellWidth: "auto" },
          nil: { halign: "left" },
          tgl: { halign: "left" },
        },
        headerStyles: {
          halign: "center",
          fillColor: [0, 150, 120],
          textColor: [255, 255, 255],
          lineColor: [0, 0, 0],
        },
        bodyStyles: { lineColor: [0, 0, 0] },
        theme: "grid",
      });
      var startY = doc.autoTable.previous.finalY + 10;
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFontSize(14);
      //section A - Indicator Defination
      doc.text(5, startY, "Section 1B: PMTCT Reports");
      doc.setFontSize(9);
      // Simple data example
      var head = [h];
      var body = d;
      if (event == "Excel") {
        //alert(this.records.length);
        if (this.records.length == 0) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "No Data ",
            showConfirmButton: true,
          }).then((e) => {
            Swal.close(e);
          });
        }
        const csvRows = [];
        const headers = headers;
        csvRows.push(headers.join(","));
        //loop over the headers
        for (const row of d) {
          const values = headers.map((header) => {
            const escaped = ("" + row[header]).replace(/"/g, '\\"');
            return '"' + escaped + '"';
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
      } else {
        //alert();
        doc.autoTable({
          head: head,
          body: body,
          // margin: { left: 5.5, top: 52 },
          startY: startY + 4,
          margin: { horizontal: 1 },
          didDrawCell: function () {
            //
          },
          styles: {
            columnWidth: "wrap",
            fontSize: 7,
            overflow: "linebreak",
            cellWidth: "auto",
          },
          columnStyles: {
            2: { cellWidth: "auto" },
            nil: { halign: "left" },
            tgl: { halign: "left" },
          },
          headerStyles: {
            halign: "center",
            fillColor: [0, 150, 120],
            textColor: [255, 255, 255],
            lineColor: [0, 0, 0],
          },
          bodyStyles: { lineColor: [0, 0, 0] },
          theme: "grid",
        });
        // Simple html example
        var startY = doc.autoTable.previous.finalY + 10;
        doc.addFont("Tahoma", "Tahoma", "bold");
        doc.setFontSize(14);
        //section A - Indicator Defination
        doc.text(5, startY, "Section 1C: EID/VL Reports");
        doc.setFontSize(9);
        doc.autoTable({
          head: [h1],
          body: d1,
          // margin: { left: 5.5, top: 52 },
          startY: startY + 4,
          margin: { horizontal: 1 },
          didDrawCell: function () {
            //
          },
          styles: {
            columnWidth: "wrap",
            fontSize: 7,
            overflow: "linebreak",
            cellWidth: "auto",
          },
          columnStyles: {
            2: { cellWidth: "auto" },
            nil: { halign: "left" },
            tgl: { halign: "left" },
          },
          headerStyles: {
            halign: "center",
            fillColor: [0, 150, 120],
            textColor: [255, 255, 255],
            lineColor: [0, 0, 0],
          },
          bodyStyles: { lineColor: [0, 0, 0] },
          theme: "grid",
        });
        //page numbering
        var height = 190;
        var width = 290;
        if (this.pl == "l") {
          height = 190;
          width = 200;
        }
        const pageCount = doc.internal.getNumberOfPages();
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(
            "USAID Kenya | UNES | UoN | Ministry of Health                            Prepared by:titusowuor30@gmail.com" +
              "                                 Page " +
              String(i) +
              " of " +
              String(pageCount),
            height,
            width,
            null,
            null,
            "right"
          );
        }
        const previewLink = doc.output("bloburl");
        var openeddoc = window.open(
          previewLink,
          "Report",
          "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,top=000,left=500,width=1000,height=1500"
        );
        openeddoc.focus();
      }
    },
  },
};
</script>

<template>
  <!-- buttons -->
  <div class="row">
    <div class="col-sm-4 float-end">
      <b-button
        pill
        variant="outline-primary"
        @click="getPMTCTData()"
        style="margin-right: 10px"
      >
        Generate PMCT Report
      </b-button>
    </div>
  </div>
</template>
<style scoped>
.changebg {
  background-color: rgb(240, 240, 240);
}
</style>
