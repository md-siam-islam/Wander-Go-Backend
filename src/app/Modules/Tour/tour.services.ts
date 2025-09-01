import { deleteFields } from '../../consts';
import { ITour, ITourtype } from './tour.interface';
import { Tour, TourType } from './tour.model';
import { searchField } from './tour.searchfield';


//----- Tour Type Services starts -----//
const CreateTourtype = async (payload: ITourtype) => {
    // Implementation for creating a tour
    // const Existour = await TourType.findOne({name: payload.name}) 

    // if(Existour){
    //     throw new Error("Tour Type already exists")
    // }

    const tourtype = await TourType.create(payload)

    return tourtype

}

const getAllTourtype = async () => {

    const tourType = await TourType.find({});

    const totalTourType = await TourType.countDocuments();

    return {
       data : tourType,
       meta : {
        total : totalTourType
       }
    };
}

const GetSingleTourtype = async(id: string) => {

    const TourId = await TourType.findById(id)

    if(!TourId){
        throw new Error("Tour Type not found")
    }
    const tourtype = await TourType.findById(id)

    return tourtype

}

const UpdateTourtype = async(id : string , payload: Partial<ITourtype>) => {

    const existingTourtype = await TourType.findById(id)
    if(!existingTourtype){
        throw new Error("Tour Type not found")
    }

    const NewTourtype = await TourType.findByIdAndUpdate(id , payload, {new: true , runValidators: true})

    return NewTourtype
}


const DeleteTourtype = async(id: string ) => {
    const existingTourtype = await TourType.findById(id)
    if(!existingTourtype){
        throw new Error("Tour Type not found")
    }
    await TourType.findByIdAndDelete(id)
    return null;
}

//----- Tour Type Services end -----//


// Tour Services

const CreateTour = async (payload : ITour) => {

    const ExistingTour = await Tour.findOne({title : payload.title})
    if(ExistingTour){
        throw new Error("Tour already exists")
    }

    const baseTour = payload.title.toLocaleLowerCase().split(" ").join("-")
    let slug = `${baseTour}-tour`

    let count = 0;

    while( await Tour.exists({slug})){
        slug = `${baseTour}-tour-${count++}`

    }
    payload.slug = slug;


    const tour = await Tour.create(payload)
    return tour
}

const getAllTour = async (query: Record<string, string>) => {

    const filter = query
    // search
    const searchTerm = query.searchTerm || ""
    // sort korci je kon field onujayi
    const sort = query.sort || "-createdAt"

    // field selection
    //  jehetu amra string hishebe pabo tai split kore array
    const field = query.field?.split(",").join(" ") || ""

    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit


    // delete unwanted fields from filter object
    for(const field of deleteFields){
        delete filter[field]
    }

    const SearchQuery = { $or : searchField.map(field => ({
        [field] : {$regex : searchTerm , $options : "i"}
    }))}

    const tour = await Tour.find(SearchQuery).find(filter).sort(sort).select(field).skip(skip).limit(limit)

    const totalTour = await Tour.countDocuments()

    return {
        meta: {
            page: page,
            limit: limit,
            total: totalTour,
            totalPage : Math.ceil(totalTour/limit)
        },
        data: tour
    }
}



const GetSingleTour = async (id: string) => {
    const existingTour = await Tour.findById(id)
    if(!existingTour){
        throw new Error("Tour not found")
    }

    const tour = await Tour.findById(id)

    return tour
}


const UpdateTour = async (id: string , payload: Partial<ITour>) => {

    const exitingTour = await Tour.findById(id)
    if(!exitingTour){
        throw new Error("Tour not found")
    }

    if(payload.title){
        const baseTour = payload.title.toUpperCase().split(" ").join("-")
    let slug = `${baseTour}-tour`

    let count = 0;

    while( await Tour.exists({slug})){
        slug = `${baseTour}-tour-${count++}`

    }
    payload.slug = slug;

    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload , {new: true , runValidators : true})

    return updatedTour


}

const DeleteTour = async (id: string) => {
    const existingTour = await Tour.findById(id)
    if(!existingTour){
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

