import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
        },
        description : {
            type : String,
            required : true,
        },
        address : {
            type : String, 
            required : true,
        },
        // type :{
        //     type : String,
        //     required : true,
        // },
        type : {
            type : String,
            required : true,
        },
        parking : {
            type : Boolean,
            default : 0,
        },
        furnished : {
            type : Boolean,
            default : 0,
        },  
        bedrooms :{
            type : Number,
            default : 0,
        },
        bathrooms :{
            type : Number,
            default : 0,
        },
        offer :{
            type : Boolean,
            default : 0,
        },
        regularPrice : {
            type : Number,
            // required : true,
        },
        discountPrice : {
            type : Number
        },
        imageURLs : {
            type : Array
        },
        userRef :{
            type : String,
            required : true,
        },
        location: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
            },
            coordinates: {
                type: [Number], // Array of numbers
            }
        }
    },
    {timestamps : true}
);

listingSchema.index({ location: '2dsphere' });

const Listing  = mongoose.model('Listing',listingSchema );

export default  Listing;