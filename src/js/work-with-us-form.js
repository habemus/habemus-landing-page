// animate header on scroll
$(function () {
  var $contactForm = $('#work-with-us-form');

  $contactForm.submit(function(e) {

    var name = $contactForm.find("[name='name']").val();
    var email = $contactForm.find("[name='email']").val();
    var social = $contactForm.find("[name='social']").val();
    var message = $contactForm.find("[name='message']").val();
    var cc = $contactForm.find("[name='_cc']").val();

    // console.log(name, phone, mail, message);

  	e.preventDefault();
  	$.ajax({
  		url: '//formspree.io/hello@habem.us',
  		method: 'POST',
      data: {
        message:
        '\n' +
        'name: ' + name + '\n' +
        'e-mail: ' + email + '\n' +
        'social: ' + social + '\n' +
        'message: ' + message,
        _cc: cc,
        _replyto: email,
        _subject: 'New team member ' + name
      },

  		dataType: 'json',
  		beforeSend: function() {
  			// $contactForm.append('<p class="alert alert--loading"> {{ t.contact.sending }}</p>');
        $contactForm.append('<p class="alert alert--loading">Sending message...</p>');
  		},
  		success: function(data) {
  			$contactForm.find('.alert--loading').hide();
  			// $contactForm.append('<p class="alert alert--success">{{ t.contact.success }}</p>');
        $contactForm.append('<p class="alert alert--success">Message sent. We will reply soon</p>');
        $contactForm.find("[name='name']").val('');
        $contactForm.find("[name='social']").val('');
        $contactForm.find("[name='email']").val('');
        $contactForm.find("[name='message']").val('');
  		},
  		error: function(err) {
  			$contactForm.find('.alert--loading').hide();
  			// $contactForm.append('<p class="alert alert--error">{{ t.contact.error }}</p>');
        $contactForm.append('<p class="alert alert--error">Something went wrong, please try again</p>');
  		}
  	});
  });
});
