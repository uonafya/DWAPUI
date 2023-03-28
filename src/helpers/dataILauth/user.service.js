import { authHeader } from "./auth-header";
import store from "@/state/store";
var CryptoJS = require("crypto-js");
// import axios from "axios";
// import Swal from "sweetalert2";

export const userService = {
    login,
    logout,
    register,
    getAll,
    data() {
        return {
            username: "",
        };
    },
};

function login(username, password) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    };
    store.dispatch("screens/clearScreens");
    //var sanitizedScreens = [];
    return fetch(window.$http + "login/", requestOptions)
        .then(handleResponse)
        .then((user) => {
            // let accessScreens = [
            //     "Dashboard",
            //     "DataAlignment",
            //     "IndicatorMappingRules",
            //     "IndicatorComparison",
            //     "DataQuality",
            //     "Indicators",
            //     "AllIndicators",
            //     "Categories",
            //     "Security",
            //     "DataPullSchedule"
            //     "Roles",
            //     "Users",
            //     "PasswordPolicy",
            //     "Reports",
            // ];
            let accessScreens = user.screens.toString().split(",");
            console.log(accessScreens)
            store.dispatch("screens/loadUserScreens", { userScreen: accessScreens });

            // for (var i = 0; i < accessScreens.length; i++) {
            //     store.dispatch("screens/loadUserScreens", { userScreen: accessScreens[i] });
            // }
            let encryptToken = CryptoJS.AES.encrypt(
                user.user.token.trim(),
                "mnopqr",
            ).toString();
            if (user.user.token) {
                let responseJson = {
                    id: user.id,
                    username: username,
                    email: user.user.email,
                    token: encryptToken,
                    notifications: user.notifications,
                };
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem("user", JSON.stringify(responseJson));
            }
            return user;
        })
        .then((error) => {
            return error;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("user");
    window.location.reload()
}

function register(user) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    };
    return fetch(`register/`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: "GET",
        headers: authHeader(),
    };
    return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then((text) => {
        var data = text && JSON.parse(text);
        if (!response.ok) {
            //var error = (data && data.message) || response.statusText;
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            return Promise.reject(data);
        }
        console.log(response);
        return data;
    });
}