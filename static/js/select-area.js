/* select-area.js
 * SELECTOR DE ÁREAS Y POLÍGONOS
 * Un objeto JavaScript para construir u selector de áreas y polígonos.
 * Copyright (c) 2012 Andrés de la Paz
 * Modificado en DIC 2018
 * www.wextensible.com
 * Ver detalles de cómo se usa en
 * www.wextensible.com/como-se-hace/selector-area/
 */

"use strict";

//forzar ES6 (existe select-area-old.js sin modificaciones para el no soporte)
((...args)=>true);

//Asignación inicial a un objeto literal vacío o a si mismo
//si ya fue creado previamente.
var Wextensible = Wextensible || {};
//Envolvemos en el espacio de nombres
Wextensible.SELECT_AREA_JS = function(){



//El constructor es una propiedad del Wextensible
Wextensible.SelectArea = (function(){   
//Un acortador para el módulo general. Si se referencia
//en este módulo quedará en el closure
var wxG = Wextensible.general;

var puntoeli=""
var pnum = ""

const namePlus = {
    M: {x:"x", y:"y", plus00:"", plus01:"", plus10:"", plus11:"", plus20:"", lados:""},
    m: {x:"dx", y:"dy", plus00:"", plus01:"", plus10:"", plus11:"", plus20:"", lados:""},
    L: {x:"x", y:"y", plus00:"", plus01:"", plus10:"", plus11:"", plus20:"", lados:""},
    l: {x:"dx", y:"dy", plus00:"", plus01:"", plus10:"", plus11:"", plus20:"", lados:""},
    C: {x:"x", y:"y", plus00:"x1", plus01:"y1", plus10:"x2", plus11:"y2", plus20:"", lados:"n"},
    c: {x:"dx", y:"dy", plus00:"dx1", plus01:"dy1", plus10:"dx2", plus11:"dy2", plus20:"", lados:"n"},
    S: {x:"x", y:"y", plus00:"x2", plus01:"y2", plus10:"", plus11:"", plus20:"", lados:"n"},
    s: {x:"dx", y:"dy", plus00:"dx2", plus01:"dy2", plus10:"", plus11:"", plus20:"", lados:"n"},
    Q: {x:"x", y:"y", plus00:"x1", plus01:"y1", plus10:"", plus11:"", plus20:"", lados:"n"},
    q: {x:"dx", y:"dy", plus00:"dx1", plus01:"dy1", plus10:"", plus11:"", plus20:"", lados:"n"},
    T: {x:"x", y:"y", plus00:"", plus01:"", plus10:"", plus11:"", plus20:"", lados:"n"},
    t: {x:"dx", y:"dy", plus00:"", plus01:"", plus10:"", plus11:"", plus20:"", lados:"n"},
    A: {x:"x", y:"y", plus00:"rx", plus01:"ry", plus10:"α", plus11:"f1", plus20:"f2", lados:""},
    a: {x:"dx", y:"dy", plus00:"rx", plus01:"ry", plus10:"α", plus11:"f1", plus20:"f2", lados:""}
};


function _msg(e, metodo){
    //Si no queremos mensajes de alerta, comentar esta línea
    alert(`Error en selector: ${metodo}(): ${e.message}`);
}

//El constructor
var tempConstructor = function(nombreInstancia="", contenedor="", controles=null, controlesArea=true){

    //El nombre de instancia es imprescindible y debe coincidir con el
    //nombre de la variable. Se trata del ID de un elemento de bloque
    //donde se va a construir el objeto.
    this.nombre = nombreInstancia;
    this.contenedor = null;
    if (document.getElementById(contenedor)) {
        this.idContenedor = contenedor;
        this.contenedor = document.getElementById(contenedor);
        if (this.contenedor.style.zIndex=="") {
            //El contenedor ha de tener un z-index pues más abajo hacemos un parseInt y lo sumamos
            //con el zIndexBase que es un entero
            this.contenedor.style.zIndex = 0;
        }
    } else {
        alert("No se encontró el elemento '" + contenedor + "'");
        return null;
    }

    //Medidas que se usan en dimensionarPoligono() y que pueden ser modificadas desde fuera para 
    //ajustar diametro y centro del polígono a un ancho y alto distinto de this.contenedor
    this.contenWidth = this.contenedor.offsetWidth;
    this.contenHeight = this.contenedor.offsetHeight;

    //Variables de proceso
    this.tipoSeleccion = "poligono";
    this.moverPuntosActivado = false;
    this.moverSitioSelector = true;
    this.listaPuntos = [];
    this.nuevoPunto = false;
    this.move = 0;
    this.moverCamino = false;
    this.x = 0;
    this.y = 0;
    this.num = -1;
    this.numCtrl = -1;

    this.saveBak = true;
    this.bak = [];
    this.cursorBak = 0;
    this.maxBak = 25;
    //Para ejecutar algo en el exterior en las acciones deshacer o rehacer
    this.ejecutarBak = null;

    this.colorNumeroPunto = "white";
    this.offsetReflejo = 1;

    this.keysConfig = ["medidaPunto", "resolucionDibujo", "conNumero", "colorNumeroPunto", 
    "colorBordeSelector", "colorFondoSelector", "colorPuntoSeleccionado", "colorFinalCamino", 
    "digitos", "maxBak", "offsetReflejo"];

    //El zoom sólo sirve para presentar los valores en el cuadro de controles ajustados al zoom. Aquí
    //inicialmente ha de tener el valor 1. Pero en ejecución este valor puede cambiar, por lo que cuando
    //actualice desde, p.e., selector.offsetLeft al cuadro de texto o al revés, debe tener en cuenta este
    //valor que SERÁ MODIFICADO desde el exterior. Valores en tanto por uno.
    this.zoom = 1;
    this.whcell = 1;
    this.x0 = 0;
    this.y0 = 0;

    //Incorporado en Jul-Ago 2018: 
    //Activa cambiar tamaño ambas, ancho, alto
    this.medidasActivadas = "ambas";
    //Si el valor anterior es ancho o alto, lo siguiente ajustará la medida desactivada al valor proporcional
    this.ajustarOtraMedida = false;
    //Con esto aseguramos unos mínimos en el ancho y alto del selector
    this.minWidth = 0;
    this.minHeight = 0;

    this.colorPuntoControl = "black";
    this.conPuntosControl = true,

    this.digitos = 2;

    //Medidas y estilos. Si soporta touch (aunque soporte también mouse) es preferible poner
    //alargador grande. Chrome 32 da true al test createEvent("MouseEvents") y también a
    //createEvent("TouchEvent") aunque el dispositivo no lo soporte (ordenador desktop sin
    //eventos de toque)
    if (wxG.touch) {
        this.medidaAlargador = 32;
    } else {
        this.medidaAlargador = 16;
    }

    this.medidaPunto = 16;
    this.dibujando = false;
    this.resolucionDibujo = 1;

    this.imagenSelector = "url(https://www.wextensible.com/res/img/alargador" + this.medidaAlargador + ".png)";
    this.anchoBordeSelector = 1;
    this.colorBordeSelector = "maroon";
    this.colorFondoSelector = "rgba(255,255,0,0.5)";
    this.colorPuntoSeleccionado = "magenta";
    this.colorFinalCamino = "blue";

    this.conNumero = true;

    //En el método seleccionarArea() hay un preventDefault() para impedir en los móviles
    //los toques por defecto. Pero si se usa menu-context.js con el evento menucontext
    //entonces esto también lo previene. En ese caso en la aplicación que use select-area.js
    //con menu-context.js hay que poner esta propiedad a false y buscar allí otra forma
    //de prevenir los comportamientos por defecto de los toques.
    this.usarPreventDefault = true;

    //Ejecuta algo cuando finaliza el movimiento del ratón (mouseup)
    this.ejecutarEventoMov = function(){};

    //Ejecuta algo cuando cambiamos el tipo de selección
    this.ejecutarEventoTipoSeleccion = function(){}; 

    //Esto es para IE8 que no soporta SVG
    this.soportaSvg = true;

    //Las capas van por encima del contenido. Si el selector se usa con otros componentes
    //como conector.js, allí también hay un z-index que debería ir por debajo de este.
    this.zIndexBase = 100000;

    //Capa para crear líneas con SVG
    this.capaSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.capaSvg.setAttribute("class", "select-area-capa-svg");
    this.capaSvg.style.display = "none";
    this.capaSvg.style.position = "absolute";
    this.capaSvg.style.width = "100%";
    this.capaSvg.style.height = "100%";
    this.capaSvg.style.top = 0;
    this.capaSvg.style.left = 0;
    this.capaSvg.style.backgroundColor = "transparent";
    //Empieza en 1 para dejar un hueco por si queremos poner otras cosas más abajo
    this.capaSvg.style.zIndex = parseInt(this.contenedor.style.zIndex) + this.zIndexBase + 1;
    this.capaSvg.setAttribute("unselectable", "on");
    this.contenedor.appendChild(this.capaSvg);

    //Capa para puntos de polígono
    this.capaPuntos = document.createElement("div");
    this.capaPuntos.setAttribute("class", "select-area-capa-puntos");
    this.capaPuntos.style.display = "none";
    this.capaPuntos.style.position = "absolute";
    this.capaPuntos.style.width = "100%";
    this.capaPuntos.style.height = "100%";
    this.capaPuntos.style.top = 0;
    this.capaPuntos.style.left = 0;
    this.capaPuntos.style.backgroundColor = "transparent";
    this.capaPuntos.style.zIndex = parseInt(this.contenedor.style.zIndex) + this.zIndexBase + 2;
    this.capaPuntos.style.userSelect = "none";
    this.capaPuntos.setAttribute("unselectable", "on");
    this.contenedor.appendChild(this.capaPuntos);

    //Cuadro selector para seleccionar área
    this.selector = document.createElement("div");
    this.selector.setAttribute("class", "select-area-selector");
    this.selector.style.display = "none";
    this.selector.style.position = "absolute";
    this.selector.style.width = this.medidaAlargador + "px";
    this.selector.style.height = this.medidaAlargador + "px";
    this.selector.style.top = 0;
    this.selector.style.left = 0;
    this.selector.style.outlineColor = this.colorBordeSelector;
    this.selector.style.outlineStyle = "dashed";
    this.selector.style.outlineWidth = this.anchoBordeSelector + "px";
    this.selector.style.backgroundColor = this.colorFondoSelector;
    this.selector.style.backgroundImage = this.imagenSelector;
    this.selector.style.backgroundRepeat = "no-repeat";
    this.selector.style.backgroundPosition = "100% 100%";
    this.selector.style.zIndex = parseInt(this.contenedor.style.zIndex) + this.zIndexBase + 3;
    this.selector.setAttribute("unselectable", "on");
    this.contenedor.appendChild(this.selector);

    //Capa superior para captar x,y del ratón
    this.capaSelector = document.createElement("div");
    this.capaSelector.setAttribute("class", "select-area-capa-selector");
    this.capaSelector.style.display = "none";
    this.capaSelector.style.position = "absolute";
    this.capaSelector.style.width = "100%";
    this.capaSelector.style.height = "100%";
    this.capaSelector.style.top = 0;
    this.capaSelector.style.left = 0;
    this.capaSelector.style.backgroundColor = "rgba(0,0,0,0.01)";
    this.capaSelector.style.zIndex = parseInt(this.contenedor.style.zIndex) + this.zIndexBase + 4;

    if (wxG.touch){
        this.capaSelector.setAttribute("ontouchstart",  this.nombre + ".seleccionarArea(event)");
        this.capaSelector.setAttribute("ontouchmove", this.nombre + ".seleccionarArea(event)");
        this.capaSelector.setAttribute("ontouchend", this.nombre + ".seleccionarArea(event)");
    }
    if (wxG.mouse) {
        this.capaSelector.setAttribute("onmousedown",  this.nombre + ".seleccionarArea(event)");
        this.capaSelector.setAttribute("onmousemove", this.nombre + ".seleccionarArea(event)");
        this.capaSelector.setAttribute("onmouseup", this.nombre + ".seleccionarArea(event)");
        this.capaSelector.setAttribute("onmouseout", this.nombre + ".seleccionarArea(event)");
        this.capaSelector.setAttribute("onmouseenter", this.nombre + ".seleccionarArea(event)");
    }
    this.capaSelector.setAttribute("ondblclick", this.nombre + ".seleccionarArea(event)");
    this.capaSelector.setAttribute("unselectable", "on");
    this.capaSelector.style[wxG.vpForCss["user-select"]] = "none";
    this.contenedor.appendChild(this.capaSelector);

    this.controlesArea = controlesArea;
    this.controles = this.crearControles(controles);
    this.aplicarCss();

    this.activarSelector(true);
};// cierra el constructor




//INCORPORAMOS LOS MÉTODOS AL PROTOTIPO


tempConstructor.prototype.crearControles = function(idElemento){
    let creadoControles = false;
    try {
        let elemento = document.getElementById(idElemento);
        if (elemento) {
            let css = document.getElementById(`${this.nombre}-css-controles`);
            if (!css){
                css = document.createElement("style");
                css.id = `${this.nombre}-css-controles`;
                document.head.appendChild(css);
            }
            let cad = `
            
            `;
            css.textContent = cad;
            let styLegend = "", styArea = "", styPoligono = "", styBoton = "";
            let checkedArea =  "checked", checkedPoligono = "";
            if (!this.controlesArea){
                styLegend = `style="display:none"`;
                checkedArea = "";
                checkedPoligono = "checked";
                styArea = `style="display:none"`;
                styBoton = `style="display:none"`;
            }
            let html = [
            `<fieldset id="${this.nombre}-caja-sel" unselectable="on">`,
                `<legend id="${this.nombre}-leyenda-sel-area-puntos" unselectable="on" ${styLegend}>`,
                    /*`<label>Área <input type="radio" name="${this.nombre}-tipo-seleccion" id="${this.nombre}-tipo-seleccion-area" value="area" ${checkedArea} onclick="${this.nombre}.cambiarTipoSeleccion(&quot;area&quot;)" /></label>`+*/
                    `<label>Polígono <input type="radio" name="${this.nombre}-tipo-seleccion" id="${this.nombre}-tipo-seleccion-poligono" value="poligono" ${checkedPoligono} onclick="${this.nombre}.cambiarTipoSeleccion(&quot;poligono&quot;)" /></label>`,
                `</legend>`,
                `<div id="${this.nombre}-sel-area" unselectable="on" ${styArea}>`,
                    `<label class="${this.nombre}-keyboard">Centro X <input type="number" id="${this.nombre}-left" min="0" max="9999" size="3" onchange="${this.nombre}.seleccionarDesdeControlesevent)" value="0" /></label>`,
                    `<label class="${this.nombre}-keyboard">Centro Y <input type="number" id="${this.nombre}-top" min="0" max="9999" size="3" onchange="${this.nombre}.seleccionarDesdeControlesevent)"  value="0" /></label>`,
                    `<label class="${this.nombre}-keyboard">Ancho <input type="number" id="${this.nombre}-width" min="0" max="9999" size="3" onchange="${this.nombre}.seleccionarDesdeControlesevent)"  value="0" /></label>`,
                    `<label class="${this.nombre}-keyboard">Alto <input type="number" id="${this.nombre}-height" min="0" max="9999" size="3" onchange="${this.nombre}.seleccionarDesdeControlesevent)"  value="0" /></label>`,
                    `<div id="${this.nombre}-botones-seleccion">`,
                        `<button type="button" onclick="${this.nombre}.seleccionarDesdeControles(event)">Seleccionar todo</button>`,
                        `<button type="button" onclick="${this.nombre}.borrarSeleccion()">BorrarSelección</button>`,
                    `</div>`,
                `</div>`,
                `<div id="${this.nombre}-sel-puntos" unselectable="on" ${styPoligono}>`,
                    `<button type="button" onclick="${this.nombre}.borrarPuntos()" class="btn btn-danger pull-right">Borrar</button>`,
                    `<button type="button" onclick="${this.nombre}.construirPoligono(null)" class="btn btn-primary pull-right">Construir</button>`,
                    `<label class="form-check form-check-label btn btn-primary pull-right">Mover
                            <input class="form-check-input" type="checkbox" value="1" id="${this.nombre}-mover-puntos" onclick="${this.nombre}.activarMoverPuntos(this.checked)" checked="">
                            <span class="form-check-sign">
                                <span class="check"></span>
                            </span>
                    </label>`,
                        `<div id="${this.nombre}-divpol" style="display:none">`,
                            `<label class="${this.nombre}-keyboard">Lados <input type="number" id="${this.nombre}-lados-poligono" min="0" max="99" size="0" value="0" /></label>`,
                            `<label class="${this.nombre}-keyboard">Curva `, 
                                `<select id="${this.nombre}-curva-poligono">`,
                                    `<option value="L">L (Línea)</option>`,
                                    `<option value="C">C (Cúbica)</option>`,
                                    `<option value="Q">Q (Cuadrática)</option>`,
                                    `<option value="A">A (Arco)</option>`,
                                `</select>`,
                            `</label>`,
                            `<label class="${this.nombre}-keyboard">Ángulo <input type="number" id="${this.nombre}-angulo-poligono" min="-179.99" max="180.00" size="3" value="0" /></label>`,
                            `<label class="${this.nombre}-keyboard">Dirección `,
                                `<select id="${this.nombre}-direccion-poligono">`,
                                    `<option value="right">Derecho</option>`,
                                    `<option value="left">Izquierdo</option>`,
                                `</select>`,
                            `</label>`,
                            `<fieldset class="grupo"><legend>Posición centro y diámetro</legend>`,
                                `<label>Centro X <input type="number" id="${this.nombre}-centroX-poligono" min="0" max="9999" size="3" value="0" /></label>`,
                                `<label>Centro Y <input type="number" id="${this.nombre}-centroY-poligono" min="0" max="9999" size="3"  value="0" /></label>`,
                                `<label>Diámetro <input type="number" id="${this.nombre}-diametro-poligono" min="0" max="9999" size="3" value="0" /></label>`,
                                `<button type="button" onclick="${this.nombre}.dimensionarPoligono()">Dimensionar</button>`,
                            `</fieldset>`,
                            `<fieldset class="grupo"><legend>Ubicación puntos control</legend>`,
                                `<label class="${this.nombre}-keyboard">Distancia <input type="number" id="${this.nombre}-distanciaControl-poligono" min="0" max="9999" size="3" value="0" /></label>`,
                                `<label class="${this.nombre}-keyboard">Ángulo <input type="number" id="${this.nombre}-anguloControl-poligono" min="-179.99" max="180.00" size="3" value="0" /></label>`,
                                `<div class="botonesDistancia"><button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;centro&quot;)">Centro</button>`,
                                `<button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;arista&quot;)">Arista</button>`,
                                `<button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;circulo&quot;)">Círculo</button>`,
                                `<button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;exterior&quot;)">Exterior</button>`,
                                `<button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;replica&quot;)">Réplica</button></div>`,
                            `</fieldset>`,
                            
                        `</div>`,
                    /*`<label>Dibujar <input type="checkbox" value="1" id="${this.nombre}-dibujando" onclick="${this.nombre}.activarDibujando(this.checked)" /></label> `,
                    `<fieldset unselectable="on" ><legend class="conten-svgicon">Propiedades punto`,
                        `<button type="button" data-div="${this.nombre}-divpoint" onclick="${this.nombre}.mostrarOcultarDiv(event)">`,
                            `<svg class="svg-icon" style="display:inline"><use href="#svgicon-plus"></use></svg>`,
                            `<svg class="svg-icon" style="display:none"><use href="#svgicon-minus"></use></svg>`,
                        `</button>`,
                        `</legend>`,
                        `<div id="${this.nombre}-divpoint" style="display:none">`,
                            `<div><span class="conten-svgicon">`,
                                `<button type="button" title="Primero" onclick="${this.nombre}.actuarProp(&quot;start&quot;)"><svg class="svg-icon" style="display:inline"><use href="#svgicon-navstart"></use></svg></button>`,
                                `<button type="button" title="Anterior" onclick="${this.nombre}.actuarProp(&quot;prev&quot;)"><svg class="svg-icon" style="display:inline"><use href="#svgicon-navprev"></use></svg></button>`,
                                `<button type="button" title="Siguiente" onclick="${this.nombre}.actuarProp(&quot;next&quot;)"><svg class="svg-icon" style="display:inline"><use href="#svgicon-navnext"></use></svg></button>`,
                                `<button type="button" title="Último" onclick="${this.nombre}.actuarProp(&quot;end&quot;)"><svg class="svg-icon" style="display:inline"><use href="#svgicon-navend"></use></svg></button>`,
                                `<button type="button" title="Nuevo" onclick="${this.nombre}.actuarProp(&quot;new&quot;)"><svg class="svg-icon" style="display:inline"><use href="#svgicon-asterisk"></use></svg></button>`,
                                `<button type="button" id="${this.nombre}-eliminar" title="Eliminar" onclick="${this.nombre}.actuarProp(&quot;delete&quot;)"><svg class="svg-icon" style="display:inline"><use href="#svgicon-delete"></use></svg></button>`,
                                `</span>`,
                                `<button type="button" id="${this.nombre}-prop-aplicar" onclick="${this.nombre}.aplicarPropiedadesPunto()">Aplicar</button>`, 
                            `</div>`,
                            `<label id="${this.nombre}-keyboard-num">Nº <input type="number" id="${this.nombre}-prop-num" min="0" max="999" size="3" onchange="${this.nombre}.seleccionarPunto(event)" /></label>`,
                            `<label>Comando <select id="${this.nombre}-prop-cmd" onchange="${this.nombre}.cambiarComando(event)" data-cmda="-">`,
                                `<option value="-">-</option>`,
                                `<option value="M">M (Move)</option>`,
                                `<option value="m">m (Move)</option>`,
                                `<option value="L">L (Line)</option>`,
                                `<option value="l">l (Line)</option>`,
                                `<option value="C">C (Cubic)</option>`,
                                `<option value="c">c (Cubic)</option>`,
                                `<option value="Q">Q (Quadratic)</option>`,
                                `<option value="q">q (Quadratic)</option>`,
                                `<option value="A">A (Arc)</option>`,
                                `<option value="a">a (Arc)</option>`,
                            `</select></label>`,
                            `<label class="${this.nombre}-keyboard"><span id="${this.nombre}-prop-name-x"></span> <input type="number" id="${this.nombre}-prop-x" min="-10000" max="10000" step="0.01" size="3" /></label>`,
                            `<label class="${this.nombre}-keyboard"><span id="${this.nombre}-prop-name-y"></span> <input type="number" id="${this.nombre}-prop-y" min="-10000" max="10000" step="0.01" size="3" /></label>`,
                            `<label class="${this.nombre}-keyboard"><span id="${this.nombre}-prop-name-plus00"></span> <input type="number" id="${this.nombre}-prop-plus00" min="-10000" max="10000" step="0.01" size="3" /></label>`,
                            `<label class="${this.nombre}-keyboard"><span id="${this.nombre}-prop-name-plus01"></span> <input type="number" id="${this.nombre}-prop-plus01" min="-10000" max="10000" step="0.01" size="3" /></label>`,
                            `<label class="${this.nombre}-keyboard"><span id="${this.nombre}-prop-name-plus10"></span> <input type="number" id="${this.nombre}-prop-plus10" min="-10000" max="10000" step="0.01" size="3" /></label>`,
                            `<label class="${this.nombre}-keyboard"><span id="${this.nombre}-prop-name-plus11"></span> <input type="number" id="${this.nombre}-prop-plus11" min="-10000" max="10000" step="0.01" size="3" /></label>`,
                            `<label class="${this.nombre}-keyboard"><span id="${this.nombre}-prop-name-plus20"></span> <input type="number" id="${this.nombre}-prop-plus20" min="-10000" max="10000" step="0.01" size="1"  /></label>`,
                            `<fieldset><legend>Puntos control interesantes</legend>`,
                                `<label class="${this.nombre}-keyboard">Lados <input type="number" id="${this.nombre}-prop-lados" min="3" max="99" step="1" size="2" value="5"  /></label>`,
                                `<label>Distancia <select id="${this.nombre}-prop-distancia">`,
                                    `<option value="centro">Centro</option>`,
                                    `<option value="arista">Arista</option>`,
                                    `<option value="circulo" selected>Circulo</option>`,
                                    `<option value="exterior">Exterior</option>`,
                                    `<option value="replica">Replica</option>`,
                                `</select></label>`,
                                `<span class="conten-svgicon">`,
                                    `<button type="button" title="Calcular distancia" onclick="${this.nombre}.calcularDistancia()"><svg class="svg-icon" `,
                                    `style="display:inline"><use href="#svgicon-refreshb"></use></svg></button>`,
                                `</span>`,
                                `<div class="centroxyradio">Centro X: <span id="${this.nombre}-prop-centroX"></span> Y: <span id="${this.nombre}-prop-centroY"></span> Radio: <span id="${this.nombre}-prop-radio"></span></div>`,
                            `</fieldset>`,
                        `</div>`,
                    `</fieldset>`,
                    `<fieldset unselectable="on"><legend class="conten-svgicon">Construir polígono regular `,
                        `<button type="button" data-div="${this.nombre}-divpol" onclick="${this.nombre}.mostrarOcultarDiv(event)">`,
                            `<svg class="svg-icon" style="display:inline"><use href="#svgicon-plus"></use></svg>`,
                            `<svg class="svg-icon" style="display:none"><use href="#svgicon-minus"></use></svg>`,
                        `</button>`,
                        `</legend>`,
                        `<div id="${this.nombre}-divpol" style="display:none">`,
                            `<label class="${this.nombre}-keyboard">Lados <input type="number" id="${this.nombre}-lados-poligono" min="2" max="99" size="2" value="2" /></label>`,
                            `<label class="${this.nombre}-keyboard">Curva `, 
                                `<select id="${this.nombre}-curva-poligono">`,
                                    `<option value="L">L (Línea)</option>`,
                                    `<option value="C">C (Cúbica)</option>`,
                                    `<option value="Q">Q (Cuadrática)</option>`,
                                    `<option value="A">A (Arco)</option>`,
                                `</select>`,
                            `</label>`,
                            `<label class="${this.nombre}-keyboard">Ángulo <input type="number" id="${this.nombre}-angulo-poligono" min="-179.99" max="180.00" size="3" value="0" /></label>`,
                            `<label class="${this.nombre}-keyboard">Dirección `,
                                `<select id="${this.nombre}-direccion-poligono">`,
                                    `<option value="right">Derecho</option>`,
                                    `<option value="left">Izquierdo</option>`,
                                `</select>`,
                            `</label>`,
                            `<fieldset class="grupo"><legend>Posición centro y diámetro</legend>`,
                                `<label>Centro X <input type="number" id="${this.nombre}-centroX-poligono" min="0" max="9999" size="3" value="0" /></label>`,
                                `<label>Centro Y <input type="number" id="${this.nombre}-centroY-poligono" min="0" max="9999" size="3"  value="0" /></label>`,
                                `<label>Diámetro <input type="number" id="${this.nombre}-diametro-poligono" min="0" max="9999" size="3" value="0" /></label>`,
                                `<button type="button" onclick="${this.nombre}.dimensionarPoligono()">Dimensionar</button>`,
                            `</fieldset>`,
                            `<fieldset class="grupo"><legend>Ubicación puntos control</legend>`,
                                `<label class="${this.nombre}-keyboard">Distancia <input type="number" id="${this.nombre}-distanciaControl-poligono" min="0" max="9999" size="3" value="0" /></label>`,
                                `<label class="${this.nombre}-keyboard">Ángulo <input type="number" id="${this.nombre}-anguloControl-poligono" min="-179.99" max="180.00" size="3" value="0" /></label>`,
                                `<div class="botonesDistancia"><button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;centro&quot;)">Centro</button>`,
                                `<button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;arista&quot;)">Arista</button>`,
                                `<button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;circulo&quot;)">Círculo</button>`,
                                `<button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;exterior&quot;)">Exterior</button>`,
                                `<button type="button" onclick="${this.nombre}.calcularDistanciaAnguloControl(&quot;replica&quot;)">Réplica</button></div>`,
                            `</fieldset>`,
                            `<button type="button" onclick="${this.nombre}.construirPoligono(null)">Construir</button>`,
                        `</div>`,
                    `</fieldset>`,
                    `<fieldset unselectable="on"><legend class="conten-svgicon">Configuración `,
                        `<button type="button" data-div="${this.nombre}-divconf" onclick="${this.nombre}.mostrarOcultarDiv(event)">`,
                            `<svg class="svg-icon" style="display:inline"><use href="#svgicon-plus"></use></svg>`,
                            `<svg class="svg-icon" style="display:none"><use href="#svgicon-minus"></use></svg>`,
                        `</button>`,
                        `</legend>`,
                        `<div id="${this.nombre}-divconf" style="display:none">`,
                            `<label class="${this.nombre}-keyboard">Tamaño punto <input type="number" id="${this.nombre}-conf-medidaPunto" min="2" max="64" size="3" value="${this.medidaPunto}" /></label>`,
                            `<label>Puntos con número <input type="checkbox" id="${this.nombre}-conf-conNumero" ${this.conNumero?'checked':''} /></label>`,
                            `<label>Color número <input type="text" id="${this.nombre}-conf-colorNumeroPunto" value="${this.colorNumeroPunto}" size="15" /></label>`,
                            `<label>Color punto <input type="text" id="${this.nombre}-conf-colorBordeSelector" value="${this.colorBordeSelector}" size="15" /></label>`,
                            `<label>Color seleccionado <input type="text" id="${this.nombre}-conf-colorPuntoSeleccionado" value="${this.colorPuntoSeleccionado}" size="15" /></label>`,
                            `<label>Color final camino <input type="text" id="${this.nombre}-conf-colorFinalCamino" value="${this.colorFinalCamino}" size="15" /></label>`,
                            `<label>Color selector <input type="text" id="${this.nombre}-conf-colorFondoSelector" value="${this.colorFondoSelector}" size="15" /></label>`,
                            `<label class="${this.nombre}-keyboard">Resolución dibujo <input type="number" id="${this.nombre}-conf-resolucionDibujo" min="1" max="64" size="3" value="${this.resolucionDibujo}" /></label>`,
                            `<label class="${this.nombre}-keyboard">Precisión cálculos <input type="number" id="${this.nombre}-conf-digitos" min="0" max="16" size="3" value="${this.digitos}" /></label>`,
                            `<label class="${this.nombre}-keyboard">Máximo deshacer <input type="number" id="${this.nombre}-conf-maxBak" min="0" max="16" size="3" value="${this.maxBak}" /></label>`,
                            `<label class="${this.nombre}-keyboard">Offset reflejo <input type="number" id="${this.nombre}-conf-offsetReflejo" min="0" max="1000" size="3" value="${this.offsetReflejo}" /></label>`,
                            `<button type="button" id="${this.nombre}-conf-aplicar" onclick="${this.nombre}.aplicarConfigDesdeControles()">Aplicar</button>`, 
                        `</div>`,
                    `</fieldset>`,*/
                `</div>`,
                `<button type="button" id="${this.nombre}-boton-activar" style="display:none" onclick="${this.nombre}.activarSelector()" ${styBoton}>Desactivar</button>`, 
            `</fieldset>`];
            elemento.innerHTML = html.join("");
            creadoControles = true;
        } else {
            creadoControles = false;
        }
    } catch(e) {_msg(e, "crearControles")}
    return creadoControles;
};


tempConstructor.prototype.mostrarOcultarDiv = function(event){
    let div = null;
    try {
        let boton = event.target;
        let tag = boton.tagName.toLowerCase();
        if (tag!=="button"){
            while (boton = boton.parentElement, tag = boton.tagName.toLowerCase(), boton && tag!=="button");
        }
        if (tag==="button"){
            let dataDiv = boton.getAttribute("data-div");
            if (dataDiv){
                div = document.getElementById(dataDiv);
                if (div) {
                    let sty = div.style.display;
                    div.style.display = sty !== "none" ? "none" : "block";
                    boton.firstElementChild.style.display = sty !== "none" ? "inline" : "none";
                    boton.lastElementChild.style.display = sty !== "none" ? "none" : "inline";
                }
            }
        }
    } catch(e) {_msg(e, "mostrarOcultarDiv")}
    return div;
};

tempConstructor.prototype.aplicarCss = function(){
    let css = null;
    try {
        css = document.getElementById(`${this.nombre}-css`);
        if (!css){
            css = document.createElement("style");
            css.id = `${this.nombre}-css`;
            document.head.appendChild(css);
        }
        let disp = this.conPuntosControl && !this.dibujando ? "block" : "none";
        let cad = `[class="${this.nombre}-punto"],[class="${this.nombre}-puntoctrl"]{position:absolute;display:block;
        width:${this.medidaPunto}px;height:${this.medidaPunto}px;line-height:${this.medidaPunto}px;font-size:${this.medidaPunto*0.75}px;
        text-align:center;color:${this.colorNumeroPunto}}
        [class="${this.nombre}-punto"]{background-color:${this.colorBordeSelector}}
        [class="${this.nombre}-punto"][data-sel]{box-shadow:0px 0px 8px 4px ${this.colorPuntoSeleccionado};z-index:${this.zIndexBase+1001}}
        [class="${this.nombre}-punto"][data-z],[class="${this.nombre}-punto"][data-end]{background-color:${this.colorFinalCamino}!important}
        [class="${this.nombre}-linea"]{stroke:${this.colorBordeSelector};stroke-width:${this.anchoBordeSelector}px;fill:none}
        [class="${this.nombre}-puntoctrl"]{background-color:${this.colorPuntoControl};display:${disp};z-index:${this.zIndexBase+1000}}
        [class="${this.nombre}-puntoctrl"][data-sel]{display:block}
        [class="${this.nombre}-lineactrl"]{stroke:${this.colorPuntoControl};stroke-width:${this.anchoBordeSelector}px;stroke-dasharray:4;fill:none;display:${disp}}
        [class="${this.nombre}-lineactrl"][data-sel]{display:block}
        .select-area-selector{background-color:${this.colorFondoSelector}!important}`;
        if (this.dibujando){
            cad += `[class="${this.nombre}-punto"]{display:none}`;
        }
        css.textContent = cad;
    } catch(e) {_msg(e, "aplicarCss")}
    return css;
};


tempConstructor.prototype.aplicarConfigDesdeControles = function(){
    let config = null;
    try {
        config = this.keysConfig.reduce((p, key) => {
            let control = document.getElementById(`${this.nombre}-conf-${key}`);
            if (control){
                if (control.type === "number"){
                    p[key] = parseFloat(control.value);
                } else if (control.type === "checkbox") {
                    p[key] = control.checked;
                } else {
                    p[key] = control.value;
                }
            }
            return p;
        }, {});
        this.aplicarConfig(config);
    } catch(e) {_msg(e, "aplicarConfigDesdeControles")}
    return config;
};

tempConstructor.prototype.aplicarConfig = function(config=null, actualizarControles=false){
    let conf = null;
    try {
        if (config!==null){
            this.keysConfig.forEach(key => {
                if (config.hasOwnProperty(key)){
                    this[key] = config[key];
                    if (actualizarControles) {
                        let control = document.getElementById(`${this.nombre}-conf-${key}`);
                        if (control){
                            if (typeof config[key] === "boolean"){
                                control.checked = config[key];
                            } else {
                                control.value = config[key];
                            }
                        }
                    }
                }
            });
            this.aplicarCss();
            conf = config;
        }
    } catch(e) {_msg(e, "aplicarConfig")}
    return conf;
};


tempConstructor.prototype.mostrarPuntosControl = function(mostrar=false){
    this.conPuntosControl = mostrar;
    this.aplicarCss();
};

tempConstructor.prototype.listaPuntosToString = function(listaPuntos){
    let str = null;
    try {
        str = listaPuntos.map((v,i) => `${i},${v.x},${v.y},${v.cmd},${v.z},${v.plus.flat(2).join(",")}`).join("\n");
    } catch(e) {_msg(e, "listaPuntosToString")}
    return str;
};

tempConstructor.prototype.guardar = function(){
    let ok = null;
    try {
        if (this.saveBak){
            if (this.listaPuntos.length>0 && (this.bak.length===0 || this.listaPuntosToString(this.listaPuntos) !== this.listaPuntosToString(this.bak[this.bak.length-1]))){
                if (this.bak.length>0) {
                    if (this.cursorBak < this.bak.length-1){
                        this.bak.splice(this.cursorBak);
                    } else if (this.cursorBak===this.bak.length-1 && this.bak.length>this.maxBak) {
                        this.bak.shift();
                    }
                }
                this.bak.push(this.listaPuntos.map(v => Object.keys(v).
                reduce((p,key) => {
                    if (key==="plus"){
                        p[key] = v[key].map(w => [...w]);
                    } else {
                        p[key] = v[key];
                    }
                    return p;
                }, {})));
                this.cursorBak = this.bak.length-1;
            }
            if (this.ejecutarBak) this.ejecutarBak();
        }
        ok = true;
    } catch(e) {_msg(e, "guardar")}
    return ok;
};

tempConstructor.prototype.deshacer = function(){
    let ok = null;
    try {
        this.borrarPuntos(false);
        this.cursorBak = this.cursorBak>0 ? this.cursorBak-1 : 0;
        let datos = this.bak.length>0 ? this.bak[this.cursorBak] : [];
        this.saveBak = false;
        this.importar({tipo: "object", datos, zoom: this.zoom, whcell: this.whcell});
        this.saveBak = true;
        if (this.ejecutarBak) this.ejecutarBak();
        ok = true;
    } catch(e) {_msg(e, "deshacer")}
    return ok;
};

tempConstructor.prototype.rehacer = function(){
    let ok = null;
    try {
        this.borrarPuntos(false);
        this.cursorBak = this.cursorBak<this.bak.length-1 ? this.cursorBak+1 : this.bak.length-1;
        let datos = this.bak.length>0 ? this.bak[this.cursorBak] : [];
        this.saveBak = false;
        this.importar({tipo: "object", datos, zoom: this.zoom, whcell: this.whcell});
        this.saveBak = true;
        if (this.ejecutarBak) this.ejecutarBak();
        ok = true;
    } catch(e) {_msg(e, "rehacer")}
    return ok;
};

//Para activar y desactivar el selector. 
//El argumento puede ser false, true o null (sin argumento). En este caso si estuviera
//activado lo desactivaría y al revés.
tempConstructor.prototype.activarSelector = function(activar){
    let ok = null;
    try {
        if (activar==null) activar = (this.capaSelector.style.display == "none");
        this.capaSvg.style.display = "none";
        this.capaPuntos.style.display = "none";
        this.selector.style.display = "none";
        this.capaSelector.style.display = "none";
        if (activar) {
            if (this.tipoSeleccion == "area") {
                this.selector.style.display = "block";
                this.selector.style.backgroundImage = this.imagenSelector;
                if (this.controles && this.controlesArea) {
                    document.getElementById(this.nombre + "-sel-area").style.display = "block";
                    document.getElementById(this.nombre + "-tipo-seleccion-area").checked = true;
                    document.getElementById(this.nombre + "-sel-puntos").style.display = "none";
                }
             } else {
                this.capaSvg.style.display = "block";
                this.capaPuntos.style.display = "block";
                this.selector.style.backgroundImage = "none";
                this.activarMoverPuntos(this.moverPuntosActivado);
                if (this.controles) {
                    document.getElementById(this.nombre + "-sel-area").style.display = "none";
                    document.getElementById(this.nombre + "-sel-puntos").style.display = "block";
                    document.getElementById(this.nombre + "-tipo-seleccion-poligono").checked = true;
                }
            }
            this.capaSelector.style.display = "block";
            if (this.controles) document.getElementById(this.nombre + "-boton-activar").value = "Desactivar";
        } else if (this.controles) {
            document.getElementById(this.nombre + "-boton-activar").value = "Activar";
        }
        ok = true;
    } catch(e) {_msg(e, "activarSelector")}
    return ok;
};


//Para cambiar el tipo de selección
tempConstructor.prototype.cambiarTipoSeleccion = function(tipo){
    this.tipoSeleccion = tipo;
    this.activarSelector(true);
    this.ejecutarEventoTipoSeleccion();
};

tempConstructor.prototype.activarDibujando = function(activar){
    let ok = null;
    try {
        this.dibujando = activar;
        this.aplicarCss();
        ok = true;
    } catch(e) {_msg(e, "activarDibujando")}
    return ok;
};


//Esto reajusta el tamaño del contenedor y capas al que se pase en worig, horig.
//Tiene un uso externo, pues internamente no se utiliza en ningún proceso.
//Además le aplica el zoom que se pase. Los valores de los cuadros de controles son
//sin considerar el zoom. Los valores del polígono tampoco consideran el zoom y 
//si hay un polígono pintado se borrará al aplicar medidas nuevas o cambiar de zoom.
tempConstructor.prototype.aplicarMedidas = function(worig=100, horig=100, zoom=1, whcell=1){
    let ok = null;
    try {
        this.zoom = zoom;
        this.whcell = whcell;
        let zwhc = this.zoom * this.whcell;
        var wpres = worig * zoom;
        var hpres = horig * zoom;
        //contenedor y capas
        this.contenedor.style.width = wpres + "px";
        this.contenedor.style.height = hpres + "px";
        this.capaSelector.style.width = wpres + "px";
        this.capaSelector.style.height = hpres + "px";
        this.capaPuntos.style.width = wpres + "px";
        this.capaPuntos.style.height = hpres + "px";
        this.capaSvg.style.width = wpres + "px";
        this.capaSvg.style.height = hpres + "px";
        //selector se ajusta al zoom sólo si hay controles
        if (this.controles && (this.selector.style.display == "block")) {
            this.selector.style.left = (document.getElementById(this.nombre + "-left").value * zwhc) + "px";
            this.selector.style.top = (document.getElementById(this.nombre + "-top").value * zwhc) + "px";
            this.selector.style.width = (document.getElementById(this.nombre + "-width").value * zwhc) + "px";
            this.selector.style.height = (document.getElementById(this.nombre + "-height").value * zwhc) + "px";
            var displaySelector = this.selector.style.display;
            //Para el polígono se borrarán todos los puntos
            this.borrarPuntos();
            //Dejamos el selector como estaba pues borrarPuntos siempre lo desactiva
            if (this.tipoSeleccion=="area") this.selector.style.display = displaySelector;
        }
        ok = true;
    } catch(e) {_msg(e, "aplicarMedidas")}
    return ok;
};



//Esta función tiene una utilidad externa, pues no se usa dentro del objeto. Se trata
//de recuperar las posiciones del selector de área o los puntos del polígono sin tener
//que recurrir externamente a extraerlos desde los objetos HTML del selector.
//El tipo será "area" o "poligono", aunque si no se pasa se devuelve del área.
//Devuelve un array de esta forma:
//   - "area": array(left, top, width, height)
//   - "poligono": array(x1,y1,x2,y2,x3,y3,x4,y4,...) siendo una relación de todos los puntos que están
//                 unidos por líneas.
tempConstructor.prototype.obtenerPosiciones = function(tipo){
    let arr = null;
    try {
        let zwhc = this.zoom*this.whcell;
        if (tipo==null) tipo = "area";
        if (tipo=="area") {
            if (this.controles) {
                //si hay controles los obtenemos directamente de los controles (no hay que aplicar zoom)
                arr = [document.getElementById(this.nombre + "-left").value,
                       document.getElementById(this.nombre + "-top").value,
                       document.getElementById(this.nombre + "-width").value,
                       document.getElementById(this.nombre + "-height").value];
            } else {
                //en este caso hay que descontar el zoom pues en el selector están con zoom
                arr = [Math.round(this.selector.offsetLeft*zwhc), 
                       Math.round(this.selector.offsetTop*zwhc), 
                       Math.round(this.selector.offsetWidth*zwhc), 
                       Math.round(this.selector.offsetHeight*zwhc)];
            }
        } else {
            //Hay que descontar el zoom pues en listaPuntos están con zoom
            arr = [];
            for(var i in this.listaPuntos){
                arr[arr.length] = Math.round(this.listaPuntos[i].x*zwhc);
                arr[arr.length] = Math.round(this.listaPuntos[i].y*zwhc);
            }
            //agregamos el último punto de la última linea si está cerrado 
            if (this.listaPuntos.length>1){
                var lineaFin = document.getElementById(this.nombre + "-linea" + (this.listaPuntos.length-1));
                var x1 = lineaFin.x1.baseVal.value;
                var y1 = lineaFin.y1.baseVal.value;
                var x2 = lineaFin.x2.baseVal.value;
                var y2 = lineaFin.y2.baseVal.value;
                if ((x1 != x2)||(y1 != y2)){
                    arr[arr.length] = Math.round(x2*zwhc);
                    arr[arr.length] = Math.round(y2*zwhc);
                }
            }
        }
    } catch(e) {_msg(e, "obtenerPosiciones")}
    return arr;
};


tempConstructor.prototype.seleccionarArea = function(evento){
    let obj = wxG.recogeEvento(evento);
    if (obj!==null && !obj.element.hasAttribute("data-nosel")) {
        let zwhc = this.zoom*this.whcell;
        let x = obj.pagx;
        let y = obj.pagy;
        let mpm = Math.round(this.medidaPunto/2);
        if ((x>this.contenedor.offsetLeft)&&
            (y>this.contenedor.offsetTop)&&
            (x<(this.contenedor.offsetLeft+this.contenedor.offsetWidth))&&
            (y<(this.contenedor.offsetTop+this.contenedor.offsetHeight))) {
            //Esto para prevenir mover pantalla en móviles (ver comentario en la 
            //declaración de la propiedad this.usarPreventDefault)
            if (this.usarPreventDefault && obj.event.preventDefault) obj.event.preventDefault();
            x -= this.contenedor.offsetLeft;
            y -=  this.contenedor.offsetTop;
            let sl = this.selector.offsetLeft;
            let st = this.selector.offsetTop;
            let sw = this.selector.offsetWidth;
            let sh = this.selector.offsetHeight;
            let sr = sl+sw;
            let sb = st+sh;
            if (this.tipoSeleccion==="poligono"){ 
                // -------------------------SELECCIÓN POLÍGONO------------------------------------------------------
                let dentroArea = (this.moverPuntosActivado && (x>sl)&&(x<sr)&&(y>st)&&(y<sb));
                if (["mousedown", "touchstart", "dblclick"].includes(obj.event.type)){
                    this.saveBak = false;
                    this.numCtrl = -1;
                    this.x = x;
                    this.y = y;
                    this.num = -1;
                    if (dentroArea){
                        this.move = 2;
                        this.capaSelector.style.cursor = this.dibujando ? "default" : "pointer";
                    } else if (this.dibujando){
                        this.move = 3;
                        this.iniDibujo = true;
                        this.qrd = Math.pow(this.resolucionDibujo, 2);
                    } else {
                        if ((obj.event.ctrlKey || obj.event.altKey) && obj.event.shiftKey) {
                            this.activarMoverPuntos(!this.moverPuntosActivado);
                        } else {
                            this.activarMoverPuntos(false);
                            let num = this.buscarNumPunto({x,y});
                            if (num === -1) {
                                if (!obj.event.ctrlKey && !obj.event.altKey && !obj.event.shiftKey) this.nuevoPunto = true;
                            } else if (typeof num==="string"){
                                let arr = num.split(",").map(v => parseInt(v, 10));
                                this.numCtrl = arr[0];
                                this.num = arr[1];
                                if (obj.event.altKey){
                                    this.ajustarPunto(this.num, this.numCtrl);
                                } else {
                                    this.move = 1;
                                    this.capaSelector.style.cursor = this.dibujando ? "default" : "pointer";
                                }
                            } else if (obj.event.ctrlKey){
                                this.seleccionarPunto(num);
                            } else if (obj.event.shiftKey) {
                                this.cortarUnirCamino(num);
                            } else if (obj.event.altKey) {
                                this.ajustarPunto(num);
                            } else if (obj.event.type==="dblclick") {
                                if (!this.eliminarPunto(num)) return null;
                            } else {
                                this.move = 1;
                                this.capaSelector.style.cursor = this.dibujando ? "default" : "pointer";
                                this.num = num;
                            }
                        }
                    }

                } else if ((obj.event.type == "mousemove")||(obj.event.type == "touchmove")){
                    if (this.move===1){
                        this.capaSelector.style.cursor = this.dibujando ? "default" : "pointer";
                        if (this.numCtrl===-1){
                            this.moverPunto(this.num, x, y);
                        } else {
                            this.moverPuntoControl(this.num, this.numCtrl, x, y);
                        }
                    } else if ((this.move===2)||dentroArea) {
                        this.capaSelector.style.cursor = this.dibujando ? "default" : "move";
                        if (this.move===2){
                            //mover selector de polígono
                            let sx = this.selector.offsetLeft+x-this.x;
                            let sy = this.selector.offsetTop+y-this.y;
                            if ((sx>=0)&&(sx<=(this.contenedor.offsetWidth-sw))&&
                                (sy>=0)&&(sy<=(this.contenedor.offsetHeight-sh))){
                                this.selector.style.left = sx + "px";
                                this.selector.style.top = sy + "px";
                                this.moverPoligono(x-this.x, y-this.y, this.moverCamino);
                            }
                            this.x = x;
                            this.y = y;
                        }
                    } else if (this.move===3){
                        let a = this.x-x, b = this.y-y;
                        if (this.iniDibujo ||(a*a+b*b)>this.qrd){
                            let cmd = "L";
                            if (this.iniDibujo){
                                this.iniDibujo = false;
                                cmd = "M";
                            }
                            this.crearPunto(x, y, cmd);
                            if (cmd==="M" && this.listaPuntos.length>1){
                                let n = this.listaPuntos.length-2;
                                this.cortarCamino(n);
                            }
                            this.x = x;
                            this.y = y;
                        }
                    } else {
                        let n = this.buscarNumPunto({x,y});
                        if (n>-1 || typeof n === "string" ){
                            this.capaSelector.style.cursor = this.dibujando ? "default" : "pointer";
                        } else {
                            this.capaSelector.style.cursor = "default";
                        }
                    }
                } else if ((obj.event.type === "mouseup")||(obj.event.type === "touchend")){
                    if (this.nuevoPunto) {
                        this.crearPunto(x, y, "L", [], true);
                        this.nuevoPunto = false;
                    } else if (this.move===1) {
                        this.move = 0;
                    } else if (this.move===2){
                        this.move = 0;
                    } else if (this.move===3){
                        this.move = 0;
                    }
                    this.saveBak = true;
                    this.guardar();
                }
            } else { 
                // -------------------------------- SELECCIÓN ÁREA ----------------------------------------------------
                let dentroSelector = ((x>sl)&&(x<sr)&&(y>st)&&(y<sb));
                let dentroAlargador = ((x>(sr-this.medidaAlargador))&&(x<sr)&&(y>(sb-this.medidaAlargador))&&(y<sb));
                if ((obj.event.type == "mousedown")||(obj.event.type == "touchstart")){
                    if (dentroAlargador){
                        //alargador derecha
                        this.move = 2;
                        this.capaSelector.style.cursor="se-resize";
                        this.x = x;
                        this.y = y;
                     } else if (dentroSelector){
                        //mover
                        this.move = 1;
                        this.capaSelector.style.cursor="move";
                        this.x = x-sl;
                        this.y = y-st;
                    } else {
                        this.x = x;
                        this.y = y;  
                        if (this.moverSitioSelector) {
                            //mover de sitio. Por defecto está activado y podemos pinchar en otra
                            //zona del contenedor de tal forma que el área selectora se desplaza
                            //allí modificando su ancho y alto a la medida del alargador. La primera
                            //vez que se abre el objeto entra por aquí. Si this.moverSitioSelector se
                            //desactiva desde EL EXTERIOR entonces ya no responde aquí.
                            this.move = 2;
                            this.capaSelector.style.cursor="se-resize";
                            this.selector.style.left = x + "px";
                            this.selector.style.top = y + "px";
                            this.selector.style.width = this.medidaAlargador + "px";
                            this.selector.style.height = this.medidaAlargador + "px";
                            this.selector.style.display = "block";
                        }
                    }
                } else if ((obj.event.type == "mousemove")||(obj.event.type == "touchmove")){
                    let dx = x-this.x;
                    let dy = y-this.y;
                    if (this.move===0){
                        if (dentroAlargador){
                            this.capaSelector.style.cursor="se-resize";
                        } else if (dentroSelector){
                            this.capaSelector.style.cursor="move";
                        } else {
                            this.capaSelector.style.cursor = "default";
                        }
                    } else if (this.move===1) {
                        //mover
                        this.capaSelector.style.cursor="move";
                        let dx = x-this.x;
                        let dy = y-this.y;
                        if ((dx>=0)&&(dx<=(this.contenedor.offsetWidth-sw))&&
                            (dy>=0)&&(dy<=(this.contenedor.offsetHeight-sh))){
                            this.selector.style.left = dx + "px";
                            this.selector.style.top = dy + "px";
                        }
                    } else if (this.move===2){
                        //alargador derecha
                        this.capaSelector.style.cursor="se-resize";
                        if (((sl+sw+x-this.x)<=this.contenedor.offsetWidth)&&
                                ((st+sh+y-this.y)<=this.contenedor.offsetHeight)){
                            let ww = sw+x-this.x;
                            let hh = sh+y-this.y;
                            if (this.medidasActivadas==="ambas" || this.medidasActivadas==="ancho"){
                                this.selector.style.width = Math.max(this.minWidth, ww) + "px";
                                if (this.ajustarOtraMedida){
                                    this.selector.style.height = Math.max(this.minHeight, ww * sh/sw) + "px";
                                }
                            }
                            if (this.medidasActivadas==="ambas" || this.medidasActivadas==="alto"){
                                this.selector.style.height = Math.max(this.minHeight, hh) + "px";
                                if (this.ajustarOtraMedida){
                                    this.selector.style.width = Math.max(this.minWidth, hh * sw/sh) + "px";
                                }
                            }
                            this.x=x;
                            this.y=y; 
                        }
                    }
                } else {
                    this.capaSelector.style.cursor = "default"; 
                    if (this.move>0) {
                        this.x=x;
                        this.y=y;
                        this.move = 0;
                    }
                }
                if (this.controles) {
                    //Sólo con selector activado
                    if (this.selector.style.display=="block") {
                        document.getElementById(this.nombre + "-left").value = Math.round(this.selector.offsetLeft*zwhc);
                        document.getElementById(this.nombre + "-top").value = Math.round(this.selector.offsetTop*zwhc);
                        document.getElementById(this.nombre + "-width").value = Math.round(this.selector.offsetWidth*zwhc);
                        document.getElementById(this.nombre + "-height").value = Math.round(this.selector.offsetHeight*zwhc);
                    }
                }
                if (this.move>0) this.ejecutarEventoMov(this.move);
            }
        } else {
            this.capaSelector.style.cursor = "default"; 
            if (this.move>0) {
                this.x=x;
                this.y=y;
                this.move = 0;
            }
        }
    }
};


tempConstructor.prototype.seleccionarDesdeControles = function(event){
    let ok = null;
    try {
        let [sw, sh, sl, st, sr, sb, cw, ch] = [this.selector.offsetWidth, this.selector.offsetHeight, this.selector.offsetLeft,
        this.selector.offsetTop, this.selector.offsetLeft + this.selector.offsetWidth, this.selector.offsetTop + this.selector.offsetHeight,
        this.capaSelector.offsetWidth, this.capaSelector.offsetHeight];
        let inpute = event.target;
        if (inpute.id == (this.nombre + "-left")){
            if (sr>=cw) inpute.value = cw - sw;
            this.selector.style.left = Math.round(inpute.value * this.zoom) + "px";
        } else if (inpute.id == (this.nombre + "-top")){
            if (sb>=ch) inpute.value = ch - sh;
            this.selector.style.top = Math.round(inpute.value * this.zoom) + "px";
        } else if (inpute.id == (this.nombre + "-width")){
            if (sr>cw) inpute.value = cw - sl;
            this.selector.style.width = Math.round(inpute.value * this.zoom) + "px";
        } else if (inpute.id == (this.nombre + "-height")){
            if (sb>ch) inpute.value = ch - st;
            this.selector.style.height = Math.round(inpute.value * this.zoom) + "px";
        } else {
            this.selector.style.left = 0 + "px";
            this.selector.style.top = 0 + "px";
            this.selector.style.width = this.contenedor.offsetWidth + "px";
            this.selector.style.height = this.contenedor.offsetHeight + "px";
            document.getElementById(this.nombre + "-left").value = 0;
            document.getElementById(this.nombre + "-top").value = 0;
            let zwhc = this.zoom*this.whcell;
            document.getElementById(this.nombre + "-width").value = Math.round(this.contenedor.offsetWidth*zwhc);
            document.getElementById(this.nombre + "-height").value =  Math.round(this.contenedor.offsetHeight*zwhc);
        }
        this.ejecutarEventoMov("controles");
        ok = true;
    } catch(e) {_msg(e, "seleccionar")}
    return ok;
};



tempConstructor.prototype.borrarSeleccion = function(){
    let ok = null;
    try {
        document.getElementById(this.nombre + "-left").value = 0;
        document.getElementById(this.nombre + "-top").value = 0;
        document.getElementById(this.nombre + "-width").value = 0;
        document.getElementById(this.nombre + "-height").value = 0;
        this.selector.style.left = 0;
        this.selector.style.top = 0;
        this.selector.style.width = this.medidaAlargador + "px";
        this.selector.style.height = this.medidaAlargador + "px";
        this.ejecutarEventoMov();
        ok = true;
    } catch(e) {_msg(e, "borrarSeleccion")}
    return ok;
};


tempConstructor.prototype.buscarNumPunto = function({x=0, y=0, omitir=-1, desde=0, asc=true, ctrl=true, offset=null}={}){
    let num = -1;
    try {
        let mp = offset===null ? Math.round(this.medidaPunto/2) : offset;
        if (ctrl){
            let filtrados = [...this.capaPuntos.querySelectorAll(`[class="${this.nombre}-puntoctrl"]`)].filter(v => {
                let [xx, yy] = [v.offsetLeft+mp, v.offsetTop+mp];
                return x>(xx-mp) && x<(xx+mp) && y>(yy-mp) && y<(yy+mp);
            });
            if (filtrados.length>0){
                let puntoControl = filtrados[0];
                num = puntoControl.id.split("-").splice(2).join(",");
            }
        }
        if (num===-1) {
            for (let i = desde; asc?i<this.listaPuntos.length:i>-1; i+=asc?1:-1) {
                if (i!==omitir){
                    let xx = this.listaPuntos[i].x;
                    let yy = this.listaPuntos[i].y;
                    if (x>(xx-mp) && x<(xx+mp) && y>(yy-mp) && y<(yy+mp)){
                        num = i;
                        break;
                    }
                }
            }
        }
    } catch(e) {_msg(e, "buscarNumPunto")}
    return num;
};


tempConstructor.prototype.seleccionarPunto = function(num=0){
    let punto = null;
    try {
        let elemento = num.target;
        if (this.listaPuntos.length===0){
            num = -1;
        } else {
            if (elemento) num = elemento.value;
            if (isNaN(num)) num = -1;
            num = parseInt(num, 10);
            num = Math.max(0, Math.min(num, this.listaPuntos.length-1));
        }
        if (elemento) elemento.value = num; 
        if (num>-1) {
            if (num==="") num = 0;
            if (isNaN(num)) num = 0;
            num = parseInt(num, 10);
            num = Math.max(0, Math.min(num, this.listaPuntos.length-1));
            for (let  [index, punto] of this.listaPuntos.entries()){
                this.getPunto(index).removeAttribute("data-sel");
            }
            [...document.querySelectorAll(`[class="${this.nombre}-puntoctrl"]`)].forEach(v => v.removeAttribute("data-sel"));
            [...document.querySelectorAll(`[class="${this.nombre}-lineactrl"]`)].forEach(v => v.removeAttribute("data-sel"));
            let puntoSel = this.getPunto(num);
            puntoSel.setAttribute("data-sel", "");
            let cmdLc = this.listaPuntos[num].cmd.toLowerCase();
            this.listaPuntos[num].plus.forEach((v,i) => {
                if (cmdLc!=="a" || i===0){
                    document.getElementById(`${this.nombre}-puntoctrl-${i}-${num}`).setAttribute("data-sel", "");
                    document.getElementById(`${this.nombre}-lineactrl-${i}-${num}`).setAttribute("data-sel", "");
                    if ("aq".includes(cmdLc)) {
                        document.getElementById(`${this.nombre}-lineactrl-${i+1}-${num}`).setAttribute("data-sel", "");
                    }
                }
            });
            if (this.controles) this.volcarPropiedadesPunto(num);
        }
    } catch(e) {_msg(e, "seleccionarPunto")}
    return punto;
};


tempConstructor.prototype.seleccionarPuntoAvance = function(masMenos=1){
    let punto = null;
    try {
        if (this.listaPuntos.length>0) {
            let num = this.getNumSel();
            num = num + masMenos;
            if (num===this.listaPuntos.length) num = 0;
            if (num<0) num = this.listaPuntos.length-1;
            punto = this.seleccionarPunto(num);
        }
    } catch(e) {_msg(e, "seleccionarPuntoSiguiente")}
    return punto;
};

tempConstructor.prototype.aplicarPropiedadesPunto = function(){
    let punto = null;
    try {
        let zwhc = this.zoom*this.whcell;
        let num = parseInt(document.getElementById(`${this.nombre}-prop-num`).value, 10);
        let nuevoPunto = false;
        if (this.listaPuntos.length>0 && num>-1 && num<this.listaPuntos.length){
            punto = this.listaPuntos[num];
        } else {
            nuevoPunto = true;
            num = this.listaPuntos.length;
            punto = {x:0, y:0, cmd:"", z:-1, plus:[]};
        }
        let cmd = document.getElementById(`${this.nombre}-prop-cmd`).value;
        let cmdLc = cmd.toLowerCase();
        let plus = [];
        let [xa, ya] = num>0 ? [this.listaPuntos[num-1].x, this.listaPuntos[num-1].y] : [0, 0];
        ["x", "y", "plus00", "plus01", "plus10", "plus11", "plus20"].forEach((key,i) => {
            let valor = document.getElementById(`${this.nombre}-prop-${key}`).value;
            if (valor!==""){
                valor = parseFloat(valor);
                if (key!=="plus20" && !(cmdLc==="a" && ["plus10", "plus11"].includes(key))) {
                    valor = valor*zwhc;
                }
                if (key.indexOf("plus")===0 && !("cq".includes(cmdLc) && key==="plus20")){
                    let [i, j] = key.split("plus")[1].split("").map(v => parseInt(v, 10));
                    if (plus.length===i) plus.push([]);
                    plus[i][j] = valor;
                } else {
                    if (cmd>"Z") {
                        valor += ((i%2===0) ? xa : ya);
                    }
                    punto[key] = valor;
                }
            }
        });
        if (nuevoPunto){
            if (cmd==="-") cmd = "M";
            punto = this.crearPunto(punto.x, punto.y, cmd, plus);
        } else {
            this.modificarLinea(cmd, plus);
            this.moverPunto(num, punto.x, punto.y);
        }
        this.seleccionarPunto(num);
        this.guardar();
    } catch(e) {_msg(e, "aplicarPropiedadesPunto")}
    return punto;
};


tempConstructor.prototype.actuarProp = function(accion=""){
    let num = -1;
    try {
        let numInput = document.getElementById(`${this.nombre}-prop-num`);
        num = parseInt(numInput.value, 10);
        let cmdSelect = document.getElementById(`${this.nombre}-prop-cmd`);
        if (accion==="new"){
            numInput.value = this.listaPuntos.length;
            ["x", "y", "plus00", "plus01", "plus10", "plus11", "plus20"].forEach(key => {
                let prop = document.getElementById(`${this.nombre}-prop-${key}`);
                prop.value = "";
                prop.disabled = true;
            });
            cmdSelect.value = "-";
        } else if (accion==="delete" && num>-1 && num<this.listaPuntos.length){
            if (!this.eliminarPunto(num)) return null;
            if (this.listaPuntos.length>0){
                num = Math.max(0, Math.min(num, this.listaPuntos.length-1));
                this.seleccionarPunto(num);
            }
        } else if (this.listaPuntos.length>0) {
            if (accion==="start"){
                num = 0;
            } else if (accion==="end"){
                num = this.listaPuntos.length-1;
            } else {
                num += (accion==="prev" ? -1 : 1);
                num = Math.max(0, Math.min(num, this.listaPuntos.length-1));
            }
            this.seleccionarPunto(num);
        }

    } catch(e) {_msg(e, "aplicarPropiedadesPunto")}
    return num;
};



tempConstructor.prototype.getNumSel = function(){
    let num = -1;
    try {
        let puntoSel = this.capaPuntos.querySelector(`[class="${this.nombre}-punto"][data-sel]`);
        if (puntoSel) num = parseInt(puntoSel.id.split("-").pop().slice("punto".length), 10);
    } catch(e) {_msg(e, "getPuntoSel")}
    return num;
};



tempConstructor.prototype.volcarPropiedadesPunto = function(num=0) {
    let numPunto = -1;
    try {
        let zwhc = this.zoom*this.whcell;
        if (this.controles) {
            if (num>-1 && num<this.listaPuntos.length) {
                let vals = {num:"", cmd:"", x:"", y:"", plus00:"", plus01:"", plus10:"", plus11:"", plus20:""};
                vals.num = num;
                vals.cmd = this.listaPuntos[num].cmd;
                let cmdLc = vals.cmd.toLowerCase();
                if (["v", "h"].includes(cmdLc)) {
                    vals.cmd = vals.cmd<"a" ? "L" : "l";
                    cmdLc = vals.cmd.toLowerCase();
                }
                document.getElementById(`${this.nombre}-eliminar`).disabled = cmdLc==="m";
                vals.x = this.listaPuntos[num].x;
                vals.y = this.listaPuntos[num].y;
                if (vals.cmd>"Z"){
                    vals.x -= this.listaPuntos[num-1].x;
                    vals.y -= this.listaPuntos[num-1].y;
                }
                vals.x = wxG.redondear((vals.x+this.x0)/zwhc, this.digitos, false);
                vals.y = wxG.redondear((vals.y+this.y0)/zwhc, this.digitos, false);
                this.listaPuntos[num].plus.forEach((v,i) => v.forEach((w,j) => {
                    let val = w;
                    if (vals.cmd.toLowerCase()!=="a" || i===0) {
                        let xy0 = j%2===0 ? this.x0 : this.y0;
                        w = wxG.redondear((w+xy0)/zwhc, this.digitos, false);
                    }
                    vals[`plus${i}${j}`] =  w;
                }));
                Object.keys(vals).forEach(key => {
                    let control = document.getElementById(`${this.nombre}-prop-${key}`);
                    control.value = vals[key];
                    if (key==="cmd") control.setAttribute("data-cmda", vals[key]);
                    if (!["num", "cmd"].includes(key)) {
                        let span = document.getElementById(`${this.nombre}-prop-name-${key}`);
                        let name = namePlus[vals.cmd][key];
                        span.textContent = namePlus[vals.cmd][key];
                        control.disabled = name==="";
                        if (name===""){
                            control.value = "";
                        } else if (control.value===""){
                            control.value = 0;
                        }
                        if (cmdLc==="a" && key.indexOf("plus")===0){
                            if (key==="plus00" || key==="plus01"){
                                control.min = 0;
                                control.max = 10000;
                                control.step = 0.01;
                            } else if (key==="plus10"){
                                control.min = 0;
                                control.max = 360;
                                control.step = 1;
                            } else if (key==="plus11" || key==="plus20"){
                                control.min = 0;
                                control.max = 1;
                                control.step = 1;
                            }
                        } else {
                            control.min = -10000;
                            control.max = 10000;
                            control.step = 0.01;
                        }
                    }
                });
                numPunto = num;
            }
        }
    } catch(e) {_msg(e, "volcarPropiedadesPunto")}
    return numPunto;
};



tempConstructor.prototype.cambiarComando = function(event){
    let cmd = null;
    try {
        let cmd = event.target.value;
        let cmdLc = cmd.toLowerCase();
        let num = parseInt(document.getElementById(`${this.nombre}-prop-num`).value, 10);
        let cmda = event.target.getAttribute("data-cmda");
        let cmdaLc = cmda.toLowerCase();
        ["x", "y", "plus00", "plus01", "plus10", "plus11", "plus20"].forEach((key, i) => {
            let span = document.getElementById(`${this.nombre}-prop-name-${key}`);
            let name = namePlus[cmd][key];
            span.textContent = name;
            let control = document.getElementById(`${this.nombre}-prop-${key}`);
            control.disabled = name==="";
            if (name===""){
                control.value = "";
            } else if (control.value===""){
                control.value = 0;
            }
            if (control.value!==""){
                if (cmdLc==="a" && (key==="plus11" || key==="plus20")){
                    control.min = 0;
                    control.max = 1;
                    control.step = 1;
                } else {
                    control.min =  cmdLc==="a" ? 0 : -10000;
                    control.max = 10000;
                    control.step = 0.01;
                    if (num>0){
                        let valor = parseFloat(control.value);
                        if (this.listaPuntos.length>1 && cmda!==cmd && (cmdLc!=="a" || cmdLc==="a" && ["x","y"].includes(key)) && (cmda<"a" && cmd>"Z"||cmda>"Z" && cmd<"a")){
                            let xy = ((i%2===0) ? this.listaPuntos[num-1].x : this.listaPuntos[num-1].y)/(this.zoom*this.whcell);
                            if (cmda<"a" && cmd>"Z"){
                                valor -= xy;
                            } else if (cmda>"Z" && cmd<"a"){
                                valor += xy;
                            }
                        }
                        control.value = wxG.redondear(valor, this.digitos, false);
                    }
                }
            }
        });
        event.target.setAttribute("data-cmda", cmd);
    } catch(e) {_msg(e, "cambiarComando")}
    return cmd;
};

tempConstructor.prototype.getPunto = function(num=0){
    let punto = null;
    try {
        if (num>-1 && num<this.listaPuntos.length){
            punto = document.getElementById(`${this.nombre}-punto${num}`);
        }
    } catch(e) {_msg(e, "getPunto")}
    return punto;
};


tempConstructor.prototype.getLinea = function(num=0){
    let linea = null;
    try {
        if (num>-1 && num<this.listaPuntos.length){
            linea = document.getElementById(`${this.nombre}-linea${num}`);
        }
    } catch(e) {_msg(e, "getLinea")}
    return linea;
};


tempConstructor.prototype.crearPunto = function(x=0, y=0, cmd="L", plus=[], sobreLinea=false){
    let punto = null;
    try {
        if (this.listaPuntos.length===0) cmd="M";
        let mpm = Math.round(this.medidaPunto/2);
        punto = document.createElement("div");
        punto.className = `${this.nombre}-punto`;
        punto.style.left = `${x-mpm}px`;
        punto.style.top = `${y-mpm}px`;
        let num = -1, insertado = false, xr, yr;
        if (sobreLinea && this.listaPuntos.length>0){
            for (var i=0; i<this.listaPuntos.length-1; i++){
                if (["l", "v", "h"].includes(this.listaPuntos[i+1].cmd.toLowerCase())){
                    let linea = this.getLinea(i);
                    if (linea){
                        let [x1, y1, x2, y2] = this.getPosLin(linea);
                        let box = linea.getBBox();
                        let k = Math.abs(x2-x1) > Math.abs(y2-y1);
                        let p = k ?  (y2-y1)/(x2-x1) : (x2-x1)/(y2-y1);
                        let z = Math.abs(k ? y-(p*(x-x1)+y1) : x-(p*(y-y1)+x1));
                        let condicion = x>box.x-this.medidaPunto && 
                            x<box.x+box.width+this.medidaPunto &&
                            y>box.y-this.medidaPunto &&
                            y<box.y+box.height+this.medidaPunto &&
                            z<this.medidaPunto;
                        if (condicion) {
                            num = i+1;
                            xr = x2;
                            yr = y2;
                            insertado = true;
                            break;
                        }
                    }
                }
            }
        }
        if (insertado){
            //Renumera puntos y líneas ANTES DE INSERTAR nuevo punto
            for (let n=this.listaPuntos.length-1; n>-1; n--){
                let puntoN = this.getPunto(n);
                if (n>=num){
                    puntoN.id = `${this.nombre}-punto${n+1}`;
                    if (this.conNumero) puntoN.textContent = n+1;
                    this.getLinea(n).id = `${this.nombre}-linea${n+1}`;
                    let cmd = this.listaPuntos[n].cmd;
                    let cmdLc = cmd.toLowerCase();
                    this.listaPuntos[n].plus.forEach((v,i) => {
                        if (cmdLc!=="a" || i===0) {
                            let puntoControl = document.getElementById(`${this.nombre}-puntoctrl-${i}-${n}`);
                            puntoControl.id = `${this.nombre}-puntoctrl-${i}-${n+1}`;
                            if (this.conNumero) puntoControl.textContent = n+1;
                            let lineaControl = document.getElementById(`${this.nombre}-lineactrl-${i}-${n}`);
                            lineaControl.id = `${this.nombre}-lineactrl-${i}-${n+1}`;
                            let [xc, yc] = [this.listaPuntos[n].x, this.listaPuntos[n].y];
                            let d = lineaControl.getAttribute("d").replace(/L-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?/, `L${xc} ${yc}`);
                            if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                            lineaControl.setAttribute("d", d);
                            if ("aq".includes(cmdLc)){
                                lineaControl = document.getElementById(`${this.nombre}-lineactrl-${i+1}-${n}`);
                                lineaControl.id = `${this.nombre}-lineactrl-${i+1}-${n+1}`;
                                d = lineaControl.getAttribute("d").replace(/L-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?/, `L${xc} ${yc}`);
                                if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                                lineaControl.setAttribute("d", d);
                            }
                        }
                    });
                }
                let z = this.listaPuntos[n].z;
                if (z===-1) {
                    puntoN.removeAttribute("data-z");
                } else {
                    z = z>=num ? z+1 : z;
                    this.listaPuntos[n].z = z;
                    puntoN.setAttribute("data-z", z);
                }
            }
            this.listaPuntos.splice(num, 0, {x, y, cmd, z:-1, plus});
            let puntoPosterior = this.getPunto(num+1);
            if (!puntoPosterior) {
                throw new Error (`No se encontró el punto posterior ${num+1}`);
            } else {
                punto = this.capaPuntos.insertBefore(punto, puntoPosterior);
            }
        } else {
            this.listaPuntos.push({x, y, cmd, z:-1, plus});
            num = this.listaPuntos.length-1;
            punto = this.capaPuntos.appendChild(punto);
        }
        punto.id = `${this.nombre}-punto${num}`;
        if (this.conNumero) punto.textContent = num;
        let [a, b] = insertado ? [xr, yr] : [x, y];
        this.crearLinea(num, x, y, a, b, insertado);
        this.moverPunto(num, x, y);
        this.crearPuntoControl(num);
        this.marcarUltimoPunto();
        this.guardar();
    } catch(e) {_msg(e, "crearPunto")}
    return punto;
};

tempConstructor.prototype.crearPuntoControl = function(num){
    let punto = null;
    try {
        punto = this.listaPuntos[num];
        let cmd = punto.cmd;
        let cmdLc = cmd.toLowerCase();
        if (!"mlvh".includes(cmdLc)) {
            let puntoAnterior = this.listaPuntos[num-1];
            let mpm = Math.round(this.medidaPunto/2);
            let pcs = cmdLc==="a" ? [punto.plus[0]] : punto.plus;
            for (let i=0; i<pcs.length; i++) {
                let puntoControl = document.createElement("div");
                puntoControl.id = `${this.nombre}-puntoctrl-${i}-${num}`;
                puntoControl.className = `${this.nombre}-puntoctrl`;
                if (this.conNumero) puntoControl.textContent = `${num}`;
                let xc = pcs[i][0];
                let yc = pcs[i][1];
                if (cmd>"Z" && cmdLc!=="a"){
                    xc += puntoAnterior.x;
                    yc += puntoAnterior.y;
                }
                puntoControl.style.left = `${xc-mpm}px`;
                puntoControl.style.top = `${yc-mpm}px`;
                this.capaPuntos.appendChild(puntoControl);
                let lineaControl = document.createElementNS("http://www.w3.org/2000/svg", "path");
                lineaControl.id = `${this.nombre}-lineactrl-${i}-${num}`;
                lineaControl.setAttribute("class", `${this.nombre}-lineactrl`);
                let [x2, y2] = i===0 ? [puntoAnterior.x, puntoAnterior.y] : [punto.x, punto.y];
                let d = `M${xc} ${yc}L${x2} ${y2}`;
                if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                lineaControl.setAttribute("d", d);
                this.capaSvg.appendChild(lineaControl);
                if ("aq".includes(cmdLc)){
                    lineaControl = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    lineaControl.id = `${this.nombre}-lineactrl-${i+1}-${num}`;
                    lineaControl.setAttribute("class", `${this.nombre}-lineactrl`);
                    let [x2, y2] = [punto.x, punto.y];
                    let d = `M${xc} ${yc}L${x2} ${y2}`;
                    if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                    lineaControl.setAttribute("d", d);
                    this.capaSvg.appendChild(lineaControl);
                }
            }
        }
    } catch(e) {_msg(e, "crearPuntoControl")}
    return punto;
};

tempConstructor.prototype.marcarUltimoPunto = function(){
    let punto = null;
    try {
        this.listaPuntos.forEach((v, i) => {
            let puntoi = this.getPunto(i);
            if (!puntoi) {
                throw new Error(`No se encontró el punto ${i} al remover atributo "data-end"`);
            } else {
/*                console.log(puntoi)*/
                puntoi.removeAttribute("data-end");
            }
        });
        if (this.listaPuntos.length>0) {
            let num = this.listaPuntos.length-1;
            let punto = this.getPunto(num);
            if (!punto){
                throw new Error(`No se encontró el punto ${num} para poner atributo "data-end"`);
            } else {
                punto.setAttribute("data-end", num);
                pnum=num+1
                var i 
                for (i = 0; i < pnum; i++) {
                    if($('#sel-punto'+i+'').length == 0) {
                        $('.coorde').append('<div class="col-md-4" id="sel-punto'+i+'"><div class="form-group"><label class="bmd-label-floating"><span class="puntos">'+i+'</span></label><input type="text" class="form-control" value="X:"><input type="text" class="form-control" value="Y:"></div></div>')
                    }
                }

/*                
*//*                console.log(num+1)
                puntoeli = document.getElementById('sel-punto'+num);
                console.log(puntoeli)*/
            }
        }
    } catch(e) {_msg(e, "marcarUltimoPunto")}
    return punto;
};


tempConstructor.prototype.eliminarPunto = function(num=0) {
    let punto = null;
    try {
        if (this.listaPuntos.length>0){
            if (num===-1) num = this.getNumSel();
            if (num===-1) num = 0;
            let cmd = this.listaPuntos[num].cmd;
            let cmdLc = cmd.toLowerCase();
            let camino = this.obtenerCamino(num);
            if (camino) {
                if (camino[2]) this.abrirCamino(camino[1], camino[2], camino);
                for (let n=0; n<this.listaPuntos.length; n++) {
                    let puntoN = this.getPunto(n);
                    if (!puntoN) throw new Error("No se pudo obtener punto al eliminar");
                    if (n>=num) {
                        let cmd = this.listaPuntos[n].cmd;
                        let cmdLc = cmd.toLowerCase();
                        let [xc, yc] = [this.listaPuntos[n].x, this.listaPuntos[n].y];
                        if (n>num) {
                            puntoN.id = `${this.nombre}-punto${n-1}`;
                            if (this.conNumero) puntoN.textContent = n-1;
                            let linea = this.getLinea(n);
                            if (!linea) throw new Error("No se pudo obtener línea al eliminar");
                            linea.id = `${this.nombre}-linea${n-1}`;
                        }
                        this.listaPuntos[n].plus.forEach((v,i) => {
                            if (cmdLc!=="a" || i===0) {
                                let puntoControl = document.getElementById(`${this.nombre}-puntoctrl-${i}-${n}`);
                                if (!puntoControl) throw new Error("No se pudo obtener punto control al eliminar");
                                if (n===num || n===camino[0]+1){
                                    puntoControl.parentElement.removeChild(puntoControl);
                                } else {
                                    puntoControl.id = `${this.nombre}-puntoctrl-${i}-${n-1}`;
                                    if (this.conNumero) puntoControl.textContent = n-1;
                                }
                                let lineaControl = document.getElementById(`${this.nombre}-lineactrl-${i}-${n}`);
                                if (!lineaControl) throw new Error("No se pudo obtener línea control (1) al eliminar");
                                if (n===num || n===camino[0]+1){
                                    lineaControl.parentElement.removeChild(lineaControl);
                                } else {
                                    lineaControl.id = `${this.nombre}-lineactrl-${i}-${n-1}`;
                                    let d = lineaControl.getAttribute("d").replace(/L-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?/, `L${xc} ${yc}`);
                                    if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                                    lineaControl.setAttribute("d", d);
                                }
                                if ("aq".includes(cmdLc)){
                                    lineaControl = document.getElementById(`${this.nombre}-lineactrl-${i+1}-${n}`);
                                    if (!lineaControl) throw new Error("No se pudo obtener línea control (2) al eliminar");
                                    if (n===num || n===camino[0]+1){
                                        lineaControl.parentElement.removeChild(lineaControl);
                                    } else {
                                        lineaControl.id = `${this.nombre}-lineactrl-${i+1}-${n-1}`;
                                        let d = lineaControl.getAttribute("d").replace(/L-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?/, `L${xc} ${yc}`);
                                        if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                                        lineaControl.setAttribute("d", d);
                                    }
                                }
                            }
                        });
                    }
                    let z = this.listaPuntos[n].z;
                    if (z===-1) {
                        puntoN.removeAttribute("data-z");
                    } else {
                        z = z>num ? z-1 : z;
                        this.listaPuntos[n].z = z;
                        puntoN.setAttribute("data-z", z);
                    }
                }
                let punto = this.getPunto(num);
                punto.parentElement.removeChild(punto);
                if (num===camino[0] || num===camino[1]){
                    let linea = this.getLinea(num);
                    if (!linea) throw new Error("No se pudo obtener línea (2) al eliminar");
                    linea.parentElement.removeChild(linea);
                    if (num===camino[1] && this.listaPuntos.length>1){
                        let puntoAnterior = this.listaPuntos[num-1];
                        if (puntoAnterior) {
                            linea = this.getLinea(num-1);
                            if (linea) linea.setAttribute("d", `M${puntoAnterior.x} ${puntoAnterior.y}L${puntoAnterior.x} ${puntoAnterior.y}`);
                        }
                    }
                } else if (num>0 && num-1>=camino[0] && num-1<=camino[1]){
                    let linea = this.getLinea(num-1);
                    if (!linea) throw new Error("No se pudo obtener línea (3) al eliminar");
                    linea.parentElement.removeChild(linea);
                    linea = this.getLinea(num);
                    linea.id = `${this.nombre}-linea${num-1}`;
                    let [x1, y1] = [this.listaPuntos[num-1].x, this.listaPuntos[num-1].y];
                    let [x2, y2] = [x1, y1];
                    if (num<this.listaPuntos.length-1) [this.listaPuntos[num+1].x, this.listaPuntos[num].y+1];
                    this.setPosLin(linea, x1, y1, x2, y2);
                }
                this.listaPuntos.splice(num, 1);
                if (num===camino[0] && num<camino[1] && this.listaPuntos[num].cmd.toLowerCase()!=="m"){
                    this.listaPuntos[num].cmd = "M";
                    this.listaPuntos[num].plus = [];
                }
                this.reubicarLineas(num);
                this.marcarUltimoPunto();
            }
        }
        this.activarMoverPuntos(this.moverPuntosActivado);
        
         puntoeli = document.getElementById('sel-punto'+pnum);
         puntoeli.parentNode.removeChild(puntoeli)

        this.guardar();
    } catch(e) {_msg(e, "eliminarPunto")}
    return punto;
};


tempConstructor.prototype.setPosLin = function(linea=null, x1=null, y1=null, x2=null, y2=null, plus=null){
    let lineaReturn = null;
    try {
        if (linea!==null){
            let d = linea.getAttribute("d");
            if (!(typeof d === "string" && /^[mlvhacqstz\d\s,.+-]+$/i.test(d))) {
                new Error (`El atributo "d" no es un String o no contiene lo esperado`);
            } else {
                let cmds = d.replace(/[.\d-]+/g, " ").trim().split(/\s+/);
                let arr = d.trim().split(/[a-z]/i).splice(1).map(v => v.trim().split(/\s+/).map(w => parseFloat(w)));
                if (x1!==null) arr[0][arr[0].length-2] = x1;
                let xx1 = arr[0][arr[0].length-2];
                if (y1!==null) arr[0][arr[0].length-1] = y1;
                let yy1 = arr[0][arr[0].length-1];
                if (x2!==null) arr[1][arr[1].length-2] = cmds[1]<"a" ? x2 : x2-xx1;
                if (y2!==null) arr[1][arr[1].length-1] = cmds[1]<"a" ? y2 : y2-yy1;
                if (plus!==null){
                    arr[1][0] = plus[0][0];
                    arr[1][1] = plus[0][1];
                    if (plus.length>1){
                        arr[1][2] = plus[1][0];
                        arr[1][3] = plus[1][1];
                    }
                    if (plus.length>2) arr[1][4] = plus[2][0];
                } 
                d = `${cmds[0]} ${arr[0].map(v => wxG.redondear(v, this.digitos, false)).join(" ")} ` +
                `${cmds[1]} ${arr[1].map(v => wxG.redondear(v, this.digitos, false)).join(" ")}`;
                if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                linea.setAttribute("d", d);
                lineaReturn = linea;
            }
        }
    } catch(e) {_msg(e, "setPosLin")}
    return lineaReturn;
};

tempConstructor.prototype.getPosLin = function(linea=null){
    let pos = [0, 0, 0, 0];
    try {
        if (linea!==null){
            let d = linea.getAttribute("d");
            if (!(typeof d === "string" && /^[mlvhacqstz\d\s,.+-]+$/i.test(d))) {
                new Error (`El atributo "d" no es un String o no contiene lo esperado`);
            } else {
                let arr = d.trim().split(/[a-z]/i).splice(1).map(v => v.trim().split(/\s+/).map(w => parseFloat(w)));
                let y1 = arr[0].pop();
                let x1 = arr[0].pop();
                let y2 = arr[1].pop();
                let x2 = arr[1].pop();
                pos = [x1, y1, x2, y2];
            }
        }
    } catch(e) {_msg(e, "getPosLin")}
    return pos;
};

tempConstructor.prototype.moverPunto = function(num, x, y){
    let punto = null;
    try {
        let mpm = Math.round(this.medidaPunto/2);
        punto = this.getPunto(num);
        if (punto) {
            let xp = x-mpm;
            let yp = y-mpm;
            this.listaPuntos[num].x = x;
            this.listaPuntos[num].y = y;
            punto.style.left = xp + "px";
            punto.style.top = yp + "px";
            let z = this.listaPuntos[num].z;
            let linea = this.getLinea(num);
            let [x2, y2] = num<this.listaPuntos.length-1 && z===-1 ? [this.listaPuntos[num+1].x, this.listaPuntos[num+1].y] : [null, null];
            this.setPosLin(linea, x, y, x2, y2);
            if (z===-1 && (num===this.listaPuntos.length-1 || num<this.listaPuntos.length-1 && this.listaPuntos[num+1].z > -1 && this.listaPuntos[num+1].z > num+1)){
                this.setPosLin(linea, null, null, x, y);
            }
            if (num>0) {
                let lineaAnterior = this.getLinea(num-1);
                if (z<=num && (this.listaPuntos[num-1].z===-1 || this.listaPuntos[num-1].z > num-1)) {
                    this.setPosLin(lineaAnterior, null, null, x, y);
                }
            }
            if (z>-1 && z>=num){
                let lineaz = this.getLinea(z);
                this.setPosLin(lineaz, null, null, x, y);
            }
            for (let i=num; i<this.listaPuntos.length; i++){
                let cmd = this.listaPuntos[i].cmd;
                if (i>0 && "vhl".includes(cmd.toLowerCase())) {
                    let x1 = this.listaPuntos[i-1].x;
                    let y1 = this.listaPuntos[i-1].y;
                    let x2 = this.listaPuntos[i].x;
                    let y2 = this.listaPuntos[i].y;
                    if ("VvHh".includes(cmd) && x1!==x2 && y1!==y2){
                        this.listaPuntos[i].cmd = "VH".includes(cmd) ? "L" : "l";
                    } else if ("Ll".includes(cmd) && x1===x2){
                        this.listaPuntos[i].cmd = "L".includes(cmd) ? "V" : "v";
                    } else if ("Ll".includes(cmd) && y1===y2){
                        this.listaPuntos[i].cmd = "L".includes(cmd) ? "H" : "h";
                    }
                }
            }

            let cmd = this.listaPuntos[num].cmd;
            let cmdLc = cmd.toLowerCase();
            let id, lineaControl;
            if (num<this.listaPuntos.length-1) {
                id = `${this.nombre}-lineactrl-${0}-${num+1}`;
                lineaControl = document.getElementById(id);
                this.setPosLin(lineaControl, null, null, this.listaPuntos[num].x, this.listaPuntos[num].y);
            }
            id = `${this.nombre}-lineactrl-${1}-${num}`;
            lineaControl = document.getElementById(id);
            this.setPosLin(lineaControl, null, null, this.listaPuntos[num].x, this.listaPuntos[num].y);
            this.guardar();
        }
    } catch(e) {_msg(e, "moverPunto")}
    return punto;
};


tempConstructor.prototype.moverPuntoControl = function(num, numCtrl, x, y){
    let puntoControl = null;
    try {
        let mpm = Math.round(this.medidaPunto/2);
        let punto = this.listaPuntos[num];
        if (punto.cmd<"a" || punto.cmd.toLowerCase()==="a"){
            punto.plus[numCtrl] = [x, y];
        } else {
            punto.plus[numCtrl] = [x-this.listaPuntos[num-1].x, y-this.listaPuntos[num-1].y];
        }
        puntoControl = document.getElementById(`${this.nombre}-puntoctrl-${numCtrl}-${num}`);
        puntoControl.style.left = `${x-mpm}px`;
        puntoControl.style.top = `${y-mpm}px`;
        let lineaControl = document.getElementById(`${this.nombre}-lineactrl-${numCtrl}-${num}`);
        this.setPosLin(lineaControl, x, y);
        if ("aq".includes(punto.cmd.toLowerCase())) {
            lineaControl = document.getElementById(`${this.nombre}-lineactrl-${numCtrl+1}-${num}`);
            this.setPosLin(lineaControl, x, y);
        }
        this.setPosLin(this.getLinea(num-1), null, null, null, null, punto.plus);
        this.guardar();
    } catch(e) {_msg(e, "moverPuntoControl")}
    return puntoControl;
};

tempConstructor.prototype.crearLinea = function(num=0, x1=0, y1=0, x2=0, y2=0, insertado=false){
    let linea = null;
    try {
        linea = document.createElementNS("http://www.w3.org/2000/svg", "path");
        linea.id = `${this.nombre}-linea${num}`;
        linea.setAttribute("class", `${this.nombre}-linea`);
        this.setPosLin(linea, x1, y1, x2, y2);
        let d = `M ${wxG.redondear(x1, this.digitos, false)} ${wxG.redondear(y1, this.digitos, false)} L `+
        `${wxG.redondear(x2, this.digitos, false)} ${wxG.redondear(y2, this.digitos, false)}`;
        if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
        linea.setAttribute("d", d);
        if (insertado){
            let lineaPosterior = this.getLinea(num+1);
            this.capaSvg.insertBefore(linea, lineaPosterior);
        } else {
            linea = this.capaSvg.appendChild(linea);
        }
        if (num>0){
            let cmd =  this.listaPuntos[num].cmd;
            let cmdLc = cmd.toLowerCase();
            if ("acsqt".includes(cmdLc)){
                let plus = this.listaPuntos[num].plus.map((v,i) => v.
                map(w => cmdLc!=="a"||i===0 ? wxG.redondear(w,this.digitos,false) : w ).
                join(" ")).join(" ");
                let [x1, y1, x2, y2] = [this.listaPuntos[num-1].x, this.listaPuntos[num-1].y, this.listaPuntos[num].x, this.listaPuntos[num].y];
                if (cmd>"Z"){
                    x2 = x2-x1;
                    y2 = y2-y1;
                }
                //Hay que quitar "sS" y "tT" que omiten el primer punto de control pues es una reflexión del segundo de la curva anterior.
                //Convertimos "sS" a "cC" y "tT" a "qQ". Al exportar() se puede reconvertir para reducir tamaño del atributo
                let cmda = this.listaPuntos[num-1].cmd;
                if ("sStT".includes(cmd) && "cCqQ".includes(cmda)){
                    cmd = cmd==="s" ? "c" : cmd==="S" ? "C" : cmd==="t" ? "q" : "Q";
                    let i = "cs".includes(cmdLc) ? 1 : 0;
                    let xp = this.listaPuntos[num-1].plus[i][0];
                    let yp = this.listaPuntos[num-1].plus[i][1];
                    let xf = this.listaPuntos[num-1].x;
                    let yf = this.listaPuntos[num-1].y;
                    if ("cq".includes(cmda)){
                        xf = xf-this.listaPuntos[num-2].x;
                        yf = yf-this.listaPuntos[num-2].y;
                    }
                    let r = Math.sqrt(Math.pow(xp-xf, 2) + Math.pow(yp-yf, 2));
                    let a = Math.atan2(yp-yf, xp-xf) + Math.PI;
                    let xr = r*Math.cos(a);
                    let yr = r*Math.sin(a);
                    if ("CQ".includes(cmd)){
                        xr += this.listaPuntos[num-1].x;
                        yr += this.listaPuntos[num-1].y;
                    }
                    this.listaPuntos[num].plus.unshift([xr, yr]);
                    this.listaPuntos[num].cmd = cmd;
                    plus = `${wxG.redondear(xr, this.digitos, false)} ${wxG.redondear(yr, this.digitos, false)} ${plus}`;
                }
                d = `M ${wxG.redondear(x1, this.digitos, false)} ${wxG.redondear(y1, this.digitos, false)} ${cmd} ${plus} `+
                `${wxG.redondear(x2, this.digitos, false)} ${wxG.redondear(y2, this.digitos, false)}`;
                if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                this.getLinea(num-1).setAttribute("d", d);
            }
        }
    } catch(e){_msg(e, "crearLinea")}
    return linea;
};




tempConstructor.prototype.reubicarLineas = function(num){
    let punto = null;
    try {
        if (num>0) punto = this.moverPunto(num-1, this.listaPuntos[num-1].x, this.listaPuntos[num-1].y);
        if (num<this.listaPuntos.length) punto = this.moverPunto(num, this.listaPuntos[num].x, this.listaPuntos[num].y);
        if (num<this.listaPuntos.length-1) punto = this.moverPunto(num+1, this.listaPuntos[num+1].x, this.listaPuntos[num+1].y);
    } catch(e) {_msg(e, "reubicarLineas")}
    return punto;
};


tempConstructor.prototype.construirCaminos = function(){
    let caminos = [];
    try {
        let i = 0, ii = 0, totalCaminos= -1;
        while (totalCaminos++, totalCaminos<=this.listaPuntos.length && i<this.listaPuntos.length) {
            let z = this.listaPuntos[i].z;
            if (z>-1){
                if (z===i) {
                    caminos.push([ii, z, false]);
                } else {
                    if (i>0 && this.listaPuntos[ii].z===-1) {
                        caminos.push([ii, i-1, false]);
                    }
                    caminos.push([i, z, true]);
                }
                i = z+1;
                ii = i;
            } else {
                i++;
            }
        }
        if (ii<this.listaPuntos.length) caminos.push([ii, i-1, false]);
        if (totalCaminos>this.listaPuntos.length) {
            throw new Error ("Se alcanzó un bucle máximo no esperado");
        } else {
            //Reconstruye "M"
            for (let camino of caminos){
                let num1 = camino[0];
                let cmd = this.listaPuntos[num1].cmd;
                if (!"Mm".includes(cmd)) this.listaPuntos[num1].cmd = "M";
                for (let j=num1+1; j<=camino[1]; j++){
                    let cmdj = this.listaPuntos[j].cmd;
                    if ("Mm".includes(cmdj))  this.listaPuntos[j].cmd = "L";
                }
            }
        }
        
    } catch(e){_msg(e, "construirCaminos")}
    return caminos;
};



tempConstructor.prototype.obtenerCamino = function(...args){
    let camino = null;
    try {
        let filtrados =  this.construirCaminos().filter(v => args.every(n => n>=v[0] && n<=v[1]));
        if (filtrados.length===1) camino = filtrados[0];
    } catch(e){_msg(e, "obtenerCamino")}
    return camino;
};

//cierra el último camino
tempConstructor.prototype.finalizarPoligono = function(){
    let camino = null;
    try {
        let caminos = this.construirCaminos();
        if (caminos.length>0) {
            camino = caminos[caminos.length-1];
            if (!camino[2]){
                camino = this.cerrarCamino(camino[0], camino[1]);
            } else {
                camino = this.abrirCamino(camino[0], camino[1]);
            }
            this.guardar();
        }
    } catch(e) {_msg(e, "finalizarPoligono")}
    return camino;
};


tempConstructor.prototype.puntoFinalPoligono = function(){
    let punto = null;
    try {
        let caminos = this.construirCaminos();
        if (caminos.length>0) {
            let camino =  caminos[caminos.length-1];
            if (camino[2]){
                punto = [this.listaPuntos[camino[0]].x, this.listaPuntos[camino[0]].y];
            } else {
                punto = [this.listaPuntos[camino[1]].x, this.listaPuntos[camino[1]].y];
            }
        }
    } catch(e) {_msg(e, "puntoFinalPoligono")}
    return punto;
};


//Para ver si un polígono está cerrado.
tempConstructor.prototype.poligonoCerrado = function(){
    var cerrado = false;
    if (this.soportaSvg && (this.listaPuntos.length>1)) {
        var linea = document.getElementById(this.nombre + "-linea" + (this.listaPuntos.length-1));
        cerrado = (linea.getAttribute("x1") != linea.getAttribute("x2") || linea.getAttribute("y1") != linea.getAttribute("y2"));
    }
    return cerrado;
};



tempConstructor.prototype.cerrarCamino = function(num1=0, num2=0, camino=null) {
    try {
        camino = camino===null ? this.obtenerCamino(num1, num2) : camino;
        if (camino && !camino[2]) {
            this.listaPuntos[num2].z = num1;
            this.listaPuntos[num1].z = num2;
            this.getPunto(num1).setAttribute("data-z", num2);
            this.getPunto(num2).setAttribute("data-z", num1);
            if (num1>0 && this.listaPuntos[num1-1].z===-1){
                this.listaPuntos[num1-1].z = num1-1;
                this.getPunto(num1-1).setAttribute("data-z", num1-1);
            }
            this.reubicarLineas(num1);
            this.reubicarLineas(num2);
            this.marcarUltimoPunto();
            this.guardar();
        }
    } catch(e){_msg(e, "cerrarCamino")}
    return camino;
};


tempConstructor.prototype.abrirCamino = function(num1=0, num2=0, camino=null) {
    try {
        camino = camino===null ? this.obtenerCamino(num1, num2) : camino;
        if (camino && camino[2]) {
            let [num1, num2] = [camino[0], camino[1]];
            this.listaPuntos[num1].z = -1;
            this.listaPuntos[num2].z = -1;
            this.getPunto(num1).removeAttribute("data-z");
            this.getPunto(num2).removeAttribute("data-z");
            if (num2<this.listaPuntos.length-1 && this.listaPuntos[num2+1].cmd==="M"){
                this.listaPuntos[num2+1].cmd = "L";
            }
            this.reubicarLineas(num1);
            this.reubicarLineas(num2);
            this.marcarUltimoPunto();
            this.guardar();
        }
    } catch(e){_msg(e, "abrirCamino")}
    return camino;
};



tempConstructor.prototype.borrarCamino = function(num=-1) {
    let camino = null;
    try {
        if (num===-1) num = this.getNumSel();
        camino = this.obtenerCamino(num);
        if (camino) {
            let [num1, num2] = [camino[0], camino[1]];
            let longi = num2-num1+1;
            let datos = [];
            this.listaPuntos.forEach((v,i) => {
                if (i<num1 || i>num2){
                    let obj = {};
                    Object.keys(v).forEach(key => {
                        if (key==="plus"){
                            obj.plus = v.plus.map(w => [...w]);
                        } else if (i>num2 && key==="z") {
                            obj.z = Math.max(v.z-longi, -1);
                        } else {
                            obj[key] = v[key];
                        }
                    });
                    datos.push(obj);
                }
            });
            this.borrarPuntos(false);
            this.saveBak = false;
            this.importar({tipo: "object", datos, zoom: this.zoom, whcell: this.whcell});
            this.saveBak = true;
            this.guardar();
        }
        this.marcarUltimoPunto();
    } catch(e){_msg(e, "borrarCamino")}
    return camino;
};




tempConstructor.prototype.cortarUnirCamino = function(num=-1){
    let camino = null;
    try {
        if (num===-1) num = this.getNumSel();
        camino = this.obtenerCamino(num);
        if (camino) {
            if (camino[1]===num && camino[1]>camino[0] && camino[1]-camino[0]>1){
                if (camino[2]) {
                    this.abrirCamino(camino[0], camino[1], camino);
                } else {
                    this.cerrarCamino(camino[0], camino[1], camino);
                }
            } else if (num<this.listaPuntos.length-1){
                if (this.listaPuntos[num].z===-1) {
                    camino = this.cortarCamino(num);
                } else if (this.listaPuntos[num].z===num) {
                    camino = this.unirCamino(num);
                }
            }
        }
    } catch(e) {_msg(e, "cortarUnirCamino")}
    return camino;
};


tempConstructor.prototype.cortarCamino = function(num=0){
    let camino = null;
    try {
        camino = this.obtenerCamino(num);
        if (camino){
            let [num1, num2, cerrado] = camino;
            if (cerrado){
                this.listaPuntos[num1].z = -1;
                this.listaPuntos[num2].z = -1;
                this.getPunto(num1).removeAttribute("data-z");
                this.getPunto(num2).removeAttribute("data-z");
                this.moverPunto(num1, this.listaPuntos[num1].x, this.listaPuntos[num1].y);
                this.moverPunto(num2, this.listaPuntos[num2].x, this.listaPuntos[num2].y);
            }
            this.listaPuntos[num].z = num;
            this.getPunto(num).setAttribute("data-z", num);
            let [x, y] = [this.listaPuntos[num].x, this.listaPuntos[num].y];
            let numSgte = num + 1;
            let cmdSgte = this.listaPuntos[numSgte].cmd.toLowerCase();
            if ("acq".includes(cmdSgte)) {
                let linea = this.getLinea(num);
                linea.setAttribute("d", `M${x} ${y}L${x} ${y}`);
                this.listaPuntos[numSgte].plus.forEach((v, k) => {
                    if (cmdSgte!=="a" || k===0){
                        let puntoControl = document.getElementById(`${this.nombre}-puntoctrl-${k}-${numSgte}`);
                        if (puntoControl) puntoControl.parentElement.removeChild(puntoControl);
                        let lineaControl = document.getElementById(`${this.nombre}-lineactrl-${k}-${numSgte}`);
                        if (lineaControl) lineaControl.parentElement.removeChild(lineaControl);
                        if ("aq".includes(cmdSgte)) {
                            lineaControl = document.getElementById(`${this.nombre}-lineactrl-${k+1}-${numSgte}`);
                            if (lineaControl) lineaControl.parentElement.removeChild(lineaControl);
                        }
                    }
                });
                this.listaPuntos[numSgte].plus = [];
            }
            this.listaPuntos[numSgte].cmd ="M";
            this.moverPunto(num, x, y);
            this.guardar();
        }
    } catch(e) {_msg(e, "cortarCamino")}
    return camino;
};


tempConstructor.prototype.unirCamino = function(num=0){
    let camino = null;
    try {
        camino = this.obtenerCamino(num);
        if (camino){
            let [num1, num2, cerrado] = camino;
            if (cerrado && (num===num1 || num===num2)){
                this.listaPuntos[num1].z = -1;
                this.listaPuntos[num2].z = -1;
                this.getPunto(num1).removeAttribute("data-z");
                this.getPunto(num2).removeAttribute("data-z");
                this.moverPunto(num1, this.listaPuntos[num1].x, this.listaPuntos[num1].y);
                this.moverPunto(num2, this.listaPuntos[num2].x, this.listaPuntos[num2].y);
                if (num1>0) {
                    this.moverPunto(num1-1, this.listaPuntos[num1-1].x, this.listaPuntos[num1-1].y);
                }
                if (num2<this.listaPuntos.length-1) {
                    this.moverPunto(num2+1, this.listaPuntos[num2+1].x, this.listaPuntos[num2+1].y);
                }
            } else if (!cerrado && num2===num && this.listaPuntos[num].z>-1 && this.listaPuntos[num].z===num && num<this.listaPuntos.length-1 && !this.obtenerCamino(num+1)[2]){
                this.listaPuntos[num].z = -1;
                this.getPunto(num).removeAttribute("data-z");
                this.moverPunto(num, this.listaPuntos[num].x, this.listaPuntos[num].y);
                if (num<this.listaPuntos.length-1) {
                    this.moverPunto(num+1, this.listaPuntos[num+1].x, this.listaPuntos[num+1].y);
                    let cmd = this.listaPuntos[num+1].cmd;
                    let cmdLc = cmd.toLowerCase();
                    if (cmdLc==="m"){
                        this.listaPuntos[num+1].cmd = cmd==="M" ? "L" : "l";
                    }
                }
            }
            this.guardar();
        }
    } catch(e) {_msg(e, "unirCamino")}
    return camino;
};


tempConstructor.prototype.importar = function({tipo="path", datos=null, zoom=1, whcell=1, x0=0, y0=0, tx=0, ty=0, sx=1, sy=1, a=0, xm=0, ym=0}={}){
    let listaPuntos = null;
    try {
        this.zoom = zoom;
        this.whcell = whcell;
        let zwhc = this.zoom*this.whcell;
        this.x0 = x0*zwhc;
        this.y0 = y0*zwhc;
        if (tipo === "array"){
            for (let i=0; i<datos.length; i++) {
                let punto = datos[i];
                let x = punto[0]*zwhc-this.x0;
                let y = punto[1]*zwhc-this.y0;
                let z = typeof punto[2] === "number" ? punto[2] : undefined;
                let cmd = typeof punto[3] === "string" ? punto[3] : undefined;
                let plus = typeof punto[4] === "undefined" ? [] : 
                punto[4].map((v,j) => {
                    if (cmd.toLowerCase()==="a" && j>0){
                        return [...v];
                    } else  if (cmd<"a" && cmd!=="A"){
                        return [v[0]*zwhc-this.x0, v[1]*zwhc-this.y0];
                    } else {
                        return [v[0]*zwhc, v[1]*zwhc];
                    }
                });
                this.crearPunto(x, y, cmd, plus);
                if (typeof z === "number" && i>z){
                    this.cerrarCamino(z, i);
                }
            }
        } else if (tipo === "object") {
            let zetas = [];
            for (let i=0; i<datos.length; i++) {
                let punto = datos[i];
                zetas.push(punto.z);
                this.crearPunto(punto.x, punto.y, punto.cmd, punto.plus);
            }
            for (let i=0; i<this.listaPuntos.length; i++){ 
                let punto = this.listaPuntos[i];
                let z = zetas[i];
                if (z>-1) {
                    if (z<i || z===i) this.cortarUnirCamino(i);
                    if (z<i) {
                        if (i===this.listaPuntos.length-1) {
                            this.cerrarCamino(i, z);
                        } else {
                            this.cortarUnirCamino(i);
                        }
                    }
                }
            }
        } else if (tipo === "path") {
            this.borrarPuntos();
            datos = datos.replace(/,/g, " ").
            replace(/([a-z+-])\.(\d)/gi, "$1" + "0.$2").
            replace(/(\d)(-)(\d)/g, "$1 $2$3").
            replace(/([ACHLMQSTVZ])/gi, " $1 ").
            replace(/\s*z\s*/gi, " z 0 ").
            replace(/(\d+)-(\d+)/g, "$1 -$2").
            replace(/(\s+[-]?)\.(\d+)/g, "$1" + "0.$2");
            let temp = "";
            while (datos!==temp){
                temp = datos;
                datos = datos.replace(/(\s+[-]?\d+\.\d+)\.(\d+)/g, "$1 0.$2");
            }
            let reg = /\s+([ACHLMQSTVZ])((?:\s+[+-]?\d+(?:\.\d+)*)+)/gi;
            let bus = [], coin;
            while ((coin = reg.exec(datos)) !== null) {
                let com = coin[1].toLowerCase();
                coin[2] = coin[2].trim().split(/\s+/).map(v => parseFloat(v));
                let gap = com==="a" ? 7 : com==="c" ? 6 :  "qs".includes(com) ? 4 : "vh".includes(com) ? 1 : 2;
                let offset = "vh".includes(com) ? 1 : 2;
                let items = [...coin[2]].map(v => v);
                coin[2] = [];
                coin[3] = [];
                let n=-1, maxLoop = 10000;
                while (n++, n<maxLoop && items.length>0){
                    coin[3].push(items.splice(0, gap-offset));
                    coin[2].push(items.splice(0, offset));
                }
                if (n===maxLoop){
                    throw new Error (`Se alcanzó un final de bucle y no se pudo completar la importación`);
                    bus = null;
                    break;
                }
                bus[bus.length] = coin;
            }
            if (bus){
                let [mx, my] = [0, 0];
                let [xa, ya] = [0, 0];
                bus.forEach(vbus => {
                    let cmd = vbus[1];
                    let cmdLc = cmd.toLowerCase();
                    if (cmdLc==="z") {
                        //Busca el último punto M (mx,my) y el punto anterior (xa,ya) para cerrar el camino
                        let num1 = this.buscarNumPunto({x: mx-this.x0, y: my-this.y0, ctrl:false, offset: 0.001});
                        let num2 = this.buscarNumPunto({x: xa-this.x0, y: ya-this.y0, omitir: num1, ctrl: false, offset: 0.001});
                        if (num1>-1 && num2>-1){
                            this.cerrarCamino(num1, num2);
                            [xa, ya] = [mx, my];
                        }
                    } else {
                        let values = vbus[2];
                        for (let i=0; i<values.length; i++) {
                            let [x, y] = [0, 0];
                            let p = values[i][0]*zwhc;
                            let q = values[i].length>1 ? values[i][1]*zwhc : 0;
                            if ("mlacqst".includes(cmdLc)){
                                x = p + ("mlacqst".includes(cmd) ? xa : 0);
                                y = q + ("mlacqst".includes(cmd) ? ya : 0);
                            } else if (cmdLc==="h"){
                                x = p + (cmd==="h" ? xa : 0);
                                y = ya;
                            } else if (cmdLc==="v"){
                                x = xa;
                                y = p + (cmd==="v" ? ya : 0);
                            } else { //no esperado
                                x = 0;
                                y = 0;
                            }
                            [xa, ya] = [x, y];
                            if (cmdLc==="m") [mx, my] = [x, y];
                            let plus = [];
                            let longi = vbus[3][i].length;
                            if (longi>0){
                                vbus[3][i].forEach((v,j,a) => {
                                    let zm = cmdLc==="a" && j>1 ? 1 : 1/zwhc;
                                    let xp = a[j-1]/zm;
                                    let yp = v/zm;
                                    if (cmd<"a" && cmd!=="A"){// || cmd==="A" && j<2){
                                        xp -= this.x0;
                                        yp -= this.y0;
                                    }
                                    if (j%2>0) plus.push([xp, yp]);
                                });
                                let zm = cmdLc==="a" ? 1 : 1/zwhc;
                                if (longi%2!==0) plus.push([vbus[3][i][longi-1]/zm]);
                            }
                            this.crearPunto(x-this.x0, y-this.y0, cmd, plus);
                        }
                        let n = this.listaPuntos.length-1;
                        if (cmdLc==="m" && n>0 && this.listaPuntos[n-1].z===-1){
                            this.cortarCamino(n-1, false);
                        }
                    }
                });
                if (this.listaPuntos.length>1) {
                    let n = this.listaPuntos.length-1;
                    if (this.listaPuntos[n].z===-1) this.listaPuntos[n].z = n;
                }
            }
        }
        if (tx!==0 || ty!==0 || sx!==1 || sy!==1 || a!==0){
            let [txf, tyf] = [tx*zwhc, ty*zwhc];
            let [xmf, ymf] = [xm*zwhc, ym*zwhc];
            let af = a*Math.PI/180;
            for (let i=0; i<this.listaPuntos.length; i++){
                let x = this.listaPuntos[i].x + this.x0;
                let y = this.listaPuntos[i].y + this.y0;
                if (a!==0){
                    let r = Math.sqrt(Math.pow(x-xmf,2) + Math.pow(y-ymf,2));
                    let b = af + Math.atan2(y-ymf, x-xmf);
                    x = xmf + r*Math.cos(b);
                    y = ymf + r*Math.sin(b);
                }
                x = x*sx + txf;
                y = y*sy + tyf;
                let cmd = this.listaPuntos[i].cmd;
                let cmdLc = cmd.toLowerCase();
                this.listaPuntos[i].plus.forEach((v,j) => {
                    if (cmdLc!=="a"){
                        let vx = v[0]+(cmd<"a"?this.x0:0);
                        let vy = v[1]+(cmd<"a"?this.y0:0);
                        if (a!==0){
                            let [xxm, yym] = cmd<"a" ? [xmf, ymf] : [0, 0];
                            let r = Math.sqrt(Math.pow(vx-xxm,2) + Math.pow(vy-yym,2));
                            let b = af + Math.atan2(vy-yym, vx-xxm);
                            vx = xxm + r*Math.cos(b);
                            vy = yym + r*Math.sin(b);
                        }
                        vx = vx*sx + (cmd<"a"?txf: 0);
                        vy = vy*sy + (cmd<"a"?tyf: 0);
                        let px = vx + (cmd > "Z" ? this.listaPuntos[i-1].x + this.x0 : 0);
                        let py = vy + (cmd > "Z" ? this.listaPuntos[i-1].y + this.y0 : 0);
                        this.moverPuntoControl(i, j, px-this.x0, py-this.y0);
                    } else {
                        if (j===0){
                            this.listaPuntos[i].plus[0][0] = (v[0]+(cmd==="A"?this.x0:0))*sx;
                            this.listaPuntos[i].plus[0][1] = (v[1]+(cmd==="A"?this.y0:0))*sy;
                        } else if (j===2) {
                            this.moverPuntoControl(i, 0, this.listaPuntos[i].plus[0][0], this.listaPuntos[i].plus[0][1]);
                        }
                    }
                });
                this.moverPunto(i, x-this.x0, y-this.y0);
            }


        }
        listaPuntos = this.listaPuntos;
    } catch(e) {_msg(e, "importar")}
    return listaPuntos;
};

tempConstructor.prototype.reducirPuntos = function(){
    let listaPuntos = null;
    try {
        let n = 0, maxLoop = 10000, hayDelete = true;
        while (n++, n<maxLoop && hayDelete){
            let [xa, ya, cmd] = [0, 0, ""];
            hayDelete = false;
            for (let [index, punto] of this.listaPuntos.entries()){
                if (index>0){
                    if ("LlMm".includes(punto.cmd) && punto.x===xa && punto.y===ya){
                        hayDelete = true;
                    } else if (punto.cmd==="H" && cmd==="H"){
                        index--;
                        hayDelete = true;
                    } else if (punto.cmd==="V" && cmd==="V"){
                        index--;
                        hayDelete = true;
                    }  else if (punto.cmd==="V" && cmd==="H" && punto.y===ya){
                        hayDelete = true;
                    } else if (punto.cmd==="H" && cmd==="V" && punto.x===xa){
                        hayDelete = true;
                    } else if ("mM".includes(punto.cmd) && "mM".includes(cmd)){
                        hayDelete = true;
                        index--;
                    } else if ("mM".includes(punto.cmd) && index===this.listaPuntos.length-1){
                        hayDelete = true;
                    }
                    if (hayDelete) {
                        if (!this.eliminarPunto(index)) return null;
                        break;
                    }
                }
                [xa, ya, cmd] = [punto.x, punto.y, punto.cmd];
            }
        }
        listaPuntos = this.listaPuntos;
        if (n===maxLoop) {
            listaPuntos = null;
            throw new Error("Se alcanzó un maxLoop");
        }
    } catch(e) {_msg(e, "reducirPuntos")}
    return listaPuntos;
};

/* tipos:
listaPuntos: igual que this.listaPuntos, pero agregando propiedad index. Un punto será como esto {index:0, x:0, y:0, cmd:"M", z:-1, plus:[]}
json: extrae como listaPuntos y le pasa JSON.stringify
array: valores en arrays con [index, x, y, cmd, z, plus]
string: el array anterior pasado a string
path: para incluir en un atributo "d" de un elemento path
*/
tempConstructor.prototype.exportar = function({tipo="path", soloCamino=false}={}){
    let datos = null;
    try {
        let zwhc = this.zoom*this.whcell;
        this.reducirPuntos();
        datos = ["listaPuntos", "json", "array"].includes(tipo) ? [] : "";
        let caminos = this.construirCaminos();
        if (soloCamino){
            let num = this.getNumSel();
            caminos = caminos.filter(camino => num>=camino[0] && num<=camino[1]);
        }
        let [xa, ya] = [0, 0];
        for (let [i, camino] of caminos.entries()){
            let [num1, num2, cerrado] = camino;
            let z = cerrado;
            for (let j=num1; j<=num2; j++){
                let zz = this.listaPuntos[j].z;
                let cmd = this.listaPuntos[j].cmd;
                let cmdLc = cmd.toLowerCase();
                let plus = this.listaPuntos[j].plus.
                map((v,k) => v.map((w,n) => 
                wxG.redondear(cmdLc==="a" && k>0 ? w : w/zwhc + (cmd<"a" && cmd!=="A" ? (n===0 ? this.x0/zwhc : this.y0/zwhc) : 0), this.digitos, false)));
                let plusPath = plus.map(v => v.join(" ")).join(" ");
                let plusString = '[' + plus.map(v => '[' + v.join(", ") + ']').join(", ") + ']';
                let x = this.listaPuntos[j].x;
                let y = this.listaPuntos[j].y;
                let [xe, ye] = [x, y];
                if ("achlmqstv".includes(cmd)){
                    xe = x-xa;
                    ye = y-ya;
                }
                if (cmd==="h"){
                    [xa, ya] = [x, ya];
                } else if (cmd==="v"){
                    [xa, ya] = [xa, y];
                } else {
                    [xa, ya] = [x, y];
                }
                let x0 = cmd<"a" ? this.x0 : 0;
                let xf = wxG.redondear((xe+x0)/zwhc, this.digitos, false);
                let y0 = cmd<"a" ? this.y0 : 0;
                let yf = wxG.redondear((ye+y0)/zwhc, this.digitos, false);
                if ("Hh".includes(cmd)){
                    yf = "";
                } else if ("Vv".includes(cmd)){
                    xf = "";
                }
                if (["listaPuntos", "json"].includes(tipo)) {
                    datos.push({index:j, x:xf, y:yf, cmd, z:zz, plus});
                } else if (tipo==="array") {
                    datos.push([j, xf, yf, cmd, zz, plus]);
                } else if (tipo==="string") {
                    datos += `${j}, ${xf}, ${yf}, ${cmd}, ${zz}, ${plusString}\n`;
                } else if (tipo==="path") {
                    datos += `${cmd}${plusPath} ${xf.toString()} ${yf.toString()}`.trim();
                }
            }
            if (z && tipo==="path") datos += "z";
        }
        if (tipo==="json") datos = JSON.stringify(datos).replace(/\},/g, "},\n");
        if (typeof datos === "string"){
            datos = datos.trim().replace(/[ ]+/g, " ").replace(/\s*([a-z])\s*/ig, "$1");
        }
    } catch(e) {_msg(e, "exportar")}
    return datos;
};


tempConstructor.prototype.activarMoverPuntos = function(activar, moverCamino=false){
    let ok = null;
    try {
        this.moverPuntosActivado = activar;
        if (activar){
            this.selector.style.left = 0;
            this.selector.style.top = 0;
            this.selector.style.width = 0;
            this.selector.style.height = 0;
            let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
            let [n, m] = [-1, -1];
            if (moverCamino){
                this.moverCamino = true;
                let num = this.getNumSel();
                let camino = this.obtenerCamino(num);
                if (camino) [n, m] = camino;
            } else {
                this.moverCamino = false;
                [n, m] = [0, this.listaPuntos.length-1];
            }
            if (n>-1 && m>-1) {
                for (let i=n; i<=m; i++){
                    x0 = Math.min(x0, this.listaPuntos[i].x);
                    y0 = Math.min(y0, this.listaPuntos[i].y);
                    x1 = Math.max(x1, this.listaPuntos[i].x);
                    y1 = Math.max(y1, this.listaPuntos[i].y);
                }
                this.selector.style.left = x0 + "px";
                this.selector.style.top = y0 + "px";
                let w = Math.max(this.medidaPunto, x1-x0);
                let h = Math.max(this.medidaPunto, y1-y0);
                this.selector.style.width = w + "px";
                this.selector.style.height = h + "px";
            }
            this.selector.style.display = "block";
        } else {
            this.selector.style.display = "none";
        }
        if (this.controles) document.getElementById(this.nombre + "-mover-puntos").checked = activar;
        ok = true;
    } catch(e) {_msg(e, "activarMoverPuntos")}
    return ok;
};


tempConstructor.prototype.borrarPuntos = function(borrarBak=true){
    let listaPuntos = null;
    try {
        this.capaSvg.innerHTML = "";
        this.capaPuntos.innerHTML = "";
        this.listaPuntos = [];
        this.activarMoverPuntos(false);
        if (borrarBak) {
            this.bak = [];
            this.cursorBak = 0;
        }
        listaPuntos = this.listaPuntos;
    } catch(e) {_msg(e, "borrarPuntos")}
    $('.coorde').empty()
    return listaPuntos;
};


tempConstructor.prototype.centrarPoligono = function(){
    var ancho = this.contenedor.offsetWidth;
    var alto = this.contenedor.offsetHeight;
    document.getElementById(this.nombre + "-left-poligono").value = Math.round(ancho/2);
    document.getElementById(this.nombre + "-top-poligono").value = Math.round(alto/2);
};


tempConstructor.prototype.dimensionarPoligono = function(){
    let ok = null;
    try {
        let zwhc = this.zoom*this.whcell;
        let medida = this.contenWidth*5/12;
        let centroX = this.contenWidth/2;
        let centroY = this.contenHeight/2;
        document.getElementById(`${this.nombre}-diametro-poligono`).value = wxG.redondear(medida/zwhc, 0, false);
        document.getElementById(`${this.nombre}-centroX-poligono`).value = wxG.redondear(centroX/zwhc, 0, false);
        document.getElementById(`${this.nombre}-centroY-poligono`).value = wxG.redondear(centroY/zwhc, 0, false);
    } catch(e) {_msg(e, "dimensionarPoligono")}
    return ok;
};


tempConstructor.prototype.construirPlus = function({curva="A", distanciaControl=0, anguloControl=0, radio=0, centroX=0, centroY=0, num=0}){
    let plus = null;
    try {
        if (curva==="C"||curva==="Q") {
            let [x, y] = [this.listaPuntos[num].x, this.listaPuntos[num].y];
            let [xa, ya] = [this.listaPuntos[num-1].x, this.listaPuntos[num-1].y];
            let [xm, ym] = [xa + (x-xa)/2, ya + (y-ya)/2];
            let theta = Math.atan2(ym-centroY, xm-centroX);
            distanciaControl = Math.abs(distanciaControl);
            anguloControl = anguloControl*Math.PI/180;
            if (curva==="Q") {
                let px = centroX + distanciaControl*Math.cos(theta + anguloControl);
                let py = centroY + distanciaControl*Math.sin(theta + anguloControl);
                plus = [[px, py]];
            } else {
                let xc = centroX + distanciaControl*Math.cos(theta - anguloControl);
                let yc = centroY + distanciaControl*Math.sin(theta - anguloControl);
                let xd = centroX + distanciaControl*Math.cos(theta + anguloControl);
                let yd = centroY + distanciaControl*Math.sin(theta + anguloControl);
                plus = [[xc, yc], [xd, yd]];
            }
        } else if (curva === "A"){
            let dc = parseInt(distanciaControl / (this.zoom*this.whcell), 10);
            dc = dc<0 ? 0 : dc>3 ? 3 : dc;
            let [f1, f2] = [...(dc.toString(2).padStart(2, "0"))].map(v => +v);
            plus = [[radio, radio], [anguloControl, f1], [f2]];
        } else {
            plus = [];
        }
    } catch(e) {_msg(e, "construirPlus")}
    return plus;
};


tempConstructor.prototype.calcularDistanciaAnguloControl = function(distancia){
    let ok = null;
    try {
        let curva = document.getElementById(`${this.nombre}-curva-poligono`).value;
        let lados = parseFloat(document.getElementById(`${this.nombre}-lados-poligono`).value);
        let radio = parseFloat(document.getElementById(`${this.nombre}-diametro-poligono`).value)/2;
        let [distanciaControl, anguloControl] = this.obtenerDistanciaAnguloControl(curva, distancia, lados, radio);
        document.getElementById(`${this.nombre}-distanciaControl-poligono`).value = distanciaControl;
        document.getElementById(`${this.nombre}-anguloControl-poligono`).value = anguloControl;
        ok = true
    } catch(e) {_msg(e, "calcularDistanciaAnguloControl")}
    return ok;
};

tempConstructor.prototype.obtenerDistanciaAnguloControl = function(curva="A", distancia="circulo", lados=0, radio=1){
    let [distanciaControl, anguloControl] = [0, 0];
    try {
        if (curva==="A"){
            if (distancia==="arista"){
                distanciaControl = 1;
            } else if (distancia==="exterior"){
                distanciaControl = 3;
            } else if (distancia==="circulo"){
                distanciaControl = 2;
            }
        } else if (lados>2 && (curva==="C" || curva==="Q") && distancia!=="centro") {
            let angulo = 2*Math.PI/lados;
            if (distancia==="arista"){
                distanciaControl = radio * Math.cos(angulo/2);
            } else if (distancia==="exterior"){
                distanciaControl =  2 * radio * Math.cos(angulo/2);
            } else if (distancia==="circulo"){
                if (curva==="Q"){
                    distanciaControl = radio*(2-Math.cos(angulo/2));
                } else {
                    let v = (4/3)*Math.tan(angulo/4);
                    distanciaControl = radio*Math.sqrt(1+Math.pow(v,2));
                    anguloControl = ((angulo/2)-Math.atan(v))*360/(2*Math.PI);
                }
            } else if (distancia==="replica"){
                distanciaControl = radio / Math.cos(angulo/2);
            }
        }
    } catch(e) {_msg(e, "obtenerDistanciaAnguloControl")}
    return [distanciaControl, anguloControl];
};


tempConstructor.prototype.construirPoligono = function(props){
    let ok = null;
    try {
        let zwhc = this.zoom*this.whcell;
        let propsBase = {lados: 4, diametro: 10, distanciaControl: 0, anguloControl: 0, angulo: 0, centroX: 10, centroY: 10, direccion: "right", curva: "L"};
        if (props===null || typeof props!=="object"){
            props = {};
            if (this.controles) {
                Object.keys(propsBase).forEach(key => {
                    let valor = document.getElementById(`${this.nombre}-${key}-poligono`).value;
                    if (typeof propsBase[key] === "number") {
                        valor = parseFloat(valor);
                        if (["diametro", "distanciaControl", "anguloControl", "centroX", "centroY"].includes(key)){
                            if (key==="anguloControl"){
                                valor = parseFloat(valor);
                            } else {
                                valor = parseFloat(valor * zwhc);
                            }
                        }
                    }
                    props[key] = valor;
                });
            } else {
                Object.keys(propsBase).forEach(key => props[key] = propsBase[key]);
            }
        } else {
           Object.keys(propsBase).forEach(key => {
               if (!props.hasOwnProperty(key)) props[key] = propsBase[key];
           });
        }
        let radio = props.diametro/2;
        let angs = 2*Math.PI/props.lados;
        let angulo = props.angulo*2*Math.PI/360;
        let dir = props.direccion==="right" ? 1 : -1;
        let [x0, y0] = [0, 0];
        this.saveBak = false;
        let num = this.listaPuntos.length;
        for (let i=0; i<props.lados; i++){
            let b = dir*(i*angs - angulo);
            let x = props.centroX + radio*Math.cos(b);
            let y = props.centroY + radio*Math.sin(b);
            if (i==0){
                x0 = x;
                y0 = y;
            }
            this.crearPunto(x-this.x0, y-this.y0);
            if (i>0 && props.curva!=="L") {
                this.seleccionarPunto(num+i);
                this.modificarLinea(props.curva, this.construirPlus({curva: props.curva, 
                distanciaControl: props.distanciaControl, 
                anguloControl: props.anguloControl, radio, 
                centroX: props.centroX, centroY: props.centroY, num: num+i}));
            }
        }
        if (props.curva!=="L"){
            this.crearPunto(x0-this.x0, y0-this.y0);
            let numPunto = num+props.lados;
            this.seleccionarPunto(numPunto);
            let b = dir*(props.lados*angs - angulo);
            this.modificarLinea(props.curva, this.construirPlus({curva: props.curva, 
            distanciaControl: props.distanciaControl, 
            anguloControl: props.anguloControl, radio, 
            centroX: props.centroX, centroY: props.centroY, num: numPunto}));
        }
        this.finalizarPoligono();
        this.guardar();
        this.saveBak = true;
        ok = true;
    } catch(e) {_msg(e, "construirPoligono")}
    return ok;
};

tempConstructor.prototype.obtenerRadio = function(x=0, y=0, xa=0, ya=0, lados=5){
    let [centroX, centroY, radio] = [0, 0, 0];
    try {
        let a = Math.PI/lados;
        centroX = (1/4)*(2*(x+xa)+(y-ya)*Math.tan(a/2)+(ya-y)*(1/Math.tan(a/2)));
        centroY = (1/2)*((x-xa)*(1/Math.tan(a))+y+ya);
        radio = Math.sqrt(Math.pow(xa-centroX,2)+Math.pow(ya-centroY,2));
    } catch(e) {_msg(e, "obtenerRadio")}
    return [centroX, centroY, radio];
};

tempConstructor.prototype.calcularDistancia = function(){
    let ok = null;
    try {
        let curva = document.getElementById(`${this.nombre}-prop-cmd`).value;
        if ("cq".includes(curva.toLowerCase())) {
            let zwhc = this.zoom*this.whcell;
            let lados = parseInt(document.getElementById(`${this.nombre}-prop-lados`).value, 10);
            if (lados<3) {
                lados = 3;
                document.getElementById(`${this.nombre}-prop-lados`).value = 3;
            }
            let distancia = document.getElementById(`${this.nombre}-prop-distancia`).value;
            let x = parseFloat(document.getElementById(`${this.nombre}-prop-x`).value) * zwhc;
            let y = parseFloat(document.getElementById(`${this.nombre}-prop-y`).value) * zwhc;
            let num = parseInt(document.getElementById(`${this.nombre}-prop-num`).value);
            let xa = this.listaPuntos[num-1].x;
            let ya = this.listaPuntos[num-1].y;
            let [centroX, centroY, radio] = this.obtenerRadio(x, y, xa, ya, lados);
            let [distanciaControl, anguloControl] = this.obtenerDistanciaAnguloControl(curva.toUpperCase(), distancia, lados, radio);
            let plus = this.construirPlus({curva: curva.toUpperCase(), distanciaControl, anguloControl, centroX, centroY, num});
            document.getElementById(`${this.nombre}-prop-plus00`).value = wxG.redondear(plus[0][0] / zwhc, this.digitos, false);
            document.getElementById(`${this.nombre}-prop-plus01`).value = wxG.redondear(plus[0][1] / zwhc, this.digitos, false);
            if (curva.toLowerCase()==="c"){
                document.getElementById(`${this.nombre}-prop-plus10`).value = wxG.redondear(plus[1][0] / zwhc, this.digitos, false);
                document.getElementById(`${this.nombre}-prop-plus11`).value = wxG.redondear(plus[1][1] / zwhc, this.digitos, false);
            }
            document.getElementById(`${this.nombre}-prop-centroX`).textContent = wxG.redondear(centroX / zwhc, this.digitos, false);
            document.getElementById(`${this.nombre}-prop-centroY`).textContent = wxG.redondear(centroY / zwhc, this.digitos, false);
            document.getElementById(`${this.nombre}-prop-radio`).textContent = wxG.redondear(radio / zwhc, this.digitos, false);
        }
        ok = true;
    } catch(e) {_msg(e, "calcularDistancia")}
    return ok;
};


tempConstructor.prototype.getBox = function(){
    let box = null;
    try {
        let [x1, y1, x2, y2] = [this.contenedor.offsetWidth, this.contenedor.offsetHeight, 0, 0];
        for (let punto of this.listaPuntos){
            let [x, y] = [punto.x, punto.y];
            if (x<x1) x1 = x;
            if (x>x2) x2 = x;
            if (y<y1) y1 = y;
            if (y>y2) y2 = y;
        }
        box = {x1, y1, x2, y2};
    } catch(e) {_msg(e, "getBox")}
    return box;
};


tempConstructor.prototype.moverPoligono = function(dx=0, dy=0, moverCamino=false){
    let ok = null;
    try {
        let [n, m] = [-1, -1];
        if (moverCamino){
            let num = this.getNumSel();
            let camino = this.obtenerCamino(num);
            if (camino) [n, m] = camino;
        } else {
            [n, m] = [0, this.listaPuntos.length-1];
        }
        if (n>-1 && m>-1) {
            for(let i=n; i<=m; i++){
                let punto = this.listaPuntos[i];
                let x = punto.x+dx;
                let y = punto.y+dy;
                if (!this.moverPunto(i, x, y)) return null;
                if (punto.plus.length>0){
                    punto.plus.forEach((v, j) => {
                        if (punto.cmd<"a" && punto.cmd!=="A"){
                            if (!this.moverPuntoControl(i, j, v[0]+dx, v[1]+dy)) return null;
                        }
                    });
                }
            }
        }
        ok = true;
    } catch(e) {_msg(e, "moverPoligono")}
    return ok;
};


tempConstructor.prototype.alinearPoligono = function(donde="left", x1=0, y1=0, x2=0, y2=0){
    let ok = null;
    try {
        let box = this.getBox();
        if (donde==="left") {
            this.moverPoligono(x1-box.x1, 0);
        } else if (donde==="right") {
            this.moverPoligono(x2-box.x2, 0);
        } else if (donde==="top") {
            this.moverPoligono(0, y1-box.y1);
        } else if (donde==="bottom") {
            this.moverPoligono(0, y2-box.y2);
        } else if (donde==="center"){
            this.moverPoligono((x1+x2-box.x1-box.x2)/2, 0);
        } else if (donde==="middle"){
            this.moverPoligono(0, (y1+y2-box.y1-box.y2)/2);
        }
        ok = true;
    } catch(e) {_msg(e, "moverPoligono")}
    return ok;
};


tempConstructor.prototype.agrandarPoligono = function(dw=0, dh=0){
    let ok = null;
    try {
        let box = this.getBox();
        if (box){
            let dx = box.x2-box.x1;
            let sx = dx===0 ? 1 : dw/dx;
            let dy = box.y2-box.y1;
            let sy = dy===0 ? 1 : dh/dy;
            let pts = this.listaPuntos.map(v => [v.x, v.y]);
            let [bx, by] = [box.x1*sx, box.y1*sy];
            this.saveBak = false;
            for (let [index, punto] of this.listaPuntos.entries()){
                let x = punto.x * (1+sx) - bx;
                let y = punto.y * (1+sy) - by;
                if (!this.moverPunto(index, x, y)) return null;
                if (punto.plus.length>0){
                    let cmd = punto.cmd;
                    let cmdLc = cmd.toLowerCase();
                    punto.plus.forEach((v, j) => {
                        if (cmdLc!=="a"){
                            let [vx, vy] = [...v];
                            if (cmd>"Z") {
                                vx += pts[index-1][0];
                                vy += pts[index-1][1];
                            }
                            vx = vx * (1+sx) - bx;
                            vy = vy * (1+sy) - by;
                            if (!this.moverPuntoControl(index, j, vx, vy)) return null;
                        }
                    });
                }
            }
            this.saveBak = true;
            this.guardar();
        }
        ok = true;
    } catch(e) {_msg(e, "agrandarPoligono")}
    return ok;
};


tempConstructor.prototype.rotarPoligono = function(da=0){
    let ok = null;
    try {
        let box = this.getBox();
        if (box){
            da = da*Math.PI/360;
            let xm = box.x1 + (box.x2-box.x1)/2;
            let ym = box.y1 + (box.y2-box.y1)/2;
            let pts = this.listaPuntos.map(v => [v.x, v.y]);
            this.saveBak = false;
            for (let [index, punto] of this.listaPuntos.entries()){
                let [x, y] = [punto.x, punto.y];
                let a = Math.atan2(y-ym, x-xm) + da;
                let r = Math.sqrt(Math.pow(x-xm,2) + Math.pow(y-ym,2));
                x = xm + r * Math.cos(a);
                y = ym + r * Math.sin(a);
                if (!this.moverPunto(index, x, y)) return null;
                if (punto.plus.length>0){
                    let cmd = punto.cmd;
                    let cmdLc = cmd.toLowerCase();
                    punto.plus.forEach((v, j) => {
                        if (cmdLc!=="a"){
                            let [vx, vy] = [...v];
                            if (cmd>"Z") {
                                vx += pts[index-1][0];
                                vy += pts[index-1][1];
                            }
                            let a = Math.atan2(vy-ym, vx-xm) + da;
                            let r = Math.sqrt(Math.pow(vx-xm,2) + Math.pow(vy-ym,2));
                            vx = xm + r * Math.cos(a);
                            vy = ym + r * Math.sin(a);
                            if (!this.moverPuntoControl(index, j, vx, vy)) return null;
                        }
                    });
                }
            }
            this.saveBak = true;
            this.guardar();
        }
        ok = true;
    } catch(e) {_msg(e, "rotarPoligono")}
    return ok;
};


tempConstructor.prototype.ajustarPoligono = function(){
    let ok = null;
    try {
        this.saveBak = false;
        for (let [index, punto] of this.listaPuntos.entries()){
            let x = wxG.redondear(punto.x/this.whcell, 0, false)*this.whcell;
            let y = wxG.redondear(punto.y/this.whcell, 0, false)*this.whcell;
            if (!this.moverPunto(index, x, y)) return null;
        }
        this.saveBak = true;
        this.guardar();
        ok = true;
    } catch(e) {_msg(e, "ajustarPoligono")}
    return ok;
};


tempConstructor.prototype.ajustarPunto = function(num=-1, numCtrl=-1){
    let ok = null;
    try {
        num = num===-1 ? this.getNumSel() : num;
        if (num>-1){
            let punto = this.listaPuntos[num];
            if (numCtrl===-1){
                let x = wxG.redondear(punto.x/this.whcell, 0, false)*this.whcell;
                let y = wxG.redondear(punto.y/this.whcell, 0, false)*this.whcell;
                this.moverPunto(num, x, y);
            } else {
                let cmdLc = punto.cmd.toLowerCase();
                if (numCtrl<punto.plus.length){
                    let x = wxG.redondear(punto.plus[numCtrl][0]/this.whcell, 0, false)*this.whcell;
                    let y = wxG.redondear(punto.plus[numCtrl][1]/this.whcell, 0, false)*this.whcell;
                    this.moverPuntoControl(num, numCtrl, x, y);
                }
            }
            this.guardar();
        }
        ok = true;
    } catch(e) {_msg(e, "ajustarPunto")}
    return ok;
};


tempConstructor.prototype.modificarLinea = function(comando="L", plus=[]){
    let ok = null;
    try {
        let num = this.getNumSel();
        if (num>-1){
            this.saveBak = false;
            let comandoLc = comando.toLowerCase();
            let punto = this.listaPuntos[num];
            let cmd = punto.cmd;
            let cmdLc = cmd.toLowerCase();
            if (cmdLc!=="m") {
                punto.plus.forEach((v,i) => {
                    if (!(cmdLc==="a" && i>0)) {
                        let puntoControl = document.getElementById(`${this.nombre}-puntoctrl-${i}-${num}`);
                        puntoControl.parentElement.removeChild(puntoControl);
                        let lineaControl = document.getElementById(`${this.nombre}-lineactrl-${i}-${num}`);
                        lineaControl.parentElement.removeChild(lineaControl);
                        if ("aqt".includes(cmdLc)) {
                            lineaControl = document.getElementById(`${this.nombre}-lineactrl-${1}-${num}`);
                            lineaControl.parentElement.removeChild(lineaControl);
                        }
                    }
                });
                punto.plus = [];
                punto.cmd = comando;
                let [x, y] = [punto.x, punto.y];
                let whc = this.contenedor.offsetHeight/12;
                let [xa, ya] = [this.listaPuntos[num-1].x, this.listaPuntos[num-1].y];
                let d = "M0 0";
                let linea = this.getLinea(num-1);
                if (comandoLc === "l"){
                    d = `M${xa} ${ya}${comando}${x} ${y}`;
                } else if (comandoLc === "a"){
                    punto.plus = plus.length===3 ? plus : [[whc, whc], [0, 0], [0]];
                    punto.plus[1][1] = punto.plus[1][1]>0 ? 1 : 0;
                    punto.plus[2][0] = punto.plus[2][0]>0 ? 1 : 0;
                    this.crearPuntoControl(num);
                    let dplus = punto.plus.map(v => v.join(" ")).join(" ");
                    d = `M${xa} ${ya}${comando}${dplus} ${x} ${y}`;
                } else if (comandoLc === "c"){
                    if (plus.length===2){
                        punto.plus = plus;
                    } else {
                        let lados = 5;
                        let [centroX, centroY, radio] = this.obtenerRadio(x, y, xa, ya, lados);
                        let [distanciaControl, anguloControl] = this.obtenerDistanciaAnguloControl("C", "circulo", lados, radio);
                        punto.plus = this.construirPlus({curva: "C", distanciaControl, anguloControl, centroX, centroY, num});
                    }
                    this.crearPuntoControl(num);
                    let dplus = punto.plus.map(v => v.join(" ")).join(" ");
                    d = `M${xa} ${ya}${comando}${dplus} ${x} ${y}`;
                } else if (comandoLc === "q"){
                    if (plus.length===1){
                        punto.plus = plus;
                    } else {
                        let lados = 5;
                        let [centroX, centroY, radio] = this.obtenerRadio(x, y, xa, ya, lados);
                        let [distanciaControl, anguloControl] = this.obtenerDistanciaAnguloControl("Q", "circulo", lados, radio);
                        punto.plus = this.construirPlus({curva: "Q", distanciaControl, anguloControl, centroX, centroY, num});
                    }
                    this.crearPuntoControl(num);
                    let dplus = punto.plus.map(v => v.join(" ")).join(" ");
                    if (comando>"Z") [x, y] = [x-xa, y-ya];
                    d = `M${xa} ${ya}${comando}${dplus} ${x} ${y}`;
                }
                if (!/^[mlvhacqstz\d\s,.+-]+$/i.test(d)) new Error (`Un atributo "d" no está bien formado`);
                linea.setAttribute("d", d);
            }
            this.saveBak = true;
            this.guardar();
        }
        ok = true;
    } catch(e) {_msg(e, "modificarLinea")}
    return ok;
};

tempConstructor.prototype.reflejar = function(reflejo="x"){
    let ok = null;
    try {
        let zwhc = this.zoom*this.whcell;
        let [xr, yr] = [-Infinity, -Infinity];
        for (let punto of this.listaPuntos){
            xr = Math.max(xr, punto.x);
            yr = Math.max(yr, punto.y);
        }
        xr += this.offsetReflejo*zwhc;
        yr += this.offsetReflejo*zwhc;
        let nn = this.listaPuntos.length;
        let j = -1;
        this.saveBak = false;
        for (let i=0; i<nn; i++){
            j++;
            let punto = this.listaPuntos[i];
            let x = reflejo==="x" ? 2*xr-punto.x : punto.x;
            let y = reflejo==="y" ? 2*yr-punto.y : punto.y;
            let cmd = punto.cmd;
            let cmdLc = cmd.toLowerCase();
            let z = punto.z>-1 ? nn+punto.z : punto.z;
            let plus = punto.plus.map((v,k) => {
                if (cmdLc!=="a" || k===0){
                    return v.map((w,m) => {
                        let val = w;
                        if (cmd<"a"){
                            if (m===0){
                                val = reflejo==="x" ? 2*xr-w : w;
                            } else {
                                val = reflejo==="y" ? 2*yr-w : w;
                            }
                        } else if (m===0 && reflejo==="x" || m===1 && reflejo==="y") {
                            val = -val;
                        }
                        return val;
                    });
                } else {
                    return [...v];
                }
            });
            this.crearPunto(x, y, cmd, plus);
            if (i===0 && z===-1) {
                this.cortarCamino(nn-1);
            } else if (i>0 && z>-1 && z<nn+j){
                this.cerrarCamino(z, nn+j);
            }
        }
        this.saveBak = true;
        this.guardar();
        ok = true;
    } catch(e) {_msg(e, "reflejar")}
    return ok;
};

wxG.prefijarCss(["user-select"]); 

//RETORNAMOS EL CONSTRUCTOR
return tempConstructor;
})(); //cierra el módulo
}; //cierra el Wextensible