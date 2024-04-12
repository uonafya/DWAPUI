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
    from: {
      type: Date,
      default: new Date("2024-02-01"),
    },
    county: {
      type: String,
      default: "kisii",
    },
    org_level: {
      type: String,
      default: "-5",
    },
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
    this.getReportData();
  },
  methods: {
    // Function to fetch PMTCT data
    async fetchPMTCTData() {
      const username = JSON.parse(localStorage.user).username;
      //console.log(username);
      const selectedCounty = this.county;
      const orgLevel = this.org_level;
      let period = moment(this.from).format("YYYYMM");
      const cacheKey = `pmtct_data_${username}_${selectedCounty}_${orgLevel}_${period}`;
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      console.log(cacheKey);
      console.log(cachedData);
      const currentTime = Date.now();
      // Check if cached data is available and not expired
      if (cachedData && currentTime - cachedData.timestamp < 24 * 60 * 60 * 1000) {
        this.pmtct_data = cachedData.data;
      } else {
        localStorage.removeItem(cacheKey);
        await axios
          .post(
            `pmtct-data/?period=${period}&org_level=${
              "-" + orgLevel.toString()
            }&org_name=${selectedCounty}`,
            {}
          )
          .then((response) => {
            this.pmtct_data = response.data["data"];
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ data: this.pmtct_data, timestamp: currentTime })
            );
            Swal.close();
          });
      }
    },
    // Function to fetch EID data
    //Sections 1: Intro 2:definition 3: data {a:hiv testing,b:maternal HAART,c:infant prophylaxis,d:eid testing} 4:actions
    async fetchEIDData() {
      const username = JSON.parse(localStorage.user).username;
      //console.log(username);
      let selectedCounty = this.county;
      const period = moment(this.from).format("YYYYMM");
      const cacheKey = `eid_data_${username}_${selectedCounty}_${period}`;
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      console.log(cacheKey);
      console.log(cachedData);
      const currentTime = Date.now();
      // Check if cached data is available and not expired
      if (cachedData && currentTime - cachedData.timestamp < 24 * 60 * 60 * 1000) {
        this.eid_vl_data = cachedData.data;
      } else {
        localStorage.removeItem(cacheKey);
        axios.post(`eid-data/?period=${period}&org_name=${selectedCounty}`, {}).then((response) => {
          this.eid_vl_data = response.data;
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: this.eid_vl_data, timestamp: currentTime })
          );
          Swal.close();
        });
      }
    },
    getReportData() {
      //localStorage.clear();
      var data = [];
      var data1 = [];
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
      this.fetchPMTCTData();
      this.fetchEIDData();
      Swal.close();
      data = this.pmtct_data.map((row) => ({
        "Org Unit": row.ou_name,
        "New ANC Clients": row.moh_711_new,
        "Known Positive at 1st ANC": row.moh_731_HV02_03,
        "Initial test at ANC": row.moh_731_HV02_04,
        "Initial test at L&D": row.moh_731_HV02_05,
        "Initial test at PNC_PNC<=6wks": row.moh_731_HV02_06,
        "Missed Opportuanities": row.missed_opp,
        Status: row.missed_opp_status,
      }));
      data1 = this.eid_vl_data.map((row) => ({
        County: row.county,
        Subcounty: row.subcounty,
        Ward: row.ward,
        Facility: row.facility,
        "MFL Code": row.facilitycode,
        Enrolled: row.enrolled,
        Positives: row.positives,
        "Pending Enrollment": Number(row.positives) - Number(row.enrolled),
      }));
      //console.log(data);
      //get headers
      this.title = this.report;
      const headers = Object.keys(data[0]);
      const headers1 = Object.keys(data1[0]);
      const cars = [];
      const cars1 = [];
      Object.entries(data).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        cars.push(Object.values(data[key]));
      });
      Object.entries(data1).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        cars1.push(Object.values(data1[key]));
      });
      const uniqueCars = Array.from(new Set(cars));
      const uniqueCars1 = Array.from(new Set(cars1));
      this.generateReport(headers, uniqueCars, headers1, uniqueCars1);
    },
    generateReport(h, d, h1, d1) {
      //print doc
      //Sections 1: Intro 2:definition 3: data {a:hiv testing,b:maternal HAART,c:infant prophylaxis,d:eid testing} 4:actions
      const filename = moment(new Date()).format("YYYY-MM-DD-HH:MM:SS");
      var doc = new jsPDF(this.pl);
      var doc_width=doc.internal.pageSize.width;
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(5, 5, 200, 30, 1, 1, "FD");
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(10);
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFont("Tahoma");
      doc.text(72, 10, "MINISTRY OF HEALTH");
      doc.text(72, 15, "Division of National AIDs & STI Control Program");
      doc.text(72, 20, "P.O. Box 19361 – 00202 NAIROBI, KENYA");
      doc.text(72, 25, "Phone: 1-800-7878-09 | Email: info@nascop.or.ke");
      doc.text(155, 30, "Print Date: " + moment(new Date()).format("DD-MM-YYYY HH:MM"));
      //doc.text(10, 40, this.title);
      doc.text(72, 33, "System Unit: Integrated Data IL");
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
        doc.text(
          5,
          40,
          this.county+" "+this.report +
            `\t\t\t\t\tReporting Period: ${moment(this.from).format("YYYY/MM")}`
        );
      } catch (e) {
        console.log(e);
      }
      doc.line(2,42,doc_width-5,42)
      //report intro
      doc.text(5, 50, "SECTION 1: INTRODUCTION");
      doc.line(5, 51, 70, 51);
      doc.addFont("Tahoma", "Tahoma", "light");
      doc.setFontSize(12);
      let intro =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";
      var introp = doc.splitTextToSize(intro, doc_width-5);
      doc.text(5, 56, introp);
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFontSize(14);
      //section 1A - Indicator Defination
      doc.text(5, 85, "SECTION 2: INDICATOR DEFINITION");
      doc.setFontSize(12);
      let table_heads = ["Indicator","Definition","Description"];
      let table_body = [
        ["A", "",""],
        ["B","" ,""],
      ];
      doc.autoTable({
        head: [table_heads],
        body: table_body,
        startY: 90,
        margin: { horizontal: 4 },
        styles: {
          columnWidth: "wrap",
          fontSize: 9,
          overflow: "linebreak",
          cellWidth: "auto",
        },
        columnStyles: {
          2: { cellWidth: "auto" },
          nil: { halign: "center" },
          tgl: { halign: "center" },
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
      var startY = doc.autoTable.previous.finalY + 20;
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFontSize(14);
      //section A - Indicator Defination
      doc.text(5, startY, "SECTION 3A: HIV TESTING REPORTS");
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
            fontSize: 9,
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
          createdCell: function (data) {
            if (data.row.raw[h.indexOf("Status")] === "missed") {
              data.cell.styles.fillColor = [255, 0, 0]; // Danger background for critical status
            } else if (data.row.raw[h.indexOf("Status")] === "okay") {
              data.cell.styles.fillColor = [255, 255, 255]; // Success background for stable status
            }
          },
        });
        // Simple html example
        doc.addPage();
        startY =20;
        doc.addFont("Tahoma", "Tahoma", "bold");
        doc.setFontSize(14);
        //Sections 1: Intro 2:definition 3: data {a:hiv testing,b:maternal HAART,c:infant prophylaxis,d:eid testing} 4:actions
        //section A - Indicator Defination
        doc.text(5, startY, "SECTION 3B: MATERNAL HAART REPORTS");
        doc.setFontSize(9);
        doc.autoTable({
        head: [["A","B"]],
        body: [["",""],],
        startY: startY + 4,
        margin: { horizontal: 1 },
        theme:"grid",
        });
        startY = doc.autoTable.previous.finalY + 20;
        doc.addFont("Tahoma", "Tahoma", "bold");
        doc.setFontSize(14);
        //Sections 1: Intro 2:definition 3: data {a:hiv testing,b:maternal HAART,c:infant prophylaxis,d:eid testing} 4:actions
        //section A - Indicator Defination
        doc.text(5, startY, "SECTION 3C: INFANT PROPHYLAXIS REPORTS");
        doc.setFontSize(9);
        doc.autoTable({
        head: [["A","B"]],
        body: [["",""],],
        startY: startY + 4,
        margin: { horizontal: 1 },
        theme:"grid",
        });
        //Sections 1: Intro 2:definition 3: data {a:hiv testing,b:maternal HAART,c:infant prophylaxis,d:eid testing} 4:actions
        //section A - Indicator Defination
        startY = doc.autoTable.previous.finalY + 20;
        doc.addFont("Tahoma", "Tahoma", "bold");
        doc.setFontSize(14);
        doc.text(5, startY, "SECTION 3C: EID/VL TESTING REPORTS");
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
            fontSize: 9,
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
        @click="getReportData()"
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
