/*
 * The Original Code is Mozilla Universal charset detector code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 2001
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   António Afonso (antonio.afonso gmail.com) - port to JavaScript
 *   Mark Pilgrim - port to Python
 *   Shy Shalom - original C code
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301  USA
 */

var jschardet = {};

require.config({baseUrl: 'js/jschardet/'}); 
require(['./constants', './codingstatemachine', './escsm','./mbcssm','./charsetprober','./mbcharsetprober','./jisfreq','./gb2312freq','./euckrfreq','./big5freq','./euctwfreq','./chardistribution','./jpcntx','./sjisprober','./utf8prober','./charsetgroupprober','./eucjpprober','./gb2312prober','./euckrprober','./big5prober','./euctwprober','./mbcsgroupprober','./sbcharsetprober','./langgreekmodel','./langthaimodel','./langbulgarianmodel','./langcyrillicmodel','./hebrewprober','./langhebrewmodel','./langhungarianmodel','./sbcsgroupprober','./latin1prober','./escprober','./universaldetector']);

jschardet.VERSION = "0.1";
jschardet.detect = function(buffer) {
    var u = new jschardet.UniversalDetector();
    u.reset();
    if( typeof Buffer == 'function' && buffer instanceof Buffer ) {
        var str = "";
        for (var i = 0; i < buffer.length; ++i)
            str += String.fromCharCode(buffer[i])
        u.feed(str);
    } else {
        u.feed(buffer);
    }
    u.close();
    return u.result;
}
jschardet.log = function() {
  console.log.apply(console, arguments);
}
