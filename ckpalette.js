$(function() {
    var $alpha = $("#palette>div.panel>div.alpha");
    var $alphaCursor = $("#palette>div.panel>div.alpha>div.alpha-cursor");
    var alphaCursor = 1;

    var $z = $("#palette>div.panel>div.z");
    var $zCursor = $("#palette>div.panel>div.z>div.z-cursor");
    var zCursor = 1;

    $xy = $("#palette>div.panel>div.xy");

    $z.on("click", function(e) {
        console.log(e);
        $zCursor.css("top", e.offsetY - 8);
        zCursor = (e.offsetY / $z.height());
        var rate = 0.17; // 1/6;
        var R = 0, G = 0, B = 0;
        if(zCursor > 0.83) {console.log(1);}
        else if(zCursor > 0.67) {console.log(2);}
        else if(zCursor > 0.50) {console.log(3);}
        else if(zCursor > 0.33) {
            // R = 0;
            // B = 255;
            // G = Math.round((zCursor / rate - 1) * 255);
        }
        else if(zCursor > 0.17) {
            G = 0;
            B = 255;
            R =  Math.round((2 - zCursor / rate) * 255);
        }
        else if(zCursor >= 0) {
            R = 255;
            G = 0;
            B = Math.round(zCursor / rate * 255);
        }
        $xy.css("backgroundColor", getRGB(R, G, B));
        console.log(zCursor, [R,G,B]);
    });

    $alpha.on("click", function(e) {
        $alphaCursor.css("left", e.offsetX - 8);
        alphaCursor = (e.offsetX / $alpha.width()).toFixed(2);
        console.log(alphaCursor);
    });

    $($alphaCursor).on("click", function(e) {
        e.preventDefault();
        return false;
    });

    $($zCursor).on("click", function(e) {
        e.preventDefault();
        return false;
    });

    function getRGB(R, G, B) {
        return '#'+(R*16*16*16*16+G*16*16+B).toString(16);
    }


});
