$(function () {
  var START_NOW_ID = '#start-now-buttons';

  function handleWindowScroll() {
    if ($(window).scrollTop() > 100) {
      $(START_NOW_ID).addClass('active');
    }
  }

  $(window).on('scroll', handleWindowScroll);
  handleWindowScroll();
});
