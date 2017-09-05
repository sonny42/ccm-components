/** ccm.openidadmin.js */
ccm.component( {
	name: 'openidadmin',
	config:
    {
		html:  [ ccm.store, { local: 'templatesadmin.json' } ],
		style: [ ccm.load, 'styleadmin.css' ],
		roles: ['Dozent', 'Student', 'Tutor', 'Administrator'],
		adminRole: 'Administrator',
		superAdmin: 'philipp.sonnenberger@gmail.com',
		openid:  [ ccm.instance, 'http://localhost/ccm/openid2/ccm.openid.js' ],
		loggedInStore:
		//[ccm.store , { store: 'openid_login' }],
		[ccm.store , { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'openid_login' }],
		debug: true
	},
	Instance: function ()
	{
		var self = this;
		ccm.load( 'openidcommons.js' );
		self.render = function ( callback )
		{
			rendercontent();
			//if(isLoggedIn())
			//{
				//Render Content only if user is super admin or has admin role
			//	if(getCurrentUser() == self.superAdmin  || getCurrentUsersRoles().indexOf(self.adminRole) != -1)
			//	{
					
			//	}
			//	else
			//	{
			//		var element = ccm.helper.element( self );
			//		element.html( 'Unzureichende Berechtigung!' );
			//		displayLogoutButton(element);
			//	}
			//}
			
			if(callback) callback();
		}
		
		//render content after successful login
		function rendercontent()
		{
			//render main div
			var element = ccm.helper.element( self );
			element.html( ccm.helper.html( self.html.get( 'main' ) ) );
			
			var form = ccm.helper.html(self.html.get( 'form' ),
			{
				onsubmit: function()
				{
					buttonClicked();
				}
			});
			
			//render role select element
			var roleSelect = ccm.helper.html( self.html.get( 'select' ), {size: '4', id: 'select1'} );
			for ( var i = 0; i < self.roles.length; i++ )
			{
				var selectOption = ccm.helper.html( self.html.get( 'select_option' ),
				{
					value: self.roles[i],
					inner: self.roles[i]
				});
				roleSelect.append(selectOption);
			}
			form.append(roleSelect);
			
			//render user select element
			var userSelect = ccm.helper.html( self.html.get( 'select' ), {size: '4', id: 'select2'} );
			//render select button1
			var button = ccm.helper.html(self.html.get('submit'), {value: 'Zuordnen'});
			
			self.loggedInStore.get('knownUsers', function(dataset)
			{
				if(self.debug) alert('knownUsers from store: ' + JSON.stringify(dataset));
				if(dataset == null)
				{
					//storing empty array to initialize
					dataset = { key: 'knownUsers', value: []};
					self.loggedInStore.set(dataset);
				}
			
				for ( var i = 0; i < dataset.value.length; i++ )
				{
					var selectOption = ccm.helper.html( self.html.get( 'select_option' ),
					{
						value: dataset.value[i],
						inner: dataset.value[i]
					});
					userSelect.append(selectOption);
				}
				form.append(userSelect);
				form.append(button);
			});
	
			var form2 = ccm.helper.html(self.html.get( 'form' ),
			{
				onsubmit: function()
				{
					buttonClicked2();
				}
			});

			//render select button2
			var button2 = ccm.helper.html(self.html.get('submit'), {value: 'Zuordnung löschen'});			
			var userRole = ccm.helper.html( self.html.get( 'select' ), {size: '4', id: 'select3'} );
			self.loggedInStore.get('userRoleMap', function(dataset)
			{
				if(self.debug) alert('userRoleMap from store: ' + JSON.stringify(dataset));
				if(dataset == null)
				{
					//storing empty array to initialize
					dataset = { key: 'userRoleMap', value: []};
					self.loggedInStore.set(dataset);
				}
				//render array
				for ( var i = 0; i < dataset.value.length; i++ )
				{
					if(self.debug) alert(JSON.stringify(dataset.value[i]));			
					var selectOption = ccm.helper.html( self.html.get( 'select_option' ),
					{	
						value: i, //use index as value for easy access later on
						inner: dataset.value[i].user + ' <=> ' + dataset.value[i].role //create user readable text
					});
					userRole.append(selectOption);
				}
				form2.append(userRole);
				form2.append(button2);	
			});

			//render forms
			element.append(form);
			element.append(form2);
		}
				
		//this gets executed when button1 is clicked (add)
		function buttonClicked()
		{
			if(self.debug) alert('button1 clicked');
			var select1 = ccm.helper.val( ccm.helper.find( self, '#select1' ).val() );
			var select2 = ccm.helper.val( ccm.helper.find( self, '#select2' ).val() );
			var entry = { role: select1, user: select2 };
			self.loggedInStore.get('userRoleMap', function(dataset)
			{
				if(self.debug) alert('putting entry into store: ' + JSON.stringify(entry));
				//add new entry and save change
				dataset.value.push(entry);
				self.loggedInStore.set(dataset);
			});
		}
		
		//this gets executed when button2 is clicked (delete)
		function buttonClicked2()
		{
			if(self.debug) alert('button2 clicked2');
			//value of selected element is the elements index
			var select = ccm.helper.val( ccm.helper.find( self, '#select3' ).val() );
			self.loggedInStore.get('userRoleMap', function(dataset)
			{
				//remove selected element
				dataset.value.splice(select, 1);
				self.loggedInStore.set(dataset);
			});
		}
		
	}
	

});