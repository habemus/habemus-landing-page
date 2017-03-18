$(function () {

  var WEBEDITOR_IMAGE_ID = '#webeditor-image';

  var $imageContainer = $(WEBEDITOR_IMAGE_ID);

  var imageHeight  = $imageContainer.height();
  var windowHeight = $(window).height();

  var scene = new ScrollMagic.Scene({
    triggerElement: WEBEDITOR_IMAGE_ID,
    // ensure the whole image is displayed before pin takes place
    offset: windowHeight / 2 - (windowHeight - imageHeight),
    // scroll for 1 windowHeight
    duration: windowHeight * 0.8,
  })
  // pins the element for the the scene's duration
  .setPin(WEBEDITOR_IMAGE_ID)
  .addTo(window.HABEMUS_LEARN.scrollMagicController);

  scene.on('progress', function (e) {

    if (e.progress === 0) {
        $imageContainer.find('#learn-chat-text').removeClass('active');
        $imageContainer.find('#learn-chat-woman').removeClass('active');
        $imageContainer.find('#learn-chat-box').removeClass('active');
        $('#learn-upload').removeClass('hide');
      }

    if (e.progress > 0) {
      $('#learn-upload').addClass('hide');
    }

    if (e.progress > 0.1) {
      $imageContainer.find('#learn-chat-text').addClass('active');
    }

    if (e.progress > 0.2) {
      $imageContainer.find('#learn-chat-woman').addClass('active');
    }

    if (e.progress > 0.2) {
      $imageContainer.find('#learn-chat-box').addClass('active');
      $imageContainer.find('#learn-chat-box').css({
        transform: 'translateY(-' + (e.progress * 100) + '%)',
      });
    }

    if (e.progress > 0.2 && e.progress < 1) {
      $imageContainer.find('#learn-chat-box').addClass('highlight');
    } else if (e.progress === 0 || e.progress === 1) {
      setTimeout(function () {
        $imageContainer.find('#learn-chat-box').removeClass('highlight');
      }, 1000);
    }

    console.log(e.progress);
  });
});
