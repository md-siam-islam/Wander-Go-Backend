"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_STATUS = void 0;
var PAYMENT_STATUS;
(function (PAYMENT_STATUS) {
    PAYMENT_STATUS["PAID"] = "PAID";
    PAYMENT_STATUS["UNPAID"] = "UNPAID";
    PAYMENT_STATUS["FAILED"] = "FAILED";
    PAYMENT_STATUS["CANCEL"] = "CANCEL";
    PAYMENT_STATUS["REFUNDED"] = "REFUNDED";
    // Backward compatibility alias
    PAYMENT_STATUS["CANCLE"] = "CANCEL";
})(PAYMENT_STATUS || (exports.PAYMENT_STATUS = PAYMENT_STATUS = {}));
