import { Types } from "mongoose";

export interface ITourtype {
    name : string;
}
export interface ITour {
title: string ;
slug: string ;
description?: string;
images?: string[];
location?: string;
costFrom?: number;
startDate?: Date;
endDate?: Date;
included?: string[];
excluded?: string[];
amenities?: string[];
tourPlan?: string[];
maxGests?: number;
minAge?: number;
departureLocation ?: string;
arrivalLocation?: string;
division: Types.ObjectId;
tourType: Types.ObjectId;
deletedImages?: string[];

}