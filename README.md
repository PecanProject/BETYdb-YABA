[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

[![Build Status](https://travis-ci.org/saurabh1969/BETYdb-YABA.svg?branch=api)](https://travis-ci.org/saurabh1969/BETYdb-YABA)



# BETYdb-YABA
Yet Another BETYdb API (for metadata upload)


## Setup BETYdb

Following commands can be used to initialize the database to be used 
with YABA development.

```bash
docker-compose up -d postgres
docker-compose run --rm bety initialize
docker-compose run --rm bety sync
```


## Running the App

### Bring up container for YABA-API

```sh
docker-compose up -d yaba_api
```

## Running the App (without initialization and synchronization of bety)

### Bring up the containers at once

#### Once initialization and synchronization of bety database is done,the below command can be directly used to start the app.(Skip the "Setup BETYdb" step) 
```sh
# Bring up full stack
docker-compose up
```


## How to hit the endpoints

Following endpoints can be used to upload Metadata to respective tables in bety.

Experiments: (to experiments table):

```sh
curl -F "fileName=@input_files/experiments.csv"   \
     http://localhost:5001/yaba/v1/experiments?username=guestuser
```

Sites: (to sites table)

```sh
curl -F "fileName=@sites.csv"   \
     -F "shp_file=@input_files/S8_two_row_polys.shp"  \
     -F "dbf_file=@input_files/S8_two_row_polys.dbf"  \
     -F "prj_file=@input_files/S8_two_row_polys.prj"  \
     -F "shx_file=@input_files/S8_two_row_polys.shx"  \
     http://localhost:5001/yaba/v1/sites
```

Treatments: (to treatments table)

```sh
curl -F "fileName=@input_files/treatments.csv"   \
     http://localhost:5001/yaba/v1/treatments?username=guestuser
```

Cultivars: (to cultivars table)

```sh
curl -F "fileName=@input_files/cultivars.csv"   \
     http://localhost:5001/yaba/v1/cultivars
```


Citations: (to citations table)

```sh
curl -F "fileName=@input_files/citations.csv"   \
     http://localhost:5001/yaba/v1/citations?username=guestuser
```

Experiments_sites: (to experiments_sites table)

```sh
curl -F "fileName=@input_files/experiments_sites.csv"   \
     http://localhost:5001/yaba/v1/experiments_sites
```
Experiments_treatments: (to experiments_treatments table)

```sh
curl -F "fileName=@input_files/experiments_treatments.csv"   \
     http://localhost:5001/yaba/v1/experiments_treatments
```

Sites_cultivars: (to sites_cultivars table)

```sh
curl -F "fileName=@input_files/sites_cultivars.csv"   \
     http://localhost:5001/yaba/v1/sites_cultivars
```

Citations_sites: (to citations_sites table)
 
```sh
curl -F "fileName=@input_files/citations_sites.csv"   \
     http://localhost:5001/yaba/v1/citations_sites
```
