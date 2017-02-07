jQuery.expr[':'].contains = function(a, i, m){
  return jQuery(a).text().toUpperCase()
          .indexOf(m[3].toUpperCase()) >= 0;
};
jQuery.expr[':'].Contains = function(a, i, m){
  var tags =  jQuery(a).data("tag").split(",");
  return $.inArray(m[3],tags)!=-1;
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
    afterPjax();
  }
});
function afterPjax() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  content.css({'opacity':1}).removeClass('fadeOuts').addClass('fadeIns');
  bind();
}

$(".nav-left ul li").on("click",function (e) {
  $(".nav-right form .search").val("");
  $(this).siblings(".active").removeClass("active");
  $(this).addClass("active");
  var $handle = $(".nav-right nav a");
  if ($(this).hasClass("all")){
    $handle.css("display","block");
  } else {
    $handle.css("display","none");
    $(".nav-right").find("."+$(this).data("rel")+"").css("display","block");
  }
});

$(".nav-right form .search").keydown(function (e) {
  if (e.which == 13 && $(".nav-right nav a:not(:hidden)").length>0) {
      $(".nav-right nav a:not(:hidden):first").trigger("click");
  }
});
$(".nav-right form .search").on("input",function (e) {
  inputChange(e);
});
$(".nav-right form .search").on("change",function (e) {
  inputChange(e);
});
function inputChange(e) {
  var val = $(e.currentTarget).val().trim();
  if(val==""){
    $(".nav-right nav a").css("display","block");
  }else if(val.substr(0,1)=="#"){
    $(".nav-right nav a").css("display","none");
    $(".nav-right nav").find("a:Contains('"+val.substr(1)+"')").css("display","block");
  }else{
    $(".nav-right nav a").css("display","none");
    $(".nav-right nav").find("a:contains('"+val+"')").css("display","block");
  }
}

$(".nav-right form span input[type=checkbox]").on("change",function (e) {
  $(".nav-right .tags-list").css("display",$(this).prop("checked")?"block":"none");
});

$(".full-toc .full").click(function (e) {
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
});

$(function () {
  bind();
  //搜索框下的tag搜索事件
  $(".nav-right .tags-list li a").on("click",function (e) {
    $(".nav-right form input").val("#"+$(this).text().trim()).change();
  });
  //文章toc的显示点击事件
  $(".full-toc .post-toc-menu").on('click', function() {
      $('.post-toc').toggleClass('open');
      $(".post .pjax").toggleClass('toc');
  });
});


function bind() {
  //绑定文章内tag的搜索事件
  $(".post .pjax article .article-meta .tag a").on("click", function (e) {
    $(".nav-right form input").val("#" + $(this).text().trim()).change();
  });
  //初始化文章toc
  $(".post-toc-content").html($(".post .pjax article .toc-ref .toc").clone());
  //绑定文章toc的滚动事件
  $(".full-toc .post-toc .post-toc-content .toc-link").click(function () {
    var target = $(this.hash);
    $(".post").animate({scrollTop: $(target).offset().top+$(".post").scrollTop()}, 500);
    return false;
  });
  $(document).pjax('.post .pjax article a[target!=_blank]', '.pjax', {fragment:'.pjax', timeout:8000});
}