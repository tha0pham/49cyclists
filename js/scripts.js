$(function(e){
  // load login popup
  $("#popup").load("login.html");

	// load header
	$("#header-wrapper").load("header.html", function(){
    // login button handler: display popup with animation
    $(".login").click(function(e){      
      $("#popup").fadeIn(500).css("display", "flex");

      //validate log in form
      $("#loginForm").validate({
        rules: {
          loginEmail: "required",
          loginPwd: "required"
        },
        messages: {
          loginEmail: "Username is required",
          loginPwd: "Password is required"
        },
        highlight: function(element){
          $(element).css("boxShadow", "0 0 3px red");
        },
        unhighlight: function(element){
          $(element).css("boxShadow","0 0 3px green");
        },
        // TODO: submit form using AJAX
          submitHandler: function() { alert("TODO: submit form using AJAX"); },
      });//end login validation

    });// end login button handler
  
  //load footer
  $("#footer-wrapper").load("footer.html");

  // close popup when click outside
  $(window).click(function(e){
    if (e.target== document.querySelector("#popup")) {
      $("#popup").hide();
    }
  });// end closing popup

    // sign up button handler: redirect to signup.html
    $(".signup").click(function(e){
      window.location.replace("signup.html");
    }); // end sign up button handler
  });// end load header

  /* jQuery UI widget: accordion*/
  $("#accordion").accordion({
    heightStyle: "content",
  }); // end accordion
   
  /* jQuery plugins: tooltipster and validation */
  // activate tooltipster
  $(".tooltip").tooltipster({
    theme: ['tooltipster-noir', 'tooltipster-noir-customized'],
    trigger: "hover",
    animation: "grow",
  }); // end tooltipster

  // validate contact us form
  $("#contactUsForm").validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
          maxlength: 5,
        },
        email: {
          required: true,
          email: true,
          maxlength: 10,
        },
        comment: {
          required: true,
          minlength: 2,
          maxlength: 5,
        },
        url: {
          url: true,
        }
      },
      messages: {
        name: {
          required: "Got a name?",
          minlength: $.validator.format("Give at least {0} characters for your name."),
          maxlength: $.validator.format("We only have room for {0} characters. Got a shorter name?")
        },
        email: {
          required: "Give us an email address to reach you back!",
          email: "Hmm... Your email looks weird...",
          maxlength: $.validator.format("We only have room for {0} characters. Got a shorter email?"),
        },
        comment: {
          required: "Blank comments hurt :(",
          minlength: $.validator.format("We need more than {0} characters on comments."),
          maxlength: $.validator.format("Your comment is too long. Stay within {0} characters.")
        },
        url: {
          url: "Please don't lead us off the Internet..."
        }
      },
      errorClass:"contactError",
      errorElement:"p",
      errorLabelContainer: '.errorContainer',
      highlight: function(element){
        $(element).css("boxShadow", "0 0 3px red");
      },
      unhighlight: function(element){
        $(element).css("boxShadow","");

      },
      // TODO: submit form using AJAX
  }); // end contact us validation

  // validate sign up form
  $("#signupForm").validate({
   // validate as you go
    onkeyup: function(element, event){
      $(element).valid();
    },
    errorElement: "span",
    rules: {
      firstName: {
        required: true,
        minlength: 2,
        maxlength: 5,
      },
      lastName: {
        required: true,
        minlength: 2,
        maxlength: 5,
      },
      email: {
        required: true,
        email: true,
        maxlength: 10,
      },
      password: {
        required: true,
        minlength: 3,
        maxlength: 5,
        myPassword: true,
      },
      confirmPassword: {
        required: true,
        equalTo: "#password",
      },
    },
    messages:{
      firstName: {
        required: "First name is required",
        minlength: $.validator.format("Minimum {0} characters"),
        maxlength: $.validator.format("Maximum {0} characters"),
      },
      lastName: {
        required: "Last name is required",
        minlength: $.validator.format("Minimum {0} characters"),
        maxlength: $.validator.format("Maximum {0} characters"),
      },
      email: {
        required: "Email is required",
        email: "Please check email format",
        maxlength: $.validator.format("Maximum {0} characters"),
      },
      password: {
        required: "Password is required",
        minlength: $.validator.format("Minimum {0} characters"),
        maxlength: $.validator.format("Maximum {0} characters"),
      },
      confirmPassword: {
        required: "Please confirm your password",
        equalTo: "Passwords are not matched",
      },
    },
    highlight: function(element){
        $(element).css("boxShadow", "0 0 3px red");
    },
    unhighlight: function(element){
      $(element).css("boxShadow","0 0 3px green");
    },
    // TODO: submit form using AJAX
          //submitHandler: function() { alert("TODO: submit form using AJAX"); },
  }); // end sign up validation

  // password check
  $.validator.addMethod("myPassword", function(value){
    return /[a-z]/.test(value) && /[0-9]/.test(value) &&/[A-Z]/.test(value);
  }, "Password must contain at least 1 lowercase, 1 uppercase and 1 digit");
  // end password check
  
  /* AJAX requests *********************/
  // AJAX 1: request to an external file - zip.json
  $("#forecastTable").hide(); 
    $.getJSON("zip.json", function( data ) {
        $.each(data, function() {
          $.each(this, function(key, value) {
            $("#zip").append('<option value="'+value+'">'+value+'</option>');
          });
      });
    }); // end ajax getJSON

  // AJAX 2: request to another website - wp.zybooks.com
  $("#zip").change(function(e){
    var zip = $("#zip").val();
    var requestData = {"zip":zip};
    
    $("#forecastTable").fadeOut("slow");

      $.ajax({
        url: "https://wp.zybooks.com/weather.php", 
        method: "GET",
        data: requestData,
        dataType: "json",
      })
      .done(function(data) {
        if (data.success == true) {

          console.log(zip);
          console.log(data.forecast);

          $("#forecastTable tr td").each(function(){
            $(this).remove();
          }); 

          var date = new Date();
          $.each(data.forecast, function(key, value){
            date.setDate(date.getDate()+key);
            $("#dateRow").append('<td>'+date.toDateString()+'</td>');
            $("#highRow").append('<td>'+value.high+'&deg;F</td>');
            $("#lowRow").append('<td>'+value.low+'&deg;F</td>');
            $("#descRow").append('<td>'+value.desc+'</td>');

            var status = value.desc;

            if (status.includes("sunny")) {
              $("#imgRow").append('<td><img src="img/warm.gif"/></td>');
            } else if (status.includes("rain")){
              $("#imgRow").append('<td><img src="img/cool.gif"/></td>');
            } else if (status.includes("cloudy")){
              $("#imgRow").append('<td><img src="img/cloudy.gif"/></td>');
            } else {
              $("#imgRow").append('<td>No data</td>');
            }
          });// end each data.forecast

          $("#forecastTable").fadeIn("slow");
        } else {
          alert(data.error);
        }
      }); // end ajax to wy.zybooks.com
  }); // end zip on change handler
/*end AJAX requests***************/
}); // end ready event