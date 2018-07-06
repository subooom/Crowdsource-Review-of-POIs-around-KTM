let title, img;
let index = 0;

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

  let template = '<div class="col s12 m7"><h2 class="header">'+title.replace('Visit ', '')+'</h2><div class="card hoverable horizontal"><div class="card-image"><img class="trip-img" src="'+img+'"></div><div style="position: relative;left: 0px; width: 50%" class="card-stacked"><div class="card-content"><div class="input-field"><textarea id="textarea1" class="materialize-textarea" rows="5"></textarea><label for="textarea1">Review *(optional)</label></div><p><label><input type="checkbox" /><span>Is it managed properly?</span></label></p><p><label><input type="checkbox" /><span>Does it have a clean surrounding?</span></label></p><p><label><input type="checkbox" /><span>Can you meditate there?</span></label></p><p><label><input type="checkbox" /><span>Is the road to get there tarmacked?</span></label></p><button id="next" class="btn waves-effect waves-light" type="submit" name="action">Next<i class="material-icons right">send</i></button><a href="" class="deep-purple btn waves-effect skip waves-light"><span class="white-text text-darken-2">Skip this one</span></a></div></div></div><div>';

  setTimeout(function(){
    $('#destination').html(template);
    $('.trip-img').addClass('loading');
    $('.preloader-wrapper').hide();
  }, 3000);

}

(async function(){
  try {
    const { data } = await axios.get('https://www.thrillophilia.com/places-to-visit-in-kathmandu');
    const html = $(data);

    const trips = html.find('.trip_detail').get().filter(e => $(e).find('img').length);

    $(trips).find('.count').remove();
    generateItem(trips, index);
    index++;

    $('#skip').click(function(e){
      e.preventDefault();
      $('.card').animate({opacity: 0}, 500);
      generateItem(trips);
    });
    $('#next').click(function(e){
      e.preventDefault();
      console.log(e);
      $('.card').animate({opacity: 0}, 500);
      generateItem(trips);
    });
  } catch (error) {
    console.warn(error);
  }
})();
