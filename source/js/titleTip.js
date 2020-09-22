jQuery.fn.quberTip = function (options) {
	var defaults = {
		speed: 500,
		xOffset: 10,
		yOffset: 10
	};
	var options = $.extend(defaults, options);
	return this.each(function () {
		var $this = jQuery(this);
		if ($this.attr('data-title') != undefined) {
			//Pass the title to a variable and then remove it from DOM
			if ($this.attr('data-title') != '') {
				var tipTitle = ($this.attr('data-title'));
			} else {
				var tipTitle = 'QuberTip';
			}
			//Remove title attribute
			$this.removeAttr('data-title');
			$(this).hover(function (e) {
				if ($(window).width() > 1024) {
					//      $(this).css('cursor', 'pointer');
					$("body").append("<div id='tooltip'>" + tipTitle + "</div>");
					$("#tooltip").css({ "position": "absolute",
						"z-index": "9999",
						"background": "#f4f5f5",
						"padding": "5px",
						"opacity": "0.9",
						"border": "1px solid grey",
						"-moz-border-radius": "3px",
						"border-radius": "3px",
						"-webkit-border-radius": "3px",
						"font-weight": "normal",
						"font-size": "12px",
						"display": "none"
					});
					$("#tooltip")
						.css("top", (e.pageY + defaults.xOffset) + "px")
						.css("left", (e.pageX + defaults.yOffset) + "px")
						.fadeIn(options.speed);
				}
			}, function () {
				//Remove the tooltip from the DOM
				$("#tooltip").remove();
			});
			$(this).mousemove(function (e) {
				$("#tooltip")
					.css("top", (e.pageY + defaults.xOffset) + "px")
					.css("left", (e.pageX + defaults.yOffset) + "px");
			});
		}
	});
};