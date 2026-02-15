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
exports.DivisionServices = void 0;
// import { deleteFields } from '../../consts';
const cloudinary_config_1 = require("../../config/cloudinary.config");
const QueryBulder_1 = require("../utils/QueryBulder");
const division_model_1 = require("./division.model");
const division_searchField_1 = require("./division.searchField");
const CreateDivision = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findDivision = yield division_model_1.Division.findOne({ name: payload.name });
    if (findDivision) {
        throw new Error("Division already exists");
    }
    const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
    console.log(payload.name.toLocaleLowerCase());
    let slug = `${baseSlug}-division`;
    let count = 0;
    while (yield division_model_1.Division.exists({ slug })) {
        slug = `${slug}-${count++}`;
    }
    payload.slug = slug;
    const division = yield division_model_1.Division.create(payload);
    return division;
});
const GetAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const divisionsQueryBuilder = new QueryBulder_1.QueryBuilder(division_model_1.Division.find(), query);
    const divisions = yield divisionsQueryBuilder.search(division_searchField_1.searchField).
        filter().
        sort().
        field().
        pagination();
    const [data, meta] = yield Promise.all([
        divisions.build(),
        divisionsQueryBuilder.Getmeta()
    ]);
    return {
        data,
        meta
    };
});
// const GetAllDivision = async (query:Record<string, string>) => {
//     const filter = query
//     const searchTerm = query.searchTerm || ""
//     const field = query.field?.split(",").join(" ") || ""
//     const sort = query.sort || "-createdAt"
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 6
//     const skip = (page - 1)*limit
//     for(const field of deleteFields){
//         delete filter[field]
//     }
//     const searchQuery = {$or : searchField.map(field => ({
//         [field] : {$regex : searchTerm , $options: "i"}
//     }))}
//     const divisions = await Division.find(searchQuery).find(filter).sort(sort).select(field).limit(limit).
//     skip(skip)
//     const totalDivisions = await Division.countDocuments();
//     return {
//         data : divisions,
//         meta : {
//             total : totalDivisions,
//             page : page,
//             limit : limit,
//             totalPage : Math.ceil(totalDivisions/limit)
//         }
//     };
// }
const UpdatedDivision = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found");
    }
    const DublicateDivision = yield division_model_1.Division.findOne({ name: payload.name, _id: { $ne: id } });
    if (DublicateDivision) {
        throw new Error("Division already exists");
    }
    if (payload.name) {
        const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;
        let count = 0;
        while (yield division_model_1.Division.exists({ slug })) {
            slug = `${slug}-${count++}`;
        }
        payload.slug = slug;
    }
    const updatedDivision = yield division_model_1.Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (payload.thumbnail && existingDivision.thumbnail) {
        (0, cloudinary_config_1.deleteImageFromCloudinary)(existingDivision.thumbnail);
    }
    return updatedDivision;
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_model_1.Division.findOne({ slug });
    if (!division) {
        throw new Error("Division not found");
    }
    return {
        data: division
    };
});
const DeleteDivision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDivision = yield division_model_1.Division.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found");
    }
    yield division_model_1.Division.findByIdAndDelete(id);
    return null;
});
exports.DivisionServices = {
    CreateDivision,
    GetAllDivision,
    UpdatedDivision,
    DeleteDivision,
    getSingleDivision
};
