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


export const DivisionServices = {
    CreateDivision
}