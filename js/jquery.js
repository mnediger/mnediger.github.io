//fade out scroll arrow when user leaves top of page
//fade scroll arrow back in when user goes back to top of page
$(document).ready(function() {

    //remove focus of button after click
    $(".btn").mouseup(function(){
        $(this).blur();
    })
    
    // Add smooth scrolling on all links inside the navbar
    $("#myNavbar a").on('click', function(event) {

      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {

        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        });

      } // End if

    });
    
    // Validates the contact form and submits it using Formspree.
    $.validator.setDefaults({
        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    $("#contact-form").validate({
      submitHandler: function(form) {
        $.ajax({
          url: "//formspree.io/m.nediger@gmail.com", 
          method: "POST",
          data: {
            name: $(form).find("input[name='name']").val(),
            _replyto: $(form).find("input[name='_replyto']").val(),
            message: $(form).find("textarea[name='message']").val()
          },
          dataType: "json",
          success: function() {
            $("#submit-success").fadeIn();
            $("#contact-form").fadeOut();
          },
          error: function() {
            $("#submit-errors").fadeIn();        
          }
        });
      }
    });
    
})
