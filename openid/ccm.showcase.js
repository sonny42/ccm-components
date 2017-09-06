( function () {

    var ccm_version = '9.0.0';
    var ccm_url     = 'https://akless.github.io/ccm/version/ccm-9.0.0.min.js';

    var component_name = 'openid-showcase';
    var component_obj  = {
        name: component_name,
        config:
            {
                //html: [ 'ccm.get', 'templates.json', 'input.inner.class' ],
                html:  {
                    "main":
                        {
                            "tag": "div",
                            "id": "openid_main"
                        }
                },
                style: [ 'ccm.load', 'style.css' ],
                openid: ['ccm.component' , 'ccm.openid.js'],
            },
        Instance: function ()
        {
            var self = this;
            var currentUser = null;
            self.start = function ( callback ) {
                //self.element.innerHtml = '';
                //self.element.appendChild( self.ccm.helper.html( self.html.main ) );
                //console.log(self.openid.Instance);
                if ( callback ) callback();
            }

        }
    };

    var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
    if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
    function register() { ccm[ ccm_version ].component( component_obj ); }
}() );