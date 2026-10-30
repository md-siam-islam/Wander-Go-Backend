"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSLservices = void 0;
const env_1 = require("../../config/env");
const axios_1 = __importDefault(require("axios"));
const sslPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const storeId = env_1.envVariables.SSL.SSL_STORE_ID ? env_1.envVariables.SSL.SSL_STORE_ID.trim() : "testbox";
    const storePass = env_1.envVariables.SSL.SSL_STORE_PASS ? env_1.envVariables.SSL.SSL_STORE_PASS.trim() : "testbox@ssl";
    // Always enforce v4 endpoint even if env variable in Vercel still has outdated v3 URL
    let paymentApi = env_1.envVariables.SSL.SSL_PAYMENT_API ? env_1.envVariables.SSL.SSL_PAYMENT_API.trim() : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
    if (paymentApi.includes("/v3/")) {
        paymentApi = paymentApi.replace("/v3/", "/v4/");
    }
    // Backend callback endpoints
    // If running in production or on Vercel, OR if the configured URL mistakenly points to localhost:5000:
    // SSLCommerz MUST redirect to the live Vercel backend so it can verify the payment and update MongoDB!
    const liveBackendApi = "https://backend-wander-go-tour-management.vercel.app/api/v1/payment";
    let backendSuccessUrl = (env_1.envVariables.SSL.SSL_SUCCESS_BACKEND_URL || "").trim();
    let backendFailUrl = (env_1.envVariables.SSL.SSL_FAIL_BACKEND_URL || "").trim();
    let backendCancelUrl = (env_1.envVariables.SSL.SSL_CANCEL_BACKEND_URL || "").trim();
    const isRunningOnVercel = !!process.env.VERCEL;
    const isProd = process.env.NODE_ENV === "production";
    if (isRunningOnVercel || isProd || !backendSuccessUrl || backendSuccessUrl.includes("localhost:5000")) {
        backendSuccessUrl = `${liveBackendApi}/success`;
    }
    if (isRunningOnVercel || isProd || !backendFailUrl || backendFailUrl.includes("localhost:5000")) {
        backendFailUrl = `${liveBackendApi}/fail`;
    }
    if (isRunningOnVercel || isProd || !backendCancelUrl || backendCancelUrl.includes("localhost:5000")) {
        backendCancelUrl = `${liveBackendApi}/cancel`;
    }
    const data = {
        store_id: storeId,
        store_passwd: storePass,
        total_amount: payload.amount,
        currency: "BDT",
        tran_id: payload.transactionId,
        success_url: `${backendSuccessUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
        fail_url: `${backendFailUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
        cancel_url: `${backendCancelUrl}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
        shipping_method: "NO",
        num_of_item: 1,
        weight_of_items: 0,
        logistic_pickup_id: "N/A",
        logistic_delivery_type: "Tour",
        product_name: "Tour",
        product_category: "Services",
        product_profile: "general",
        cus_name: payload.name || "Customer",
        cus_email: payload.email || "customer@wandergo.com",
        cus_add1: payload.address || "Dhaka",
        cus_add2: "Gazipur",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: payload.phone || "01700000000",
        cus_fax: "N/A",
        ship_name: payload.name || "Customer",
        ship_add1: payload.address || "Dhaka",
        ship_add2: "N/A",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: "1000",
        ship_country: "Bangladesh",
    };
    try {
        const responsive = yield (0, axios_1.default)({
            method: "POST",
            url: paymentApi,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return responsive.data;
    }
    catch (err) {
        console.error("SSLCommerz request error:", ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || (err === null || err === void 0 ? void 0 : err.message));
        return {
            status: "FAILED",
            failedreason: ((_c = (_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.failedreason) || (err === null || err === void 0 ? void 0 : err.message) || "HTTP request to SSLCommerz failed"
        };
    }
});
exports.SSLservices = {
    sslPayment
};
