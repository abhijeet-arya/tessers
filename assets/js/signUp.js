

$(document).ready(()=>{
    if($('#errMsg').html()==""){
        $('#errMsg').css('display','none')
    }else{
        $('#errMsg').css('display','block')
    }
    const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };
      
      const validate = () => {
        const email = $('#email').val();
        
      
        if (validateEmail(email)) {
            $('#errMsg').text('')
          $('#errMsg').hide()
        } else {
          $('#errMsg').text('Invalid email')
          $('#errMsg').show()
        }
        return false;
      }
      
      $('#email').on('input', validate);
})
