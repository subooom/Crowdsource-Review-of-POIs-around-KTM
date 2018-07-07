let database;
let errors = [];
let title, img;
let index = 0;
let loadingTemplate = `<div class="preloader-wrapper big active" style="position: relative; top: 40px"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>`;

function showExitScreen(){
  $('#card-item').animate({opacity: 0}, 500);

  setTimeout(function(){
    $('#destination').html(`<div class="col s12 m7">
    <h2 class="header">You're awesome! <img src="img/laugh.png" width="40px" />  </h2>
    <div class="card horizontal">
      <div class="card-image">
        <img src="img/thankyou.jpg">
      </div>
      <div class="card-stacked">
        <div class="card-content">
          <h4>Thank you for your time</h4>
          <p>As a departing gift, here's a nice picture of the Justice League America for you to download.</p>
          <button id="download" class="btn waves-effect waves-light"> Download <i class="material-icons">cloud_download</i></button>
          <p>Thank you for helping make the world a better place.</p>
          <p>The data you provided will be used for good.</p>
        </div>
      </div>
    </div>
    </div>`);
  }, 520);
  setTimeout(function(){
    $('#download').click(function(e){
      console.log(e);
      e.preventDefault();  //stop the browser from following
      window.open('files/thankyou.zip', '_blank');
    });
  }, 550);
}

function sendData(i){
  let review_database = database.ref('reviews');

  let review_text = $("#review-text").val();
  let input1 = $("#managed").is(':checked');
  let input2 = $("#clean").is(':checked');
  let input3 = $("#meditate").is(':checked');
  let input4 = $("#tarmacked").is(':checked');
  let title  = $('.header').html();

  let data = {
    title: title,
    user_review: review_text,
    managed : input1,
    clean : input2,
    meditate : input3,
    tarmacked : input4
  }
  console.log('Saving data...');

  let review = review_database.push(data, finished);
  console.log("Firebase generated key: "+review.key);

  function finished(err) {
    if(err){
      console.log("Oops, something went wrong");
      $('#error-span').html(err);
    } else{
      console.log("Data saved successfully.")
    }
  }
}

function generateItem(trips, index){
  $.each(trips, function(i, trip){
    $(trip).find('img').each((_, img) => {
      img.src = img.dataset.normal;
    });
  });
  title = $(trips[index]).find('.title').html();


  try{
    img = $(trips[index]).find('.clickable-image')[0].src;
  } catch(e){
    generateItem(trips);
  }
  let template = '<h4 id="index" class="teal-text lighten-1">hello</h4><div id="card-item" class="col s12 m7"><h2 class="header">'+title.replace('Visit ', '')+'</h2><div class="card hoverable horizontal"><div class="card-image"><img class="trip-img" src="'+img+'"></div><div style="position: relative;left: 0px; width: 50%" class="card-stacked"><div class="card-content"><div class="input-field"><textarea id="review-text" class="materialize-textarea" rows="5"></textarea><label for="review-text">Review *(optional)</label><span id="error-span" class="helper-text red-text"></span></div><p><label><input type="checkbox" id="managed" /><span>Is it managed properly?</span></label></p><p><label><input type="checkbox" id="clean" /><span>Does it have a clean surrounding?</span></label></p><p><label><input type="checkbox" id="meditate" /><span>Can you meditate there?</span></label></p><p style="margin-bottom: 10px"><label><input type="checkbox" id="tarmacked" /><span>Is the road to get there tarmacked?</span></label></p><button id="next" class="btn waves-effect waves-light" name="action">Next<i class="material-icons right">send</i></button><button id="skip" class="deep-purple btn waves-effect waves-light"><span class="white-text text-darken-2"><i class="material-icons right">skip_next</i>Skip this one</span></button></div></div></div><div>';

  setTimeout(function(){
    $('#destination').html(template);

    if(index>=3){
      $(".card-content").append('<a style="margin-top: 5px" id="exit" class=" waves-effect waves-light"><i class="material-icons right">exit_to_app</i>I am done, take me out</a>');
    }
    $('#index').html(`${index+1} of ${trips.length}`);
    $('#skip').click(function(e){
      e.preventDefault();
      index++;
      $('#card-item').animate({opacity: 0}, 500);
      setTimeout(function(){
        $('#destination').html(`<h4 id="index" class="teal-text lighten-1">${index+1} of ${trips.length}</h4>`+loadingTemplate);
      }, 520);

      generateItem(trips, index);
    });
    $('#next').click(function(e){
      e.preventDefault();

      let review_text = $("#review-text").val();
      let input1 = $("#managed").is(':checked');
      let input2 = $("#clean").is(':checked');
      let input3 = $("#meditate").is(':checked');
      let input4 = $("#tarmacked").is(':checked');
      if(review_text !== '' || input1 || input2 || input3 || input4){
        sendData();
        index++;
        $('#card-item').animate({opacity: 0}, 500);
        setTimeout(function(){
          $('#destination').html(`<h4 id="index" class="teal-text lighten-1">${index+1} of ${trips.length}</h4>`+loadingTemplate);
        }, 520);
        $('.preloader-wrapper').show();
        generateItem(trips, index);
      } else {
        errors.push("You can't submit empty data.")
        $('#error-span').html(errors);
      }
    });
    $('#exit').click(function(e){
      e.preventDefault();
      showExitScreen();
    });
  }, 2000);
}
$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBMiFlDe29ao7r8Gj9HnC6oznOrb9ZG7lM",
    authDomain: "crowdsourced-review-of-p-b0e13.firebaseapp.com",
    databaseURL: "https://crowdsourced-review-of-p-b0e13.firebaseio.com",
    projectId: "crowdsourced-review-of-p-b0e13",
    storageBucket: "",
    messagingSenderId: "764596801314"
  };
  firebase.initializeApp(config);

  database = firebase.database();
  (async function(){
    try {
      $('#destination').html(loadingTemplate);

      const { data } = await axios.get('https://www.thrillophilia.com/places-to-visit-in-kathmandu');
      const html = $(data);
      trips = html.find('.trip_detail').get().filter(e => $(e).find('img').length);

      $(trips).find('.count').remove();
      generateItem(trips, index);
      index++;

    } catch (error) {
      console.warn(error);
    }
  })();
});