const tracksTemplateSource = document.getElementById('tracks-template').innerHTML;
const tracksTemplate = Handlebars.compile(tracksTemplateSource);

const $tracks = $('#tracks-container');

var apikey = "apikey=NDU0ZjU2ZWMtMjVhMS00NmNlLWI3NWItYTdlNTc5ODdkMzNk";
var trackID = "tra.305200130"; // "tra.#######"
var queryURL = "https://api.napster.com/v2.2/tracks/" + trackID + "?" + apikey;

// Possible logic: 
// IF statements when a certain mood is selected, it will update the trackID?

// if (sad === true) {
//   trackID = "tra.5156528";
// }
// else if (happy = true) {
//   trackiD = "tra.305200130";
// }


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





  // for (var i = 0; i < database.length; i++) {
  //   var a = $("<audio controls>");
  //   a.attr("src", database[i].previewURL);
  //   $(".preview").append(a);
  // }
});

// "https://api.napster.com/v2.2/tracks/top?apikey=NDU0ZjU2ZWMtMjVhMS00NmNlLWI3NWItYTdlNTc5ODdkMzNk"

// http://api.napster.com/v2.2/tracks/tra.5156528?apikey=NDU0ZjU2ZWMtMjVhMS00NmNlLWI3NWItYTdlNTc5ODdkMzNk