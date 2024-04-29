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
import definations from "./indicator_defination.js";
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
      default: "-4",
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
      //localStorage.clear()
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
      //localStorage.clear()
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
      var testing_data = [];
      var eid_data = [];
      var maternal_data=[];
      var infant_data=[];

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
      testing_data = this.pmtct_data.map((row) => ({
        "Org Unit": row.ou_name,
        "New ANC Clients": row.moh_711_new,
        "Known Positive at 1st ANC": row.moh_731_HV02_03,
        "Initial test at ANC": row.moh_731_HV02_04,
        "Initial test at L&D": row.moh_731_HV02_05,
        "Initial test at PNC_PNC<=6wks": row.moh_731_HV02_06,
        "Missed Opportuanities": row.missed_opp,
        Status: row.missed_opp_status,
      }));
      // missed_maternal = (moh_731_HV02_10_sum + moh_731_HV02_11_sum + moh_731_HV02_12_sum + moh_731_HV02_13_sum + moh_731_HV02_14_sum)
      // - (moh_731_HV02_16_sum + moh_731_HV02_17_sum + moh_731_HV02_18_sum + moh_731_HV02_19_sum + moh_731_HV02_21_sum)
      maternal_data=this.pmtct_data.map((row) => ({
        "Org Unit": row.ou_name,
        "Total Positive(HV02-10-HV02-14)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "On HAART at 1st ANC HV02-16": row.moh_731_HV02_16,
        "Start HAART_ANC HV02-17": row.moh_731_HV02_17,
        "Start HAART_L&D HV02-18": row.moh_731_HV02_18,
        "Start HAART_PNC<=6wks HV02-19": row.moh_731_HV02_19,
        "Start HAART_PNC> 6weeks to 6 months HV02-21":row.moh_731_HV02_21,
        "Missed Opportuanities": row.missed_maternal,
        Status: row.missed_maternal_status,
      }));
      console.log(maternal_data)
      //infant_missed = (moh_731_HV02_10_sum + moh_731_HV02_11_sum + moh_731_HV02_12_sum + moh_731_HV02_13_sum + moh_731_HV02_14_sum) -
      //(moh_731_HV02_39_sum + moh_731_HV02_40_sum + moh_731_HV02_41_sum)
      infant_data=this.pmtct_data.map((row) => ({
        "Org Unit": row.ou_name,
        "HIV Positive Results (PMTCT)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "Infant ARV Prophyl_ANC HV02-39": row.moh_731_HV02_39,
        "Infant ARV Prophyl_L&D HV02-40": row.moh_731_HV02_40,
        "Infant ARV Prophyl<8wks_PNC HV02-41": row.moh_731_HV02_41,
        "Missed Opportuanities": row.infant_missed,
        Status: row.infant_missed_status,
      }));
      eid_data = this.eid_vl_data.map((row) => ({
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
      const testing_headers = Object.keys(testing_data[0]);
      const maternal_headers = Object.keys(maternal_data[0]);
      const infant_headers = Object.keys(infant_data[0]);
      const eid_headers = Object.keys(eid_data[0]);
      const testing_cars = [];
      const maternal_cars = [];
      const infant_cars = [];
      const eid_cars = [];
      Object.entries(testing_data).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        testing_cars.push(Object.values(testing_data[key]));
      });
      Object.entries(maternal_data).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        maternal_cars.push(Object.values(maternal_data[key]));
      });
      Object.entries(infant_data).forEach((val) => {
      const [key] = val;
      //console.log(key, val);
      infant_cars.push(Object.values(infant_data[key]));
      });
      Object.entries(eid_data).forEach((val) => {
      const [key] = val;
      //console.log(key, val);
      eid_cars.push(Object.values(eid_data[key]));
      });
      const testing_uniqueCars = Array.from(new Set(testing_cars));
      const maternal_uniqueCars = Array.from(new Set(maternal_cars));
      const infant_uniqueCars = Array.from(new Set(infant_cars));
      const eid_uniqueCars = Array.from(new Set(eid_cars));
      this.generateReport(testing_headers, testing_uniqueCars, maternal_headers, maternal_uniqueCars,infant_headers,infant_uniqueCars,eid_headers,eid_uniqueCars);
    },
    generateReport(h,d,h1,d1,h2,d2,h3,d3) {
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
      "Routine antenatal care (ANC) offers an important opportunity to provide high quality combined HIV prevention through targeted health education and counselling; HIV testing for the woman, partners and family members; linkage to HIV prevention and treatment; and to discuss and plan for future conception and contraception needs. Prevention of mother-to-child transmission of HIV (PMTCT)/Syphilis/Hepatitis B should be offered as part of a comprehensive package of fully integrated, routine antenatal care interventions. In financial year 2023/2024, NASCOP undertook an PMTCT RRI to address missed opportunities focusing on data reported in February 2022 to August 2023. A need to routinized the process of data review for immediate action was identified as important in achieving elimination of mother to child HIV transmission.\n\nThis bulletin provides a summary of indicators for monitoring the PMTCT Program at site level.\n\nYour immediate attention on highlighted rows in the report will be appreciated. You raise questions or provide feedback to (email). The report will be automatically shared every Monday";
      var introp = doc.splitTextToSize(intro, doc_width - 5);
      doc.text(5, 56, introp);
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFontSize(14);
      //section 1A - Indicator Defination
      doc.text(5, 125, "SECTION 2: INDICATOR DEFINITION");
      doc.setFontSize(12);
      var startY=130;
      var maxColumnWidths = [0, 0, 0];
      var pl_w=0.794
      if(this.pl==='l'){
        pl_w=1.68;
      }
      // Iterate through the data to calculate maximum column widths
      definations.forEach(section => {
          section.indicators.forEach(indicator => {
          maxColumnWidths[0] = Math.max(maxColumnWidths[0], indicator.Indicator.length);
          maxColumnWidths[1] = Math.max(maxColumnWidths[1], indicator.Source.join('\n').length);
          maxColumnWidths[2] = Math.max(maxColumnWidths[2], indicator.Definition.length);
          });
      });
      // Create table headers
      const headers = ['Indicator', 'Source', 'Definition'];
      // Add table headers
      doc.setFontSize(12);
      doc.autoTable({
      head: [headers],
      startY: startY,
      margin: { horizontal:1,top: 0 },
      styles: { fontSize: 12 },
      headerStyles: {
      halign: "left",
      fillColor: [0, 150, 120],
      textColor: [255, 255, 255],
      lineColor: [255, 255, 255],
      },
      columnStyles: {
      0: { cellWidth: maxColumnWidths[0] * 1.2 }, // Multiply by a factor to adjust width
      1: { cellWidth: maxColumnWidths[1] * 0.8 },
      2: { cellWidth: maxColumnWidths[2] * 1.68 }
      },
      theme: 'grid'
      });
      startY = doc.autoTable.previous.finalY;
      // Iterate through the data
      definations.forEach(section => {
      // Add section title as a row with colspan
      doc.autoTable({
      body: [[{ content: section.section_title, colSpan: 3, styles: { fontSize: 12,fontStyle: 'bold', halign: 'left' } }]],
      startY: startY,
      margin: { horizontal:1,top: 2 },
      theme: 'grid'
      });
      startY = doc.autoTable.previous.finalY;
      // Create table data for indicators within the section
      const tableData = [];
      section.indicators.forEach(indicator => {
      tableData.push([indicator.Indicator, indicator.Source.join('\n'), indicator.Definition]);
      });
      // Add table data
      doc.autoTable({
      body: tableData,
      startY: startY,
      margin: { horizontal:1,top: 2 },
      styles: {
      columnWidth: "wrap",
      fontSize: 10,
      overflow: "linebreak",
      cellWidth: "auto",
      },
      columnStyles: {
      0: { cellWidth: maxColumnWidths[0] * 1.2 }, // Multiply by a factor to adjust width
      1: { cellWidth: maxColumnWidths[1] * 0.8 },
      2: { cellWidth: maxColumnWidths[2] * pl_w }
      },
      theme: 'grid'
      });
      startY = doc.autoTable.previous.finalY;
      });

      ///next section
      doc.addPage();
      var startY = 20;
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
              data.cell.styles.textColor=[255, 255, 255]
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
        head: [h1],
        body:d1,
        startY: startY + 4,
        margin: { horizontal: 1 },
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
        createdCell: function (data) {
          if (data.row.raw[h1.indexOf("Status")] === "missed") {
          data.cell.styles.fillColor = [255, 0, 0]; // Danger background for critical status
          data.cell.styles.textColor=[255, 255, 255]
          }
        },
        });
        doc.addPage();
        startY = 20;
        doc.addFont("Tahoma", "Tahoma", "bold");
        doc.setFontSize(14);
        //Sections 1: Intro 2:definition 3: data {a:hiv testing,b:maternal HAART,c:infant prophylaxis,d:eid testing} 4:actions
        //section A - Indicator Defination
        doc.text(5, startY, "SECTION 3C: INFANT PROPHYLAXIS REPORTS");
        doc.setFontSize(9);
        doc.autoTable({
        head: [h2],
        body: d2,
        startY: startY + 4,
        margin: { horizontal: 1 },
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
        createdCell: function (data) {
        if (data.row.raw[h2.indexOf("Status")] === "missed") {
           data.cell.styles.fillColor = [255, 0, 0]; // Danger background for missed status
           data.cell.styles.textColor=[255, 255, 255]
        }
        },
        });
        //Sections 1: Intro 2:definition 3: data {a:hiv testing,b:maternal HAART,c:infant prophylaxis,d:eid testing} 4:actions
        //section A - Indicator Defination
        doc.addPage();
        startY = 20;
        doc.addFont("Tahoma", "Tahoma", "bold");
        doc.setFontSize(14);
        doc.text(5, startY, "SECTION 3D: EID/VL TESTING REPORTS");
        doc.setFontSize(9);
        doc.autoTable({
          head: [h3],
          body: d3,
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
            console.log(data.row.raw["Pending Enrollment"])
            if (data.row.raw[h3.indexOf("Pending Enrollment")] > 0) {
              data.cell.styles.fillColor = [235,237,209]; // Danger background for critical status
              //data.cell.styles.textColor=[255, 255, 255]
            }
          }
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
          this.title,
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
