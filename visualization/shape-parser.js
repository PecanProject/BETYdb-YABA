const shp= require('shpjs');

const shapeParser=async function(file){
    try{
        let geoJSON =await shp(file);
        return geoJSON;
    }
    catch(err){
        throw Error("Couldn't parse shapefile");
    }
}

module.exports={ shapeParser }