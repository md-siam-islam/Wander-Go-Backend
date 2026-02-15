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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const consts_1 = require("../../consts");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filter = Object.assign({}, this.query);
        // delete unwanted fields from filter object
        for (const field of consts_1.deleteFields) {
            delete filter[field];
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    // search function for  title , description , location 
    search(searchField) {
        const searchTerm = this.query.searchTerm || "";
        const searchQuery = { $or: searchField.map(field => ({
                [field]: { $regex: searchTerm, $options: "i" }
            })) };
        this.modelQuery = this.modelQuery.find(searchQuery);
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    field() {
        var _a;
        const field = ((_a = this.query.field) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
        this.modelQuery = this.modelQuery.select(field);
        return this;
    }
    pagination() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    Getmeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDocument = yield this.modelQuery.model.countDocuments();
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const totalPage = Math.ceil(totalDocument / limit);
            return {
                totalDocument,
                page,
                limit,
                totalPage
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
