const data = [{
        "section_title": "Missed Opportunities for HIV Testing (PMTCT)",
        "indicators": [{
                "Indicator": "New ANC clients",
                "Source": ["KHIS: MOH711", "KHIS: MOH731", "Facility(MOH 711)", "Facility(MOH 731): HV02-01", "ANC register"],
                "Definition": "These are New ANC Clients numbers from various sources."
            },
            {
                "Indicator": "Known Positive at 1st ANC HV02-03",
                "Source": ["KHIS: HV02-03", "Facility(MOH 731): HV02-03", "ANC register"],
                "Definition": "These are Known Positive at 1st ANC clients numbers."
            },
            {
                "Indicator": "Initial test at ANC HV02-04",
                "Source": ["KHIS: HV02-04", "Facility(MOH 731): HV02-04", "ANC register"],
                "Definition": "These are Initial test at ANC clients numbers."
            },
            {
                "Indicator": "Initial test at L&D HV02-05",
                "Source": ["KHIS: HV02-05", "Facility(MOH 731): HV02-05", "Maternity register"],
                "Definition": "These are Initial test at L&D clients numbers."
            },
            {
                "Indicator": "Initial test at PNC_PNC<=6wks HV02-06",
                "Source": ["KHIS: HV02-06", "Facility(MOH 731): HV02-06", "Post Natal Register"],
                "Definition": "These are Initial test at PNC_PNC<=6wks clients numbers."
            },
            {
                "Indicator": "Known HIV Status_Total HV02-07",
                "Source": ["KHIS total: HV02-07", "Facility MOH 731: total (HV02-07)"],
                "Definition": "These are Known HIV Status_Total clients numbers."
            }
        ]
    },
    {
        "section_title": "Missed Maternal HAART",
        "indicators": [{
                "Indicator": "Known Positive at 1st ANC HV02-10",
                "Source": ["KHIS: HV02-10", "Facility(MOH 731): HV02-10", "ANC register"],
                "Definition": "These are Known Positive at 1st ANC clients numbers."
            },
            {
                "Indicator": "Positive Results at ANC HV02-11",
                "Source": ["KHIS: HV02-11", "Facility(MOH 731): HV02-11", "ANC register"],
                "Definition": "These are clients with Positive Results at ANC."
            },
            {
                "Indicator": "Positive Results at L&D HV02-12",
                "Source": ["KHIS: HV02-12", "Facility(MOH 731): HV02-12", "Maternity Register"],
                "Definition": "These are clients with Positive Results at L&D."
            },
            {
                "Indicator": "Positive Results at PNC <= 6 weeks HV02-13",
                "Source": ["KHIS: HV02-13", "Facility(MOH 731): HV02-13", "Postnatal Register"],
                "Definition": "These are clients with Positive Results at PNC <= 6 weeks."
            },
            {
                "Indicator": "Positive Results at PNC > 6 weeks to 6 months HV02-14",
                "Source": ["KHIS: HV02-14", "Facility(MOH 731): HV02-14", "Postnatal Register"],
                "Definition": "These are clients with Positive Results at PNC > 6 weeks to 6 months."
            },
            {
                "Indicator": "Total Positive HV02-15",
                "Source": ["KHIS total: HV02-15", "MOH 731: total (HV02-15)"],
                "Definition": "These are Total Positive clients numbers."
            },
            {
                "Indicator": "On HAART at 1st ANC HV02-16",
                "Source": ["KHIS: HV02-16", "Facility(MOH 731): HV02-16", "ANC register"],
                "Definition": "This is the number of pregnant women who were already on HAART by the time they started ANC."
            },
            {
                "Indicator": "Start HAART in ANC HV02-17",
                "Source": ["KHIS: HV02-17", "Facility(MOH 731): HV02-17", "ANC register"],
                "Definition": "This is the number of pregnant women who started HAART in ANC."
            },
            {
                "Indicator": "Start HAART in L&D HV02-18",
                "Source": ["KHIS: HV02-18", "Facility(MOH 731): HV02-18", "Maternity Register"],
                "Definition": "This is the number of women who started HAART in L&D."
            },
            {
                "Indicator": "Start HAART in PNC <= 6 weeks HV02-19",
                "Source": ["KHIS: HV02-19", "Facility(MOH 731): HV02-19", "Postnatal Register"],
                "Definition": "This is the number of women who started HAART within 6 weeks postnatal."
            },
            {
                "Indicator": "Start HAART in PNC > 6 weeks to 6 months HV02-21",
                "Source": ["KHIS: HV02-21", "Facility(MOH 731): HV02-21", "Postnatal Register"],
                "Definition": "This is the number of women who started HAART after 6 weeks of delivery."
            },
            {
                "Indicator": "On maternal HAART_Total HV02-20",
                "Source": ["KHIS total: HV02-20", "MOH 731: total (HV02-20)"],
                "Definition": "This is the sum of all women who were on maternal HAART at ANC, L&D and 6 weeks postnatal."
            }
        ]
    },
    {
        "section_title": "Missed Infant Prophylaxis",
        "indicators": [{
                "Indicator": "Infant ARV Prophyl at ANC HV02-39",
                "Source": ["KHIS: HV02-39", "Facility(MOH 731): HV02-39", "ANC register"],
                "Definition": "This is the number of infant prophylaxis issued to pregnant women at ANC."
            },
            {
                "Indicator": "Infant ARV Prophyl at L&D HV02-40",
                "Source": ["KHIS: HV02-40", "Facility(MOH 731): HV02-40", "Maternity Register"],
                "Definition": "This is the number of infant prophylaxis issued to pregnant women at L&D."
            },
            {
                "Indicator": "Infant ARV Prophyl <= 8 weeks at PNC HV02-41",
                "Source": ["KHIS: HV02-41", "Facility(MOH 731): HV02-41", "Postnatal Register"],
                "Definition": "This is the number of infant prophylaxis issued to pregnant women at PNC within 8 weeks postnatal."
            },
            {
                "Indicator": "Total Infant ARV prophylaxis HV02-42",
                "Source": ["KHIS total: HV02-42", "MOH 731: total (HV02-42)"],
                "Definition": "This is the count of all infant prophylaxis issued to women at ANC, L&D, and postnatal."
            }
        ]
    }
]
export default data;