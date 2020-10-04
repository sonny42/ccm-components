( function () {

    var ccm_version = '9.2.0';
    var ccm_url     = 'https://ccmjs.github.io/ccm/versions/ccm-9.2.0.min.js';

    var component_name = 'openid-showcase';
    var component_obj  = {
        name: component_name,
        config:
            {
                html:   ['ccm.load', 'templates.json'],
                style:  ['ccm.load', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 'style.css', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css'],
                //openid: ['ccm.instance' , '/ccm-components/openid/ccm.openid.js', {redirectUri: 'http://localhost/ccm-components/openid-showcase/index.html'}],
                openid: ['ccm.instance' , '/ccm-components/openid/ccm.openid.js', {redirectUri: 'https://sonny42.github.io/ccm-components/openid-showcase/index.html'}],
            },
        Instance: function ()
        {
            var self = this;
            self.start = function ( callback ) {

                self.element.appendChild( self.ccm.helper.html( self.html.main ) );

                var content_div = self.element.querySelector( '#content-div' );

                if(self.openid.isLoggedIn()) {
                    var username = self.openid.getCurrentUser();
                    content_div.appendChild(self.ccm.helper.html(self.html.content_logged_in, {name: username}));
                } else {
                    var link = self.openid.getOpenIdURL();
                    //content_div.appendChild(self.ccm.helper.html(self.html.content_default, {link: link}));

                    //work around to prevent bugged encoding of link url
                    content_div.appendChild(self.ccm.helper.html(self.html.content_default));
                    self.element.querySelector( '#link' ).setAttribute('href', link);
                }

                if ( callback ) callback();
            }

        }
    };

    var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
    if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
    function register() { ccm[ ccm_version ].component( component_obj ); }
}() );