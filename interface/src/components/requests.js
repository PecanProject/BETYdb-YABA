import axios from 'axios'

export function getVisualData(files, type, username){
    const formData = new FormData();
    let params= '';
    
    if(type === "cultivars"){
        formData.append('cultivars',files.cultivars,"cultivars.csv");
        formData.append('sites_cultivars',files.sites_cultivars,"sites_cultivars.csv");
        formData.append('sites',files.sites,"sites.csv");
        params= 'getCultivarSites'
    }

    if(type === "experiments"){
        formData.append('experiments',files.experiments,"experiments.csv");
        formData.append('experiments_sites',files.experiments_sites,"experiments_sites.csv");
        formData.append('sites',files.sites,"sites.csv");
        formData.append("username", username);
        params= 'getExperimentSites'
    }

    if(type === "treatments"){
        formData.append('experiments',files.experiments,"experiments.csv");
        formData.append('experiments_sites',files.experiments_sites,"experiments_sites.csv");
        formData.append('sites',files.sites,"sites.csv");
        formData.append('treatments',files.treatments,"treatments.csv");
        formData.append('experiments_treatments',files.experiments_treatments,"experiments_treatments.csv");
        formData.append("username", username);
        params= 'getTreatmentSites'
    }
    
    let res= fetch(`http://localhost:3001/${params}`,  {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      })
        .then(response => response.json())
        .then(result => result)
        .catch(error => {
        throw Error(error)
        });
    return Promise.resolve(res);
}


export function getGeoJSON(file){
    const formData = new FormData();

    formData.append("shp_file", file);

    let res= fetch("http://localhost:3001/getGeoJSON", {
        method: 'POST',
        body: formData,
        redirect: 'follow'
      })
        .then(response => response.json())
        .catch(error => {
            throw Error(error)
        });
    return Promise.resolve(res);
}

export function uploadFiles(file, type, username){
    const formData = new FormData();
    let params= '';

    if(username!="")
        params= `${type}?username=${username}`;
    else
        params= `${type}`;
    
    type=`${type}.csv`;
    formData.append('fileName',file, type);
    
    return Promise.resolve(
        axios({
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
            url: `http://localhost:6001/${params}`
        })
        // We get the API response and receive data in JSON format...
        .then(response => (response.data))
    )
}

function getGeoFile(zip_file, file_type){
    
    const formdata = new FormData();
    formdata.append("shp_file", zip_file);
    formdata.append("type", file_type);

    const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
    };
    
    const res = fetch("http://localhost:3001/getGeoFile", requestOptions)
    .then(response => new File([response.blob()], `${file_type}_file.${file_type}`))
    .catch(error => {
        throw Error(error)
        });
    return Promise.resolve(res);
}

export function uploadSites(sites, zip_file){
    const formData = new FormData();
    const shp_file= Promise.resolve(getGeoFile(zip_file, "shp"));
    const dbf_file= Promise.resolve(getGeoFile(zip_file, "dbf"));
    const prj_file= Promise.resolve(getGeoFile(zip_file, "prj"));
    const shx_file= Promise.resolve(getGeoFile(zip_file, "shx"));

    Promise.all([shp_file, dbf_file, prj_file, shx_file])
    .then((values)=>{
        console.log(values);
            formData.append('fileName', sites, "sites.csv");
            formData.append("shp_file", values[0], "shp_file.shp");
            formData.append("dbf_file", values[1], "dbf_file.dbf");
            formData.append("prj_file", values[2], "prj_file.prj");
            formData.append("shx_file", values[3], "shx_file.shx");
            
            axios({
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
                url: `http://localhost:5001/yaba/v1/sites`
            })
            // We get the API response and receive data in JSON format...
            .then(response => console.log(response.data))
        })
}