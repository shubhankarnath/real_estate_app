import { app } from "../../client/src/firebase.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async(req, res, next) =>{
    // console.log(req.body)
    try {
        const listing = new Listing(req.body);

        console.log('listing bana di');

        await listing.save()
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async(req, res, next)=>
{
    const listing = await Listing.findById(req.params.id);
    // console.log(listing);

    if(!listing ){  
        next(errorHandler(404, 'Listing not found.'));
        return;
   }

   try {
        if(req.user.id !== listing.userRef){
            next(errorHandler(401, 'You can delete only your listing.'));
            return;
        }

        const deletedListing = await Listing.findByIdAndDelete(req.params.id);

        console.log('listing deleted');
        
        res.status(200).json({message : 'Listing deleted successfully.'});
        
    } catch (error) {
        next(error);   
    }

}

export const updateListing = async (req, res, next) =>{
    const listing = await Listing.findById(req.params.id);

    if(!listing ){
        next(errorHandler(404, 'Listing not found.'));
        return;
   }
   if(req.user.id !== listing.userRef){
    next(errorHandler(401, 'You can update only your listing.'));
    return;
    }


   try {

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id,
        req.body,
        { new: true }
        );
        res.status(200).json(updatedListing);

   } catch (error) {
        next(error);
   }
}

export const getListing = async (req, res, next) =>{

    try {
        const listing = await Listing.findById(req.params.id);

        if(!listing){
            next(errorHandler(404, 'Listing not found!'));
        }
        // console.log('listing de di');
        // console.log(listing);
        res.status(200).json(listing);
        
    } catch (error) {
        next(error);
    }
}

export const getLocation = async(req, res, next) =>{
    try {
        
    } catch (error) {
        
    }
}

export const getListings = async (req, res, next) =>{
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        const searchTerm = req.query.searchTerm || '';

        // console.log(req.query);

        let offer = req.query.offer;
        if(offer === undefined || offer === 'false'){
            offer = {$in : [false, true]};
        }else{
            offer = true;
        }
        let parking = req.query.parking;
        if(parking === undefined || parking === 'false'){
            parking = {$in : [false, true]};
        }else{
            parking = true;
        }

        let type = req.query.type;
        if(type === undefined || type == 'all'){
            type = {$in : ['rent', 'sell']};
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === 'false'){
            furnished = {$in : [true, false]};
        }else{
            furnished = true;
        }

        let sort = req.query.sort || 'createdAt';
        let order = req.query.order || 'desc'

        let applyGeoFilter = (searchTerm == '') ? 0 : 1;
        let latitude = req.query.latitude || 0;
        let longitude = req.query.longitude || 0;
        let radiusInKilometer = parseInt(req.query.radiusInKilometer) || 10;
        let radiusInRadians = radiusInKilometer/6371;

        if(applyGeoFilter)
        {
            try {
                const address = searchTerm;
                // console.log(address);
                // console.log(process.env.VITE_GOOGLE_MAP_API_KEY)
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA40-tPFkc_eoQBgzULjGlKaQ1TXmMH7Wo`)
                const resultLocation = await response.json();
                
                // console.log(resultLocation)
                if(resultLocation.status === 'OK'){
                    latitude = resultLocation.results[0].geometry.location.lat;
                    longitude = resultLocation.results[0].geometry.location.lng;
        
                    // console.log(location);
            
                    // console.log("formData.location.coordinates[0]", formData.location.coordinates[0]);
                    // console.log("formData.location.coordinates[1]", formData.location.coordinates[1]);
                }else if(resultLocation.status ==='ZERO_RESULTS'){
                    // res.status(200).json({});
                }else{  
                    console.log("resultLocation.status is not Ok")
                    // radiusInRadians = 10000000000;
                }
            } catch (error) {
                console.log(error);
                applyGeoFilter = false;
            }
            
        }

        // console.log("latitude ", latitude)
        // console.log("longitude ", longitude)
        
        

        const baseQuery = {
            // name: { $regex: searchTerm, $options: 'i' },
            offer: offer,
            furnished: furnished,
            type: type,
            parking: parking
        }
        if(applyGeoFilter){
            baseQuery.location= {
                $geoWithin: {
                    $centerSphere: [
                      [latitude,longitude], radiusInRadians
                    ]
                  }
            }
        }else{
            baseQuery.$or = [
                { location: { $exists: false } },
                { location: { $exists: true } }
            ];
        }


        // console.log(baseQuery.location.$geoWithin)


        const data = await Listing.find(baseQuery).sort({
            [sort] : order,
        }).limit(limit).skip(startIndex);

        // console.log(data )

        // for(let i=0; i<data.length; i++){
            // console.log("jefda");
            // console.log(data[i].location);
        // }


        res.status(200).json(data);
        
    } catch (error) {
        next(error);
    }
}