//=========================================== Webcam (WebRTC)====================================
function webcam() {
  var video = document.querySelector("#video"),
    canvas = document.querySelector("#canvas"),
    context = canvas.getContext("2d"),
    photo = document.querySelector("#photo");

  var constraints = {
    audio: false,
    video: {
      width: 320,
      height: 240
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
      var video = document.querySelector('video');
      video.srcObject = mediaStream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    }).catch(function (err) {
      // Old browser support?
      navigator.getMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || // Mozilla
        navigator.msGetUsermedia; // Microsoft IE

      navigator.getMedia({
        video: true,
        audio: false // No need to capture audio
      }, function (stream) {

        video.srcObject = stream;
        video.play();
      }, function (err) {
        console.log(err);
      });
    });



  document.querySelector("#capture").addEventListener("click", function () {
    //What I want to draw on
    // (video, IDK, IDK, width, height)
    context.drawImage(video, 0, 0, 320, 240);

    // Grab from the canvas and placing into the photo src, which is the link and where the picture is saved.
    // The src of the file is transferred to "data:image/png;base64[picture's code]"
    // For example, take a picture. Right-click on the pic and you can see its address
    //              bar when you open it in a new tab; however, you cannot copy its image address.
    photo.setAttribute("src", canvas.toDataURL("image/jpeg", 1.0));

    //========================== Forces image to be downloaded ==========================//
    // var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    // window.location.href = image;
  });
}

webcam();


//==============================================Initialize Firebase==================================================
var config = {
  apiKey: "AIzaSyDajmKcgfn5dnEGd1Vp8EprgLJNdVOG_AQ",
  authDomain: "project-one-3e89e.firebaseapp.com",
  databaseURL: "https://project-one-3e89e.firebaseio.com",
  storageBucket: "project-one-3e89e.appspot.com"
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
  file = $('#files').get(0).files[0];
    if (file !== undefined) {
      storageRef = firebase.storage().ref();
      thisRef = storageRef.child(file.name);

      // Upload file to Firebase storage
      thisRef.put(file).then(function (snapshot) {
        fileUploaded = !fileUploaded;
        console.log("File Uploaded");
        retrieveUrl();
      }).catch(err => {
        console.log(err);
      });
    }

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

//======================================== ParallelDots ===========================================
  // Ajax call using url as source for detection
  function emotionDetect() {
    if (urlRetrieved) {
      $.ajax({
        url: 'https://apis.paralleldots.com/v3/facial_emotion?api_key=Cr6V9f2rl8RJDzQQp1ZFRwosg73K8k0MOcOCf4d119E&url=' + downloadURL,
        method: 'POST'
      }).then(function (response) {
        if (response.output === 'No face detected.') {
          console.log('You are probably a robot with no emotions');
          $(".preview").empty().hide("scale");;

          var e = $('<br><p class="errBox white-text">');
          $(".preview").append(e).show("scale", 1050);
          e.html("You are probably a robot with no emotions. Please upload another image file with a headshot and sufficient lighting.");
        } else {
          console.log(response.facial_emotion[0].tag);
          mood = response.facial_emotion[0].tag;
          retrieveSong();
        }
      });
      urlRetrieved = !urlRetrieved;
    }
  }

//======================================= Napster ==============================================
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
    }).then(function(response) {
      var database = response.tracks;
      console.log(database);

      var a = $("<audio controls autoplay>");
      var p = $('<p class="artistInfo center-align white-text">');
      var c = $('<p class="artistInfo center-align white-text">');

      // $('.preview').show("puff");

      // Empty audio controls before every request so we don't get duplicates
      $('.preview').empty().hide("scale");

      p.html(database[0].name + " by " + database[0].artistName);

      $(".preview").append(p).show("scale", 1050);

      a.attr("src", database[0].previewURL);
      $(".preview").attr('id', 'song').append(a).show("scale", 1060);

      c.html(database[0].albumName + " Album").show("scale", 1200);
      $(".preview").append(c).show("scale", 1100);

    });

  }

}
