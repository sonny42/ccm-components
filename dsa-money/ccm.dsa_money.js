/**
 * @overview This component renders a simple money tracker for the pen and paper RPG DSA.
 * @author Philipp Sonnenberger 2020
 * @license The MIT License (MIT)
 */

( function () {

  const component = {

    name: 'dsa-money',

    ccm: 'https://ccmjs.github.io/ccm/versions/ccm-25.5.3.min.js',
	
	config: {
		'unit_block_template': [ 'ccm.load', 'money_unit_block.js' ],
		'container_template': [ 'ccm.load', 'container.js' ],
	},

    Instance: function () {
		
		this.start = async () => {
			
			const me = this;
			
			this.loadBootstrap = function() {
				ccm.load('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js',
						['https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
						'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js']);
				ccm.load({url:'https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css', context: this});
				ccm.load({url:'style.css', context: this});
			}; 
			
			let minus = function(event) {
				me.change(event, -1);
			};
			let minus5 = function(event) {
				me.change(event, -5);
			};
			let minus10 = function(event) {
				me.change(event, -10);
			};
			let plus = function(event) {
				me.change(event, 1);
			};
			let plus5 = function(event) {
				me.change(event, 5);
			};
			let plus10 = function(event) {
				me.change(event, 10);
			};
			
			this.change = function(event, amount) {
				let unit = event.target.value;
				this.money[unit] += amount;
				this.renderAll();
			};
			
			let convertUpHandler = function(event) {
				me.convertUp(event.target.value);
			};
			
			let convertDownHandler = function(event) {
				me.convertDown(event.target.value);
			};
			
			this.convertDown = function(unit) {
				let index = this.moneyOrder.indexOf(unit);
				let lowerUnit = this.moneyOrder[index+1];
				this.money[unit]--;
				this.money[lowerUnit]+=10;
				this.renderAll();
			};
			
			this.convertUp = function(unit) {
				let index = this.moneyOrder.indexOf(unit);
				let higherUnit = this.moneyOrder[index-1];
				this.money[unit]-=10;
				this.money[higherUnit]++;
				this.renderAll();
			};
			
			this.renderDublonen = function() {
				this.dublonenBlock = this.renderMoney(this.dublonenBlock, 'dublonen', false, true);
			};
			this.renderSilber = function() {
				this.silberBlock = this.renderMoney(this.silberBlock, 'silber', false, false);
			};
			this.renderHeller = function() {
				this.hellerBlock = this.renderMoney(this.hellerBlock, 'heller', false, false);
			};
			this.renderKreuzer = function() {
				this.kreuzerBlock = this.renderMoney(this.kreuzerBlock, 'kreuzer', true, false);
			};
			
			this.renderMoney = function(oldBlock, unitName, disbableFirst, disableLast) {
				let amount = this.money[unitName];
				let newBlock = this.ccm.helper.html(this.unit_block_template, 
					{
						unit: unitName,
						moneyValue: amount + ' ' + unitName,
						minusTenFunc: minus10,
						minusFiveFunc: minus5,
						minusFunc: minus,
						plusFunc: plus,
						plusFiveFunc: plus5,
						plusTenFunc: plus10,
						convertMinusFunc : convertDownHandler,
						convertPlusFunc: convertUpHandler
					}
				);
				let buttonGroupLeft = newBlock.childNodes[1];
				if(disbableFirst || amount < 1) {
					buttonGroupLeft.childNodes[0].disabled = true;
				}
				if(amount < 10) {
					buttonGroupLeft.childNodes[1].disabled = true;
				}
				if(amount < 5) {
					buttonGroupLeft.childNodes[2].disabled = true;
				}
				if(amount < 1) {
					buttonGroupLeft.childNodes[3].disabled = true;
				}
				newBlock.childNodes[2].childNodes[0].disabled = true;
				if(disableLast || amount < 10) {
					newBlock.childNodes[3].childNodes[3].disabled = true;
				}

				return newBlock;
			};
			
			this.renderAll = function() {
				this.renderDublonen();
				this.renderSilber();
				this.renderHeller();
				this.renderKreuzer();
				this.updateContainer();
			};
			
			this.updateContainer = function() {
				if(this.element.contains(this.container)) {
					this.element.removeChild(this.container);
				}
				let welcomeText = '<h1>Welcome to the <b>DSA Money Tracker</b>.</h1>';
				this.container = this.ccm.helper.html(this.container_template, 
					{
						text: welcomeText,
						content: [this.dublonenBlock, this.silberBlock, this.hellerBlock, this.kreuzerBlock]
					}
				);
				this.element.appendChild(this.container);
			}
			
			this.getMoney = function() {
				return {dublonen: 0, silber: 0 , heller: 0, kreuzer: 0};
			};
			
			this.money = this.getMoney();
			this.moneyOrder = ['dublonen','silber','heller','kreuzer'];
			
			this.loadBootstrap();
			this.element.innerHTML = '';
			this.renderAll();
			
			console.log('dsa money component rendered successfully');
			
		};
		
		
    }
	
  };

  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();