// animate text on section home
$(function(){
  $("#typed").typed({
    stringsElement: $('#typed-strings'),
    typeSpeed: 60,
    backDelay: 2000,
    loop: false,
    contentType: 'text',
    loopCount: false,
    showCursor: true,
    attr: null,
  });
});
