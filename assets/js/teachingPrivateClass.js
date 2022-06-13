$(document).ready(()=>{
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });
      let classId = params.classId;
      
    $('#startClassBtn').click(()=>{
        window.location = `/api/startPrivateClass?classId=${classId}`;
    })
    $('.commentMainCont').scrollTop($('.commentMainCont').prop("scrollHeight"));


    $('#postAnnouncement').click(()=>{
        $('#classWorkForm').hide();
        $('#announceForm').css('display','flex');
    })
    $('#postClassWork').click(()=>{
        $('#announceForm').hide();
        $('#classWorkForm').css('display','flex');
    })
    

    $('#announceForm').submit(function (e){
        e.preventDefault();
    }).validate({
        rules:{
            postHeading:{required:true},
           
        },
        messages:{
            postHeading:'this field is required'
        },
        submitHandler:function(form){
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
        form.reset()
        $('#announceForm').hide()
        }
    })
    $('body').on('click','.classWorkCont',function(){
        const postId=$(this).attr('id')
        window.location= `/classWork?classId=${classId}&classWorkId=${postId}`
    })
    $('body').on('submit','.commentForm',function(e){
        e.preventDefault();
      

        data={}
        data.id=$(this).parent().attr('id');
        data.comment=$(this).find('.commentInput').val();
        const postContId = $(this).parent().attr('id')
        const commentMainCont = $(`#${postContId}`).find('.commentMainCont');
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
                <p class="postUserName">${data.userName}</p>
                <p class="comment">${data.comment}</p>
                <p class="date">${data.datePosted}</p>
            </div>`)
            commentMainCont.append(commentCont);
            commentMainCont.scrollTop(commentMainCont.prop("scrollHeight"));
            }
        })
        }
        
    })
    $('#classWorkForm').submit(function(e){
        e.preventDefault()
    }).validate({
        rules:{
            postHeading:{required:true},
            submissionDate:{required:true},
            marks:{required:true},
        },
        messages:{
            postHeading:'this field is required',
            submissionDate:'this field is required',
            marks:'this field is required',
        },
        submitHandler:function(form){
            
            data = {}
            data.classId = classId
            data.heading = $('#classWorkHeading').val();
            data.body = $('#classWorkBody').val();
            data.submissionDate = $('#submissionDate').val();
            data.marks = $('#marks').val();
            $.ajax('/api/postClassWork',{
                            type:'POST',
                            dataType:'json',
                            data:data,
                            success:function(data,status,xhr){
                                const postCont = $("<div class='classWorkCont postCont'></div>");
                                const classWorkContent = $(`<div class="logo"><i class="fa fa-bookmark"></i></div>
                                <p class="classWorkPara postHeading">${data.heading}</p>`)
                                postCont.append(classWorkContent);
                                $('#postMainCont').prepend(postCont);
                
                            }
                        })

            $('#classWorkForm').hide()
            form.reset()
        }
    })
    
    
    $('.fa-times').click(()=>{
        $('#announceForm').hide();
        $('#classWorkForm').hide();
    })

    
})