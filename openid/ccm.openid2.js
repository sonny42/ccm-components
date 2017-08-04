( function () {

    var ccm_version = '9.0.0';
    var ccm_url     = 'https://akless.github.io/ccm/version/ccm-9.0.0.min.js';

    var component_name = 'openid2';
    var component_obj  = {
        name: component_name,
        config:
            {
                //html: [ 'ccm.get', 'templates.json', 'input.inner.class' ],
                html:  {
                    "main":
                        {
                            "tag": "div",
                            "class": "openid2"
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
                style: [ 'ccm.load', 'style.css' ],
                openid: ['ccm.load' , 'openidconnect.js', 'sha256.js'],
                loggedInStore:
                //['ccm.store' , { store: 'openid_login' }],
                    ['ccm.store' , { url: 'wss://ccm.inf.h-brs.de', store: 'openid_login' }],
                clientId: '1096722142749-hcr71g909c47htrucd1ib31oaogfd0am.apps.googleusercontent.com',
                redirectUri: 'http://localhost/ccm/openid2/index.html',
                //debug page: http://localhost/openidconnectjstest/callback.html
                discoveryUri: 'https://accounts.google.com/',
                debug: true //set this to true for debug messages (many js popups!)
            },
        Instance: function ()
        {
            var self = this;
            //ccm.load( 'openidconnect.js' );
            //ccm.load( 'sha256.js' );
            //ccm.load( 'openidcommons.js' );
            var currentUser = null;
            var proceed = false;
            var proceed2 = false;
            self.start = function ( callback )
            {
                self.element.innerHtml = '';
                self.element.appendChild( self.ccm.helper.html( self.html.main ) );

                if(!isLoggedIn())
                {
                    try
                    {
                        OIDC.restoreInfo();
                        var id_token = OIDC.getValidIdToken();
                        var id_token_payload = OIDC.getIdTokenPayload(id_token);
                        var ccmuserid = b64_sha256(id_token_payload.sub);
                        localStorage['ccmuserid'] = ccmuserid;
                        var dataset = { key: ccmuserid , value: id_token_payload.email };
                        if(self.debug) alert('put dataset in store: '
                            + JSON.stringify(dataset));
                        self.loggedInStore.set( dataset );
                        currentUser = id_token_payload.email;

                        self.loggedInStore.get('knownUsers', function(dataset)
                        {
                            if(self.debug) alert('knownUsers from store: ' + JSON.stringify(dataset));
                            if(dataset == null)
                            {
                                //creating empty array to initialize
                                dataset = { key: 'knownUsers', value: []};
                            }
                            //Add current user to known users if not already done
                            if(dataset.value.indexOf(currentUser) == -1)
                            {
                                dataset.value.push(currentUser);
                            }
                            self.loggedInStore.set(dataset);
                            displayLoggedIn();
                        });
                    }
                    catch(e)
                    {
                        if(self.debug) alert(e);
                        var main_div = self.element.querySelector( '.openid2' );
                        displayLoginButton(main_div);
                    }
                }
                else
                {
                    displayLoggedIn();
                }

                if ( callback ) callback();
            }

            //check wether the user is logged in
            function isLoggedIn()
            {
                if(localStorage['ccmuserid'])
                {
                    var ccmuserid = localStorage['ccmuserid'];
                    if(self.debug) alert('id from storage: ' + ccmuserid);
                    self.loggedInStore.get(ccmuserid, function(dataset)
                    {
                        if(self.debug) alert('id from store (callback): '
                            + JSON.stringify(dataset));
                        if(dataset && dataset.key == ccmuserid)
                        {
                            currentUser = dataset.value;
                        }
                        proceed = true;
                    });
                    while(!proceed) if(self.debug) alert('wait-1...');
                    proceed = false;
                }
                return currentUser != null;
            }

            //Get the current user - if any
            function getCurrentUser()
            {
                return currentUser;
            }

            //Get current users roles
            function getCurrentUsersRoles()
            {
                if(currentUser == null) return;
                var roles = [];
                self.loggedInStore.get('userRoleMap', function(dataset)
                {
                    if(self.debug) alert('userRoleMap from store (callback): ' + JSON.stringify(dataset));
                    for ( var i = 0; i < dataset.value.length; i++ )
                    {
                        if(dataset.value[i].user == currentUser)
                        {
                            if(self.debug) alert('found role: ' + dataset.value[i].role);
                            roles.push(dataset.value[i].role);
                        }
                    }
                    proceed2 = true;
                });
                while(!proceed2) if(self.debug) alert('wait-2...');
                proceed2 = false;
                return roles;
            }

            //This gets rendered when the user is logged in
            function displayLoggedIn()
            {
                var main_div = self.element.querySelector( '.openid2' );
                displayGreeting(main_div);
                displayLogoutButton(main_div);
            }

            //Greeting
            function displayGreeting(parentElement)
            {
                if(!parentElement) return;
                parentElement.innerHTML = 'Willkommen ' + currentUser + '!<br/>';
                parentElement.innerHTML += 'Zugewiesene Rollen: ' + getCurrentUsersRoles() + '<br/>';
            }

            //Logout-Button
            function displayLogoutButton(parentElement)
            {
                if(!parentElement) return;
                parentElement.appendChild(self.ccm.helper.html(self.html.logout,
                    {
                        text: 'Logout',
                        onclick: function()
                        {
                            var ccmuserid = localStorage['ccmuserid'];
                            self.loggedInStore.del(ccmuserid);
                            localStorage.removeItem('ccmuserid');
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
                var url = getOpenIdURL();
                if(self.debug) alert(url);
                var linktext = "<a href="+url+">click</a>";
                parentElement.innerHTML = linktext;
            }

            //Build OpenID URL
            function getOpenIdURL()
            {
                var clientInfo = {
                    client_id : self.clientId,
                    redirect_uri : self.redirectUri
                };
                OIDC.setClientInfo( clientInfo );
                var providerInfo = OIDC.discover(self.discoveryUri);
                OIDC.setProviderInfo( providerInfo );
                OIDC.storeInfo(providerInfo, clientInfo);
                var requestData =	{
                    scope : 'openid+email',
                    response_type : 'id_token'
                };
                //return OIDC.login();
                return OIDC.login(requestData);
            }
        }
    };

    var namespace = window.ccm && ccm.components[ component_name ]; if ( namespace ) { if ( namespace.ccm_version ) ccm_version = namespace.ccm_version; if ( namespace.ccm_url ) ccm_url = namespace.ccm_url; }
    if ( !window.ccm || !ccm[ ccm_version ] ) { var tag = document.createElement( 'script' ); document.head.appendChild( tag ); tag.onload = register; tag.src = ccm_url; } else register();
    function register() { ccm[ ccm_version ].component( component_obj ); }
}() );