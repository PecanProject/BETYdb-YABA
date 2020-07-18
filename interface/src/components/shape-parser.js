const shp= require('shpjs');

const shapeParser=async(file)=>{
    try{
        let geo= await shp(file).then(function(geojson){
            return geojson
        });
        return geo
    }    
    catch(e){
        throw Error("Couldn't parse data "+e)
    }
}

export default shapeParser;