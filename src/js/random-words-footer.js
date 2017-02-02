// animate word change on footer
$(document).ready(function() {
  
  var $wordsContainer = $('#random-words-container');
  
  var words = $wordsContainer.find('> span').map(function (index, el) {
    return $(el).text();
  });
  
  $wordsContainer.remove();
  
  $(".words").on("mouseenter", function() {
    // console.log("passou");
    var item = words[Math.floor(Math.random()*words.length)];
    $("#word-change").text(item);
  });
});
