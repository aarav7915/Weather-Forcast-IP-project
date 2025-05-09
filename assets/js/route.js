/**
 * @license MIT
 * @fileoverview Manage all routes
 * @copyright Sarvan Yaduvanshi 2024 All rights reserved
 * @author Sarvan Yaduvanshi <sarvankumar620058@gmail.com>
 */

'use strict';

import { updateWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=28.6139&lon=77.209"; // India coordinates

const currentLocation = function () {
    window.navigator.geolocation.getCurrentPosition(
        res => {
            const { latitude, longitude } = res.coords;
            updateWeather(latitude, longitude);
        },
        err => {
            window.location.hash = defaultLocation;
        }
    );
};

/**
 * @param {string} query Searched query
 */
const searchedLocation = query => {
    const params = query.split("&");
    const latParam = params.find(param => param.startsWith("lat="));
    const lonParam = params.find(param => param.startsWith("lon="));
    if (!latParam || !lonParam) {
        error404();
        return;
    }
    const lat = parseFloat(latParam.split("=")[1]);
    const lon = parseFloat(lonParam.split("=")[1]);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        error404();
        return;
    }
    updateWeather(lat, lon);
};

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
]);

const checkHash = function () {
    const requestURL = window.location.hash.slice(1);
    const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL, ""];
    routes.has(route) ? routes.get(route)(query) : error404();
};

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
    if (!window.location.hash) {
        window.location.hash = "#/current-location";
    } else {
        checkHash();
    }
});