
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
        return response.facial_emotion[0].tag;
      }).catch(err => {
        console.log(err);
      });
      urlRetrieved = !urlRetrieved;
    }
  }

}

