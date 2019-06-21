# BETYdb-YABA
Yet Another BETYdb API (for metadata upload)


## Setup App Locally(One time process)

Following commands can be used to fetch app codebase to local system.

### Clone app repository

In a directory of your choice, clone the bety repository from github:

```sh
git clone https://github.com/saurabh1969/BETYdb-YABA
```
## Setup BETYdb Locally(One time process)

Following commands can be used to initialize the database to be used 
with BETYdb-YABA development.This is one time process.

### Install PostgreSQL

Visit [https://www.postgresql.org/download/](https://www.postgresql.org/download/) to download PostgreSQL.

Steps 1-3 are for just one time purpose.Once done,directly steps of Runing the app can be followed.

### Step 1: Clone bety repository

In a directory BETYdb-YABA, clone the bety repository from github and cd to the bety folder:

```sh
cd BETYdb-YABA
git clone https://github.com/PecanProject/bety.git
cd bety
```

### Step 2: Create a `docker-compose.override.yml`

You will need to mount the postgres container to port 9000. This can be done by creating a `docker-compose.override.yml` file in the bety folder. 

Copy and paste the following chunk into the file: 

```sh
version: "3"
services:
  postgres:
    ports:
      - 9000:5432
```

### Step 3: Initialize BETY database

Once you have set up the docker-compose.override.yml file, you should follow these next steps to initialize the database:

```sh
# Start postgres
docker-compose -p bety up -d postgres
# Initialize BETY database
docker run -ti --rm --network bety_bety -e BETY_INITIALIZE_URL='-w https://terraref.ncsa.illinois.edu/bety/dump/bety0/bety.tar.gz' pecan/bety:terra initialize
# Sync with server 6 only
docker run -ti --rm --network bety_bety -e REMOTE_SERVERS='6' pecan/bety:terra sync
```


## Running the App

### Step 1: Bring up all containers for bety

Go to BETYdb-YABA directory.
```sh
cd bety
# Bring up full stack
docker-compose up
```

### Step 2: Bring up the container for flask app

Go to BETYdb-YABA directory.Open other terminal window.

```sh
# Bring up full stack
docker-compose up
```


## How to hit the endpoints

Following endpoints can used now(hit from BETYdb-YABA directory,as file path is relative) -

Experiments:

```sh
curl -F "fileName=@/input_files/experiments.csv"   \
     http://localhost:5001/yaba/v1/experiments?username=guestuser
```

Sites

```sh
curl -F "fileName=@sites.csv"   \
     -F "shp_file=@/input_files/S8_two_row_polys.shp"  \
     -F "dbf_file=@/input_files/S8_two_row_polys.dbf"  \
     -F "prj_file=@/input_files/S8_two_row_polys.prj"  \
     -F "shx_file=@/input_files/S8_two_row_polys.shx"  \
     http://localhost:5001/yaba/v1/sites
```

Cultivars

```sh
curl -F "fileName=@/input_files/cultivars.csv"   \
     http://localhost:5001/yaba/v1/cultivars
```




