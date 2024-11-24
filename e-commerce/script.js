const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
var icon = document.getElementById("icon");

if (bar) {
    bar.addEventListener('click', () =>{
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

/* cookies */

getCookie = (cName)=>{/* retrieve cookies value*/
    const name = cName +"=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split(";");
    let value;
    cArr.forEach(val =>{
        if(val.indexOf(name)=== 0)value = val.substring(name.length);
    })
    return value;
}

cookieMessage = () => {/* will remov the cookie message if enabled */
    if(!getCookie("cookie"))
    {
  document.querySelector("#cookies").style.display = "block";

}}

window.addEventListener("load",cookieMessage);//checks for cookies at page load

setCookie = (cName, cValue, expDays) => {//cookie constructor
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expDays + date;
}

document.querySelector("#cookies-btn").addEventListener('click', () => {// create cookie when cookie button is clicked
    document.querySelector("#cookies").style.display = "none";
    setCookie("cookie",true,30);
})
function eraseCookie(name) {   //cookie destructor
    document.cookie = name+'=; Max-Age=-99999999;';  
}

/* dark-theme*/

function darkmode_init()
{

    
    let darkmodeCookie = {
        set:function(key,value,time,path,secure=false)
        {
            let expires = new Date();
            expires.setTime(expires.getTime() + time);
            var path   = (typeof path !== 'undefined') ? pathValue = 'path=' + path + ';' : '';
            var secure = (secure) ? ';secure' : '';
            
            document.cookie = key + '=' + value + ';' + path + 'expires=' + expires.toUTCString() + secure;
        },
        get:function()
        {
            let keyValue = document.cookie.match('(^|;) ?darkmode=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        },
        remove:function()
        {
            document.cookie = 'darkmode=; Max-Age=0; path=/';
        }
    };
    
    
    if(darkmodeCookie.get() == 'true')
    {
        icon.src = "img/sun.png";
        document.body.classList.toggle('dark-theme');
    }
    
    
    icon.addEventListener('click', (event) => {
        event.preventDefault();

        document.body.classList.toggle('dark-theme');
        
        if(document.body.classList.contains('dark-theme'))
        {
            icon.src = "img/sun.png";
            darkmodeCookie.set('darkmode','true',2628000000,'/',false);
        }
        else
        {
            icon.src = "img/moon.png";
            darkmodeCookie.remove();
        }//
    });
}

