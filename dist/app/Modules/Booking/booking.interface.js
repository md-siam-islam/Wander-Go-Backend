"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOKING_ENUM = void 0;
var BOOKING_ENUM;
(function (BOOKING_ENUM) {
    BOOKING_ENUM["PENDING"] = "PENDING";
    BOOKING_ENUM["CANCEL"] = "CANCEL";
    BOOKING_ENUM["COMPLETE"] = "COMPLETE";
    BOOKING_ENUM["FAILED"] = "FAILED";
    // Backward compatibility aliases
    BOOKING_ENUM["CANCLE"] = "CANCEL";
    BOOKING_ENUM["CPMPLATE"] = "COMPLETE";
})(BOOKING_ENUM || (exports.BOOKING_ENUM = BOOKING_ENUM = {}));
