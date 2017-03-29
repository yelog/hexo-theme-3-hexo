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
  if($(".theme_disqus_on").val()=="true"){
    DISQUSWIDGETS.getCount({reset: true});
  }
  if($("#comments").hasClass("disqus")){
    setTimeout(function () {
      if($(".count-comment").text().trim()==""){
        $(".count-comment").text(0);
      }
    },300);
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

$(".nav-right nav a").mouseenter(function (e) {
  $(".nav-right nav a.hover").removeClass("hover");
  $(this).addClass("hover");
});
$(".nav-right nav a").mouseleave(function (e) {
  $(this).removeClass("hover");
});
var publickey = {"shift":false,"ctrl":false,"alt":false,"last": 0};
$(document).keydown(function (e) {
  var tobottom = container.prop("scrollHeight")-container.scrollTop()-container.height();
  var totop = container.scrollTop();
  if(!$(".nav-right form .search").is(":focus")){
    if (e.keyCode == 74 && !$(".nav-right form .search").is(":focus")){
      container.animate({scrollTop: container.prop("scrollHeight")-container.height()}, tobottom,"linear");
    } else if (e.keyCode == 75){
      container.animate({scrollTop: 0}, totop,"linear");
    } else if (e.keyCode == 71){
      if(publickey.shift){
        container.animate({scrollTop: container.prop("scrollHeight")}, 800);
      } else if (publickey.last == 71) {
        container.animate({scrollTop: 0}, 800);
      }
    } else if (e.keyCode == 16 ){
      publickey.shift = true;
    }
  }
})

$(document).keyup(function (e) {
  if(!$(".nav-right form .search").is(":focus")){
    if (e.keyCode == 83){
      $(".full-toc .full").trigger("click");
    } else if (e.keyCode == 73 && !$(".nav").hasClass("fullscreen")){
      $(".nav-right form .search").focus();
    } else if (e.keyCode == 87){
      $(".full-toc .post-toc-menu").trigger("click");
    } else if (e.keyCode == 74 || e.keyCode == 75){
      container.stop(true);
    } else if (e.keyCode == 16){
      publickey.shift = false;
    }
  }
  publickey.last = e.keyCode;
})

$(".nav-right form .search").blur(function (e) {
  $(".nav-right nav a.hover").removeClass("hover");
})
/*输入框焦点时的快捷键捕获*/
$(".nav-right form .search").keydown(function (e) {
  if($(".nav-right nav a:not(:hidden)").length>0 && !$(".ac").is(":visible")){
    if (e.which == 13) {
      /*回车*/
      var $handle =  $(".nav-right nav a.hover:not(:hidden)");
      if($handle.length == 0){
        $(".nav-right nav a:not(:hidden):first").trigger("click");
      } else {
        $handle.trigger("click");
      }
    } else if (e.which == 38){
      /*上*/
      if($("nav a:visible.hover").length==0 || $("nav a:visible.hover").prevAll().length == 0){
        $("nav").scrollTop($("nav").prop("scrollHeight"));
        $(".nav-right nav a.hover").removeClass("hover");
        $(".nav-right nav a:visible:last").addClass("hover");
      } else {
        $("nav a.hover").prevAll().each(function () {
          if($(this).is(":visible")){
            $(".nav-right nav a.hover").removeClass("hover");
            $(this).addClass("hover");
            if(($(this).offset().top) - $(".nav-right form").height() < 0){
              $("nav").scrollTop($("nav").scrollTop() - $(this).height());
            }
            return false;
          }
        })
      }
    } else if (e.which == 40){
      /*下*/
      if($("nav a:visible.hover").length==0 || $("nav a:visible.hover").nextAll().length == 0){
        $("nav").scrollTop(0);
        $(".nav-right nav a.hover").removeClass("hover");
        $(".nav-right nav a:visible:first").addClass("hover");
      }else{
        $("nav a.hover").nextAll().each(function () {
          if($(this).is(":visible")){
            $(".nav-right nav a.hover").removeClass("hover");
            $(this).addClass("hover");
            if(($("nav").height() + $(".nav-right form").height() - $(this).offset().top) < 0){
              $("nav").scrollTop($("nav").scrollTop() + $(this).height());
            }
            return false;
          }
        })
      }
    }
  }

  if (e.which == 27){
    var $handle = $(".nav-right form .cross");
    if($handle.is(":visible")){
      $(".nav-right form .cross").trigger("click");
    } else {
      $(".nav-right form input").blur();
    }
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
  //文章toc的显示隐藏事件
  $(".full-toc .post-toc-menu").on('click', function() {
      $('.post-toc').toggleClass('open');
  });
  $(".nav-right form .cross").on("click",function (e) {
    $(".nav-right form .search").val("").change();
    $(".nav-right form .search").focus();
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
  });
  if($("#comments").hasClass("disqus")){
    setTimeout(function () {
      if($(".count-comment").text().trim()==""){
        $(".count-comment").text(0);
      }
    },1500);
  }
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
  $("#busuanzi_value_site_uv").bind("DOMNodeInserted", function(e) {
    $(".site_uv").text($(this).text())
  });
  $("#busuanzi_value_site_pv").bind("DOMNodeInserted", function(e) {
    $(".site_pv").text($(this).text())
  });
  $(".post .pjax .index").find("br").remove();
  $(".post .pjax .index h1:eq(0)").addClass("article-title");
  //绑定文章内tag的搜索事件
  $(".post .pjax article .article-meta .tag a").on("click", function (e) {
    $(".nav-right form input").val("#" + $(this).text().trim()).change();
    if($(window).width() <= 1024) {
      $(".full-toc .full").trigger("click");
    } else if($(".full-toc .full span").hasClass("max")){
      $(".full-toc .full").trigger("click");
    }
  });
  //绑定文章内分类的点击事件
  $(".post .pjax article .article-meta .book a").on("click", function (e) {
    $(".nav-left ul li[data-rel='"+$(this).data("rel")+"']").trigger("click");
    if($(window).width() <= 1024) {
      $(".full-toc .full").trigger("click");
    } else if($(".full-toc .full span").hasClass("max")){
      $(".full-toc .full").trigger("click");
    }
  });
  //绑定文章内作者的点击事件
  $(".post .pjax article .article-meta .author").on("click", function (e) {
      $(".nav-right form input").val("@" + $(this).text().trim()).change();
      if($(window).width() <= 1024) {
          $(".full-toc .full").trigger("click");
      } else if($(".full-toc .full span").hasClass("max")){
        $(".full-toc .full").trigger("click");
      }
  });
  //初始化文章toc
  $(".post-toc-content").html($(".post .pjax article .toc-ref .toc").clone());
  //绑定文章toc的滚动事件
  $("a[href^='#']").click(function () {
    container.animate({scrollTop: $($(this).attr("href")).offset().top+container.scrollTop()}, 500);
    if ($(this).attr("href") === "#comments") {
      load$hide();
    }
    return false;
  });
  if($("#comments").hasClass("disqus")){
    var $disqusCount = $(".disqus-comment-count");
    $disqusCount.bind("DOMNodeInserted", function(e) {
      $(".count-comment").text(
          $(this).text().replace(/[^0-9]/ig,"")
      )
    });
  }
  $(document).pjax('.post .pjax article a[target!=_blank]', '.pjax', {fragment:'.pjax', timeout:8000});

  $(".pjax").find('img').each(function(){
    if(!$(this).parent().hasClass('div_img')){
      $(this).wrap("<div class='div_img'></div>");
      var alt = this.alt;
      if (alt){
        $(this).after('<div class="img_alt"><span>' + alt + '</span></div>');
      }
    }
    if($(window).width() > 426) {
      $(this).on("click",function (e) {
        var _that = $(this);
        $("body").append('<img class="img_hidden" style="display:none" src="'+this.src+'" />');
        var img_width = "";
        var img_height = "";
        var img_top = "";
        var img_left = "";
        if ((this.width/this.height)>(document.body.clientWidth/document.body.clientHeight) && $(".img_hidden").width() > document.body.clientWidth){
          img_width = document.body.clientWidth+"px";
          img_height = this.height*document.body.clientWidth/this.width+"px";
          img_top = (document.body.clientHeight - this.height*document.body.clientWidth/this.width)/2+"px";
          img_left = "0px";
        } else if (((this.width/this.height)<(document.body.clientWidth/document.body.clientHeight) && $(".img_hidden").height() > document.body.clientHeight)){
          img_width = this.width*document.body.clientHeight/this.height+"px";
          img_height = document.body.clientHeight+"px";
          img_top = "0px";
          img_left = (document.body.clientWidth - this.width*document.body.clientHeight/this.height)/2+"px";
        } else {
          img_height = $(".img_hidden").height()+"px";
          img_width = $(".img_hidden").width()+"px";
          img_top = (document.body.clientHeight - $(".img_hidden").height())/2+"px";
          img_left = (document.body.clientWidth - $(".img_hidden").width())/2+"px";
        }
        $("body").append('<div class="img_max" style="opacity: 0"></div>');
        $("body").append('<img class="img_max" src="'+this.src+'" style="top:'+$(this).offset().top+'px;left:'+$(this).offset().left+'px; width:'+$(this).width()+'px;height: '+this.height+'px;">');
        $(this).css("visibility","hidden");
        setTimeout(function () {
          $("img.img_max").attr("style","").css({"top":img_top,"left":img_left,"width":img_width,"height":img_height});
          $("div.img_max").css("opacity","1");
        },10);
        $(".img_max").on("click", function (e) {
          $("img.img_max").css({"width":_that.width()+"px","height":_that.height()+"px","top":_that.offset().top+"px","left":_that.offset().left+"px"})
          $("div.img_max").css("opacity","0");
          setTimeout(function () {
            _that.css("visibility","visible");
            $(".img_max").remove();
            $(".img_hidden").remove();
          },500);
        })
      })
    }
  });

}