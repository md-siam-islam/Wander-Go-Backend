import { envVariables } from "../../config/env";
import { SSLcommrez } from "./sslCommerz.interface";
import axios from 'axios';

const sslPayment = async (payload: SSLcommrez) => {

    const data = {
        store_id: envVariables.SSL.SSL_STORE_ID,
        store_passwd: envVariables.SSL.SSL_STORE_PASS,
        total_amount: payload.amount,
        currency: "BDT",
        tran_id: payload.transactionId,
        success_url : `${envVariables.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
        fail_url : `${envVariables.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
        cancel_url: `${envVariables.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancle`,
        shipping_method : "N/A",
        num_of_item : "N/A" ,
        weight_of_items : "N/A" ,
        logistic_pickup_id : "N/A" ,
        logistic_delivery_type : "Tour",
        product_name : "Tour",
        product_category : "Services",
        product_profile : "general",
        cus_name : payload.name ,
        cus_email : payload.email ,
        cus_add1: payload.address ,
        cus_add2 : "Gazipur",
        cus_city: "Dhaka" ,
        cus_state: "Dhaka" ,
        cus_postcode: "1000" ,
        cus_country: "Bangladesh",
        cus_phone : payload.phone,
        cus_fax : "N/A" ,
        ship_name: "N/A" ,
        ship_add1 : "N/A" ,
        ship_add2: "N/A" ,
        ship_city: "N/A" ,
        ship_state: "N/A" ,
        ship_postcode: "1000" ,
        ship_country: "Bangladesh",
    }

    const responsive = await axios ({
            method : "POST",
            url : envVariables.SSL.SSL_PAYMENT_API,
            data : data,
            headers : { "Content-Type": "application/x-www-form-urlencoded" }

    })

    return responsive.data
}

export const SSLservices = {
    sslPayment
} 