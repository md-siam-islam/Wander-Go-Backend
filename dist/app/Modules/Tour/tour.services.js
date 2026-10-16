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
exports.TourServices = void 0;
const tour_model_1 = require("./tour.model");
const tour_searchfield_1 = require("./tour.searchfield");
const QueryBulder_1 = require("../utils/QueryBulder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
//----- Tour Type Services starts -----//
const CreateTourtype = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Implementation for creating a tour
    const Existour = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (Existour) {
        throw new Error("Tour Type already exists");
    }
    const tourtype = yield tour_model_1.TourType.create(payload);
    return tourtype;
});
const getAllTourtype = () => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tour_model_1.TourType.find({});
    const totalTourType = yield tour_model_1.TourType.countDocuments();
    return {
        data: tourType,
        meta: {
            total: totalTourType
        }
    };
});
const GetSingleTourtype = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const TourId = yield tour_model_1.TourType.findById(id);
    if (!TourId) {
        throw new Error("Tour Type not found");
    }
    const tourtype = yield tour_model_1.TourType.findById(id);
    return tourtype;
});
const UpdateTourtype = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourtype = yield tour_model_1.TourType.findById(id);
    if (!existingTourtype) {
        throw new Error("Tour Type not found");
    }
    const NewTourtype = yield tour_model_1.TourType.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    return NewTourtype;
});
const DeleteTourtype = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourtype = yield tour_model_1.TourType.findById(id);
    if (!existingTourtype) {
        throw new Error("Tour Type not found");
    }
    yield tour_model_1.TourType.findByIdAndDelete(id);
    return null;
});
//----- Tour Type Services end -----//
// Tour Services
const CreateTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ExistingTour = yield tour_model_1.Tour.findOne({ title: payload.title });
    if (ExistingTour) {
        throw new Error("Tour already exists");
    }
    const baseTour = payload.title.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseTour}-tour`;
    let count = 0;
    while (yield tour_model_1.Tour.exists({ slug })) {
        slug = `${baseTour}-tour-${count++}`;
    }
    payload.slug = slug;
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const modelQuery = new QueryBulder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const Tours = yield modelQuery.
        search(tour_searchfield_1.searchField).
        filter().
        sort().
        field().
        pagination();
    // const metaData = await modelQuery.Getmeta()
    const [data, meta] = yield Promise.all([
        Tours.build(),
        modelQuery.Getmeta()
    ]);
    return {
        data,
        meta
    };
});
// const getAllTour = async (query: Record<string, string>) => {
//     const filter = query
//     const searchTerm = query.searchTerm || ""
//     const sort = query.sort || "-createdAt"
//     const field = query.field?.split(",").join(" ") || ""
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 10
//     const skip = (page - 1) * limit
//     delete unwanted fields from filter object
//     for(const field of deleteFields){
//         delete filter[field]
//     }
//     const SearchQuery = { $or : searchField.map(field => ({
//         [field] : {$regex : searchTerm , $options : "i"}
//     }))}
//     const tour = await Tour.find(SearchQuery).find(filter).sort(sort).select(field).skip(skip).limit(limit)
//     const totalTour = await Tour.countDocuments()
//     return {
//         meta: {
//             page: page,
//             limit: limit,
//             total: totalTour,
//             totalPage : Math.ceil(totalTour/limit)
//         },
//         data: tour
//     }
// }
const GetSingleTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found");
    }
    const tour = yield tour_model_1.Tour.findById(id);
    return tour;
});
const UpdateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exitingTour = yield tour_model_1.Tour.findById(id);
    if (!exitingTour) {
        throw new Error("Tour not found");
    }
    if (payload.title) {
        const baseTour = payload.title.toUpperCase().split(" ").join("-");
        let slug = `${baseTour}-tour`;
        let count = 0;
        while (yield tour_model_1.Tour.exists({ slug })) {
            slug = `${baseTour}-tour-${count++}`;
        }
        payload.slug = slug;
    }
    if (payload.images && payload.images.length > 0 && exitingTour.images && exitingTour.images.length > 0) {
        payload.images = [...payload.images, ...exitingTour.images];
    }
    // image delete handling
    if (payload.deletedImages && payload.deletedImages.length > 0 && exitingTour.images && exitingTour.images.length > 0) {
        const restDBimage = exitingTour.images.filter(imageUrl => { var _a; return !((_a = payload.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => { var _a; return !((_a = payload.deletedImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter(image => !restDBimage.includes(image));
        payload.images = [...restDBimage, ...updatedPayloadImages];
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (payload.deletedImages && payload.deletedImages.length > 0 && exitingTour.images && exitingTour.images.length > 0) {
        yield Promise.all(payload.deletedImages.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const DeleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new Error("Tour not found");
    }
    yield tour_model_1.Tour.findByIdAndDelete(id);
    return null;
});
exports.TourServices = {
    CreateTourtype,
    CreateTour,
    getAllTourtype,
    getAllTour,
    GetSingleTourtype,
    GetSingleTour,
    UpdateTourtype,
    UpdateTour,
    DeleteTourtype,
    DeleteTour
};
