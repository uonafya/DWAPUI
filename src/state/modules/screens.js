export const state = {
    userScreens: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    userToken: "token",
    bidirection: "",
    cameratype: "",
    vehicleinyard: "",
};
export const getters = {
    getUserScreens(state) {
        console.log(state.userScreens);
        localStorage.setItem('screens', state.userScreens);
        return state.userScreens;
    },
    getUserToken(state) {
        return state.userToken;
    },
};

export const mutations = {
    LOAD_USER_SCREENS(state, userScreen) {
        //console.log(userScreen);
        const allscreens = new Set();
        let index = 0;
        const createdMenus = new Set();
        for (let i = 0; i < userScreen.length; i++)
            allscreens.add(userScreen[i]);

        //parse array
        //store in hashset check if exist in hashset
        //check if array exists then set
        //
        if (allscreens.has("Dashboard")) {
            //alert(allscreens.keys("dashboard"))
            let newObjectScreen = {
                id: 1,
                label: "menuitems.dashboard.text",
                icon: "uil-home-alt",
                link: "/",

            };

            state.userScreens[0] = newObjectScreen;
        }

        ////////////////////////////////////////DataAlignment///////////////////////////////////////
        if (allscreens.has("IndicatorMappingRules")) {
            if (createdMenus.has("DataAlignment")) {
                let newObjectScreen = {
                    id: 80,
                    label: "Mapping Rules",
                    link: "/data/mapping-rules",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        return e.label;
                    })
                    .indexOf("Data Alignment");
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Data Alignment",
                    icon: "uil-object-group",
                    link: "/data-alignment",
                    subItems: [
                        {
                            id: 4,
                            label: "Mapping Rules",
                            link: "/data/mapping-rules",
                        },
                    ],
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("DataAlignment");
            }
        }
        if (allscreens.has("IndicatorComparison")) {
            if (createdMenus.has("DataAlignment")) {
                let newObjectScreen = {
                    id: 81,
                    label: "Indicator Comparison",
                    link: "/data/comparison",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        return e.label;
                    })
                    .indexOf("Data Alignment");
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Data Alignment",
                    icon: "uil-object-group",
                    link: "/data-alignment",
                    subItems: [
                        {
                            id: 4,
                            label: "Indicator Comparison",
                            link: "/data/comparison",
                        },
                    ],
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("DataAlignment");
            }
        }
        if (allscreens.has("DataQuality")) {
            if (createdMenus.has("DataAlignment")) {
                let newObjectScreen = {
                    id: 4,
                    label: "Data Quality",
                    link: "/data/DataQuality",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        return e.label;
                    })
                    .indexOf("Data Alignment");
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Data Alignment",
                    icon: "uil-object-group",
                    link: "/DataAlignment",
                    subItems: [
                        {
                            id: 4,
                            label: "Data Quality",
                            link: "/data/DataQuality",
                        },
                    ],
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("DataAlignment");
            }
        }
        ////////////////////////////////////////Indicators///////////////////////////////////////      
        if (allscreens.has("AllIndicators")) {
            if (createdMenus.has("Indicators")) {
                let newObjectScreen = {
                    id: 4,
                    label: "Indicators",
                    link: "/data/indicators",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        return e.label;
                    })
                    .indexOf("Indicators");
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Indicators",
                    icon: "uil-analytics",
                    link: "/Indicators",
                    subItems: [
                        {
                            id: 4,
                            label: "Indicators",
                            link: "/data/indicators",
                        },
                    ],
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("Indicators");
            }
        }
        if (allscreens.has("Categories")) {
            if (createdMenus.has("Indicators")) {
                let newObjectScreen = {
                    id: 5,
                    label: "Categories",
                    link: "/data/indicator_groups",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        return e.label;
                    })
                    .indexOf("Indicators");
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Indicators",
                    icon: "uil-analytics",
                    link: "/Indicators",
                    subItems: [
                        {
                            id: 5,
                            label: "Categories",
                            link: "/data/indicator_groups",
                        },
                    ],
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("Indicators");
            }
        }
        /////////////////////////Security/////////////////////////////////////////
        if (allscreens.has("Roles")) {
            if (createdMenus.has("Security")) {
                let newObjectScreen = {
                    id: 4,
                    label: "Roles",
                    link: "/data/Roles",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        return e.label;
                    })
                    .indexOf("Security");
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Security",
                    icon: "uil-lock",
                    link: "/Security",
                    subItems: [
                        {
                            id: 5,
                            label: "Roles",
                            link: "/data/Roles",
                        },
                    ],
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("Security");
            }
        }
        if (allscreens.has("Users")) {
            if (createdMenus.has("Security")) {
                let newObjectScreen = {
                    id: 4,
                    label: "Users",
                    link: "/data/Users",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        return e.label;
                    })
                    .indexOf("Security");
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Security",
                    icon: "uil-lock",
                    link: "/Security",
                    subItems: [
                        {
                            id: 4,
                            label: "Users",
                            link: "/data/Users",
                        },
                    ],
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("Security");
            }
        }
        if (allscreens.has("PasswordPolicy")) {
            if (createdMenus.has("Security")) {
                let newObjectScreen = {
                    id: 4,
                    label: "Password Policy",
                    link: "/data/Users",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        return e.label;
                    })
                    .indexOf("Security");
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Security",
                    icon: "uil-lock",
                    link: "/Security",
                    subItems: [
                        {
                            id: 5,
                            label: "Password Policy",
                            link: "/data/PasswordPolicy",
                        },
                    ],
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("Security");
            }
        }
        ////////////////////////////////////////Reports///////////////////////////////////////

        if (allscreens.has("Reports")) {
            if (createdMenus.has("Reports")) {
                let newObjectScreen = {
                    id: 3,
                    label: "Reports",
                    link: "/data/Reports",
                };
                ///add to subitem array
                index = state.userScreens
                    .map(function (e) {
                        //console.log(e.label)
                        return e.label;
                    })
                    .indexOf("Reports");
                //console.log(index);
                state.userScreens[index].subItems.push(newObjectScreen);
            } else {
                let newObjectScreen = {
                    id: 2,
                    label: "Reports",
                    icon: "uil-file-alt",
                    link: "/Reports",
                };
                //add sub item
                state.userScreens.push(newObjectScreen);
                createdMenus.add("Reports");
            }
        }
        state.userScreens = state.userScreens.sort((a, b) =>
            a.id > b.id ? 1 : b.id > a.id ? -1 : 0,
        );
    },
    SET_TOKEN_VALUE(state, userToken) {
        state.userToken = userToken;
    },
    REMOVE_SCREENS(state) {
        state.userScreens.length = 0;
    },
};
export const actions = {
    loadUserScreens({ commit }, { userScreen }) {
        commit("LOAD_USER_SCREENS", userScreen);
    },
    loadUserToken({ commit }, { userToken }) {
        commit("SET_TOKEN_VALUE", userToken);
    },
    clearScreens({ commit }) {
        commit("REMOVE_SCREENS");
    },
};
