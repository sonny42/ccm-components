		//get current current user name - if any
		function getCurrentUser()
		{
			var currentUser = null;
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
			return currentUser;
		}
		
		//check wether the user is logged in
		function isLoggedIn()
		{
			return getCurrentUser() != null;
		}
			
		//Logout-Button
		function displayLogoutButton(parentElement)
		{
			if(!parentElement) return;
			parentElement.append(ccm.helper.html( self.html.get( 'logout' ),
			{
				text: 'Logout',
				onclick: function()
				{
					var ccmuserid = localStorage['ccmuserid'];
					self.loggedInStore.del(ccmuserid);
					localStorage.removeItem('ccmuserid');
					currentUser = null;
					window.location.href = self.redirectUri;
					self.render();
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
			var linktext = "<a href="+url+">click</a>"
			parentElement.append(linktext);
		}
		
		//Get current users roles
		function getCurrentUsersRoles()
		{
			var currentUser = getCurrentUser();
			if(currentUser == null) return;
			var roles = [];
			self.loggedInStore.get('userRoleMap', function(dataset)
			{
				if(self.debug) alert('userRoleMap from store (callback): ' + JSON.stringify(dataset));
				for ( var i = 0; i < dataset.value.length; i++ )
				{
					var currentvalue = dataset.value[i];
					if(currentValue.user == currentUser)
					{
						roles.push(currentValue.role);
					}
				}
				proceed = true;
			});
			while(!proceed) if(self.debug) alert('wait-2...');
			proceed = false;
			return roles;
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
									response_type : 'id_token',
								}		
			//return OIDC.login();
			return OIDC.login(requestData);
		}