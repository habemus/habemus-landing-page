$(function () {
  
  // elements
  var $loginTriggers = $('a[href="#login"],a[href="#signup"]');
  var $logoutTriggers = $('a[href="#logout"]');
  var $onlyLoggedIn  = $('[data-auth="logged-in"]');
  var $onlyLoggedOut = $('[data-auth="logged-out"]');
  
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
      // serverURI: 'https://api.habemus.io/account/v2',
      serverURI: 'http://localhost:9000/api/h-account/public',
      t: function (key) {
        // Translations MUST be available as window object
        return window.HABEMUS_TRANSLATIONS.hAccountDialog[key];
      },
    });
    hAccountDialog.attach(document.body);
    
    /**
     * LogIn
     */
    hAccountDialog.getCurrentAccount().then(function (account) {
      // logged in
      $onlyLoggedIn.show();
      $onlyLoggedOut.hide();
      
    })
    .catch(function (err) {
      // logged out
      
      $onlyLoggedIn.hide();
      $onlyLoggedOut.show();
      
      // add event listeners
      $loginTriggers.on('click', function () {
        hAccountDialog.ensureAccount({ ensureEmailVerified: true })
          .then(function (account) {
            var dashboardURL = '//' + window.location.host + '/dashboard';
            window.location.assign(dashboardURL);
          });
      });
      
      // check for location-based triggers
      var hash = window.location.hash;
      if (hash === '#login') {
        hAccountDialog.ensureAccount({ ensureEmailVerified: true });
      } else if (hash === '#signup') {
        hAccountDialog.signUp();
      }
    });
    
    
    /**
     * LogOut
     */
    $logoutTriggers.on('click', function (e) {
      hAccountDialog.logOut();
      
      $onlyLoggedIn.hide();
      $onlyLoggedOut.show();
    });
    
  };
  
  document.body.appendChild(script);
});
