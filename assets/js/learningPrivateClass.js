$(document).ready(()=>{
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
      let classId = params.classId;
 



    $('#postAnnouncement').click(()=>{
        $('#classWorkForm').hide();
        $('#announceForm').css('display','flex');
    })

    $('#announceForm').submit(function (e){
        e.preventDefault();
        $(this).hide();
        data= {}
        data.heading = $('#announceHeading').val();
        data.body = $('#announceBody').val();
        data.classId = classId
        $.ajax('/api/postAnnouncement',{
            type:'POST',
            dataType:'json',
            data:data,
            success:function(data,status,xhr){
                
                    const postCont = $(`<div class='postCont' id=${data._id}></div>`);
                    const postUsername = $(`<p class='postUserName'>${data.userName}</p>`)
                    const heading = $(`<p class="postHeading">${data.heading}</p>`)
                    const body = $(`<p class="postBody">${data.body}</p>`)
                    const date = $(`<p class="date">${data.datePosted}</p>`);
                    const commentForm = $(`<form class="commentForm">
                    <input type="text" class="commentInput" placeholder="comment on this post">
                    <button class="commentBtn btn" type="submit"><i class="fa fa-arrow-right fa-2x"></i></button>
                </form>`)
                const commentMainCont = $(`<div class="commentMainCont"></div>`)
                    postCont.append(postUsername,heading,body,date,commentMainCont,commentForm);
                    $('#postMainCont').prepend(postCont);
                    
            },
            
        })
    })
    $('body').on('submit','.commentForm',function(e){
        e.preventDefault();
        data={}
        data.id=$(this).parent().attr('id');
        data.comment=$(this).find('.commentInput').val();
        const postContId = $(this).parent().attr('id')
        const commentMainCont = $(`#${postContId}`).find('.commentMainCont');
        $.ajax('/api/postComment',{
            type:"POST",
            dataType:'json',
            data:data,
            success:function(data,status,xhr){
                const commentCont = $(`<div class="commentCont">
                <p class="postUserName">${data.userName}</p>
                <p class="comment">${data.comment}</p>
                <p class="date">${data.datePosted}</p>
            </div>`)
            commentMainCont.append(commentCont);
            commentMainCont.scrollTop(d.prop("scrollHeight"));
            
            }
        })
    })
    
    

    $('#postClassWork').click(()=>{
        $('#announceForm').hide();
        $('#classWorkForm').css('display','flex');
    })
    
    $('.fa-times').click(()=>{
        $('#announceForm').hide();
        $('#classWorkForm').hide();
    })

    
})