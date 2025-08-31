import { IDivision } from './division.interface';
import { catchAsync } from "../utils/catchAsync";
import { Division } from './division.model';

const CreateDivision = async (payload: IDivision) => {

        const findDivision = await Division.findOne({name: payload.name})

        if(findDivision){
            throw new Error("Division already exists")
        }

        const division = await Division.create(payload)
        return division
}

const GetAllDivision = async () => {
    const divisions = await Division.find({});

    const totalDivisions = await Division.countDocuments();

    return {
        data : divisions,
        meta : {
            total : totalDivisions
        }
    };
}


const UpdatedDivision = async (id: string , payload: Partial<IDivision>) => {

    const existingDivision = await Division.findById(id)

    if(!existingDivision){
        throw new Error("Division not found")
    }

    const DublicateDivision = await Division.findOne({name : payload.name , _id : {$ne : id}})

    if(DublicateDivision){
        throw new Error("Division already exists")
    }

    const updatedDivision = await Division.findByIdAndUpdate(id, payload , {new : true , runValidators : true})

    return updatedDivision

}

const getSingleDivision = async (slug: string) => {

    const division = await Division.findOne({slug});

    if(!division){
        throw new Error("Division not found");
    }

    return {
       data : division
    };
}


const DeleteDivision = async (id: string) => {
    const existingDivision = await Division.findById(id);

    if (!existingDivision) {
        throw new Error("Division not found");
    }

    await Division.findByIdAndDelete(id);
    return null;
};

export const DivisionServices = {
    CreateDivision,
    GetAllDivision,
    UpdatedDivision,
    DeleteDivision,
    getSingleDivision
}