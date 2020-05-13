$(function(){

  function buildHTML(message){
    // 「もしメッセージに画像が含まれていたら」という条件式
    if (message.image) {
      var html = `<div class="message" data-message-id=${message.id}>
                    <div class="message__user">
                      ${message.user_name}
                      <div class="message__user--time">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="message__text">
                      <p class="lower-message__content">
                        ${message.content}
                      </p>
                      <img class="lower-message__image" src = ${message.image} ">
                    </div>
                  </div>`
      return html;
    } else {
      var html =  `<div class="message" data-message-id=${message.id}>
                    <div class="message__user">
                      ${message.user_name}
                      <div class="message__user--time">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="message__text">
                      <p class="lower-message__content">
                        ${message.content}
                      </p>
                    </div>
                  </div>  `
      return html;
    };
  };

  var reloadMessages = function(){
    var last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages){
      if (messages.length !== 0)
      var insertHTML ='';
      //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      //メッセージが入ったHTMLに、入れ物ごと追加
      $('.chat-main__message').append(insertHTML);
      $('.chat-main__message').animate({ scrollTop: $('.chat-main__message')[0].scrollHeight})
    })
    .fail(function(){
      alert('error');
    });
  };

  $('#new_message').on('submit',function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__message').append(html);
      $('.chat-main__message').animate({ scrollTop: $('.chat-main__message')[0].scrollHeight});
      $('.form__submit').prop('disabled', false);
      $('form')[0].reset();
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
    })
  });
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});
