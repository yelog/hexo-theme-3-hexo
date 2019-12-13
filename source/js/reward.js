$("input[name=pay]").on("click", function () {
    if ($("input[name=pay]:checked").val() == "weixin") {
        $(".shang_box .shang_payimg .pay_img").addClass("weixin_img");
    } else {
        $(".shang_box .shang_payimg .pay_img").removeClass("weixin_img");
    }
});

/*打赏页面隐藏与展示*/
function dashangToggle() {
    $(".shang_box").fadeToggle();
    $(".hide_box").fadeToggle();
    console.log("dashang");
}