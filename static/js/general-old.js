var Wextensible=Wextensible||{};Wextensible.general={version:"23-12-2018",colaUtiles:[],cargandoUtiles:false,ejecutarUtiles:function(){var a=[].slice.call(arguments,0);var b=a[0];var c=[].slice.call(a,1);if(wxG.utiles){wxG.utiles[b].apply(null,c);}else{wxG.colaUtiles.push(a);if(!wxG.cargandoUtiles){wxG.cargandoUtiles=true;wxG.cargarScripts(["/res/inc/utiles-old.js?mt=20-05-2017"],0,function(){while(wxG.colaUtiles.length>0){var d=wxG.colaUtiles.shift();wxG.utiles[d[0]].apply(null,d.slice(1));}});}}},targetEvent:(function(){return document.createElement("div");})(),mouse:(function(){try{var e=document.createEvent("MouseEvents");return true;}catch(e){return(typeof ltie9!=="undefined");}})(),touch:(function(){try{var e=document.createEvent("TouchEvent");return true;}catch(e){return false;}})(),fechaActual:function(){try{var f=new Date();var g=f.getDate();var h=f.getDay();var i=f.getMonth()+1;var j=f.getFullYear();var k=g+"/"+i+"/"+j;return[h,g,i,j,k];}catch(e){return null;}},formatoFecha:function(a,b,c,d,e,f,g,h,i,j){try{var k=null;if(a){if(typeof(a)=="object"){k=a;}else if(typeof(a)=="string"){k=new Date(a);}else{k=new Date();}}else{k=new Date();}var l="";if(typeof b!="boolean"){var m="/";if(b)m=b;var n="00";if(c)n=c;var o="00";if(d)o=d;var p="0000";if(e)p=e;var q=k.getUTCDate();if((n=="00")&&(q.toString().length==1))q="0"+q;var r=k.getUTCMonth()+1;if((o=="00")&&(r.toString().length==1)){r="0"+r;}else if(o[0].toLowerCase()=="a"){var s=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];r=s[r-1];if(o.length==3)r=r.substr(0,3);}var t=k.getUTCFullYear();if(p=="00")t=t.toString().substr(2,2);l=q+m+r+m+t;}var u="";var v="";if(typeof f!="boolean"){var w=":";if(f)w=f;v=", ";if(j)v=j;var x="00";if(g)x=g;var y="00";if(h)y=h;var z="00";if(i)z=i;var aa=k.getHours();if((x=="00")&&(aa.toString().length==1))aa="0"+aa;var ab=k.getMinutes();if((y=="00")&&(ab.toString().length==1))ab="0"+ab;var ac=k.getSeconds();if((z=="00")&&(ac.toString().length==1))ac="0"+ac;u=aa+w+ab+w+ac;}return l+v+u;}catch(e){return "?";}},limitaValor:function(a,b,c,d){try{if(isNaN(a.value))a.value=0;var e=(b==="entero")?parseInt(a.value,10):parseFloat(a.value);a.value=(e<c)?c:(e>d)?d:e;}catch(e){}},redondear:function(numero,digitos,masEspaciado){try{numero=parseFloat(numero);digitos=parseInt(digitos,0);function toExp(numero,digitos){var arr=numero.toString().split("e");var mantisa=arr[0],exponente=digitos;if(arr[1])exponente=Number(arr[1])+digitos;return Number(mantisa+"e"+exponente.toString());}var absNumero=Math.abs(numero);var signo=Math.sign(numero);if(masEspaciado){var n=Math.floor(Math.log2(absNumero));var spacing=Math.pow(2,n)*Number.EPSILON;if(spacing<Math.pow(10,-digitos-1)){absNumero+=spacing;}}var entero=Math.round(toExp(absNumero,digitos));return signo*toExp(entero,-digitos);}catch(e){return numero;}},quitaEspacios:function(c){return(typeof c==="string")?(c.replace(/\s+/g," ").replace(/^\s+(.+)$/,"$1").replace(/^(.+)\s+$/,"$1")):c},trim:function(c){return(typeof c==="string")?((c.trim)?c.trim():c.replace(/^\s+|\s+$/,"")):c},anulaEspacios:function(c){return(typeof c==="string")?(c.replace(/\s+/g,"")):c},escapaRegExp:function(c){return(typeof c==="string")?(c.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")):c},escapaHtml:function(c){return(typeof c==="string")?(c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")):c},nodoPadre:function(a){try{if(a==null){return null;}else if(a.parentElement){return a.parentElement;}else{return a.parentNode;}}catch(e){return null;}},arrayClassName:function(a,b){try{function recorreDom(el,h){var c=el.className;var d=new RegExp("(?:^| )"+a+"(?:$| )");if(d.test(c)){h.push(el);}var e=el.childNodes;for(var f=0;f<e.length;f++){recorreDom(e[f],h);}return h;}var g=document.body;if(b!=null)g=b;if(document.getElementsByClassName){return g.getElementsByClassName(a);}else{var h=new Array;return recorreDom(g,h);}}catch(e){return null;}},getInnerText:function(a){try{if(a==null){return "";}else if(a.childNodes.length>0){if(a.innerText){return a.innerText;}else if(a.textContent){return a.textContent;}else if(a.text){return a.text;}else{var b=a.selectSingleNode("text()");if(b!=null){return b.nodeValue;}else{return "";}}}else{return "";}}catch(e){return "";}},setInnerText:function(a,b){try{if(a!=null){if(a.innerText!=undefined){a.innerText=b;}else if(a.textContent!=undefined){a.textContent=b;}else if(a.innerHTML!=undefined){a.innerHTML=b;}else if(a.text!=undefined){a.text=b;}else{var c=a.selectSingleNode("text()");if(c!=null){c.nodeValue=b;}else{return null;}}}return a;}catch(e){return null;}},getOuterHTML:function(a){try{if(a==null){return "";}else if(a.outerHTML){return a.outerHTML;}else{var b=a.tagName.toLowerCase();var c="<"+b;var d=a.attributes;var e="";for(var f=0;f<d.length;f++){e+=" "+d[f].nodeName+"=\""+d[f].nodeValue+"\"";}c+=e;var g="";try{g=contenido("ELEMENT",b);if(g=="EMPTY"){c+=" />";}else{c+=">";}}catch(e){c+=">";}c+=a.innerHTML;if(g!="EMPTY"){c+="</"+b+">";}return c;}}catch(e){return "";}},recogeEvento:function(a){try{var b=a||window.event;var c=new Object;c.event=b;var d=(b.type.indexOf("touch")>-1);var e;if(d){e=b.changedTouches[0];}else{e=b;}c.element=e.srcElement||e.target;c.keyAscii=e.charCode||e.keyCode;if(e.offsetX){c.x=e.offsetX;c.y=e.offsetY;}else if(e.layerX){c.x=e.layerX;c.y=e.layerY;}else if(e.pageX){c.x=e.pageX-c.element.offsetLeft;c.y=e.pageY-c.element.offsetTop;}if(e.pageX!=undefined){c.pagx=e.pageX;c.pagy=e.pageY;}else{var f=wxG.estiloActual(c.element,"position");if(((wxG.estiloActual(c.element,"display")!="block")&&(f=="static"))||(f=="fixed")){c.pagx=e.x;c.pagy=e.y;}else{c.pagx=e.offsetX+c.element.offsetLeft;c.pagy=e.offsetY+c.element.offsetTop;if(c.element.offsetParent){c.pagx+=c.element.offsetParent.offsetLeft;c.pagy+=c.element.offsetParent.offsetTop;}}}return c;}catch(e){return null;}},enciendeEvento:function(a,b,c){try{if((a!=null)&&(b!="")){if(document.createEvent){var d=document.createEvent("HTMLEvents");b=b.substring(2,b.length);d.initEvent(b,false,true);a.dispatchEvent(d);}else if(a.fireEvent){try{window.event.cancelBubble=true;}catch(e){};a.fireEvent(b);}else{}}}catch(e){}},conEventListener:false,agregarEventListener:function(a,b){try{if(wxG.conEventListener||!document.body.addEventListener){wxG.conEventListener=true;if(a){for(var c=0;c<a.length;c++){var d=a[c];if(typeof d=="string"){var d=d.toLowerCase();switch(d){case "p":d="Paragraph";break;case "textarea":d="TextArea";break;default:d=d[0].toUpperCase()+d.substr(1,d.length);}var e="HTML"+d+"Element";if(window[e]){window[e].prototype.addEventListener=function(evento,accion,arg){this["on"+evento]=accion;};}}}}if(b){for(var c=0,f=b.length;c<f;c++){var g=b[c];if(g.length==2){if((g[0]!=null)&&(g[0].nodeType==1)&&(!g[0].addEventListener)){if((g[1]=="outer")||(g[1]=="all")){g[0].addEventListener=function(evento,accion,arg){try{this["on"+evento]=accion;}catch(e){}};}if((g[1]=="inner")||(g[1]=="all")){var h=g[0].getElementsByTagName("*");for(var i=0,j=h.length;i<j;i++){h[i].addEventListener=function(evento,accion,arg){this["on"+evento]=accion;};}}}}}}}}catch(e){}},vendorPrefixesCss:["-webkit-","-moz-","-o-","-xv-","-ms-","-mso-","-khtml-"],vpForCss:{},objetoEstiloActual:function(a){try{if(a!=null){if(document.defaultView.getComputedStyle){return document.defaultView.getComputedStyle(a,null);}else{return null;}}else{return null;}}catch(e){try{return a.currentStyle;}catch(e){}return null;}},propiedadEstiloActual:function(a,b){try{if(a&&(b!="")){var c=b;if(b.indexOf("-")>-1)c=wxG.cambiaGuiones(b);if((d==undefined)||(d==null)){if(b=="float"){b="cssFloat";d=a[b];if(d==null){b="styleFloat";d=a[b];}}else{d=a[b];}if((d==undefined)||(d==null)){return null;}else{return d;}}else{return d;}}else{return null;}}catch(e){return null;}},prefijarCss:function(a){var b=document.createElement("div");b.style.display="none";document.body.appendChild(b);var c=null;if(typeof(a)=="string"){if(a!="")c=[a];}else if(a.length){c=a;}if(c&&(c.length>0)){var d=wxG.objetoEstiloActual(b);for(var e in c){var f=wxG.trim(c[e]);if(f!=""){var g=wxG.descambiaGuiones(f);wxG.vpForCss[f]=wxG.cambiaGuiones(f);if(wxG.propiedadEstiloActual(d,g)==null){wxG.vpForCss[f]=null;for(var h in wxG.vendorPrefixesCss){var i=wxG.vendorPrefixesCss[h]+g;if(wxG.propiedadEstiloActual(d,i)!=null){wxG.vpForCss[f]=wxG.cambiaGuiones(i);break;}}}}}}document.body.removeChild(b);},dotarVpCss:function(){var a=document.body.getElementsByTagName("*");for(var b=0,c=a.length;b<c;b++){if(a[b].getAttribute&&a[b].getAttribute("data-vpforcss")){var d=wxG.trim(a[b].getAttribute("data-vpforcss"));if(d!=""){var e=a[b].getAttribute("style");var f=e.split(";");var g=null;for(var h in f){var i=f[h].split(":");if(i.length==2){var j=wxG.trim(i[0]);var k="";if(j!=""){if(!g)g=new Object;k=wxG.trim(i[1]);g[j]=k;}}}if(g){var l=d.split(",");for(var m in l){var n=wxG.trim(l[m]);if((n!="")&&g[n]&&wxG.vpForCss[n]&&(wxG.vpForCss[n]!=wxG.cambiaGuiones(n))){a[b].style[wxG.vpForCss[n]]=g[n];}}}}}}},estiloActual:function(a,b){try{if(window.getComputedStyle){return document.defaultView.getComputedStyle(a,null).getPropertyValue(b);}else if(a.currentStyle){var c=wxG.cambiaGuiones(b);if(a.currentStyle.getAttribute){return a.currentStyle.getAttribute(c);}else{return a.currentStyle[c];}}else{return "";}}catch(e){return "";}},cambiaGuiones:function(c){return(typeof c==="string")?c.replace(/\-([a-z])/g,function(x,y){return y.toUpperCase()}):c},descambiaGuiones:function(c){return(typeof c==="string")?c.replace(/([a-z])([A-Z])/g,function(x,y,z){return y+"-"+z.toLowerCase()}):c},extraerHojaEstilo:function(a){var b=null;var c=document.styleSheets;for(var d=0,e=c.length;d<e;d++){var f=c[d];for(var g in f){if((g=="ownerNode")&&(f[g].id==a)){b=f;break;}}}return b;},inArray:function(a,v){if(a){for(var d=0;d<a.length;d++){if(a[d]===v)return true}}return false},posArray:function(a,v){if(a){for(var d=0;d<a.length;d++){if(a[d]===v)return d}}return-1},displayNext:function(event,a,preFunc,property){try{var h=event||window.event;var i=h.target||h.srcElement;var j=i,k=false;if(a){j=document.getElementById(a);}else{if(j.hasAttribute("data-masmenos")){k=true;j=j.nextSibling;}j=j.nextSibling;if(j.nodeType!=1)j=j.nextSibling;}if(j){if(preFunc)preFunc(j);property=property||{m:"display",valStart:"none",valEnd:"block"};var l=wxG.estiloActual(j,property.name);if(l===property.valStart){j.style[property.name]=property.valEnd;if(k)i.innerHTML="-";}else{j.style[property.name]=property.valStart;if(k)i.innerHTML="+";}}}catch(e){}},imprimirTrozo:function(e,i,v){wxG.ejecutarUtiles("imprimirTrozo",e,i,v)},MAX_TABS:50,activarTab:function(a){try{var b;if(a.tagName.toLowerCase()=="button"){b=a;a=b.parentNode||b.parentElement;}if(a&&(a.id)){var c=a.id;var d=a.parentNode||a.parentElement;var e=d.parentNode||d.parentElement;var f=e.parentNode||e.parentElement;if(f.getAttribute("data-filas")!=null){var g=e.getElementsByTagName("tr");var h=g[g.length-1];e.insertBefore(d,h);}var i=f.getAttribute("data-min");if(i==null)i=0;var j=f.getAttribute("data-max");if(j==null)j=wxG.MAX_TABS;var k=c.split("tabck-");var l=parseInt(k[1]);var m=document.getElementById("tabdiv-"+l);for(var n=i;n<=j;n++){var o=document.getElementById("tabdiv-"+n);if(o){var p=document.getElementById("tabck-"+n);if(o.id==m.id){o.style.display="block";p.style.color="steelblue";p.style.backgroundColor="rgb(235, 235, 225)";p.style.borderBottomColor="rgb(235, 235, 225)";if(b)p.firstChild.focus();}else{o.style.display="none";p.style.color="white";p.style.backgroundColor="gray";p.style.borderBottomColor="gray";}}}}}catch(e){alert("Error al activar una pestaña. "+e.message);}},modulosConError:{},cargarModulos:function(a,b){if(a){for(var c=0,d=a.length;c<d;c++){var e="",f=null;if(typeof a[c]==="string"){e=a[c];}else{e=a[c][0];f=a[c][1];}e=(e.replace(/\.js$/g,"_js")).replace(/-/g,"_").toUpperCase();b=b||Wextensible;if(b[e]){b[e]();if(f)f();}else{var g=e.replace(/_JS$/,"").replace(/_/g,"-").toLowerCase();if(!wxG.modulosConError.hasOwnProperty(g)){wxG.modulosConError[g]=f;wxG.cargarScripts(["/res/inc/"+g+"-old.js"],0,(function(m){return function(){if(wxG.modulosConError[m]){wxG.cargarModulos([[m+".js",wxG.modulosConError[m]]],b);}else{wxG.cargarModulos([m+".js"],b);}}})(g));}}}}},oScroll:{interval:null,elemento:null,mm:0,hv:0,debug:false},cargarScrollMovil:function(o){wxG.ejecutarUtiles("cargarScrollMovil",o)},iniciarScrollMovil:function(e,h,m){wxG.ejecutarUtiles("iniciarScrollMovil",e,h,m)},pararScrollMovil:function(e){wxG.ejecutarUtiles("pararScrollMovil",e)},focoNumeric:null,cargarTecladoAuxiliar:function(a,e,p){wxG.ejecutarUtiles("cargarTecladoAuxiliar",a,e,p)},symNumeric:function(e,c){wxG.ejecutarUtiles("symNumeric",e,c)},variarTypeNumber:function(e,m){wxG.ejecutarUtiles("variarTypeNumber",e,m)},ajustarAnchoNumber:function(e){wxG.ejecutarUtiles("ajustarAnchoNumber",e)},cargarPasaFotos:function(){wxG.ejecutarUtiles("cargarPasaFotos")},finalizarCargaImg:function(e){wxG.ejecutarUtiles("finalizarCargaImg",e)},errorCargaImg:function(e){wxG.ejecutarUtiles("errorCargaImg",e)},ponerOtraFoto:function(e,i,p){wxG.ejecutarUtiles("ponerOtraFoto",e,i,p)},preBuscar:function(a){var b=(a||window.event).target;var c=b["prebusq"];var d=c.value;if(d==""){window.location="/res/srv/buscador.php";}else{if(d.length>75)d=d.substring(0,75);c.value=d;b.submit();}},imprimirPagina:function(){window.print()},cargarScripts:function(a,b,c){try{b=b||1;window.setTimeout(function(){try{var d=document.getElementsByTagName("head")[0];for(var e=0,f=a.length;e<f;e++){var g=document.createElement("script");if(c){wxG.agregarEventListener(null,[[g,"outer"]]);if(g.readyState=="uninitialized"){g.addEventListener("readystatechange",function(){if(g.readyState=="loaded")c();},false);}else{g.addEventListener("load",c,false);g.addEventListener("error",c,false);}}g.async=true;g.src=a[e];}}catch(e){if(c)c();}},b);}catch(e){if(c)c();}},adjudicarEventos:function(a){for(var b=0,c=a.length;b<c;b++){if(a[b].length&&(a[b].length==6)){var d=a[b][0],e=a[b][1],f=a[b][2],g=a[b][3],h=a[b][4],i=a[b][5];var j=[];if(d=="id"){var k=document.getElementById(e);if(k)j=[k];}else{j=wxG.arrayClassName(e);}if(j.length){for(var l=0,m=j.length;l<m;l++){var n=j[l];if(n){switch(f){case "firstChild":n=n.firstChild;break;case "lastChild":n=n.lastChild;break;case "nextSibling":n=n.nextSibling;break;case "previousSibling":n=n.previousSibling;break;case "parentNode":n=wxG.nodoPadre(n);}wxG.agregarEventListener(null,[[n,"outer"]]);if(i.length>1){n.addEventListener(g,(function(xArgs,fun){return function(event){if(xArgs[0]===null)xArgs[0]=event;fun.apply(null,xArgs);};}).call(null,i,h),false);}else{if(typeof(h)=="string"){n.setAttribute("on"+g,h);}else{n.addEventListener(g,h,false);}}}}}}}},pedirRuta:function(a,b,c){var d;if(window.XMLHttpRequest){d=new XMLHttpRequest();}else{d=new ActiveXObject("Microsoft.XMLHTTP");}if(d){d.open("GET",a,true);d.onreadystatechange=function(){if(d.readyState==4){if(d.status==200){var e=d.responseText;b(e);}else if(c){c(d.status);}}};}},omitir:null,adjudicarEventosGenerales:function(a){wxG.omitir=a;if(!wxG.inArray(a,"config"))wxG.aplicarConfig("");window.setTimeout(function(){var b="?mt="+wxG.version;wxG.pedirRuta("/res/inc/accesos-data/iconos-svg.html"+b,wxG.cargarIconosSvg);wxG.cargarScripts(["/res/inc/accesos-data/links.js"+b],1,wxG.cargarAccesos);wxG.cargarScripts(["/res/inc/accesos-data/anuncios-propios.js"+b],1,wxG.insertarAnunciosPropios);wxG.adjudicarEventos([["id","menuwx-menu","firstChild","click",wxG.displayNext,[null,null,null,{name:"max-height",valStart:"0px",valEnd:"1000px"}]],["id","menuwx-accesos-boton","","click",wxG.abrirAccesos,[null]],["id","pre-buscador","","submit",wxG.preBuscar,[null]],["id","boton-imprimir-pagina","","click",wxG.imprimirPagina,[null]],["class","desplegable","firstChild","click",wxG.displayNext,[null]],["id","boton-lista-apartados","","click",wxG.displayNext,[null,"lista-apartados",wxG.acortarMigas]],["id","config-width","","click",wxG.aplicarConfig,[null]],["id","config-size","","click",wxG.aplicarConfig,[null]]]);if(document.getElementById("mas-listas-index")){wxG.adjudicarEventos([["id","mas-listas-index","","click",wxG.mostrarMasIndex,[null]]]);}var c=document.getElementById("contenido");if(c){wxG.agregarEventListener(null,[[c,"outer"]]);c.addEventListener("click",function(){wxG.ocultarMenu();},false);}if(!wxG.inArray(a,"cssAfter")){if(window.location.href.indexOf("#")>-1){wxG.cargarCssAfter();}else{wxG.removerListener=true;if(document.body.addEventListener){document.body.addEventListener("click",wxG.cargarCssAfter,false);}else if(document.body.attachEvent){document.body.attachEvent("onclick",wxG.cargarCssAfter);}if(window.addEventListener){window.addEventListener("scroll",wxG.cargarCssAfter,false);}else if(window.attachEvent){window.attachEvent("onscroll",wxG.cargarCssAfter);}document.documentElement.scrollTop=0;document.body.scrollTop=0;}}if(window.addEventListener){window.addEventListener("resize",wxG.ocultarAccesos,false);}else if(window.attachEvent){window.attachEvent("onresize",wxG.ocultarAccesos);}if(!wxG.inArray(a,"avisoCookies"))wxG.insertarAvisoCookies();if(!wxG.inArray(a,"comprobarCache"))wxG.comprobarCache();wxG.insertarNavegadorTemas();wxG.insertarBotonSubir();if(!wxG.inArray(a,"comentarios"))wxG.cargarScripts(["/res/inc/comenta.js"]);},1);},ocultarMenu:function(){var a=document.getElementById("menuwx-menu");if(a){var b=a.firstChild;var c=b.nextSibling;if(wxG.estiloActual(c,"height")!=="0px"){wxG.enciendeEvento(b,"onclick");}}},mostrarMasIndex:function(a){var b=a||window.event;var c=b.target||b.srcElement;var d=c.getAttribute("data-lista");var e=parseInt(c.getAttribute("data-num"),10);c.disabled=true;if(e>1){var f=document.createElement("link");f.rel="prefetch";f.as="script";var g="";if(Wextensible.listaIndex.versiones.hasOwnProperty(e-1))g='?mt='+Wextensible.listaIndex.versiones[e-1];f.href='/res/inc/accesos-data/listas-index/'+d+'/lista-'+(e-1)+'.js'+g;document.getElementsByTagName("head")[0].appendChild(f);}if(e>0){var g="";if(Wextensible.listaIndex.versiones.hasOwnProperty(e))g='?mt='+Wextensible.listaIndex.versiones[e];var h='/res/inc/accesos-data/listas-index/'+d+'/lista-'+e+'.js'+g;wxG.cargarScripts([h],0,function(){var i=Wextensible.listaIndex['lista'+e];if(i){var j="";var k=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];for(var l=i.length-1;l>-1;l--){var m=i[l];var n=(m.mes<10)?"0"+m.mes:m.mes;var o=(m.dia<10)?"0"+m.dia:m.dia;j+='<article><header><div class="encab-fecha" data-acceso="'+m.key+'"><div class="encab-datetime">'+'<time datetime="'+m.anyo+'-'+n+'-'+o+'"><span class="encab-dia">'+o+'</span>'+'<span class="encab-mes">'+k[m.mes-1]+'</span><span class="encab-anyo">'+m.anyo+'</span>'+'</time></div>'+'<h1><a href="'+m.href+'">'+m.titulo+'</a></h1>'+'</div></header>';if(m.src){j+='<img src="'+m.src+'" width="'+m.width+'" height="'+m.height+'" '+m.props+' />';}j+=m.texto+'</article>';}var p=document.createElement("div");p.id='lista-index-'+e;p.innerHTML=j;document.getElementById("listas-index").appendChild(p);var c=document.getElementById("mas-listas-index");if(c){if(e>1){c.setAttribute("data-num",e-1);c.disabled=false;}else{var p=document.createElement("div");p.innerHTML="No hay más entradas";p.id='mas-listas-fin';c.parentElement.insertBefore(p,c);c.style.display="none";}}}});}},cargarIconosSvg:function(a){var b=document.createElement("aside");b.id="source-icons-svg";b.innerHTML=a;document.body.appendChild(b);wxG.enciendeEvento(wxG.targetEvent,"onchange");var c={"submenu-html5":["svgicon-code",'fill="currentcolor"'],"submenu-css3":["svgicon-css",'fill="currentcolor" stroke="currentcolor"'],"submenu-javascript":["svgicon-js",'fill="currentcolor" stroke="currentcolor"'],"submenu-php":["svgicon-php",'stroke="rgb(49,99,98)"'],"submenu-server":["svgicon-server",'fill="currentcolor"'],"submenu-layout":["svgicon-view-quilt",'fill="currentcolor"'],"submenu-componentes":["svgicon-extension",'fill="currentcolor"'],"submenu-tools":["svgicon-build",'fill="currentcolor"'],"submenu-pagespeed":["svgicon-avtimer",'fill="currentcolor"'],"submenu-varios":["svgicon-varios",'fill="currentcolor"'],"submenu-xhtmlcss":["svgicon-description",'fill="currentcolor"'],"menu-temas":["svgicon-books",'fill="currentcolor"'],"menu-como-se-hace":["svgicon-help",'fill="currentcolor"'],"menu-herramientas":["svgicon-build",'fill="currentcolor"'],"menu-articulos":["svgicon-books2",'fill="currentcolor"'],"menu-buscar":["svgicon-search",'fill="currentcolor"',true],"menu-codigo":["svgicon-code",'fill="currentcolor"'],"menu-historico":["svgicon-date",'fill="currentcolor"'],"menu-acerca-de":["svgicon-person",'fill="currentcolor"'],"menu-contacto":["svgicon-email",'fill="currentcolor"'],"menu-aviso-legal":["svgicon-info",'fill="currentcolor"'],"menu-imprimir":["svgicon-print",'fill="currentcolor"',true],"menu-google":["svgicon-googleplusmas",'fill="currentcolor"',true],"menu-twitter":["svgicon-twitter",'fill="currentcolor"',true],"menu-facebook":["svgicon-facebook",'fill="currentcolor"',true],"span-config-width":[["svgicon-anchomin",'fill="currentcolor"',true],["svgicon-anchomax",'fill="currentcolor"',true]],"span-config-size":[["svgicon-sizetextmas",'fill="currentcolor"',true],["svgicon-sizetextmenos",'fill="currentcolor"',true]]};wxG.llenarIconosSvg(c);c={"help-comosehace":["svgicon-help",'fill="currentcolor"',true]};wxG.llenarIconosSvg(c,true);},llenarIconosSvg:function(a,b){for(var c in a){if(a.hasOwnProperty(c)){var d=[];if(b){d=wxG.arrayClassName(c);}else{d.push(document.getElementById(c));}var e=(typeof a[c][0]==="string")?[a[c]]:a[c];for(var f=0;f<d.length;f++){var g=d[f];if(g){for(var h=0;h<e.length;h++){var i=document.createElement("span");if(!g.hasAttribute("data-id")){var j='conten-'+e[h][0];if(!document.getElementById(j))i.id=j;}else{var k=g.getAttribute("data-id");if(k)i.id=k;}i.innerHTML='<svg class="svg-icon" '+e[h][1]+'><use href="#'+e[h][0]+'"></use></svg>';g.parentElement.insertBefore(i,g);if(e[h][2]&&g.previousSibling.lastChild){g.style.display="none";}}}}}}},insertarAnunciosPropios:function(){if(wxG.anunciosPropios){for(var a in wxG.anunciosPropios){if(wxG.anunciosPropios.hasOwnProperty(a)){if(!wxG.omitir||!wxG.inArray(wxG.omitir,wxG.anunciosPropios[a].filtrarOmitir)){var b=document.getElementById(wxG.anunciosPropios[a].id);if(b){if(wxG.anunciosPropios[a].style){var c=document.createElement("style");c.id="estilo-anuncio-propio-"+a;wxG.setInnerText(c,wxG.anunciosPropios[a].style);document.getElementsByTagName("head")[0].appendChild(c);if(wxG.getInnerText(c)===""){}}var d=document.createElement("div");d.innerHTML=wxG.anunciosPropios[a].html;if(wxG.anunciosPropios[a].insercion==="before"){b.parentElement.insertBefore(d,b);}else if(wxG.anunciosPropios[a].insercion==="appendChild"){b.appendChild(d);}if(wxG.anunciosPropios[a].ejecutar){wxG.anunciosPropios[a].ejecutar();}}}}}}},accesos:null,estadoAccesos:0,abrirAccesos:function(){var a=document.getElementById("lateral-a");if(wxG.estiloActual(a,"display")=="none"){a.style.display="block";}else{wxG.ocultarAccesos();}},cargarAccesos:function(){if(wxG.estadoAccesos==0){var a=document.getElementById("accesos");if(wxG.accesos){try{for(var b in wxG.accesos){if(wxG.accesos.hasOwnProperty(b)){var c=document.getElementById("submenu-"+b);if(c){var d=c.parentElement;if(d){wxG.agregarEventListener(null,[[d,"outer"]]);d.addEventListener("click",wxG.abrirSubmenu);var e="";var f=wxG.accesos[b].links;for(var g=0;g<f.length;g++){e+='<li><a href="'+f[g][1]+'">'+f[g][0]+'</a></li>\n';}var h=document.createElement("ul");h.className="lista-submenu";h.innerHTML=e;d.parentElement.appendChild(h);}}}}wxG.estadoAccesos=1;var i=document.getElementById("enlace-tema-nuevo");if(i&&i.textContent===""&&wxG.nuevoTema){i.textContent=wxG.nuevoTema[0];i.href=wxG.nuevoTema[1];}}catch(e){wxG.accesos=null;}}if(!wxG.accesos)wxG.estadoAccesos=-1;}},abrirSubmenu:function(a){var b=a||window.event;var c=b.target||b.srcElement;while(c&&((c.tagName.toLowerCase())!=="li")){c=c.parentNode;}c=c.lastChild;if(c.tagName.toLowerCase()==="ul"){if(c.style.display==="block"){c.style.display="none";}else{var d=wxG.arrayClassName("lista-submenu");for(var e=0;e<d.length;e++){d[e].style.display="none";}c.style.display="block";}}},insertarBotonSubir:function(){try{var a=document.getElementById("scroll-subir");if(a){wxG.agregarEventListener(null,[[a,"outer"]]);a.addEventListener("click",function(){document.documentElement.scrollTop=0;document.body.scrollTop=0;});wxG.agregarEventListener(null,[[window,"outer"]]);window.addEventListener("scroll",function(){document.getElementById("scroll-subir").style.display=((document.body.scrollTop+document.documentElement.scrollTop)/document.body.scrollHeight>0.03)?"block":"none";});}}catch(e){}},insertarNavegadorTemas:function(){var a=document.getElementById("lista-apartados");if(a){var b=a.getElementsByTagName("ul");if(b.length){var c=b[0].childNodes,d,e,º;for(var f=0;f<c.length;f++){if(c[f].nodeType==1){var g=c[f].getElementsByTagName("span");if(g.length>0){d=temp.getElementsByTagName("a")[0];}else if(d){e=c[f].getElementsByTagName("a")[0];break;}else{temp=c[f];}}}if(d||e){var h=document.getElementById("contenido");if(h){var i=h.getElementsByTagName("article");if(i.length>0){var j=i[0].getElementsByTagName("header")[0];if(j){var k=j.nextSibling;if(k){for(var f=0;f<2;f++){var l=document.createElement("div");l.className="navega-temas";var m='<div class="navega-temas'+f+'"><div><div';if(d){m+=' class="navega-temas-left"><a href="'+d.href+'">'+d.innerText+'</a>';}else{m+='>';}m+='</div><div';if(e){m+=' class="navega-temas-right"><a href="'+e.href+'">'+e.innerText+'</a>';}else{m+='>';}l.innerHTML=m+'</div></div></div>';var n=document.createDocumentFragment();n.appendChild(l);if(f==0){i[0].insertBefore(n,k);}else{i[0].appendChild(n);}}}}}}}}}},insertarAvisoCookies:function(){document.cookie="testck=; path=/;";var a=(document.cookie.indexOf("testck")>-1);document.cookie="testck=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";var b="";var c=false;var d=false;if(a){d=(document.location.pathname.indexOf("/res/srv/creditos/aviso-legal")==0);c=(document.cookie.indexOf("acepta-cookies")>-1);if(c&&!d){var e=[1,1,2001,0,0,0];var f=/\d{2}\-\d{2}\-\d{4}\-\d{2}\-\d{2}\-\d{2}/;var g=document.cookie.replace(/(?:(?:^|.*;\s*)acepta\-cookies\s*\=\s*([^;]*).*$)|^.*$/,"$1");if(f.test(g))e=g.split("-");var h=new Date(e[2],e[1]-1,e[0],e[3],e[4],e[5],0);var i=new Date();if(h<i){document.cookie="acepta-cookies=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";c=false;}}if(!c||d){b='';if(!d){b+='';}else{b+="Navegar en esta página no supone aceptar cookies.";}}else if(c&&d){document.cookie="acepta-cookies=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";c=false;}}if(!c){var j=document.getElementById("contenido");var k=document.createElement("div");k.id="aviso-cookies";if(!a)k.style.color="red";k.innerHTML=b;j.insertBefore(k,j.firstChild);if(a&&!d){if(document.body.addEventListener){document.body.addEventListener("click",wxG.aceptarCookies,false);}else if(document.body.attachEvent){document.body.attachEvent("onclick",wxG.aceptarCookies);}if(window.addEventListener){window.addEventListener("scroll",wxG.aceptarCookies,false);}else if(window.attachEvent){window.attachEvent("onscroll",wxG.aceptarCookies);}}}},aceptarCookies:function(a){var b=a||window.event;var c=b.target||b.srcElement;if(!(c.id&&(c.id=="informa-cookies"))){var d=new Date();var e=wxG.formatoFecha(d,"-","00","00","0000","-","00","00","00","-");d.setTime(d.getTime()+(365*24*60*60*1000));document.cookie="acepta-cookies="+e+"; path=/; expires="+d.toUTCString();document.getElementById("aviso-cookies").style.display="none";if(document.body.removeEventListener){document.body.removeEventListener("click",wxG.aceptarCookies,false);window.removeEventListener("scroll",wxG.aceptarCookies,false);}else if(document.body.detachEvent){document.body.detachEvent("onclick",wxG.aceptarCookies);window.detachEvent("onscroll",wxG.aceptarCookies);}}},hayNuevaVersion:false,comprobarCache:function(){var a=0;var b={0:"NAVIGATENEXT",1:"RELOAD",2:"BACK_FORWARD",255:"UNDEFINED"};var c="?";try{var d=window.performance.timing;a=d.responseEnd-d.fetchStart;c=b[window.performance.navigation.type];}catch(e){}var e=[1,1,2001,0,0,0];if(typeof wxZ!=="undefined")e=wxZ.f.split("-");var f=new Date(e[2],e[1]-1,e[0],e[3],e[4],e[5],0);var g=wxG.formatoFecha(f," ","00","aaa","0000",":","00","00","00"," ");var h=document.getElementById("contenido");if(a<100){wxG.pedirRuta("/res/srv/cache-date.php?u="+window.location.pathname,function(text){if(text!=""){e=text.split("-");if(e.length==6){var i=new Date(e[2],e[1]-1,e[0],e[3],e[4],e[5],0);wxG.hayNuevaVersion=(i>f);if(wxG.hayNuevaVersion){var j=document.createElement("div");j.className="mensaje-cache";j.style.cssText='text-align:right; '+'margin: 0.2em auto; '+'font-family: Arial, Helvetica, sans-serif; '+'color: maroon; '+'font-weight: bold; '+'max-width: '+h.style.maxWidth+';"';j.innerHTML="Hay una nueva versión de esta página o de sus recursos: "+'<button type="button" class="btntxt" '+'style="color: yellow; '+'font-weight: bold; '+'background-color: maroon; '+'padding: 0.2em 0.4em; '+'border: rgb(49, 99, 98); '+'border-radius: 0.35em; " '+'onclick="window.location.reload(true)" '+'>Actualizar</button>';h.insertBefore(j,h.firstChild);}}}});}var k=document.getElementById("trace-speed");if(k){var l="?";if(a>0)l=a;k.innerHTML='Versión: '+g+'; '+'Tiempo respuesta: '+l+' ms; '+'Tipo navegación: '+c;}},aplicarConfig:function(a){var b={},tipo=typeof a,invertir=false;if(typeof a==="string"){var c=["width","size"];for(var d=0;d<c.length;d++){b[c[d]]=wxG.getConfig(c[d]);}}else{var a=a||window.event;var e=a.target||a.srcElement;while(e&&e.tagName.toLowerCase()!=="button"){e=e.parentElement;}if(e){var f=e.id.split("-")[1];b[f]=wxG.getConfig(f);invertir=true;}}for(var f in b){if(b.hasOwnProperty(f)){var g=(b[f]===null)?0:parseInt(b[f],10);if(!isNaN(g)){if(invertir)g=1-g;var h=false,i=false,j="",k=[];switch(f){case "size":{var l=document.getElementById("contenido");var m=(wxG.estiloActual(l,"font-size")==="16px")?0:1;if(g!==m){var n=16,o=20;l.style.fontSize=((g)?o:n)+"px";l.style.marginTop=(7.5*((g)?n/o:1))+"em";if(g){j='#conten-svgicon-sizetextmas{display:none}#conten-svgicon-sizetextmenos{display:inline}';}else{j='#conten-svgicon-sizetextmenos{display:none}#conten-svgicon-sizetextmas{display:inline}';}k=["Reducir","Aumentar"," tamaño letra"];h=true;}break;}case "width":{var p=document.getElementById("contenido-central");var m=(wxG.estiloActual(p,"max-width")==="none")?1:0;if(g!==m){if(g){j='#contenido-central, #cabeza-menu{max-width:none}@media screen and (min-width:5em){#lateral-a{position:absolute;top:6.4em;'+'left:0.5em;display:none;border:gray solid 1px;box-shadow:0.8em 0.8em 0.5em 0.1em silver}#menuwx-accesos-vinculo{display:none}#menuwx-accesos-boton{'+'display:inline}}@media screen and (min-width:68em){#lateral-b{position:static}}@media screen and (min-width:79em){#lateral-c{position:static}}'+'#conten-svgicon-anchomax{display:none}#conten-svgicon-anchomin{display:inline}';}else{j='#contenido-central,#cabeza-menu{max-width:45em}#cabeza-menu{left:0;max-width:46em}@media screen and (min-width:57em){#lateral-a{'+'left:46em;top:0;display:block;border:none;box-shadow:none}#menuwx-accesos-vinculo{display:inline}#menuwx-accesos-boton{display:none}}'+'@media screen and (min-width:68em){#lateral-b{position:absolute}}@media screen and (min-width:79em){#lateral-c{position:absolute}}'+'#conten-svgicon-anchomin{display:none}#conten-svgicon-anchomax{display:inline}';}k=["Minimizar","Maximizar"," ancho"];h=true;i=true;}break;}}if(h){wxG.setConfig(f,g);var q=document.getElementById("estilo-config-"+f);if(!q){q=document.createElement("style");q.id="estilo-config-"+f;document.getElementsByTagName("head")[0].appendChild(q);}q.textContent=j;if(i)window.setTimeout(function(){wxG.enciendeEvento(window,"onresize")});}}}}},leerCookies:function(){var a=null;var b=document.cookie.split(";");for(var c=0;c<b.length;c++){if(a===null)a={};var d=b[c].split("=");if(d.length===2){a[wxG.trim(d[0])]=wxG.trim(d[1]);}}return a;},leerConfig:function(){var a=null;var b=wxG.leerCookies();for(var c in b){if(b.hasOwnProperty(c)&&c==="config"){var d=b["config"].split("~");if(d.length>0){a={};for(var e=0;e<d.length;e++){var f=wxG.trim(d[e]).split("_");if(f.length===2){a[wxG.trim(f[0])]=wxG.trim(f[1]);}}}break;}}return a;},setConfig:function(a,b){var c=wxG.leerConfig();if(c){b=b.toString().replace(/[_~]+/g,"");c[a]=b;var d="";for(var e in c){if(c.hasOwnProperty(e)){if(d!=="")d+="~";d+=e+"_"+c[e];}}if(d!=="")document.cookie='config='+d+';path=/';}else{document.cookie='config='+a+':'+b+';path=/';}},getConfig:function(a){var b=wxG.leerConfig();if(b&&b.hasOwnProperty(a)){return b[a];}return null;},removerListener:false,cssAfterCargado:false,cargarCssAfter:function(){var a=document.getElementById("nojs");if(a&&!wxG.cssAfterCargado){var b=wxG.getInnerText(a);if(b==""){var c=document.createElement("link");c.rel="stylesheet";c.href="/res/sty/base.css";document.getElementsByTagName("head")[0].appendChild(c);}else{try{document.getElementsByTagName("head")[0].innerHTML+=b;}catch(e){var d=document.createElement("style");d.id="css-after";wxG.setInnerText(d,b);document.getElementsByTagName("head")[0].appendChild(d);}}if(wxG.removerListener){if(document.body.removeEventListener){document.body.removeEventListener("click",wxG.cargarCssAfter,false);window.removeEventListener("scroll",wxG.cargarCssAfter,false);}else if(document.body.detachEvent){document.body.detachEvent("onclick",wxG.cargarCssAfter);window.detachEvent("onscroll",wxG.cargarCssAfter);}}wxG.cssAfterCargado=true;}},migasAcortadas:false,acortarMigas:function(a){if(!wxG.migasAcortadas){var b=a.getElementsByTagName("ul")[0];var c=b.childNodes;for(var d=0,e=c.length;d<e;d++){var f=c[d].lastChild;var g=wxG.getInnerText(f);g=wxG.quitaEspacios(g);if(g.length>30){c[d].title=g;g=g.substr(0,27)+"...";wxG.setInnerText(f,g);}}wxG.migasAcortadas=true;}},subirItem:function(e){wxG.ejecutarUtiles("subirItem",e)},barArrow:null,actualizarArrow:function(a,b,c){wxG.barArrow=document.getElementById(a);if(wxG.barArrow&&wxG.barArrow.className&&(wxG.barArrow.className=="bar-arrow")){var d=wxG.arrayClassName("arrow-items",wxG.barArrow);if(d&&d.length&&(d.length==1)){d[0].innerHTML=b;d=wxG.arrayClassName("arrow-cursor",wxG.barArrow);if(d&&d.length&&(d.length==1)){d[0].innerHTML=c;var f=wxG.barArrow.getElementsByTagName("button");f[0].disabled=(c<2);f[1].disabled=(c<2);f[2].disabled=(c==b);f[3].disabled=(c==b);}}}},moverArrow:function(a){var b=a||window.event;var c=b.target||b.srcElement;var d=c;var e=0,f,g=0,h=0;while(d.tagName.toLowerCase()!="button"){d=wxG.nodoPadre(d);}if(d.className&&(d.className=="boton-arrow")){wxG.barArrow=wxG.nodoPadre(d);if(wxG.barArrow&&wxG.barArrow.className&&(wxG.barArrow.className=="bar-arrow")){var i=wxG.arrayClassName("arrow-items",wxG.barArrow);if(i&&i.length&&(i.length==1)){e=parseInt(wxG.getInnerText(i[0]));i=wxG.arrayClassName("arrow-cursor",wxG.barArrow);if(i&&i.length&&(i.length==1)){cursor=i[0];g=parseInt(wxG.getInnerText(cursor));var k=d.getAttribute("data-mov");if(k=="start"){h=1;}else if(k=="end"){h=e;}else if(k=="next"){h=g+1;}else{h=g-1;}if(h<1)h=1;if(h>e)h=e;cursor.innerHTML=h;var l=wxG.barArrow.getElementsByTagName("button");l[0].disabled=(h<2);l[1].disabled=(h<2);l[2].disabled=(h==e);l[3].disabled=(h==e);}}}}return h;}};