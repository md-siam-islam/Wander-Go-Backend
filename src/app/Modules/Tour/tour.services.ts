import { Query } from 'mongoose';
import { deleteFields } from '../../consts';
import { ITour, ITourtype } from './tour.interface';
import { Tour, TourType } from './tour.model';
import { searchField } from './tour.searchfield';
import { QueryBuilder } from '../utils/QueryBulder';
import { deleteImageFromCloudinary } from "../../config/cloudinary.config"


//----- Tour Type Services starts -----//
const CreateTourtype = async (payload: ITourtype) => {
    // Implementation for creating a tour
    const Existour = await TourType.findOne({name: payload.name}) 

    if(Existour){
        throw new Error("Tour Type already exists")
    }

    const tourtype = await TourType.create(payload)

    return tourtype

}

const getAllTourtype = async () => {

    const tourType = await TourType.find({});

    const totalTourType = await TourType.countDocuments();

    return {
        data: tourType,
        meta: {
            total: totalTourType
        }
    };
}

const GetSingleTourtype = async (id: string) => {

    const TourId = await TourType.findById(id)

    if (!TourId) {
        throw new Error("Tour Type not found")
    }
    const tourtype = await TourType.findById(id)

    return tourtype

}

const UpdateTourtype = async (id: string, payload: Partial<ITourtype>) => {

    const existingTourtype = await TourType.findById(id)
    if (!existingTourtype) {
        throw new Error("Tour Type not found")
    }

    const NewTourtype = await TourType.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    return NewTourtype
}


const DeleteTourtype = async (id: string) => {
    const existingTourtype = await TourType.findById(id)
    if (!existingTourtype) {
        throw new Error("Tour Type not found")
    }
    await TourType.findByIdAndDelete(id)
    return null;
}

//----- Tour Type Services end -----//


// Tour Services
const CreateTour = async (payload: ITour) => {

    const ExistingTour = await Tour.findOne({ title: payload.title })
    if (ExistingTour) {
        throw new Error("Tour already exists")
    }

    const baseTour = payload.title.toLocaleLowerCase().split(" ").join("-")
    let slug = `${baseTour}-tour`

    let count = 0;

    while (await Tour.exists({ slug })) {
        slug = `${baseTour}-tour-${count++}`

    }
    payload.slug = slug;


    const tour = await Tour.create(payload)
    return tour
}

const getAllTour = async (query: Record<string, string>) => {

    const modelQuery = new QueryBuilder(
        Tour.find().populate("division", "name slug image").populate("tourType", "name").populate("guides", "name email phone picture"),
        query
    )
    const Tours = await modelQuery.
        search(searchField).
        filter().
        sort().
        field().
        pagination()

    const [data, meta] = await Promise.all([
        Tours.build(),
        modelQuery.Getmeta()
    ])

    return {
        data,
        meta
    }
}

const GetSingleTour = async (id: string) => {
    const tour = await Tour.findById(id)
        .populate("division", "name slug image")
        .populate("tourType", "name")
        .populate("guides", "name email phone picture");

    if (!tour) {
        throw new Error("Tour not found");
    }

    return tour;
}


const UpdateTour = async (id: string, payload: Partial<ITour>) => {

    const exitingTour = await Tour.findById(id)
    if (!exitingTour) {
        throw new Error("Tour not found")
    }

    if (payload.title) {
        const baseTour = payload.title.toUpperCase().split(" ").join("-")
        let slug = `${baseTour}-tour`

        let count = 0;

        while (await Tour.exists({ slug })) {
            slug = `${baseTour}-tour-${count++}`

        }
        payload.slug = slug;

    }

    if (payload.images && payload.images.length > 0 && exitingTour.images && exitingTour.images.length > 0) {
        payload.images = [...payload.images, ...exitingTour.images]
    }



    // image delete handling
    if (payload.deletedImages && payload.deletedImages.length > 0 && exitingTour.images && exitingTour.images.length > 0) {

        const restDBimage = exitingTour.images.filter(imageUrl => !payload.deletedImages?.includes(imageUrl))

        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deletedImages?.includes(imageUrl))
            .filter(image => !restDBimage.includes(image))

        payload.images = [...restDBimage, ...updatedPayloadImages]


    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true, runValidators: true })


    if (payload.deletedImages && payload.deletedImages.length > 0 && exitingTour.images && exitingTour.images.length > 0) {
        await Promise.all(payload.deletedImages.map(url => deleteImageFromCloudinary(url)))
    }

    return updatedTour


}

const DeleteTour = async (id: string) => {
    const existingTour = await Tour.findById(id)
    if (!existingTour) {
        throw new Error("Tour not found")
    }
    await Tour.findByIdAndDelete(id)
    return null;
}

export const TourServices = {
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
}

