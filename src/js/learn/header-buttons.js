$(function () {
  var ACCOUNT_BUTTONS = '#account-buttons';

  var JOBDONE_SECTION_ID = '#learn-jobdone';

  function handleWindowScroll() {
    if ($(window).scrollTop() > $(JOBDONE_SECTION_ID).offset().top) {
      $(ACCOUNT_BUTTONS).addClass('active');
    }
  }

  $(window).on('scroll', handleWindowScroll);
  handleWindowScroll();
});
