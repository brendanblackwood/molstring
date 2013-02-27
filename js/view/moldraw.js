define([
	'jQuery',
	'Underscore',
	'JXG',
	'util/event_manager',
	'Backbone',
	'model/Molecule',
	'model/Atom',
	'model/Bond',
	'json!data/elements.json',
    'view/jsx_view'
], function($, _, JXG, EventManager, Backbone, Molecule, Atom, Bond, elements, JsxView) {

	var View = Backbone.View.extend({
		events: {
			'keyup'    : 'handleKeyPress',
			'keypress' : 'handleKeyPress'
		},
		subscribers: {},
		elements: {},

		initialize : function(options) {
			// setup perodic table elements
			this.elements = elements;

			var molecule = new Molecule();
			this.ATOM_COUNT = 0;
			this.bondList = {};
			this.BOND_COUNT = 0;
			this.board = this.buildJSXBoard();

			this.buildSelector();

			$(document).bind('keyup', $.proxy(this.handleKeyPress, this));
		},

		handleKeyPress : function(e) {
			if (e.keyCode == 27) {
		        if (this.hook) this.killBond(true);
		        if (this.editing) this.stopEditing();
		    } else if (e.keyCode == 46 && this.editing) {
		    } else if (this.editing && e.keyCode >= 65 && e.keyCode <= 91) {
		        this.editing.symbol.setText(String.fromCharCode(e.keyCode));
		        this.board.update();
		    }
		},

		buildJSXBoard : function() {
			var self = this;

			JXG.Options.grid.snapToGrid = true;
			JXG.Options.grid.gridX = 1;
			JXG.Options.grid.gridY = 1;
			JXG.Options.grid.strokeColor = '#C0C0C0';
			JXG.Options.grid.strokeOpacity = '0.5';
			JXG.Options.grid.strokeWidth = 1;
			JXG.Options.grid.dash = 0;

			var board = JXG.JSXGraph.initBoard('jxgbox',{
				boundingbox:[0,30,40,0],
				shownavigation:false
			});
			board.addGrid();

            var jsxView = new JsxView({board:board});
			return board;
		},

		// stopEditing : function() {
		//     this.editing.setAttribute({strokeColor:'#000000'});
		//     delete(this.editing);
		// },

		// onBondClick : function(bond) {
		//     switch (bond.bondType) {
		//         case 'single':
		//             bond.doubleBond = this.createBond(bond.atomA, bond.atomB, {strokeColor:'#FFFFFF'}, true);
		//             bond.setAttribute({strokeWidth:5, strokeColor:'#000000'});
		//             bond.bondType = 'double';
		//         break;
		//         case 'double':
		//             bond.tripleBond = this.createBond(bond.atomA, bond.atomB, {strokeColor:'#000000'}, true);
		//             bond.doubleBond.setAttribute({strokeWidth:5});
		//             bond.setAttribute({strokeWidth:8, strokeColor:'#000000'});
		//             bond.bondType = 'triple'
		//         break;
		//         case 'triple':
		//             bond.doubleBond.remove();
		//             bond.tripleBond.remove();
		//             delete(bond.doubleBond);
		//             delete(bond.tripleBond);
		//             bond.setAttribute({strokeWidth:3, strokeColor:'#000000'});
		//             bond.bondType = 'single';
		//         break;
		//     }
		// }

		buildSelector : function() {
			var self = this;

			$("#selector").autocomplete({
				minLength: 1,
				// source: _.map(this.elements, function(element) {
				// 	return $.extend({}, element, {
				// 		label: element.name,
				// 		value: element.atomic_number
				// 	});
				// }),
				source: function(request, response) {
					// debugger;
					var matches = _.filter(self.elements, function(element) {
						var term   = request.term.toLowerCase(),
							symbol = element.symbol.toLowerCase(),
							name   = element.name.toLowerCase();
						return symbol.indexOf(term) !== -1 || name.indexOf(term) !== -1;
					});

					response(_.map(matches, function(element) {
						return $.extend({}, element, {
							label: element.name,
							value: element.atomic_number
						});
					}));
				},
				focus: function(event, ui) {
					$("#selector").val( ui.item.label );
					return false;
				},
				select: function(event, ui) {
					$("#selector").val( ui.item.label );
					console.log(ui.item.label);
					return false;
				}
			})
			.data("ui-autocomplete")._renderItem = function(ul, item) {
				var $li = $("<li>")
						.append('<a><div class="row"></div></a>'),
					$icon = $('<span>')
						.text(item.symbol)
						.addClass('icon')
						.css({
							'border': '2px solid ' + item.stroke_color,
							'background-color': item.color
						}),
					$name = $('<span>')
						.text(item.name)
						.addClass('name');
				$li.find('.row').append($icon, $name);
				return $li.appendTo(ul);
			};
		}
	});

	// Mix in the event manager functionality
	EventManager(View.prototype);

	return View;
});