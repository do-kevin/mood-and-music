
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDajmKcgfn5dnEGd1Vp8EprgLJNdVOG_AQ",
  authDomain: "project-one-3e89e.firebaseapp.com",
  databaseURL: "https://project-one-3e89e.firebaseio.com",
  storageBucket: "project-one-3e89e.appspot.com",
};

// I needed to make these variables global so we can access the url outside of the function later
var downloadURL;
var file;
var storageRef;
var thisRef;
var fileUploaded = false;
var urlRetrieved = false;
var mood;

firebase.initializeApp(config);

// Function to save file. Called when button is clicked
function uploadFile() {
  // if (!file) {
    file = $('#files').get(0).files[0];
    storageRef = firebase.storage().ref();
    thisRef = storageRef.child(file.name);

    // Upload file to Firebase storage
    thisRef.put(file).then(function(snapshot) {
      fileUploaded = !fileUploaded;
      console.log("File Uploaded");
      retrieveUrl();
    }).catch(err => {
      console.log(err);
    });
  // }

  // Retrieve URL for uploaded file
  function retrieveUrl() {
    if (fileUploaded) {
      thisRef.getDownloadURL().then(function(url) {
      downloadURL = url;
      fileUploaded = !fileUploaded;
      urlRetrieved = !urlRetrieved;
      console.log("URL Retrieved");
      emotionDetect();
      }).catch(err => {
        console.log(err);
      });
    }
  }

  // Ajax call using url as source for detection
  function emotionDetect() {
    if (urlRetrieved) {
      $.ajax({
        url: 'https://apis.paralleldots.com/v3/facial_emotion?api_key=3NRtY8Hw2sbkDv4xf0H000ol31TzrFOb3UdGx4BVq78&url=' + downloadURL,
        method: 'POST'
      }).then(function(response) {
        console.log(response.facial_emotion[0].tag);
        mood = response.facial_emotion[0].tag
        retrieveSong();
      }).catch(err => {
        console.log(err);
      });
      urlRetrieved = !urlRetrieved;
    }
  }

  const tracksTemplateSource = document.getElementById('tracks-template').innerHTML;

  // Not sure if these two lines are needed because the variables are never read
  const tracksTemplate = Handlebars.compile(tracksTemplateSource);
  const $tracks = $('#tracks-container');

  var apikey = "apikey=NDU0ZjU2ZWMtMjVhMS00NmNlLWI3NWItYTdlNTc5ODdkMzNk";
  var trackID;
  
  // Match mood to appropriate music choice
  function retrieveSong() {
    switch (mood) {
      case 'Angry':
        trackID = "tra.128493454";
        break;
      case 'Fear':
        trackID = "tra.268797739";
        break;
      case 'Neutral':
        trackID = "tra.305200130";
        break;
      case 'Surprise':
        trackID = "tra.41390755";
        console.log('You are surprised');
        break;
      case 'Sad':
        trackID = "tra.2732140";
        break;
      case 'Happy':
        trackID = "tra.257617960";
        break;
      case 'Disgust':
        trackID = "tra.1341825";
        break;
      default:
        console.log('You are a robot with no emotions');
        break;
    }
    
    // Update queryURL with appropriate trackID
    var queryURL = "https://api.napster.com/v2.2/tracks/" + trackID + "?" + apikey;
  
    // Ajax that shit
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      var database = response.tracks;
      console.log(database)
  
      var a = $("<audio controls>");
      var p = $('<p class="artistInfo">');
      var c = $('<p class="artistInfo">');
  
      p.html(database[0].name + " by " + database[0].artistName);
      $(".preview").append(p);
  
      a.attr("src", database[0].previewURL);
      $(".preview").append(a);
  
      c.html(database[0].albumName + " Album");
      $(".preview").append(c);

    });

  }
  
}