/*jshint multistr:true */
$.fn.extend({
    palette: function(config, callback) {
        var $picker = this;
        $picker.append("<div id=\"palette\">\
            <div class=\"panel\">\
                <div class=\"xy\">\
                    <div class=\"xy-cursor\"></div>\
                    <div class=\"wrap\"></div>\
                </div><!--\
                --><div class=\"z\">\
                    <div class=\"z-cursor\"></div>\
                    <div class=\"wrap\"></div>\
                </div><!--\
                --><div class=\"alpha\">\
                    <div class=\"alpha-cursor\"></div>\
                    <div class=\"wrap\"></div>\
                </div>\
            </div>\
        </div>");

        $palette = $("#palette");

        var $alpha = this.find("#palette>div.panel>div.alpha");
        var $alphaCursor = this.find("#palette>div.panel>div.alpha>div.alpha-cursor");
        var alphaCursor = 1;

        var $z = this.find("#palette>div.panel>div.z");
        var $zCursor = this.find("#palette>div.panel>div.z>div.z-cursor");
        var zCursor = 0;

        var $xy = this.find("#palette>div.panel>div.xy");
        var $xyCursor = this.find("#palette>div.panel>div.xy>div.xy-cursor");
        var xyCursor = [1, 1];

        var zColor = [255, 0, 0];

        var xyColor = [255, 0, 0];

        $palette.css({top: 0, left: this.width()}).on("click", function(e) {
            e.preventDefault();
            return false;
        });

        this.on("click", function(e) {
            if($palette.is(":visible")) $palette.hide();
            else $palette.show();
        }).trigger("click");

        // xy 轴 颜色拾取
        $xy.on("mousedown", function(e) {
            // console.log();
            if(e.offsetY !== undefined && e.offsetX !== undefined) {
                $xyCursor.css({top: e.offsetY - 6, left: e.offsetX - 6});
                xyCursor = [e.offsetX / $xy.width(), 1 - e.offsetY / $xy.height()];
            }

            xyColor = getXYColor(zColor, xyCursor);
            // console.log(xyColor);
            var rgbHex = rgb2hex(xyColor);
            // console.log(rgbHex);
            $alpha.css("backgroundColor", rgbHex).trigger("mousedown");
        });

        // z 轴 颜色拾取
        $z.on("mousedown", function(e) {
            if(e.offsetY !== undefined) {
                $zCursor.css("top", e.offsetY - 8);
                zCursor = (e.offsetY / $z.height());
            }

            zColor = getZColor(zCursor);
            console.log(zColor);

            var rgbHex = rgb2hex(zColor);
            $xy.css("backgroundColor", rgbHex).trigger("mousedown");
        });

        // 透明度 轴 颜色拾取
        $alpha.on("mousedown", function(e) {
            if(e.offsetX !== undefined) {
                $alphaCursor.css("left", e.offsetX - 8);
                alphaCursor = (e.offsetX / $alpha.width());
            }
            console.log([zCursor, xyCursor, alphaCursor]);
            var rgb = getRGB(xyColor);
            var rgba = getRGBA(xyColor, alphaCursor);
            $picker.css("backgroundColor", rgba).data({
                zCursor: zCursor,
                xyCursor: xyCursor,
                alphaCursor: alphaCursor
            });
            callback({
                rgba: rgba,
                rgb: rgb,
                zCursor: zCursor,
                xyCursor: xyCursor,
                alphaCursor: alphaCursor
            });
        }).trigger("mousedown");

        function rgb2hex(rgb) {
            var hex = (rgb[0] * Math.pow(16,4) + rgb[1] * Math.pow(16,2) + rgb[2]).toString(16);
            if(rgb[0] === 0) hex = '00' + hex;
            return '#' + hex;
        }

        function getZColor(cursor) {
            var R = 255, G = 0, B = 0; rate = 1 / 6;
            if(cursor >= 0.83) {
                rate = 0.17;
                R = 255;
                G = Math.round(255 - (cursor - 0.83) / rate * 255);
                B = 0;
            }
            else if(cursor >= 0.67) {
                rate = 0.16;
                R = Math.round((cursor - 0.67) / rate * 255);
                G = 255;
                B = 0;
            }
            else if(cursor >= 0.50) {
                rate = 0.17;
                R = 0;
                G = 255;
                B = Math.round(255 - (cursor - 0.5) / rate * 255);
            }
            else if(cursor >= 0.33) {
                rate = 0.17;
                R = 0;
                G = Math.round((cursor - 0.33) / rate * 255);
                B = 255;
            }
            else if(cursor >= 0.17) {
                rate = 0.16;
                R =  Math.round(255 - (cursor - 0.17) / rate * 255);
                G = 0;
                B = 255;
            }
            else {
                rate = 0.17;
                R = 255;
                G = 0;
                B = Math.round(cursor / rate * 255);
            }
            return [R, G, B];
        }

        function getXYColor(color, cursor) {
            var maxValue = Math.max.apply(null, color);
            var xyColor = [255, 0, 0];
            // console.log(maxValue);
            for (var n=0; n<3; n++) {
                // 计算X轴渐变
                xyColor[n] = color[n] + (maxValue - color[n]) * (1 - cursor[0]);
                // 计算Y轴渐变
                xyColor[n] = Math.round(xyColor[n] - xyColor[n] * (1 - cursor[1]));
            }
            return xyColor;
        }

        function getRGBA(rgb, alpha) {
            return 'rgba(' + rgb.join(',') + ',' + alpha.toFixed(2) + ')';
        }

        function getRGB(rgb) {
            return 'rgb(' + rgb.join(',') + ')';
        }
        return this;
    } // palette
});

$(function(){
    $("#palettePicker").palette({}, function(data) {
        console.log(data);
    });
});
