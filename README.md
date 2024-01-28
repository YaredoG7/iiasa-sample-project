# IIASA-Sample-Project

This is a sample project created for a home work assignment by requirments from iiasa. The application is developed using the following stack
<ul>
  <li>FastApi</li>
  <li>MongoDB</li>
  <li>Geoserver</li>
  <li>Angular</li>
  <li>Docker</li>
</ul>

### FastApi
A light weight api server that performs file uplaods, basic MongoDB queries, leveraging `gridfs` to store files (chunks) and Interacts with 
Geoserver for geogiff file automation and rendering geospatial map image (WMS). Besides local file automation you can also upload a new Raster data from the frontend application
and vizualize it

### Angular
Even though Vue.js is the preferred UI framework for this project, due to my limitted experiance with Vue I chose to use Angular. which I have experiance with.

The application does a couple of basic functions. It utilizes `OpenLayer` to dispalay GeoTiff layers, it has a file upload component for *csv* and *tif* and table
that is able to show dynamic content coming from the server in a paginated maner.


### Geoserver
My experiance in the domain of GIS / geospatial data analaysis is limited so I had to spend sometime reasearching and learning about the domain. Through my research I found 
geoserver to be the perfect fit for what is required in this context. So I have used it to process, read and store the target documents. Communication with container is done via
`REST` api.

#### Docker and Compose

Every service is running in containers. Configured networking so that they can communicate with eachother and packaged them in `docker-compose`. as specified non-standard images will be pushed to docker hub.


## Running the application

Clone repo and run `docker compose up --build`, The application will be open on port *3000*.

> *Reminder*: The api has to wait for its dependency containers and it has to process some local files to make them available in the web app. So it takes ~15s to initialize.


## Tests 

The application is configured to be tested with `make unittest` and `make integration test` but <u>no test has been written yet </u>.

