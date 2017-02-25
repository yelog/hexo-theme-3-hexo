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
    NProgress.start();
  },
  'pjax:start': function() {
    content.css({'opacity':0});
  },
  'pjax:end': function() {
    NProgress.done();
    container.scrollTop(0);
    afterPjax();
    if($(window).width() <= 1024) {
      $(".full-toc .full").trigger("click");
    }
  }
});
function afterPjax() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  content.css({'opacity':1}).removeClass('fadeOuts').addClass('fadeIns');
  bind();
  if($(".theme_disqus_on").val()=="true" && $(".theme_preload_comment").val()=="false"){
    DISQUSWIDGETS.getCount({reset: true});
  }
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
  $(".nav-right form .cross").css("display",$(e.currentTarget).val()==""?"none":"block");
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
  });
  $(".nav-right form .cross").on("click",function (e) {
    $(".nav-right form input").val("").change();
  });
  $("#rocket").on("click",function (e) {
    $(this).addClass("launch");
    container.animate({scrollTop: 0}, 500);
  });
  container.scroll(function (e) {
    if(container.scrollTop()>=200 && $("#rocket").css("display")=="none"){
      $("#rocket").removeClass("launch").css("display","block").css("opacity","0.5");
    } else if(container.scrollTop()<200 && $("#rocket").css("display")=="block") {
      $("#rocket").removeClass("launch").css("opacity","1").css("display","none");
    }
  })
});


function bind() {
  //绑定文章内tag的搜索事件
  $(".post .pjax article .article-meta .tag a").on("click", function (e) {
    $(".nav-right form input").val("#" + $(this).text().trim()).change();
    if($(window).width() <= 1024) {
      $(".full-toc .full").trigger("click");
    }
  });
  //初始化文章toc
  $(".post-toc-content").html($(".post .pjax article .toc-ref .toc").clone());
  //绑定文章toc的滚动事件
  $(".full-toc .post-toc .post-toc-content .toc-link").click(function () {
    container.animate({scrollTop: $($(this).attr("href")).offset().top+container.scrollTop()}, 500);
    return false;
  });
  if($("#comments").hasClass("disqus")){
    $(".disqus-comment-count").hide();
    var $disqusCount = $(".disqus-comment-count");
    $disqusCount.bind("DOMNodeInserted", function(e) {
      $(".count-comment").text(
          $(this).text().replace(/[^0-9]/ig,"")
      )
    });
  }
  $(document).pjax('.post .pjax article a[target!=_blank]', '.pjax', {fragment:'.pjax', timeout:8000});
}