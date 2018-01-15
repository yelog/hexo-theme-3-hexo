// A local search script with the help of [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// Copyright (C) 2015 
// Joseph Pan <http://github.com/wzpan>
// Shuhao Mao <http://github.com/maoshuhao>
// This library is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of the
// License, or (at your option) any later version.
// 
// This library is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
// 
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
// 02110-1301 USA
// 
var searchAll;
var searchFunc = function (path, search_id, content_id) {
  'use strict';
  $.ajax({
    url: path,
    dataType: 'xml',
    complete: function (xmlResponse) {
      // get the contents from search data
        /* 由于 xml 不支持特殊字符，所有手动转 */
        function createXml(str){
            if(document.all){
                var xmlDom=new ActiveXObject("Microsoft.XMLDOM");
                xmlDom.loadXML(str);
                return xmlDom;
            }
            else
                return new DOMParser().parseFromString(str, "text/xml");
        }
      var datas = $("entry", createXml(xmlResponse.responseText)).map(function () {
        return {
          title: $("title", this).text(),
          content: $("content", this).text(),
          url: $("url", this).text()
        };
      }).get();

      var $input = document.getElementById(search_id);
      var $resultContent = document.getElementById(content_id);

      searchAll = function (val) {
        var str = '<ul class=\"search-result-list\">';
        var keywords = val.trim().toLowerCase().trim().split(/[\s\-]+/);
        $resultContent.innerHTML = "";
        if (val.trim().length <= 0) {
          return;
        }
        // perform local searching
        datas.forEach(function (data) {
          var isMatch = true;
          var content_index = [];
          if (!data.title || data.title.trim() === '') {
            data.title = "Untitled";
          }
          var data_title = data.title.trim().toLowerCase();
          var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
          var data_url = data.url;
          var index_title = -1;
          var index_content = -1;
          var first_occur = -1;
          // only match artiles with not empty contents
          if (data_content !== '') {
            keywords.forEach(function (keyword, i) {
              index_title = data_title.indexOf(keyword);
              index_content = data_content.indexOf(keyword);

              if (index_title < 0 && index_content < 0) {
                isMatch = false;
              } else {
                if (index_content < 0) {
                  index_content = 0;
                }
                if (i == 0) {
                  first_occur = index_content;
                }
                // content_index.push({index_content:index_content, keyword_len:keyword_len});
              }
            });
          } else {
            isMatch = false;
          }
          // show search results
          if (isMatch) {
            var urls = data_url.split("/");
            var post_date = urls[1]+"/"+urls[2]+"/"+urls[3];
            str += "<li><a href='" + data_url + "'><span class='post-title' title='"+data_title+"'>" + data_title + "</span><span class='post-date' title='"+post_date+"'>"+post_date+"</span></a>";
            var content = data.content.trim().replace(/<[^>]+>/g, "");
            if (first_occur >= 0) {
              // cut out 100 characters
              var start = first_occur - 20;
              var end = first_occur + 80;

              if (start < 0) {
                start = 0;
              }

              if (start == 0) {
                end = 100;
              }

              if (end > content.length) {
                end = content.length;
              }

              var match_content = content.substr(start, end);

              // highlight all keywords
              keywords.forEach(function (keyword) {
                var regS = new RegExp(keyword, "gi");
                match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
              });

              str += "<p class=\"search-result\">" + match_content + "...</p>"
            }
            str += "</li>";
          }
        });
        str += "</ul>";
        if (str.indexOf('<li>') === -1) {
          return $resultContent.innerHTML = "<ul><span class='local-search-empty'>没有找到内容，更换下搜索词试试吧~<span></ul>";
        }
        $resultContent.innerHTML = str;

          $(document).pjax('#local-search-result a', '.pjax', {fragment: '.pjax', timeout: 8000});
          /*鼠标移出文章列表后，去掉文章标题hover样式*/
          $("#local-search-result a").mouseenter(function (e) {
              $("#local-search-result a.hover").removeClass("hover");
              $(this).addClass("hover");
          });
          $("#local-search-result a").mouseleave(function (e) {
              $(this).removeClass("hover");
          });
      }
    },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log('文章中出现特殊字符，导致解析xml出现问题，系统自动采用第二方案：进行主动解析！！！ 请检查全文搜索是否有问题，如出现问题，请及时在 https://github.com/yelog/hexo-theme-3-hexo/issues 中提出来，作者会尽快处理！')
      }
  });
}