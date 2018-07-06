let database;

function sendData(email, feedback){
  let feedback_database = database.ref('feedbacks');

  let data = {
    email: email,
    feedback : feedback
  }
  console.log('Saving data...');

  let feedback_item = feedback_database.push(data, finished);
  console.log("Firebase generated key: "+feedback_item.key);

  function finished(err) {
    if(err){
      console.log("Oops, something went wrong");
      $('#error-span').html(err);
    } else{
      console.log("Data sent successfully.")
      $('#send-feedback').html('Your feedback has been sent! I will get back to you. <i class="material-icons">check</i>')
    }
  }
}
$(document).ready(function() {
  let errors = [];
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

  $('#send-feedback').click(function(){
    let email = $('#email').val();
    let feedback = $('#feedback').val();
    if(email === '' || feedback === ''){
      errors.push('Please Fill the form first.');
      $('#error-span').html(errors);
    } else{
      sendData(email, feedback);
    }
  });
});