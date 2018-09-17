
/**
 * A script type to display on the page.
 */
class ScriptType {
	/**
	 * Constructs a new CgiType.
	 * @param {String} url    The url to combine with the input.
	 * @param {String} id     The unique cookie identifier.
     * @param {Array}  params The list of parameter information.
     *                        Formats per Parameter:
     *                        'Name', Name and no default value
     *                        ['Name', 'Default'], Name and default value
     *                        ['Name', ['Op1', 'Op2', 'Op3']], Name and dropdown values
     * @param {String} label  The display label header.
     * @param {Number} height The height of the iframe.
	 */
    constructor(url, id, params, label, height, isAutoHeight) {
		this.url = url;
        this.label = label;
        this.id = id;
        this.height = height;
        this.isAutoHeight = isAutoHeight;

        // Fill the parameters
        this.params = [];
        // i starts at 1
        for (var i = 0; i < params.length; i++) {
            this.params.push(new UrlParameter(this, (i + 1), params[i]));
        }
        
		//this.input = null;
		this.close = null;
		this.iframe = null;
		this.iframeWrapper = null;
        this.iframeLoaded = false;
        this.iframeHTML = '';
    }

    /**
     * Gets the number of parameters.
     */
    get count() {
        return this.params.length;
    }
    
	/**
	 * The event for loading the url of combined with the input into the iframe.
	 */
	runScript() {
		//if (this.input.value.length > 0) {
			this.loadFrame();
            var url = this.url;
            for (var i = 0; i < this.count; i++) {
                url = url.replaceAll('{P' + (i + 1) + '}', this.params[i].input.value);
                this.params[i].updateCookie();
        }
        console.debug(url);
		this.iframe.src = url;
		/*}
		else {
			this.unloadFrame();
		}*/
    }

    /**
     * An event called when an iframe is loaded and is using auto height.
     */
    frameLoaded() {
        resizeIFrameToFitContentHeight(this.iframe);
    }

	/**
	 * Loads the iframe into view.
	 */
	loadFrame() {
        if (!this.iframeLoaded) {
            this.iframeWrapper.innerHTML = this.iframeHTML;
            this.iframe = document.getElementById(this.id + '-iframe');
            if (this.isAutoHeight)
                this.iframe.addEventListener('load', this.frameLoaded.bind(this));
			this.iframeLoaded = true;
			this.close.style.visibility = 'unset';
			this.iframeWrapper.style.display = 'unset';
		}
	}

	/**
	 * Unloads the iframe from view.
	 */
	unloadFrame() {
		if (this.iframeLoaded) {
			this.iframeWrapper.innerHTML = '';
			this.iframe = null;
			this.iframeLoaded = false;
			this.close.style.visibility = 'hidden';
			this.iframeWrapper.style.display = 'unset';
		}
	}

	/**
	 * Initialize the script type and its HTML.
	 */
    initializeHTML(container, template, inputTemplate, selectTemplate, iframeTemplate) {
        var scriptDiv = document.createElement('div');
        var iframeDiv = document.createElement('div');
        scriptDiv.appendChild(template.content.cloneNode(true));
        iframeDiv.appendChild(iframeTemplate.content.cloneNode(true));
        
        scriptDiv.innerHTML = scriptDiv.innerHTML.replaceAll('id="scripttype-', 'id="' + this.id + '-');
        iframeDiv.innerHTML = iframeDiv.innerHTML.replaceAll('id="scripttype-', 'id="' + this.id + '-');
        if (this.isAutoHeight)
            iframeDiv.children[0].removeAttribute('height');
        else
            iframeDiv.children[0].setAttribute('height', this.height);
        
        this.iframeHTML = iframeDiv.innerHTML;

        var inputLine = scriptDiv.getElementsByClassName('input-line')[0];

        // Initialize parameters
        for (var i = 0; i < this.count; i++) {
            var param = this.params[i];
            var paramDiv = document.createElement('div');
            paramDiv.style.display = 'inline';
            if (param.isSelect)
                paramDiv.appendChild(selectTemplate.content.cloneNode(true));
            else
                paramDiv.appendChild(inputTemplate.content.cloneNode(true));
            paramDiv.innerHTML = paramDiv.innerHTML.replaceAll('id="scripttype-', 'id="' + param.id + '-');

            if (param.isSelect) {
                //var select = paramDiv.getElementById(param.id + '-input');
                var select = paramDiv.getElementById(param.id + '-input');
                for (var j = 0; j < param.options.length; j++) {
                    var option = param.options[j];
                    var optionElement = document.createElement('option');
                    optionElement.setAttribute('value', option);
                    optionElement.innerText = option;
                    select.add(optionElement);
                }
            }

            inputLine.insertAt(paramDiv, i);
        }

        container.appendChild(scriptDiv);
	}

	/**
	 * Initializes the events and elements after the HTML has been initialized.
	 */
	initializeElements() {
        var label = document.getElementById(this.id + '-label');
        var run = document.getElementById(this.id + '-run');
        var close = document.getElementById(this.id + '-close');
        var iframeWrapper = document.getElementById(this.id + '-iframe-wrapper');

		// Events
		run.addEventListener('click', this.runScript.bind(this));
		close.addEventListener('click', this.unloadFrame.bind(this));

		// Visuals
        if (this.label != null) {
            label.style = '';
            label.innerText = this.label;
		}

        // Initialize parameter elements
        for (var i = 0; i < this.count; i++) {
            this.params[i].initializeElements();
        }

		//this.input = input;
		this.close = close;
		this.iframeWrapper = iframeWrapper;
	}
}

/**
 * A parameter for a ScriptType.
 */
class UrlParameter {

    /**
     * Constructs the UrlParameter.
     * @param {ScriptType}   script         The ScriptType containing this parameter.
     * @param {Number}       index          The index of the parameter. (0-indexed)
     * @param {String|Array} nameAndOptions The names and options for the parameter.
     *                                      Formats:
     *                                      'Name', Name and no default value
     *                                      ['Name', 'Default'], Name and default value
     *                                      ['Name', ['Op1', 'Op2', 'Op3']], Name and dropdown values
     */
    constructor(script, index, nameAndOptions) {
        this.script = script;
        this.index = index;
        this.name = '';
        this.defaultValue = '';
        this.options = [];
        if (Array.isArray(nameAndOptions)) {
            this.name = nameAndOptions[0];
            if (nameAndOptions.length > 1) {
                if (Array.isArray(nameAndOptions[1])) {
                    var options = nameAndOptions[1];
                    this.defaultValue = options[0];
                    for (var i = 0; i < options.length; i++) {
                        this.options.push(options[i].toString());
                    }
                }
                else {
                    this.defaultValue = nameAndOptions[1];
                }
            }
        }
        else {
            this.name = nameAndOptions;
        }

        this.input = null;
    }

    /**
     * Gets the id for this parameter.
     */
    get id() {
        return this.script.id + '-param' + this.index;
    }

    /**
     * Gets if the parameter type is a dropdown.
     */
    get isSelect() {
        return this.options.length > 0;
    }

    /**
     * Updates the cookie for the parameter.
     */
    updateCookie() {
        // Expires in 90 days of no use
        setCookie(this.id, this.input.value, 90);
    }
    
	/**
	 * Clears the input text.
	 */
    clearInput() {
        this.input.value = this.defaultValue;
        this.input.focus();
        this.updateCookie();
    }

	/**
	 * The event for checking for enter presses in the input.
	 */
    enterPressed(event) {
        if (event.keyCode == 13 /* ENTER */) {
            this.script.runScript();
        }
    }

	/**
	 * Initializes the events and elements of the parameter after the HTML has been initialized.
	 */
    initializeElements() {
        var span = document.getElementById(this.id + '-name');
        var input = input = document.getElementById(this.id + '-input');
        var clear = document.getElementById(this.id + '-clear');

        // Events
        input.addEventListener('keypress', this.enterPressed.bind(this));
        if (clear != null)
            clear.addEventListener('click', this.clearInput.bind(this));

        // Cookies
        input.value = getCookie(this.id);
        if (input.value.length == 0 && this.defaultValue.length != 0) {
            input.value = this.defaultValue;
        }

        // Visuals
        if (this.name.length > 0)
            span.innerText = this.name + ':';
        
        this.input = input;
    }
}

/**
 * Gets the element by its id from inside an HTMLElement.
 * @param {String} id The id of the element to search for.
 */
HTMLElement.prototype.getElementById = function (id) {
    return this.querySelector('#' + id);
}

/**
 * Inserts the element into the element at the specified position.
 * @param {HTMLElement} newChild The new element to add.
 * @param {Number}      index    The index of the new element.
 */
HTMLElement.prototype.insertAt = function (newChild, index) {
    if (index == this.children.length || this.children.length == 0)
        this.appendChild(newChild);
    else
        this.insertBefore(newChild, this.children[index]);
}

/**
 * Replaces all instances of 'search' with 'replacement'.
 * @param {String} search      The string to search for.
 * @param {String} replacement The string to replace with.
 */
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

/**
 * Resizes the iframe to fit its scroll height.
 * @param {HTMLIFrameElement} iframe        The iframe to resize.
 * @param {Number}            defaultHeight The default height if the iframe is on a different domain.
 */
function resizeIFrameToFitContentHeight(iframe, defaultHeight) {
    //var width  = iframe.contentWindow.document.body.scrollWidth;
    //if (width != 0)
    //    iframe.width = width;
    var height = iframe.contentWindow.document.body.scrollHeight;
    if (height != 0)
        iframe.height = height + 20; // Arbitrary number that is hopefully larger than scrollbars.
}


/**
 * Sets the Cookie value.
 * @param {String} cname   The name of the cookie.
 * @param {any}    cvalue  The value of the cookie.
 * @param {Number} exdays  The number of days before expiring.
 */
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Gets the Cookie value.
 * @param {String} cname   The name of the cookie.
 */
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

/**
 * Initializes the ScriptTypes.
 * @param {ScriptType[]} scriptTypes
 */
function initializeScriptTypes(scriptTypes) {
    var container = document.getElementById('container');
    var template = document.getElementById('scripttype-template');
    var inputTemplate = document.getElementById('scripttype-input-template');
    var selectTemplate = document.getElementById('scripttype-select-template');
    var iframeTemplate = document.getElementById('scripttype-iframe-template');

    container.innerHTML = '';

    // Init the HTML for the Script Types
    for (var i = 0; i < scriptTypes.length; i++) {
        scriptTypes[i].initializeHTML(container, template, inputTemplate, selectTemplate, iframeTemplate);
    }

    // HTML is all setup, now we can hook up events and do other fun stuff
    for (var i = 0; i < scriptTypes.length; i++) {
        scriptTypes[i].initializeElements();
	}
}
