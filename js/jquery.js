//fade out scroll arrow when user leaves top of page
//fade scroll arrow back in when user goes back to top of page
$(document).ready(function() {

    //remove focus of button after click
    $(".btn").mouseup(function(){
        $(this).blur();
    })
    
    $(window).scroll(function() {
        if (!$(this).scrollTop() > 0){
            $('.bounce').fadeIn();
        }
        
        if ($('body').scrollTop() <= $( window ).height()*3 )  {
            $('.bounce').fadeIn(800);// Hide your element
        }
        
        if ($('body').scrollTop() >= $( window ).height()*3 )  {
            $('.bounce').fadeOut(800);// Hide your element
        }
    });


//    
//    $("#buttonToScroll").click(function() {
//        
//        if ($('body').scrollTop() >= $( window ).height()) {
//            
//            $('html,body').animate({scrollTop: $("#3D").offset().top},800); 
//            
//        } else if ($('body').scrollTop() >= $( window ).height()/2) {
//            
//            $('html,body').animate({scrollTop: $("#information").offset().top},800); 
//            
//        } else {
//            
//            $('html,body').animate({scrollTop: $("#UX").offset().top},800);
//            
//        }
//        
//
//
//    });
//    
    //scroll back to top
    $('a[href=\\#top]').click(function(){
        $('html, body').animate({scrollTop:0}, 'slow');
        return false;
    });
    
    
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
    
})
