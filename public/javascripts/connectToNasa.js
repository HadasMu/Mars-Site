//const of the exist missions
const CURIOSITY = "Curiosity";
const OPPORTUNITY = "Opportunity";
const SPIRIT = "Spirit";

//a module for the data from nasa app.
const NasaModal = (function() {
    "use strict";
    /* your JS code here */
    const APIKEY = "RoGfUYIHJujCK4F1nSxiy7dFvcQ5I3ehihwh7Ked";
    let classes = {};

    //mission class
    classes.MissionData = class MissionData{
        constructor(json) {
            this.name =json['photo_manifest'].name;
            this.landing_date = new Date(json['photo_manifest'].landing_date);
            this.max_date = new Date(json['photo_manifest'].max_date);
            this.max_sol = json['photo_manifest'].max_sol;
        }
    };

    //list of missions.
    classes.MissionDataList = class MissionDataList {
        constructor() {
            this.list = [];
        }
        add(mission) {
            this.list[mission.name] = mission;
        }

        //create thr mission list
        createMissionList()
        {
            this.getMissionsData(CURIOSITY);
            this.getMissionsData(OPPORTUNITY);
            this.getMissionsData(SPIRIT);

        }

        //generate the modal of missions.
        generateAndAssignToModal(mission){
            document.getElementById("mission-data-add").innerHTML += `
            <div>
                <h1>${mission.name}</h1>
                <h6>mission start in:</h6><p>${mission.landing_date}</p>
                <h6>max date for mission:</h6><p>${mission.max_date}</p>
                <h6>max sol for mission:</h6><p>${mission.max_sol}</p>
            </div>`;
        }

        //get the data of the missions from the server.
        getMissionsData(mission) {
            const params = new URLSearchParams();
            params.append('api_key',APIKEY);
            fetch('https://api.nasa.gov/mars-photos/api/v1/manifests/'+ mission +'/?'+ params.toString())
                .then(validatorModule.status)
                .then(res => res.json())
                .then(json => {
                    let newMission = new NasaModal.MissionData(json);
                    this.add(newMission);
                    this.generateAndAssignToModal(newMission);
                })
                .catch(function() {
                    document.querySelector("#data").innerHTML = "Sorry, the request failed...";
                });
        }

    };

    //image class
    classes.Image = class Image {
        constructor(id ,earthDate,sol ,camera,link ) {
            this.id = id;
            this.earthDate = earthDate;
            this.sol = sol;
            this.camera = camera;
            this.link = link;
        }

    };

    //list of image class
    classes.ImageList = class ImageList{
        constructor() {
            this.listSaved = [];
        }

        //add to list of save image if click on button save.
        addToSavedImage=async (event, listOfImages)=> {
            //update the images in the screen.
             this.getImageFromDB(listOfImages);
            let imgDiv = event.currentTarget.offsetParent;
            let id = imgDiv.querySelector('.id').textContent;
            for(let i of listOfImages.listSaved)
                if(i.id === parseInt(id))
                {
                    document.getElementById("save-again-button").click();
                    return;
                }
            //get the params to save from html.
            let earthDate = imgDiv.querySelector('.earth_date').textContent;
            let sol = imgDiv.querySelector('.sol').textContent;
            let camera = imgDiv.querySelector('.camera').textContent;
            let link = imgDiv.querySelector('.link').href;
            let mission = imgDiv.querySelector('.mission').textContent;

            let img = new classes.Image(id , earthDate, sol ,camera ,link);

            listOfImages.listSaved.push(img);
            let email = document.getElementById("emailFromSession").innerText;
            let data = {"imageId": id, "earthDate": earthDate,"sol":sol,
                                        "camera":camera,"mission":mission,"path": link,"email":email};

            document.querySelector("#gif-loading").innerHTML = "<img src='../images/loading1.gif' alt='searching'>";
            await fetch('/api/addSaveImagesForUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(data)
            })
                .then(response => {
                    //update the images in the screen.
                    this.getImageFromDB(listOfImages)
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(end=>{
                    document.querySelector("#gif-loading").innerHTML = "";
                })
        }

        //get the image from the db and update the html of list saved image and carusel.
        async getImageFromDB (listOfImages) {
            let email = document.getElementById("emailFromSession").innerText;
            document.querySelector("#gif-loading").innerHTML = "<img src='../images/loading1.gif' alt='searching'>";
            await fetch('/api/saveImages/'+ email)
                .then(res => res.json())
                .then(json =>{
                    let i =0;
                    listOfImages.listSaved = [];
                        for (const imageDB of json) {
                            let img = new classes.Image(imageDB.imageId,imageDB.earthDate,imageDB.sol,imageDB.camera,imageDB.path);
                            listOfImages.listSaved.push(img);
                            i ++;
                        }
                        //update the html
                    this.htmlAssingCarousel(this.generateHTMLCarousel(listOfImages));
                    this.htmlAssingSaveImage(this.generateHTMLSave(listOfImages));

                    for (let button of document.getElementsByName("button-x")) {
                        document.getElementById(button.id).addEventListener('click',(event)=>this.clickDeleted(event,listOfImages,button.id)
                        )};
                })
                .catch(function(err) {
                    // should display some error on page to inform the user
                    console.log('Fetch Error :', err);
                })
                .finally(end=>{
                    document.querySelector("#gif-loading").innerHTML = "";
                })
        }

        //delete one image from db
        clickDeleted(event,listOfImages,id)
        {
                    let email = document.getElementById("emailFromSession").innerText;

                    let data = {email:email,imageId:id};
                    document.querySelector("#gif-loading").innerHTML = "<img src='../images/loading1.gif' alt='searching'>";
                     fetch('/api/deleteSaveImagesForUser', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body:JSON.stringify(data)
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    })
                    .finally(end=>{
                      document.querySelector("#gif-loading").innerHTML = "";
                    })

            //update the list of saved image.
            this.getImageFromDB(listOfImages);
            }

        //delete all saved image of user.
        async deleteAllImages(event ,listOfImages){
            let email = document.getElementById("emailFromSession").innerText;

            //update the list to check if there is change in other tab.
           await this.getImageFromDB(listOfImages);

           document.querySelector("#gif-loading").innerHTML = "<img src='../images/loading1.gif' alt='searching'>";
             fetch('/api/deleteAllSaveImagesUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({email:email})
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(end=>{
                 document.querySelector("#gif-loading").innerHTML = "";
             })

            //update the list
           await this.getImageFromDB(listOfImages);
        }

        //add to the html the save image.
        htmlAssingSaveImage(res)
        {
            document.getElementById("saved-image").innerHTML = res;

        }

        //add to the html the bootstrap carousel of saved images.
        htmlAssingCarousel(res){
            document.getElementById("carousel-inner").innerHTML = res;
        }

        //add to the html the photo results after search.
        htmlAssing(res)
        {
            document.getElementById("photos-result").innerHTML = res;
        }

        //generate html of the carousel saved images.
        generateHTMLCarousel(listOfImages)
        {
            let res = "";
            let first = true;
            for(let img of listOfImages.listSaved){
            if(first){
                res += `<div class="carousel-item active">`;
                first= false;
            }
            else
                res += `<div class="carousel-item">`;

            res += `<img src=${img.link} class="img-fluid" alt="cant load picture">
                    <div class="carousel-caption d-none d-md-block">
                    <h5>${img.camera}</h5>
                    <p>${img.earthDate}</p>
                    <a href="${img.link}" style="margin: auto" class="btn btn-info link carousel-indicators" role="button" target="_blank">Full size</a>
                    </div>
                </div>`;
            }
            return res;
        }

        //generate html of the saved images list.
        generateHTMLSave(listOfImages){
            let res = "";
            for(let img of listOfImages.listSaved){
                res += `
                <li>
                <div class="row">
                 <div class="col">
                    <a href="${img.link}" class="link" role="button" target="_blank">image id: ${img.id}</a>
                    <p>earth_date: ${img.earthDate} , sol:${img.sol} , camera: sol:${img.camera}</p>
                  </div>
                  <div class = "col">
                    <button id="`+ img.id + `" type="button" name = "button-x" class="btn btn-outline-danger" style="float: right">X</button>
                </div>
                </div>
                </li>`
            }
            return res;
        }

        //generate html of the cards of the images results after search.
        generateHTML(photo , mission , camera) {
            return `
            <div class="card col-lg-4 col-md-6 col-sm-12">
                <div class="card-body">
                    <img class="card-img-top" src="${photo['img_src']}" alt="mars image not found"/>
                    <h5 class="card-title mission">${mission}</h5>
                    <p class="card-text camera" >${camera}</p>
                    <p class="card-text earth_date" >${photo['earth_date']}</p>
                    <p hidden class="card-text id">${photo['id']}</p>
                    <p hidden class="card-text sol" >${photo['sol']}</p>
                    <button type="button" class="btn-save btn">save</button>
                    <a href="${photo['img_src']}" class="btn btn-info link" role="button" target="_blank">Full size</a>
                </div>
            </div>`;
        }

        //clear the image search results
        clearResults()
        {
            document.getElementById("photos-result").innerHTML = "";
            document.getElementById("nasa-form").reset();
            document.getElementById("solOrDate").classList.remove("is-invalid");
            for (let err of document.getElementsByClassName("text-danger errormessage"))
            {
                err.classList.remove("is-invalid");
                err.innerHTML = '';
            }


        }

        //start the carousel images.
        startSlideShow(event ,list)
        {
            if(list.length===0)
                return;
            else {
                document.getElementById("carousel-card").style.display = "block";
                document.getElementById("carousel").style.display = "block";
            }
        }

        //stop the carousel images.
        stopSlideShow()
        {
            document.getElementById("carousel-card").style.display = "none";
            document.getElementById("carousel").style.display = "none";
        }


        //get from the server the images of the results search.
        searchImages(event,listOfImages) {
            event.preventDefault();
            let res = "";
            let date;
            let regEx = /^\d{4}-\d{2}-\d{2}$/;
            const params = new URLSearchParams();

            date = document.getElementById("solOrDate").value.trim();

            if(!date.match(regEx))
            {
                params.append('sol', date);
            }
            else
            {
                params.append('earth_date', date);
            }
            params.append('camera', document.getElementById("camera").value.trim());
            params.append('api_key',APIKEY);

            document.querySelector("#photos-result").innerHTML = "<img src='../images/mars.gif' alt='searching'>";
            fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/'+document.getElementById("mission").value.trim()+'/photos?' + params.toString())
                .then(validatorModule.status)
                .then(res => res.json())
                .then(json => {
                    //if we dont get any image from the search.
                    if(json['photos']['length']===0)
                    {
                        res = `<h2>no image found!</h2>`;
                    }
                    //if we get results.
                    else
                    {
                        res += '<div class="row">' ;
                        for(let i = 0; i < json['photos']['length']; i++) {
                            res += this.generateHTML(json['photos'][i],document.getElementById("mission").value.trim() ,document.getElementById("camera").value.trim());

                        }
                        res += '</div>';
                    }
                    this.htmlAssing(res);
                    for (const btn of document.getElementsByClassName("btn-save"))
                        btn.addEventListener('click' ,(event) => this.addToSavedImage(event,listOfImages));
                })
                .catch(function() {
                    document.querySelector("#photos-result").innerHTML = "Sorry, the request failed...";
                })
        }
    };
    return classes;
})();

    let listOfImages = new NasaModal.ImageList();
    let missionData =new NasaModal.MissionDataList();
    let solOrDateElem = document.getElementById("solOrDate");
    let missionElem = document.getElementById('mission');
    let cameraElem = document.getElementById('camera');

    // validate the input elements
    const validateForm = (event,solOrDateElem,missionElem, cameraElem,missionData) => {
        event.preventDefault();
        solOrDateElem = document.getElementById("solOrDate");
        missionElem = document.getElementById('mission');
        cameraElem = document.getElementById('camera');

        solOrDateElem.value = solOrDateElem.value.trim();
        let v;
        let vMissionDate = false;
        // display all errors, force checking all fields
        let vDate = validateInput(solOrDateElem, validatorModule.isNotEmpty ,false);
        let vMission = validateInput(missionElem, validatorModule.isNotSelected,false);
        let vCamera = validateInput(cameraElem, validatorModule.isNotSelected,false);
        if(vDate && vMission)
        {
            vMissionDate = validateInput([solOrDateElem,missionElem.value,missionData], validatorModule.isExistDateOrSol,true);
            vDate = vDate && vMissionDate;
        }
        if(vDate)
        {
            let v4 = validateInput(solOrDateElem, validatorModule.isNotDateOrSol,false);
            vDate = vDate && v4;
        }
        v = vDate && vMission && vCamera;
        return v;
    };

    //listener events.
    document.addEventListener('DOMContentLoaded', function () {
        missionData.createMissionList();
        listOfImages.getImageFromDB(listOfImages);
       document.getElementById("Search-button").addEventListener("click",function(event) {
            if (validateForm(event,solOrDateElem, missionElem, cameraElem,missionData)) {
                listOfImages.searchImages(event, listOfImages);
            }
        });
        document.getElementById("Start-Slide-view").addEventListener("click",(event) => listOfImages.startSlideShow(event ,listOfImages));
        document.getElementById("Stop-Slide-view").addEventListener("click",listOfImages.stopSlideShow);
        document.getElementById("Clear-button").addEventListener("click",listOfImages.clearResults );
        document.getElementById("delete-all").addEventListener("click",(event) => listOfImages.deleteAllImages(event ,listOfImages) );

        window.addEventListener('offline', function(event){
            alert("You are offline please turn on internet connection to run website");
            location.reload();
        });
        window.addEventListener('online', function(event){
            alert("internet connection return");
            location.reload();
        });
    });