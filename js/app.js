
// Initialize Firebase
var config = {
  apiKey: "AIzaSyDajmKcgfn5dnEGd1Vp8EprgLJNdVOG_AQ",
  authDomain: "project-one-3e89e.firebaseapp.com",
  databaseURL: "https://project-one-3e89e.firebaseio.com",
  storageBucket: "project-one-3e89e.appspot.com",
};

var downloadURL;
var thisRef;
var storageRef;
var file;

firebase.initializeApp(config);

// Function to save file. Called when button is clicked
function previewFile(){
  var storage = firebase.storage();

  file = $('#files').get(0).files[0];
  
  storageRef = firebase.storage().ref();
  
  // Dynamically set reference to the file name
  thisRef = storageRef.child(file.name);

  // Put request upload file to Firebase storage
  thisRef.put(file).then(function(snapshot) {
    console.log('Uploaded file!');
  });

}
