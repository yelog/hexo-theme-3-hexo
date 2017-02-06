jQuery.expr[':'].contains = function(a, i, m){
  return jQuery(a).text().toUpperCase()
          .indexOf(m[3].toUpperCase()) >= 0;
};

var content = $(".pjax");
var container = $(".post");
$(document).pjax('.nav-right nav a', '.pjax', {fragment:'.pjax', timeout:8000});
$(document).on({
  'pjax:click': function() {
    content.removeClass('fadeIns').addClass('fadeOuts');
  },
  'pjax:start': function() {
    content.css({'opacity':0});
  },
  'pjax:end': function() {
    container.scrollTop(0);
    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    content.css({'opacity':1}).removeClass('fadeOuts').addClass('fadeIns');
    $(".post-toc-content").html($(".post .pjax article .toc-ref .toc").clone());
  }
});

$(".nav-left ul li").on("click",function (e) {
  if ($(this).hasClass("active")){
    return;
  } else {
    $(this).siblings(".active").removeClass("active");
    $(this).addClass("active");
    var $handle = $(".nav-right nav a");
    if ($(this).hasClass("all")){
      $handle.css("display","block");
    } else {
      $handle.css("display","none");
      $(".nav-right").find("."+$(this).data("rel")+"").css("display","block");
    }
  }
})

$(".nav-right form input").on("input",function (e) {
  var val = $(this).val().trim();
  if(val==""){
    $(".nav-right nav a").css("display","block");
  }else{
    $(".nav-right nav a").css("display","none");
    $(".nav-right").find("a:contains('"+val+"')").css("display","block");
  }
})
var flag = 0;//click触发两次，不知为何，所以出此下策
$(".full-toc .full").click(function (e) {
  if(flag%2==0){
    if ($(this).children().hasClass("min")) {
      $(this).children().removeClass("min").addClass("max");
      $(".nav").addClass("fullscreen");
      content.delay(200).queue(function(){
        $(this).addClass('fullscreen').dequeue();
      });
    } else {
      $(this).children().removeClass("max").addClass("min");
      $(".nav").removeClass("fullscreen");
      content.delay(300).queue(function(){
        $(this).removeClass('fullscreen').dequeue();
      });
    }
  }
  flag++;
});

$(function () {
  $(".post-toc-content").html($(".post .pjax article .toc-ref .toc").clone());
})
// right toc
var flagtoc = 0;
$(".full-toc .post-toc-menu").on('click', function() {
  if(flagtoc%2==0){
    $('.post-toc').toggleClass('open');
  }
  flagtoc++
});
