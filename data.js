(function(){
  var database;
  var errors = [];
  var title, img;
  var clicks = 0;
  var loadingTemplate = '<div class="preloader-wrapper big active" style="position: relative; top: 40px"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';

  function showExitScreen(){
    $('#card-item').animate({opacity: 0}, 500);

    setTimeout(function(){
      $('#destination').html('<div class="col s12 m7"><h2 class="header">You are awesome! <img src="img/laugh.png" width="40px" />  </h2><div class="card horizontal"><div class="card-image"><img src="img/thankyou.jpg"></div><div class="card-stacked"><div class="card-content"><h4>Thank you for your time</h4><p>As a departing gift, here is a nice picture of the Justice League America for you to download.</p><button id="download" class="btn waves-effect waves-light"> Download <i class="material-icons">cloud_download</i></button><p>Thank you for helping make the world a better place.</p><p>The data you provided will be used for good.</p></div></div></div></div>');

    }, 520);
    setTimeout(function(){
      $('#download').click(function(e){
        console.log(e);
        e.preventDefault();  //stop the browser from following
        window.open('files/thankyou.zip', '_blank');
      });
    }, 550);
  }

  function sendData(){
    var review_database = database.ref('reviews');

    var review_text = $("#review-text").val();
    var input1 = $("#managed").is(':checked');
    var input2 = $("#clean").is(':checked');
    var input3 = $("#meditate").is(':checked');
    var input4 = $("#tarmacked").is(':checked');
    var title  = $('.header').html();

    var data = {
      title: title,
      user_review: review_text,
      managed : input1,
      clean : input2,
      meditate : input3,
      tarmacked : input4
    }
    console.log('Saving data...');

    var review = review_database.push(data, finished);
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

  function generateItem(trips){
    clicks++;
    var trip = _getRandomItem(trips);

    if(!trip) return showExitScreen();

    title = $(trip).find('.title').html();

    try{
      img = $(trip).find('.clickable-image')[0].src;
    } catch(e){
      generateItem(trips);
    }
    var template = '<div id="card-item" class="col s12 m7"><h2 class="header">'+title.replace('Visit ', '')+'</h2><div class="card hoverable horizontal"><div class="card-image"><img class="trip-img" src="'+img+'"></div><div style="position: relative;left: 0px;" class="card-stacked"><div class="card-content"><div class="input-field"><textarea id="review-text" class="materialize-textarea" rows="5"></textarea><label for="review-text">Review *(optional)</label><span id="error-span" class="helper-text red-text"></span></div><p><label><input type="checkbox" id="managed" /><span>Is it managed properly?</span></label></p><p><label><input type="checkbox" id="clean" /><span>Does it have a clean surrounding?</span></label></p><p><label><input type="checkbox" id="meditate" /><span>Can you meditate there?</span></label></p><p style="margin-bottom: 10px"><label><input type="checkbox" id="tarmacked" /><span>Is the road to get there tarmacked?</span></label></p><button id="next" class="btn waves-effect waves-light" name="action">Next<i class="material-icons right">send</i></button><button id="skip" class="deep-purple btn waves-effect waves-light"><span class="white-text text-darken-2"><i class="material-icons right">skip_next</i>I have not been here yet</span></button></div></div></div><div>';

    setTimeout(function(){
      $('#destination').html(template);

      if($( window ).width() <= 600){
        $('.card').removeClass('horizontal');
      }
      if(clicks>=3){
        $(".card-content").append('<a style="margin-top: 5px" id="exit" class=" waves-effect waves-light"><i class="material-icons right">exit_to_app</i>I am done, take me out</a>');
      }
      $('#skip').click(function(e){
        e.preventDefault();
        $('#card-item').animate({opacity: 0}, 500);
        setTimeout(function(){
          $('#destination').html(loadingTemplate);
        }, 520);

        generateItem(trips);
      });
      $('#next').click(function(e){
        e.preventDefault();

        var review_text = $("#review-text").val();
        var input1 = $("#managed").is(':checked');
        var input2 = $("#clean").is(':checked');
        var input3 = $("#meditate").is(':checked');
        var input4 = $("#tarmacked").is(':checked');
        if(review_text !== '' || input1 || input2 || input3 || input4){
          sendData();
          index = Math.floor(Math.random()*30);
          $('#card-item').animate({opacity: 0}, 500);
          setTimeout(function(){
            $('#destination').html('<h4 id="index" class="teal-text lighten-1"></h4>'+loadingTemplate);
          }, 520);
          $('.preloader-wrapper').show();
          generateItem(trips);
        } else {
          errors.push("You can't submit empty data.")
          $('#error-span').html(errors);
        }
      });
      $('#exit').click(function(e){
        e.preventDefault();
        showExitScreen();
      });
    },2000);
  }

  var usedOnes = [];

  function _getRandomItem(trips) {
    var index;

    if(trips.length === usedOnes.length) return;

    do {
      index = Math.floor(Math.random() * trips.length);
    } while(usedOnes.indexOf(index) > -1);

    usedOnes.push(index);

    return trips[index];
  }
  function showMobileScreen() {
    var msgTemplate = '<div class="col s12 m7"><div class="card"><div class="card-image"><img src="img/oops.jpg"></div><div class="card-stacked"><div class="card-content"><h4 class="red-text">Mobile Device Detected!</h4><p>Thank you for taking the time to type this unweildy url, but sadly, due to some Javascript thingy; this survey is not doable on cellular browsers. Can you please come back again from your laptop?</p><p>I tried to make it work on cellphones but it turned out to be too much of a hassle. I hope you come back. Your data is valuable to me and to the community. Meanwhile, you might wanna check out the objectives, quote unquote; of this project by clicking <a href="objective.html">here</a> or simply swiping right and navigate from there. Thank you once again.</p></div></div></div></div>';
    $('#destination').html(msgTemplate);
    console.log('cellphone detected');
  }
  $(document).ready(function() {
    if($( window ).width() <= 600){
      showMobileScreen();
      return;
    }
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
      try {
        $('#destination').html(loadingTemplate);

        $.get('https://www.thrillophilia.com/places-to-visit-in-kathmandu')
        .then(function(data){
          var html = $(data);
          var trips = html.find('.trip_detail').get().filter(function(e){ return $(e).find('img').length});

          $(trips).find('.count').remove();

          trips.splice(trips.length - 5, 5);

          $.each(trips, function(i, trip){
            $(trip).find('img').each(function(_, img) {
              img.src = img.dataset.normal;
            });
          });

          generateItem(trips);
        });
      } catch (error) {
        console.warn(error);
      }
  });
})();