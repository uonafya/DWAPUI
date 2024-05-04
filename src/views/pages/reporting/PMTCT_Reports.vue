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
      facility_data: [],
      county_data:[],
      subcounty_data:[],
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
      const countyKey=`pmtct_data_${username}_${selectedCounty}_${2}_${period}`;
      const subcountyKey=`pmtct_data_${username}_${selectedCounty}_${3}_${period}`
      const countyData=JSON.parse(localStorage.getItem(countyKey));
      const subcountyData=JSON.parse(localStorage.getItem(subcountyKey));
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      //console.log(countyData);
      //console.log(cachedData);
      const currentTime = Date.now();
      // Check if cached data is available and not expired
      if (cachedData && currentTime - cachedData.timestamp < 24 * 60 * 60 * 1000) {
        this.facility_data= cachedData.data;
        //get for other levels
        this.county_data=countyData.data;
        //level2data.push({})
        this.subcounty_data=subcountyData.data;                     
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
            let data = response.data["data"];
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ data: data, timestamp: currentTime })
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
      this.fetchPMTCTData();
      this.fetchEIDData();
      //console.log(this.facility_data)
          
      let testing_data_county = this.county_data.map((row) => ({
        "Organisational Unit": row.ou_name,
        "New ANC Clients": row.moh_711_new,
        "Known Positive at 1st ANC": row.moh_731_HV02_03,
        "Initial test at ANC": row.moh_731_HV02_04,
        "Initial test at L&D": row.moh_731_HV02_05,
        "Initial test at PNC_PNC<=6wks": row.moh_731_HV02_06,
        "Missed Opportuanities": row.missed_opp,
        Status: row.missed_opp_status,
      }));
      let testing_data_subcounty = this.subcounty_data.map((row) => ({
        "Organisational Unit": row.ou_name,
        "New ANC Clients": row.moh_711_new,
        "Known Positive at 1st ANC": row.moh_731_HV02_03,
        "Initial test at ANC": row.moh_731_HV02_04,
        "Initial test at L&D": row.moh_731_HV02_05,
        "Initial test at PNC_PNC<=6wks": row.moh_731_HV02_06,
        "Missed Opportuanities": row.missed_opp,
        Status: row.missed_opp_status,
      }));
      
      let testing_data_okay = this.facility_data.filter(x=>x.missed_opp_status==="okay").map((row) => ({
        "Organisational Unit": row.ouNameHierarchy.split('/')[2]+"/"+row.ouNameHierarchy.split('/')[3]+"/"+row.ou_name,
        "New ANC Clients": row.moh_711_new,
        "Known Positive at 1st ANC": row.moh_731_HV02_03,
        "Initial test at ANC": row.moh_731_HV02_04,
        "Initial test at L&D": row.moh_731_HV02_05,
        "Initial test at PNC_PNC<=6wks": row.moh_731_HV02_06,
        "Missed Opportuanities": row.missed_opp,
        Status: row.missed_opp_status,
      }));
      //console.log(testing_data_okay)
      let testing_data_ra = this.facility_data.filter(x=>x.missed_opp_status==="missed").map((row) => ({
        "Organisational Unit":row.ouNameHierarchy.split('/')[2]+"/"+row.ouNameHierarchy.split('/')[3]+"/"+row.ou_name,
        "New ANC Clients": row.moh_711_new,
        "Known Positive at 1st ANC": row.moh_731_HV02_03,
        "Initial test at ANC": row.moh_731_HV02_04,
        "Initial test at L&D": row.moh_731_HV02_05,
        "Initial test at PNC_PNC<=6wks": row.moh_731_HV02_06,
        "Missed Opportuanities": row.missed_opp,
        Status: row.missed_opp_status,
      }));
      let maternal_data_county=this.county_data.map((row) => ({
        "Organisational Unit": row.ou_name,
        "Total +ve(HV02:10-14)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "On HAART at 1st ANC HV02-16": row.moh_731_HV02_16,
        "Start HAART_ANC HV02-17": row.moh_731_HV02_17,
        "Start HAART_L&D HV02-18": row.moh_731_HV02_18,
        "Start HAART_PNC<=6wks HV02-19": row.moh_731_HV02_19,
        "Start HAART_PNC> 6weeks to 6 months HV02-21":row.moh_731_HV02_21,
        "Missed Opportuanities": row.missed_maternal,
        Status: row.missed_maternal_status,
      }));
      let maternal_data_subcounty=this.subcounty_data.map((row) => ({
        "Organisational Unit": row.ou_name,
        "Total +ve(HV02:10-14)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "On HAART at 1st ANC HV02-16": row.moh_731_HV02_16,
        "Start HAART_ANC HV02-17": row.moh_731_HV02_17,
        "Start HAART_L&D HV02-18": row.moh_731_HV02_18,
        "Start HAART_PNC<=6wks HV02-19": row.moh_731_HV02_19,
        "Start HAART_PNC> 6weeks to 6 months HV02-21":row.moh_731_HV02_21,
        "Missed Opportuanities": row.missed_maternal,
        Status: row.missed_maternal_status,
      }));
      let maternal_data_okay=this.facility_data.filter(x=>x.missed_maternal_status==="okay").map((row) => ({
        "Organisational Unit":row.ouNameHierarchy.split('/')[2]+"/"+row.ouNameHierarchy.split('/')[3]+"/"+row.ou_name,
        "Total +ve(HV02:10-14)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "On HAART at 1st ANC HV02-16": row.moh_731_HV02_16,
        "Start HAART_ANC HV02-17": row.moh_731_HV02_17,
        "Start HAART_L&D HV02-18": row.moh_731_HV02_18,
        "Start HAART_PNC<=6wks HV02-19": row.moh_731_HV02_19,
        "Start HAART_PNC> 6weeks to 6 months HV02-21":row.moh_731_HV02_21,
        "Missed Opportuanities": row.missed_maternal,
        Status: row.missed_maternal_status,
      }));
      let maternal_data_ra=this.facility_data.filter(x=>x.missed_maternal_status==="missed").map((row) => ({
        "Organisational Unit": row.ouNameHierarchy.split('/')[2]+"/"+row.ouNameHierarchy.split('/')[3]+"/"+row.ou_name,
        "Total +ve(HV02:10-14)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "On HAART at 1st ANC HV02-16": row.moh_731_HV02_16,
        "Start HAART_ANC HV02-17": row.moh_731_HV02_17,
        "Start HAART_L&D HV02-18": row.moh_731_HV02_18,
        "Start HAART_PNC<=6wks HV02-19": row.moh_731_HV02_19,
        "Start HAART_PNC> 6weeks to 6 months HV02-21":row.moh_731_HV02_21,
        "Missed Opportuanities": row.missed_maternal,
        Status: row.missed_maternal_status,
      }));
     
      let infant_data_county=this.county_data.map((row) => ({
        "Organisational Unit": row.ou_name,
        "HIV +ve Results (PMTCT)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "Infant ARV Prophyl_ANC HV02-39": row.moh_731_HV02_39,
        "Infant ARV Prophyl_L&D HV02-40": row.moh_731_HV02_40,
        "Infant ARV Prophyl<8wks_PNC HV02-41": row.moh_731_HV02_41,
        "Missed Opportuanities": row.infant_missed,
        Status: row.infant_missed_status,
      }));
      let infant_data_subcounty=this.subcounty_data.map((row) => ({
        "Organisational Unit": row.ou_name,
        "HIV +ve Results (PMTCT)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "Infant ARV Prophyl_ANC HV02-39": row.moh_731_HV02_39,
        "Infant ARV Prophyl_L&D HV02-40": row.moh_731_HV02_40,
        "Infant ARV Prophyl<8wks_PNC HV02-41": row.moh_731_HV02_41,
        "Missed Opportuanities": row.infant_missed,
        Status: row.infant_missed_status,
      }));
      let infant_data_okay=this.facility_data.filter(X=>X.infant_missed_status==="okay").map((row) => ({
        "Organisational Unit":row.ouNameHierarchy.split('/')[2]+"/"+row.ouNameHierarchy.split('/')[3]+"/"+row.ou_name,
        "HIV +ve Results (PMTCT)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "Infant ARV Prophyl_ANC HV02-39": row.moh_731_HV02_39,
        "Infant ARV Prophyl_L&D HV02-40": row.moh_731_HV02_40,
        "Infant ARV Prophyl<8wks_PNC HV02-41": row.moh_731_HV02_41,
        "Missed Opportuanities": row.infant_missed,
        Status: row.infant_missed_status,
      }));
      let infant_data_ra=this.facility_data.filter(X=>X.infant_missed_status==="missed").map((row) => ({
        "Organisational Unit": row.ouNameHierarchy.split('/')[2]+"/"+row.ouNameHierarchy.split('/')[3]+"/"+row.ou_name,
        "HIV +ve Results (PMTCT)": (row.moh_731_HV02_10+row.moh_731_HV02_11+row.moh_731_HV02_12+row.moh_731_HV02_13+row.moh_731_HV02_14),
        "Infant ARV Prophyl_ANC HV02-39": row.moh_731_HV02_39,
        "Infant ARV Prophyl_L&D HV02-40": row.moh_731_HV02_40,
        "Infant ARV Prophyl<8wks_PNC HV02-41": row.moh_731_HV02_41,
        "Missed Opportuanities": row.infant_missed,
        Status: row.infant_missed_status,
      }));
      let eid_data = this.eid_vl_data.map((row) => ({
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
      const testingokay_headers = Object.keys(testing_data_okay[0]);
      const testingokay_cars = [];
      const testingcounty_headers = Object.keys(testing_data_county[0]);
      const testingcounty_cars = [];
      const testingsubcounty_headers = Object.keys(testing_data_subcounty[0]);
      const testingsubcounty_cars = [];
      const testingra_headers = Object.keys(testing_data_ra[0]);
      const testingra_cars = [];
      const maternalcounty_headers = Object.keys(maternal_data_county[0]);
      const maternalsubcounty_headers = Object.keys(maternal_data_subcounty[0]);
      const maternalokay_headers = Object.keys(maternal_data_okay[0]);
      const maternalokay_cars = [];
      const maternalcounty_cars = [];
      const maternalsubcounty_cars = [];
      const maternalra_headers = Object.keys(maternal_data_ra[0]);
      const maternalra_cars = [];
      const infantokay_headers = Object.keys(infant_data_okay[0]);
      const infantcounty_headers = Object.keys(infant_data_county[0]);
      const infantsubcounty_headers = Object.keys(infant_data_subcounty[0]);    
      const infantokay_cars = [];
      const infantcounty_cars = [];
      const infantsubcounty_cars = [];
      const infantra_headers = Object.keys(infant_data_ra[0]);
      const infantra_cars = [];
      const eid_headers = Object.keys(eid_data[0]);
      const eid_cars = [];
      Object.entries(testing_data_county).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        testingcounty_cars.push(Object.values(testing_data_county[key]));
      });
      Object.entries(testing_data_subcounty).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        testingsubcounty_cars.push(Object.values(testing_data_subcounty[key]));
      });
       Object.entries(testing_data_okay).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        testingokay_cars.push(Object.values(testing_data_okay[key]));
      });
      Object.entries(testing_data_ra).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        testingra_cars.push(Object.values(testing_data_ra[key]));
      });
      Object.entries(maternal_data_county).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        maternalcounty_cars.push(Object.values(maternal_data_county[key]));
      });
      Object.entries(maternal_data_subcounty).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        maternalsubcounty_cars.push(Object.values(maternal_data_subcounty[key]));
      });
      Object.entries(maternal_data_okay).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        maternalokay_cars.push(Object.values(maternal_data_okay[key]));
      });
      Object.entries(maternal_data_ra).forEach((val) => {
        const [key] = val;
        //console.log(key, val);
        maternalra_cars.push(Object.values(maternal_data_ra[key]));
      });
      Object.entries(infant_data_county).forEach((val) => {
      const [key] = val;
      //console.log(key, val);
      infantcounty_cars.push(Object.values(infant_data_county[key]));
      });
      Object.entries(infant_data_subcounty).forEach((val) => {
      const [key] = val;
      //console.log(key, val);
      infantsubcounty_cars.push(Object.values(infant_data_subcounty[key]));
      });
      Object.entries(infant_data_okay).forEach((val) => {
      const [key] = val;
      //console.log(key, val);
      infantokay_cars.push(Object.values(infant_data_okay[key]));
      });
      Object.entries(infant_data_ra).forEach((val) => {
      const [key] = val;
      //console.log(key, val);
      infantra_cars.push(Object.values(infant_data_ra[key]));
      });
      Object.entries(eid_data).forEach((val) => {
      const [key] = val;
      //console.log(key, val);
      eid_cars.push(Object.values(eid_data[key]));
      });
      const testingcounty_uniqueCars = Array.from(new Set(testingcounty_cars));
      const testingsubcounty_uniqueCars = Array.from(new Set(testingsubcounty_cars));
      const testingokay_uniqueCars = Array.from(new Set(testingokay_cars));
      const testingra_uniqueCars = Array.from(new Set(testingra_cars));
      const maternalcounty_uniqueCars = Array.from(new Set(maternalcounty_cars));
      const maternalsubcounty_uniqueCars = Array.from(new Set(maternalsubcounty_cars));
      const maternalokay_uniqueCars = Array.from(new Set(maternalokay_cars));
      const maternalra_uniqueCars = Array.from(new Set(maternalra_cars));
      const infantcounty_uniqueCars = Array.from(new Set(infantcounty_cars));
      const infantsubcounty_uniqueCars = Array.from(new Set(infantsubcounty_cars));
      const infantokay_uniqueCars = Array.from(new Set(infantokay_cars));
      const infantra_uniqueCars = Array.from(new Set(infantra_cars));
      const eid_uniqueCars = Array.from(new Set(eid_cars));
      this.generateReport(
        testingcounty_headers,
        testingcounty_uniqueCars, 
        testingsubcounty_headers,
        testingsubcounty_uniqueCars, 
        testingokay_headers, 
        testingokay_uniqueCars,
        testingra_headers, 
        testingra_uniqueCars, 
        maternalcounty_headers, 
        maternalcounty_uniqueCars,
        maternalsubcounty_headers, 
        maternalsubcounty_uniqueCars,
        maternalokay_headers, 
        maternalokay_uniqueCars,
        maternalra_headers, 
        maternalra_uniqueCars,
        infantcounty_headers,
        infantcounty_uniqueCars,
        infantsubcounty_headers,
        infantsubcounty_uniqueCars,
        infantokay_headers,
        infantokay_uniqueCars,
        infantra_headers,
        infantra_uniqueCars,
        eid_headers,
        eid_uniqueCars);
    },
    generateReport(
      countyh,
      countyb,
      subcnth,
      subcntb,
      hokay,
      dokay,
      hra,
      dra,
      h1county,
      d1county,
      h1subcounty,
      d1subcounty,
      h1okay,
      d1okay,
      h1ra,
      d1ra,
      h2county,
      d2county,
      h2subcounty,
      d2subcounty,
      h2okay,
      d2okay,
      h2ra,
      d2ra,
      h3,
      d3) {
        Swal.fire({
        position: "center",
        icon: "info",
        title: "Please wait...",
        html: "Compiling Report...",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });
      const filename = this.title+moment(new Date()).format("YYYY-MM-DD-HH:MM:SS");
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
      let intro = "Routine antenatal care (ANC) offers an important opportunity to provide high quality combined HIV prevention through targeted health education and counselling; HIV testing for the woman, partners and family members; linkage to HIV prevention and treatment; and to discuss and plan for future conception and contraception needs. Prevention of mother-to-child transmission of HIV (PMTCT)/Syphilis/Hepatitis B should be offered as part of a comprehensive package of fully integrated, routine antenatal care interventions. In financial year 2023/2024, NASCOP undertook an PMTCT RRI to address missed opportunities focusing on data reported in February 2022 to August 2023. A need to routinized the process of data review for immediate action was identified as important in achieving elimination of mother to child HIV transmission.\n\nThis bulletin provides a summary of indicators for monitoring the PMTCT Program at site level.\n\nYour immediate attention on highlighted rows in the report will be appreciated. You raise questions or provide feedback to (email). The report will be automatically shared every Monday";
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
      startY = 20;
      doc.addFont("Tahoma", "Tahoma", "bold");
      doc.setFontSize(14);
      doc.text(5, startY, "SECTION 3A: HIV TESTING REPORTS");
      //section A - Indicator Defination
      startY += 10;
      doc.text(5, startY, "HIV TESTING REPORTS : COUNTY SUMMARY");
      doc.setFontSize(9);
      doc.autoTable({
        head: [countyh],
        body: countyb,
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
      startY=doc.autoTable.previous.finalY+10;
      doc.setFontSize(14);
      //section A - Indicator Defination
      doc.text(5, startY, " HIV TESTING REPORTS : SUB COUNTY SUMMARY");
      doc.setFontSize(9);
      doc.autoTable({
        head:[subcnth],
        body: subcntb,
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
          if (data.row.raw[subcnth.indexOf("Status")] === "missed") {
            doc.addFont("Tahoma", "Tahoma","bold");
            doc.setFontSize(10);
            data.cell.styles.fillColor = [236,148,44]; // Danger background for critical status
            data.cell.styles.textColor=[255, 255, 255]
          }
        }
      });
      doc.addPage();
      startY=10;
      doc.setFontSize(14);
      //section A - Indicator Defination
      doc.text(5, startY, "HIV TESTING REPORTS : FACILITIES THAT REQUIRE ACTION");
      doc.setFontSize(9);
      doc.autoTable({
        head: [hra],
        body: dra,
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
          if (data.row.raw[hra.indexOf("Status")] === "missed") {
            doc.addFont("Tahoma", "Tahoma","bold");
            doc.setFontSize(10);
            data.cell.styles.fillColor = [236,148,44]; 
            data.cell.styles.textColor=[255, 255, 255]
          }
        },
      });
        doc.addPage();
        startY =10;
        doc.addFont("Tahoma", "Tahoma", "bold");
        doc.setFontSize(14);
        doc.text(5, startY, "SECTION 3B: MATERNAL HAART REPORTS");
        startY +=10;
        doc.text(5, startY, "MATERNAL HAART REPORTS : COUNTY SUMMARY");
        doc.setFontSize(9);
        doc.autoTable({
        head: [h1county],
        body: d1county,
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
      startY=doc.autoTable.previous.finalY+10;
      doc.setFontSize(14);
      doc.text(5, startY, "MATERNAL HAART REPORTS : SUB COUNTY SUMMARY");
      doc.setFontSize(9);
      doc.autoTable({
        head:[h1subcounty],
        body: d1subcounty,
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
          if (data.row.raw[h1subcounty.indexOf("Status")] === "missed") {
            doc.addFont("Tahoma", "Tahoma","bold");
            doc.setFontSize(10);
            data.cell.styles.fillColor = [236,148,44]; 
            data.cell.styles.textColor=[255, 255, 255]
          }
        },
      });
      doc.addPage();
      startY=10;
      doc.setFontSize(14);
      //section A - Indicator Defination
      doc.text(5, startY, "MATERNAL HAART REPORTS : FACILITIES THAT REQUIRE ACTION");
      doc.setFontSize(9);
      doc.autoTable({
        head: [h1ra],
        body: d1ra,
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
          if (data.row.raw[h1ra.indexOf("Status")] === "missed") {
            doc.addFont("Tahoma", "Tahoma","bold");
            doc.setFontSize(10);
            data.cell.styles.fillColor = [236,148,44]; 
            data.cell.styles.textColor=[255, 255, 255]
          }
        },
      });
        doc.addPage();
        startY = 10;
        doc.addFont("Tahoma", "Tahoma", "bold");
        doc.setFontSize(14);
        //Sections 1: Intro 2:definition 3: data {a:hiv testing,b:maternal HAART,c:infant prophylaxis,d:eid testing} 4:actions
        //section A - Indicator Defination
        doc.text(5, startY, "SECTION 3C: INFANT PROPHYLAXIS REPORTS");
        startY += 10;
        doc.text(5, startY, "INFANT PROPHYLAXIS REPORTS : COUNTY SUMMARY");
      doc.setFontSize(9);
      doc.autoTable({
        head: [h2county],
        body: d2county,
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
      startY=doc.autoTable.previous.finalY+10;
      doc.setFontSize(14);
      //section A - Indicator Defination
      doc.text(5, startY, "INFANT PROPHYLAXIS REPORTS : SUB COUNTY SUMMARY");
      doc.setFontSize(9);
      doc.autoTable({
        head:[h2subcounty],
        body: d2subcounty,
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
          if (data.row.raw[h2subcounty.indexOf("Status")] === "missed") {
            doc.addFont("Tahoma", "Tahoma","bold");
            doc.setFontSize(10);
            data.cell.styles.fillColor = [236,148,44]; 
            data.cell.styles.textColor=[255, 255, 255]
          }
        },
      });
      //section 3C
      doc.addPage();
      startY=10;
      doc.setFontSize(14);
      //section A - Indicator Defination
      doc.text(5, startY, "INFANT PROPHYLAXIS REPORTS : FACILITIES THAT REQUIRE ACTION");
      doc.setFontSize(9);
      doc.autoTable({
        head: [h2ra],
        body: d2ra,
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
          if (data.row.raw[h2ra.indexOf("Status")] === "missed") {
            doc.addFont("Tahoma", "Tahoma","bold");
            doc.setFontSize(10);
            data.cell.styles.fillColor = [236,148,44]; 
            data.cell.styles.textColor=[255, 255, 255]
          }
        },
      });
        doc.addPage();
        startY = 10;
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
         //okay values 3a
      doc.addPage();
      startY=14;
      doc.text(5, startY, "HIV TESTING REPORTS : FACILITIES THAT REQUIRE NO ACTION");
      //alert();
      doc.setFontSize(9);
      doc.autoTable({
        head:[hokay],
        body: dokay,
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
        theme: "grid"
      });
      //okay values
      doc.addPage();
      startY=14;
      doc.text(5, startY, "MATERNAL HAART REPORTS : FACILITIES THAT REQUIRE NO ACTION");
      //alert();
      doc.autoTable({//MATERNAL HAART REPORTS
        head: [h1okay],
        body: d1okay,
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
      //okay values
      doc.addPage();
      startY=14;
      doc.text(5, startY, "INFANT PROPHYLAXIS REPORTS : FACILITIES THAT REQUIRE NO ACTION");
      //alert();
      doc.autoTable({
        head: [h2okay],
        body: d2okay,
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
        Swal.close();
        var openeddoc = window.open(
          previewLink,
          filename,
          "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes,top=000,left=500,width=1000,height=1500"
        );
        openeddoc.focus();
      }
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
