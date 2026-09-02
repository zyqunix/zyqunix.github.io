(function () {
    var timeout = 0;
    var closetimer = 0;
    var ddmenuitem = 0;
    window.getCheckedValue = function (radioObj) {
        if (!radioObj)
            return "";
        var radioLength = radioObj.length;
        if (radioLength == undefined)
            if (radioObj.checked)
                return radioObj.value;
            else
                return "";
        for (var i = 0; i < radioLength; i++) {
            if (radioObj[i].checked) {
                return radioObj[i].value;
            }
        }
        return "";
    };
    window.mopen = function (id) {
        mcancelclosetime();
        if (ddmenuitem)
            ddmenuitem.style.visibility = 'hidden';
        ddmenuitem = document.getElementById(id);
        if (ddmenuitem)
            ddmenuitem.style.visibility = 'visible';
    };
    window.mclose = function () {
        if (ddmenuitem)
            ddmenuitem.style.visibility = 'hidden';
    };
    window.mclosetime = function () {
        closetimer = window.setTimeout(mclose, timeout);
    };
    window.mcancelclosetime = function () {
        if (closetimer) {
            window.clearTimeout(closetimer);
            closetimer = null;
        }
    };
    document.onclick = mclose;
    window.getElementsByClassName = function (classname, node) {
        if (!node)
            node = document.getElementsByTagName("body")[0];
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i = 0, j = els.length; i < j; i++)
            if (re.test(els[i].className))
                a.push(els[i]);
        return a;
    };
    var GlobalSpeachBubbledViewed = 0;
    var preloadPics_names = ["img/speech-bubble01.png", "img/speech-bubble02.png", "img/speech-bubble03.png", "img/speech-bubble04.png"];
    function loadHandler() {
        if (document.images) {
            var X;
            for (var i = 0; i < preloadPics_names.length; i++) {
                X = document.createElement("img");
                X.setAttribute("src", "../assets/theme/" + preloadPics_names[i]);
                X.setAttribute("display", "none");
            }
        }
        try {
            if (window.getElementsByClassName("h-bubble01")) {
                window.getElementsByClassName("h-bubble01")[0].style.display = "";
                window.getElementsByClassName("h-bubble02")[0].style.display = "none";
                window.getElementsByClassName("h-bubble03")[0].style.display = "none";
                window.getElementsByClassName("h-bubble04")[0].style.display = "none";
                setInterval(function () {
                    GlobalSpeachBubbledViewed++;
                    if (GlobalSpeachBubbledViewed == 5) {
                        GlobalSpeachBubbledViewed = 1;
                    }
                    window.getElementsByClassName("h-bubble01")[0].style.display = "none";
                    window.getElementsByClassName("h-bubble02")[0].style.display = "none";
                    window.getElementsByClassName("h-bubble03")[0].style.display = "none";
                    window.getElementsByClassName("h-bubble04")[0].style.display = "none";
                    window.getElementsByClassName("h-bubble0" + GlobalSpeachBubbledViewed)[0].style.display = "";
                }, 6000);
            }
        }
        catch (e) { }
        if (typeof $ !== 'undefined') {
            $("input[name=sendlink]").bind("click", function () {
                $(".activeBox").addClass("disabled");
                if (undefined != window.selectManager) {
                    window.selectManager.setEnableState(false);
                }
                $(".selectHolder").css({
                    "overflow": "hidden"
                });
                $(".selectHolder").removeClass("activeSelect").addClass("disabled");
                $(".formBox input[type=text]").attr("disabled", "true");
                $(".activeBox", $(this).parent()).removeClass("disabled");
                $(".activeBox input[type=text]", $(this).parent()).removeAttr("disabled");
                if ($(".selectHolder", $(this).parent()).length > 0) {
                    $(".selectHolder", $(this).parent()).removeClass("disabled");
                    $(".selectHolder", $(this).parent()).css({
                        "overflow": "hidden"
                    });
                    $(".selectHolder", $(this).parent()).removeClass("activeSelect");
                    window.selectManager.setEnableState(true);
                }
            });
        }
    }
    if (window.addEventListener) {
        window.addEventListener("load", loadHandler, false);
    }
    else {
        window.attachEvent("onload", loadHandler);
    }
})();
export {};
//# sourceMappingURL=menu.js.map