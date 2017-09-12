( function () {

    var ccm_version = '9.0.0';
    var ccm_url     = 'https://akless.github.io/ccm/version/ccm-9.0.0.min.js';

    var component_name = 'openid';
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
                        },
                    "logout":
                        {
                            "tag":"button",
                            "type":"button",
                            "inner": "%text%",
                            "onclick": "%onclick%"
                        },
                    "input":
                        {
                            "tag": "div",
                            "class": "inputdiv",
                            "inner":
                                {
                                    "tag": "form",
                                    "method":"get",
                                    "action":"%actionUrl%&%actionUrl2",
                                    "class":"form",
                                    "inner": [
                                        {
                                            "tag": "input",
                                            "type": "submit",
                                            "value": "Login with OpenId"
                                        }
                                    ],
                                    "onsubmit": "%onsubmit%"
                                }
                        }
                },
                openid: ['ccm.load' , 'openidconnect.js'],
                clientId: '1096722142749-hcr71g909c47htrucd1ib31oaogfd0am.apps.googleusercontent.com',
                redirectUri: 'http://localhost/ccm/openid/index.html',
                //debug page: http://localhost/openidconnectjstest/callback.html
                discoveryUri: 'https://accounts.google.com/',
                debug: false //set this to true to enable debug messages
            },
        Instance: function ()
        {
            var self = this;
            var currentUser = null;
            self.start = function ( callback ) {
                self.element.innerHtml = '';
                self.element.appendChild( self.ccm.helper.html( self.html.main ) );

                var main_div = self.element.querySelector( '#openid_main' );
                currentUser = self.getCurrentUser();
                if(!currentUser) {
                    displayLoginButton(main_div);
                } else {
                    displayLoggedIn(main_div);
                }

                if ( callback ) callback();
            }

            self.getCurrentUser = function () {
                try {
                    OIDC.restoreInfo();
                    var id_token = OIDC.getValidIdToken();
                    var id_token_payload = OIDC.getIdTokenPayload(id_token);
                    debug(id_token_payload);
                    return id_token_payload.email;
                } catch (e) {
                    if(e.name === 'OidcException'){
                        debug(e);
                        return null;
                    }
                    throw e;
                }
            }

            //Build OpenID URL
            self.getOpenIdURL = function () {
                debug('redirect_uri: ' + self.redirectUri);
                debug('client_id: ' + self.clientId);
                var clientInfo = {
                    client_id : self.clientId,
                    redirect_uri : self.redirectUri
                };
                OIDC.setClientInfo( clientInfo );
                var providerInfo = OIDC.discover(self.discoveryUri);
                debug(providerInfo);
                OIDC.setProviderInfo( providerInfo );
                OIDC.storeInfo(providerInfo, clientInfo);
                var requestData =	{
                    scope : 'openid+email',
                    response_type : 'id_token'
                };
                var result = OIDC.login(requestData);
                debug(result);
                return result;
            }

            //util function to check whether the user is logged in
            self.isLoggedIn = function () {
                if(!self.getCurrentUser()) return false;
                return true;
            }

            //This gets rendered when the user is logged in
            function displayLoggedIn(parentElement) {
                if(!parentElement) return;
                displayGreeting(parentElement);
                displayLogoutButton(parentElement);
            }

            //Greeting
            function displayGreeting(parentElement) {
                if(!parentElement) return;
                parentElement.innerHTML = 'Welcome ' + currentUser + '!<br/>';
            }

            //Logout-Button
            function displayLogoutButton(parentElement) {
                if(!parentElement) return;
                parentElement.appendChild(self.ccm.helper.html(self.html.logout,
                    {
                        text: 'Logout',
                        onclick: function()
                        {
                            currentUser = null;
                            window.location.href = self.redirectUri;
                            self.start();
                        }
                    }
                ));
            }

            //Login-Button
            function displayLoginButton(parentElement)
            {
                if(!parentElement) return;
                var url = self.getOpenIdURL();
                parentElement.innerHTML = '<a href='+url+'>click</a>';
            }

            function debug(info) {
                if(self.debug) console.log(info);
            }

        }
    };

    var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
    if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
    function register() { ccm[ ccm_version ].component( component_obj ); }
}() );