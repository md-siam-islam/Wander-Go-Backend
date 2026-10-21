import { envVariables } from "../../config/env";
import { SSLcommrez } from "./sslCommerz.interface";
import axios from 'axios';

const sslPayment = async (payload: SSLcommrez) => {

    const storeId = envVariables.SSL.SSL_STORE_ID ? envVariables.SSL.SSL_STORE_ID.trim() : "testbox";
    const storePass = envVariables.SSL.SSL_STORE_PASS ? envVariables.SSL.SSL_STORE_PASS.trim() : "testbox@ssl";
    
    // Always enforce v4 endpoint even if env variable in Vercel still has outdated v3 URL
    let paymentApi = envVariables.SSL.SSL_PAYMENT_API ? envVariables.SSL.SSL_PAYMENT_API.trim() : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
    if (paymentApi.includes("/v3/")) {
        paymentApi = paymentApi.replace("/v3/", "/v4/");
    }

    const data = {
        store_id: storeId,
        store_passwd: storePass,
        total_amount: payload.amount,
        currency: "BDT",
        tran_id: payload.transactionId,
        success_url : `${envVariables.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
        fail_url : `${envVariables.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
        cancel_url: `${envVariables.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancle`,
        shipping_method : "NO",
        num_of_item : 1,
        weight_of_items : 0,
        logistic_pickup_id : "N/A",
        logistic_delivery_type : "Tour",
        product_name : "Tour",
        product_category : "Services",
        product_profile : "general",
        cus_name : payload.name || "Customer",
        cus_email : payload.email || "customer@wandergo.com",
        cus_add1: payload.address || "Dhaka",
        cus_add2 : "Gazipur",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone : payload.phone || "01700000000",
        cus_fax : "N/A",
        ship_name: payload.name || "Customer",
        ship_add1 : payload.address || "Dhaka",
        ship_add2: "N/A",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: "1000",
        ship_country: "Bangladesh",
    };

    try {
        const responsive = await axios({
            method: "POST",
            url: paymentApi,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        return responsive.data;
    } catch (err: any) {
        console.error("SSLCommerz request error:", err?.response?.data || err?.message);
        return {
            status: "FAILED",
            failedreason: err?.response?.data?.failedreason || err?.message || "HTTP request to SSLCommerz failed"
        };
    }
}

export const SSLservices = {
    sslPayment
};
