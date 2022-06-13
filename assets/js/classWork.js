
$(document).ready(()=>{

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      let classId = params.classId;
      let postId= params.classWorkId;

    $('.commentMainCont').scrollTop($('.commentMainCont').prop("scrollHeight"));

    $('body').on('submit','.commentForm',function(e){
        e.preventDefault();
      
    
        data={}
        data.id=postId;
        data.comment=$('.commentInput').val();
        commentMainCont=$('.commentMainCont')
       
        if(data.comment==""){
            $(this).find('.commentInput').attr('placeholder','type something')
        }else{
            $(this).closest('form').find("input[type=text], textarea").val("");
            $.ajax('/api/postComment',{
            type:"POST",
            dataType:'json',
            data:data,
            success:function(data,status,xhr){
                const commentCont = $(`<div class="commentCont">
                <p class="commentUserName">${data.userName}</p>
                <p class="comment">${data.comment}</p>
                <p class="date">${data.datePosted}</p>
            </div>`)
            commentMainCont.append(commentCont);
            commentMainCont.scrollTop(commentMainCont.prop("scrollHeight"));
            }
        })
        }
        
    })

})