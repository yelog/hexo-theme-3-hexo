jQuery.expr[':'].contains = function(a, i, m){
  return jQuery(a).text().toUpperCase()
          .indexOf(m[3].toUpperCase()) >= 0;
};
jQuery.expr[':'].contains_tag = function(a, i, m){
  var tags =  jQuery(a).data("tag").split(",");
  return $.inArray(m[3],tags)!=-1;
};
jQuery.expr[':'].contains_author = function(a, i, m){
    var tags =  jQuery(a).data("author").split(",");
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
  if($(".theme_duoshuo_on").val()=="true" && $(".theme_preload_comment").val()!="false"){
    pajx_loadDuodsuo();
  }
}

$(".nav-left ul li").on("click",function (e) {
  $(".nav-right form .search").val("").change();
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
    $("div.ac > ul").attr("class","tag");
    $("div.acParent").css("display","block");
    if(val.substr(1).length != 0){
      $(".nav-right nav a").css("display","none");
      $(".nav-right nav").find("a:contains_tag('"+val.substr(1)+"')").css("display","block");
    }
  }else if (val.substr(0,1)=="@") {
    $("div.ac > ul").attr("class","author");
    $("div.acParent").css("display","block");
    if(val.substr(1).length != 0){
      $(".nav-right nav a").css("display","none");
      $(".nav-right nav").find("a:contains_author('"+val.substr(1)+"')").css("display","block");
    }
  }else{
      $("div.acParent").css("display","none");
    $(".nav-right nav a").css("display","none");
    $(".nav-right nav").find("a:contains('"+val+"')").css("display","block");
  }
}

$(".nav-right form span input[type=checkbox]").on("change",function (e) {
  $(".nav-right .tags-list").css("display",$(this).prop("checked")?"block":"none");
  $(".nav-right nav").css("top",$(this).prop("checked")?$(".nav-right form").height()+$(".nav-right .tags-list").height()+51:$(".nav-right form").height()+1+"px");
});

$(".full-toc .full").click(function (e) {
  if($(window).width() <= 1024 && $(".nav").hasClass("mobile")){
    $(".nav").removeClass("mobile");
    $(this).children().removeClass("mobile");
    return;
  }
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

/**
 * pjax后需要回调函数.加载多说
 */
function pajx_loadDuodsuo(){
  if(typeof duoshuoQuery =="undefined"){
    loadComment();
  } else {
    var dus=$(".ds-thread");
    if($(dus).length==1){
      var el = document.createElement('div');
      el.setAttribute('data-thread-key',$(dus).attr("data-thread-key"));//必选参数
      el.setAttribute('data-url',$(dus).attr("data-url"));
      DUOSHUO.EmbedThread(el);
      $(dus).html(el);
    }
  }
}

function bind() {
  initArticle();
  $(".article_number").text($("#yelog_site_posts_number").val());
  $(".site_word_count").text($("#yelog_site_word_count").val());
  $(".post .pjax .index").find("br").remove();
  $(".post .pjax .index h1:eq(0)").addClass("article-title");
  //绑定文章内tag的搜索事件
  $(".post .pjax article .article-meta .tag a").on("click", function (e) {
    $(".nav-right form input").val("#" + $(this).text().trim()).change();
    if($(window).width() <= 1024) {
      $(".full-toc .full").trigger("click");
    }
  });
  //绑定文章内分类的点击事件
  $(".post .pjax article .article-meta .book a").on("click", function (e) {
    $(".nav-left ul li[data-rel='"+$(this).data("rel")+"']").trigger("click");
    if($(window).width() <= 1024) {
      $(".full-toc .full").trigger("click");
    }
  });
  $(".post .pjax article .article-meta .author").on("click", function (e) {
      $(".nav-right form input").val("@" + $(this).text().trim()).change();
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

  $(".pjax").find('img').each(function(){
    $(this).wrap("<div class='div_img'></div>");
    var alt = this.alt;
    if (alt){
      $(this).after('<div class="img_alt"><span>' + alt + '</span></div>');
    }
    if($(window).width() > 426) {
      $(this).on("click",function (e) {
        var img_size = "";
        if((this.width/this.height)>(document.body.clientWidth/document.body.clientHeight)){
          img_size = "width:100%;"
        }else{
          img_size = "height:100%;"
        }
        $("body").append('<div class="img_max" style="position: fixed; left: 0px; right: 0px; top: 0px; bottom: 0px; height: 100%; width: 100%; z-index: 50; background: rgb(255, 255, 255); opacity: 0.8;"></div>');
        $("body").append('<img class="img_max" src="'+this.src+'" style="cursor:zoom-out;position:fixed; z-index: 51; left:50%;top:50%;transform: translate(-50%, -50%);'+img_size+'">');
        $(".img_max").on("click", function (e) {
          $(".img_max").remove();
        })
      })
    }
  });

}