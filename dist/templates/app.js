angular.module('templates.app', ['header.tpl.html', 'mn/masternodes-list.tpl.html', 'mn/masternodes.tpl.html']);

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
    "	<table class=\"table table-condensed table-hover\">\n" +
    "		<thead>\n" +
    "			<tr>\n" +
    "				<th>IP Address</th>\n" +
    "				<th>Public Key</th>\n" +
    "				<th class=\"hidden-xs hidden-sm\">Next Check</th>\n" +
    "				<th class=\"hidden-xs hidden-sm\">Last Seen</th>\n" +
    "				<th>Balance</th>\n" +
    "			</tr>\n" +
    "		</thead>\n" +
    "\n" +
    "		<tbody>\n" +
    "			<tr ng-if=\"myMasternodes.length\">\n" +
    "				<td colspan=\"100%\" class=\"info\">\n" +
    "					<span class=\"glyphicons server\"></span> <strong>My MasterNodes</strong>\n" +
    "				</td>\n" +
    "			</tr>\n" +
    "			<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in masternodes | filter: filterMyMasterNodes\">\n" +
    "				<td>{{node.MasternodeIP}}</td>\n" +
    "				<td>{{node.MNPubKey}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.Portcheck.NextCheck}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.MNLastSeen}}</td>\n" +
    "				<td>{{node.Balance.Value | number:5}}</td>\n" +
    "				<td><button class=\"btn btn-default btn-xs\" ng-click=\"removeFromMyList(node)\"><span class=\"glyphicons circle_remove\" title=\"Remove from My Masternodes\"></span> Remove</button></td>\n" +
    "			</tr>\n" +
    "\n" +
    "			<tr>\n" +
    "				<td colspan=\"100%\"></td>\n" +
    "			</tr>			\n" +
    "\n" +
    "			<tr>\n" +
    "				<td colspan=\"100%\" class=\"info\">\n" +
    "					<span class=\"glyphicons server\"></span> <strong>All MasterNodes </strong>\n" +
    "				</td>\n" +
    "			</tr>\n" +
    "			<tr>\n" +
    "				<td colspan=\"100%\" class=\"active\">\n" +
    "					<input type=\"text\" class=\"form-control input-sm\" placeholder=\"Search MasterNodes...\" ng-model=\"filter.node_search\">\n" +
    "				</td>\n" +
    "			</tr>\n" +
    "			<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in masternodes | filter: filterMNs | filter: filter.node_search\">\n" +
    "				<td>{{node.MasternodeIP}}</td>\n" +
    "				<td>{{node.MNPubKey}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.Portcheck.NextCheck}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.MNLastSeen}}</td>\n" +
    "				<td>{{node.Balance.Value | number:5}}</td>\n" +
    "				<td><button class=\"btn btn-default btn-xs\" ng-click=\"addToMyList(node.MNPubKey)\"><span class=\"glyphicons circle_plus\" title=\"Add to My Masternodes\"></span> Add</button></td>\n" +
    "			</tr>\n" +
    "		</tbody>\n" +
    "\n" +
    "	</table>	\n" +
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
    "				<label>Add to My MasterNodes By:</label>\n" +
    "				<input type=\"text\" placeholder=\"Public Key or IP Address...\" class=\"quick-input\" ng-model=\"filter.node_key\" ng-keypress=\"($event.which === 13)?addToMyList(filter.node_key):0\"/>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view></div>");
}]);
