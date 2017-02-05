jQuery.expr[':'].contains = function(a, i, m){
  return jQuery(a).text().toUpperCase()
          .indexOf(m[3].toUpperCase()) >= 0;
};

var content = $(".pjax");
$(document).pjax('.nav-right nav a', '.pjax', {fragment:'.pjax', timeout:8000});
$(document).on({
  'pjax:click': function() {
    content.removeClass('fadeIns').addClass('fadeOuts');
  },
  'pjax:start': function() {
    content.css({'opacity':0});
  },
  'pjax:end': function() {
    content.scrollTop(0);
    content.css({'opacity':1}).removeClass('fadeOuts').addClass('fadeIns');
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