$(document).ready(function() {
    var consentIsSet = "unknown";
    var cookieBanner = "#cookieBanner";
    var consentString = "cookieConsent=";
    var click_disable = false
    // Sets a cookie granting/denying consent, and displays some text on console/banner
    function setCookie(console_log, banner_text, consent) {
        $(cookieBanner).text(banner_text);
        $(cookieBanner).fadeOut(100);
        var d = new Date();
        var exdays = 30*12; //  1 year
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = consentString + consent + "; " + expires + ";path=/";
        consentIsSet = consent;
    }

    function denyConsent() {
        setCookie("Consent denied", "You disallowed the use of cookies.", "false");
        click_disable = true;
    }

    function grantConsent() {
        if (consentIsSet == "true") return; // Don't grant twice
        setCookie("Consent granted", "Thank you for accepting cookies.", "true");
        doConsent();
    }

    // Run the consent code. We may be called either from grantConsent() or 
    // from the main routine
    function doConsent() {
        if (consentIsSet == "true" && click_disable == false)
        analytics();
    }

    function checkScrolling(){
        if ($(window).scrollTop() > 200){
            grantConsent()
        }
    }

    function analytics() {
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)){ return; }
            js = d.createElement(s); js.id = id;
            js.onload = function(){
                // remote script has loaded
            };
            js.src = "https://www.googletagmanager.com/gtag/js?id=UA-112624043-1";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-analytics'));
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-112624043-1');
        gtag('anonymizeIp', undefined);

        $("#shiny_image").html("<img src=\"https://noscript.shinystat.com/cgi-bin/shinystat.cgi?USER=sdnwise\" alt=\"Blog counter\"/>")
    }


    // main routine
    //
    // First, check if cookie is present
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf(consentString) == 0) {
            consentIsSet = c.substring(consentString.length, c.length);
        }
    }

    if (consentIsSet == "unknown") {    
        $(cookieBanner).fadeIn(100);
        // The two cases where consent is granted: scrolling the window or clicking a link
        // Don't set cookies on the "cookies page" on scroll
        var pageName = location.pathname.substr(location.pathname.lastIndexOf("/") + 1);
        if (pageName != "cookies.html") {  
            $(window).scroll(checkScrolling)
        };
        $("a:not(.noconsent)").click(grantConsent);
        $(".denyConsent").click(denyConsent);
        // allow re-enabling cookies
        $(".allowConsent").click(grantConsent);
    } 
    else if (consentIsSet == "true") doConsent();
});
