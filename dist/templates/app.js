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
    "<div class=\"container row\">\n" +
    "\n" +
    "	<div class=\"col-sm-3\">\n" +
    "\n" +
    "		<button class=\"btn btn-default btn-xs\" ng-click=\"toggleFilter()\">\n" +
    "			<span ng-if=\"!filter.showAll\">Show All</span>\n" +
    "			<span ng-if=\"filter.showAll\">Filter Mine</span>\n" +
    "		</button>\n" +
    "		\n" +
    "		<h5>My MasterNodes</h5>\n" +
    "\n" +
    "\n" +
    "		<div ng-class=\"{'text-muted':filter.showAll}\" ng-repeat=\"node in myMasternodes\">\n" +
    "			<a class=\"pull-right\" title=\"Remove {{node}}\" href=\"#\" ng-click=\"removeFromMyList(node)\"><span class=\"glyphicons bin\"></span></a>\n" +
    "			{{node}}\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"col-sm-9\">\n" +
    "\n" +
    "		<table class=\"table table-condensed table-hover\">\n" +
    "		<thead>\n" +
    "			<tr>\n" +
    "				<th>IP Address</th>\n" +
    "				<th>Public Key</th>\n" +
    "				<th>Next Check</th>\n" +
    "				<th>Last Seen</th>\n" +
    "				<th>Balance</th>\n" +
    "			</tr>\n" +
    "		</thead>		\n" +
    "		<tbody>\n" +
    "			<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in masternodes | filter: filterMNs\">\n" +
    "				<td>{{node.MasternodeIP}}:{{node.MasternodePort}}</td>\n" +
    "				<td><span class=\"glyphicons keys\" popover-placement=\"top\" popover=\"{{node.MNPubKey}}\"></span></td>\n" +
    "				<td>{{node.Portcheck.NextCheck}}</td>\n" +
    "				<td>{{node.MNLastSeen}}</td>\n" +
    "				<td>{{node.Balance.Value | number:5}}</td>\n" +
    "			</tr>\n" +
    "		</tbody>\n" +
    "\n" +
    "		</table>		\n" +
    "\n" +
    "	</div>\n" +
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
    "				<label>Filter By:</label>\n" +
    "				<input type=\"text\" placeholder=\"IP Address...\" class=\"quick-input\" ng-model=\"filter.ipaddress\" ng-keypress=\"($event.which === 13)?addToMyList():0\"/>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view></div>");
}]);
