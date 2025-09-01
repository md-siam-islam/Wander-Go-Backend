import { ITourtype } from './tour.interface';
import { TourType } from './tour.model';


const CreateTour = async (payload: ITourtype) => {
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

export const TourServices = {
    CreateTour,
    getAllTourtype,
    GetSingleTourtype
}

