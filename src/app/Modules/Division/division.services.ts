// import { deleteFields } from '../../consts';
import { QueryBuilder } from '../utils/QueryBulder';
import { IDivision } from './division.interface';
import { Division } from './division.model';
import { searchField } from './division.searchField';

const CreateDivision = async (payload: IDivision) => {

        const findDivision = await Division.findOne({name: payload.name})

        if(findDivision){
            throw new Error("Division already exists")
        }

        const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;

        let count = 0;
        while (await Division.exists({ slug})){
            slug = `${slug}-${count++}`;
        }
        payload.slug = slug;

        const division = await Division.create(payload)
        return division
}

const GetAllDivision = async (query:Record<string, string>) => {

    const divisionsQueryBuilder = new QueryBuilder(Division.find(), query)
    const divisions = await divisionsQueryBuilder.search(searchField).
    filter().
    sort().
    field().
    pagination()

    const [data , meta] = await Promise.all([
        divisions.build(),
        divisionsQueryBuilder.Getmeta()
    ])

    return {
       data,
       meta
    };
}

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


const UpdatedDivision = async (id: string , payload: Partial<IDivision>) => {

    const existingDivision = await Division.findById(id)

    if(!existingDivision){
        throw new Error("Division not found")
    }

    const DublicateDivision = await Division.findOne({name : payload.name , _id : {$ne : id}})

    if(DublicateDivision){
        throw new Error("Division already exists")
    }

    if(payload.name){
        const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;

        let count = 0;
        while (await Division.exists({ slug})){
            slug = `${slug}-${count++}`;
        }
        payload.slug = slug;
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