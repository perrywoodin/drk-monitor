angular.module('templates.app', ['header.tpl.html', 'mn/masternodes-list.tpl.html', 'mn/masternodes.tpl.html', 'mn/masternodesSearch-modal.tpl.html']);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<nav class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n" +
    "	<div class=\"container-fluid\">\n" +
    "		<div class=\"navbar-header\">\n" +
    "			<a href=\"#\" class=\"navbar-brand\">\n" +
    "				<img alt=\"DarkCoin MasterNode monitor\" src=\"img/darkcoin_logo_horizontal_lt_s.png\">\n" +
    "			</a>\n" +
    "		</div>\n" +
    "\n" +
    "		<p class=\"navbar-text pull-right hidden-xs\">MasterNode Monitor</p>\n" +
    "	</div>\n" +
    "</nav>");
}]);

angular.module("mn/masternodes-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mn/masternodes-list.tpl.html",
    "<div class=\"container\">\n" +
    "\n" +
    "	<div class=\"alert alert-info\" role=\"alert\">\n" +
    "		<span class=\"pull-right\">({{myMasternodes.length}} of {{masternodes.length | number}} total MNs)</span>\n" +
    "		<span class=\"glyphicons server\"></span> <strong>My MasterNodes</strong>\n" +
    "	</div>\n" +
    "\n" +
    "	<table class=\"table table-condensed table-hover\" ng-if=\"myMasternodes.length\">\n" +
    "		<thead>\n" +
    "			<tr>\n" +
    "				<th>IP Address</th>\n" +
    "				<th>Public Key</th>\n" +
    "				<th class=\"hidden-xs hidden-sm\">Next Check</th>\n" +
    "				<th class=\"hidden-xs hidden-sm\">Last Seen</th>\n" +
    "				<th>Received</th>\n" +
    "				<th></th>\n" +
    "			</tr>\n" +
    "		</thead>\n" +
    "\n" +
    "		<tbody>\n" +
    "			<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in myMasternodes\">\n" +
    "				<td>{{node.MasternodeIP}}</td>\n" +
    "				<td>{{node.MNPubKey}}\n" +
    "					<span class=\"glyphicons circle_info\" ng-if=\"node.Portcheck.Result !== 'open'\" popover-placement=\"top\" popover=\"{{node.Portcheck.ErrorMessage}}\"></span></td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.Portcheck.NextCheck}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.MNLastSeen}}</td>\n" +
    "				<td>{{node.Balance.Value | number:5}}</td>\n" +
    "				<td><button class=\"btn btn-default btn-xs\" ng-click=\"removeFromMyList(node)\"><span class=\"glyphicons circle_remove\" title=\"Remove from My Masternodes\"></span> Remove</button></td>\n" +
    "			</tr>\n" +
    "			<tr class=\"success\" ng-if=\"myMasternodes.length > 1\">\n" +
    "				<td></td>\n" +
    "				<td></td>\n" +
    "				<td class=\"hidden-xs\"></td>\n" +
    "				<td class=\"hidden-xs\"></td>\n" +
    "				<td><strong>{{balanceTotal | number:5}}</strong></td>\n" +
    "				<td></td>\n" +
    "			</tr>\n" +
    "\n" +
    "		</tbody>\n" +
    "\n" +
    "	</table>	\n" +
    "\n" +
    "	<div>\n" +
    "		<button type=\"button\" class=\"btn btn-primary\" ng-click=\"showMasternodeSearchModal()\">Search MasterNodes</button>\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("mn/masternodes.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mn/masternodes.tpl.html",
    "<script>\n" +
    "	\n" +
    "var jumboHeight = $('.jumbotron').outerHeight();\n" +
    "function parallax(){\n" +
    "    var scrolled = $(window).scrollTop();\n" +
    "    $('.bg').css('height', (jumboHeight-scrolled) + 'px');\n" +
    "}\n" +
    "\n" +
    "$(window).scroll(function(e){\n" +
    "    parallax();\n" +
    "});\n" +
    "\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<div class=\"bg\"></div>\n" +
    "<div class=\"jumbotron\">\n" +
    "\n" +
    "	<div class=\"jumbotron-input\">\n" +
    "		<div>\n" +
    "			<div>\n" +
    "				<label>Monitor By:</label>\n" +
    "				<input type=\"text\" placeholder=\"Public Key...\" class=\"quick-input\" ng-model=\"filter.node_key\" ng-keypress=\"($event.which === 13)?addToMyList(filter.node_key):0\"/>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view></div>");
}]);

angular.module("mn/masternodesSearch-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mn/masternodesSearch-modal.tpl.html",
    "<div class=\"modal-header\">\n" +
    "	<h3 class=\"modal-title\">All MasterNodes</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "	<input type=\"text\" class=\"form-control input-sm\" placeholder=\"Filter MasterNodes...\" ng-model=\"filter.node_search\">\n" +
    "\n" +
    "	<table class=\"table table-condensed table-hover\">\n" +
    "	<thead>\n" +
    "		<tr>\n" +
    "			<th>IP Address</th>\n" +
    "			<th>Public Key</th>\n" +
    "			<th>Received</th>\n" +
    "			<th></th>\n" +
    "		</tr>\n" +
    "	</thead>\n" +
    "\n" +
    "	<tbody>\n" +
    "		<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in (filteredNodes = (masternodes | filter: filter.node_search) | limitTo:10)\">\n" +
    "			<td>{{node.MasternodeIP}}</td>\n" +
    "			<td>{{node.MNPubKey}}</td>\n" +
    "			<td>{{node.Balance.Value | number:5}}</td>\n" +
    "			<td><button class=\"btn btn-default btn-xs\" ng-click=\"addToMyList(node.MNPubKey)\"><span class=\"glyphicons circle_plus\" title=\"Add to My Masternodes\"></span> Add</button></td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "	</table>	\n" +
    "\n" +
    "	<div>\n" +
    "		Showing maximum 10 of {{masternodes.length | number}}. Use the Filter input above to find your node.\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button class=\"btn btn-default\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>");
}]);
