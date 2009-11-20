/**
 * @class
 */
function FilterAPI(){
	/*
         * @var
         */
        this.uri = urlBase+"list/";

        /*
         *@var array
         */
        this.callbacks = new Array();

        /**
         * @var array
         */
        this.filters = filtersFromSession;

        /**
         *@method
         *
         */
	this.addCallback = function(callback){
		if(typeof callback == 'function' || typeof callback == 'object')
			this.callbacks.push(callback);
	};
	/**
         * add a filter
         * @method
         * @param id int,string
         * @param property string an iri (predicate) which values should be filtered
         * @param isInverse boolean if the property is inverse
         * @param propertyLabel string a label for the property (will be displayed instead)
         * @param filter string can be "contains" or "equals" . going to be enhanced
         * @param value1 mixed the value applied to the filter
         * @param value2 mixed the value applied to the filter. often optional (used for "between")
         * @param valuetype string may be "uri" or "literal" or "typedliteral" or "langtaggedliteral"
         * @param literaltype string if valuetype is "typedliteral" or "langtaggedliteral": you can put stuff like "de" or "xsd:int" here...
         * @param callback function will be called on success
         * @param hidden boolean will not show up in filterbox if true
         */
	this.add = function(id, property, isInverse, propertyLabel, filter, value1, value2, valuetype, literaltype, callback, hidden){
            if(typeof callback != 'function' && typeof callback != 'object')
		callback = function(){};

		var data =
                    {
                    filter:
                        [
                            {
                                "action" : "add",
                                "id" : id,
                                "property" : property,
                                "isInverse" : typeof isInverse != 'undefined' ? isInverse : false,
                                "propertyLabel" : typeof propertyLabel != 'undefined' ? propertyLabel : null,
                                "filter" : filter,
                                "value1": value1,
                                "value2": typeof value2 != 'undefined' ? value2 : null,
                                "valuetype": typeof valuetype != 'undefined' ? valuetype : null,
                                "literaltype" : typeof literaltype != 'undefined' ? literaltype : null,
                                "hidden" : typeof hidden != 'undefined' ? hidden : false
                            }
                        ]
                };

		var dataserialized = $.toJSON(data);

		me = this;
		$.post(
		this.uri,
		{
                    "instancesconfig" : dataserialized
                }, //as post because of size
		function(res) {
                    if(true){ //how to check for success
                        //remember
                        me.filters[id] = data;

                        //do default action
                        me.reloadInstances();

                        //do caller specific action
                        callback(me.filters);

                        //inform others
                        for(key in me.callbacks){
                                me.callbacks[key](me.filters);
                        }
                    } else alert("Could not add filter!\nGot error while saving: \n"+res);
		},
		"text");
	};

	this.reloadInstances = function(){
            //$('.content .innercontent').load(document.URL);
            window.location = this.uri;
	};

        this.filterExists = function(id){
            return (typeof this.filters[id] != 'undefined');
        }

        this.getFilterById = function(id){
            return this.filters[id];
        }


	this.remove = function(id, callback){
            if(typeof callback != 'function' && typeof callback != 'object')
                callback = function(){};

            var data = {
                filter: [
                    {
                        "action" : "remove",
                        "id" : id
                    }
                ]
            };

            var dataserialized = $.toJSON(data);

            me = this;
            $.post(
		this.uri,
		{
                    "instancesconfig" : dataserialized
                }, //as post because of size
                function(res) {
                    if(true){
                        //unset
                        delete me.filters[id];
                        //do default action
                        me.reloadInstances();

                        //do caller specific action
                        callback(me.filters);

                        //inform others
                        for(key in me.callbacks){
                                me.callbacks[key](me.filters);
                        }
                    } else alert("Could not remove filter with id "+id+"!\nReason: \n"+res);
                }
            );
	};

	this.removeAll = function(callback){
            if(typeof callback != 'function' && typeof callback != 'object')
                    callback = function(){};
            me = this;
            $.get(this.uri+"&method=unsetArray", function(res) {
                if(res==""){
                    //do default action
                    me.reloadInstances();

                    //forget
                    me.filters = new Array();

                    //do caller specific action
                    callback(me.filters);

                    //inform others
                    for(key in me.callbacks){
                            me.callbacks[key](me.filters);
                    }
                 } else alert("Could not remove all filters!\nReason: \n"+res);
            });
	};
}

var filter = new FilterAPI();