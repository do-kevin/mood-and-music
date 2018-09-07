
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

firebase.initializeApp(config);

// Function to save file. Called when button is clicked
function uploadFile() {
  file = $('#files').get(0).files[0];
  storageRef = firebase.storage().ref();
  
  // Dynamically set reference to the file name
  thisRef = storageRef.child(file.name);

  // Put request upload file to Firebase storage
  thisRef.put(file).then(function(snapshot) {
    console.log('Uploaded file!');
  });

  // I'm using a timer to fix an error where the url request is happening before the file has uploaded, and therefore, there is no url. 
  // There is a better way to do this, but I don't know how yet
  setTimeout(function() {

    // Get request to get URL for uploaded file
    thisRef.getDownloadURL().then(function(url) {
      console.log(url);
      downloadURL = url;
    })

    // Ajax call using get request url as source for detection
    $.ajax({
      url: 'https://apis.paralleldots.com/v3/facial_emotion?api_key=cnzJZhio5ZfrFxoo23hDZlpsK34EARxBnXCKDkFuqAQ&url=' + downloadURL,
      method: 'POST'
    }).then(function(response) {
      console.log(response);
    });
  }, 2000);

}

