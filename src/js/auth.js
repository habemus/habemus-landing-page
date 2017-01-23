$(function () {
  
  /**
   * The hAccountDialog will be instantiated asynchronously,
   * after its script is loaded.
   */
  var hAccountDialog;
  var H_ACCOUNT_DIALOG_SCRIPT_SRC = 'bower_components/h-account-client/dist/h-account-dialog.js';
  
  var script = document.createElement('script');
  script.src = H_ACCOUNT_DIALOG_SCRIPT_SRC;
  script.onload = function () {
    // instantiate the dialog and attach it to the document
    hAccountDialog = new window.HAccountDialog({
      serverURI: 'https://api.habemus.io/account/v2',
      t: function (key) {
        // Translations MUST be available as window object
        return window.HABEMUS_TRANSLATIONS.hAccountDialog[key];
      },
    });
    hAccountDialog.attach(document.body);
    
    // add event listeners
    $('a[href="#login"]').on('click', function () {
      hAccountDialog.ensureAccount({ ensureEmailVerified: true });
    });
    
    // check for location-based triggers
    var hash = window.location.hash;
    if (hash === '#login') {
      hAccountDialog.ensureAccount({ ensureEmailVerified: true });
    } else if (hash === '#signup') {
      hAccountDialog.signUp();
    }
  };
  
  document.body.appendChild(script);
});
