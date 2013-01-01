// Inspired by http://aboutcode.net/scripts/site.js
jQuery.fn.loadRepositoriesOrg = function() {
  var target = this;
  $.githubOrg("tkjelectronics",function(response) {
    //console.log(response);
    target.append('<a href="https://github.com/TKJElectronics"><h1 style="color:black">TKJ Electronics</h1></a>');
    var repos = response.data;
    $.sortByNumberOfWatchers(repos);
    $.printRepos(repos,target);
  });

};
jQuery.fn.loadRepositoriesUsers = function() {
  var target = this;
  $.githubUser("lauszus",function(response) {
    //console.log(response);
    target.append('<a href="https://github.com/Lauszus"><h1 style="color:black">Lauszus</h1></a>');
    var repos = response.data;
    $.sortByNumberOfWatchers(repos);
    $.printRepos(repos,target);    
    target.append('<a href="https://github.com/felis/USB_Host_Shield_2.0">USB_Host_Shield_2.0</a><br>'); // Also include the USB Host Shield library manually
    target.append("Revision 2.0 of USB Host Library for Arduino.");
  });
  //this.append("<h1>mindthomas</h1>");
}
jQuery.printRepos = function(repos, target) {
  $(repos).each(function() {
    if (!this.fork && this.name != "tkjelectronics.github.com") {
      target.append('<a href="'+ this.html_url +'">' + this.name + '</a><br>');
      target.append(this.description + '<br>');      
    }    
  });
}
jQuery.sortByNumberOfWatchers = function(repos) {
  repos.sort(function(a,b) {
    return b.watchers - a.watchers;
  });
}
jQuery.githubUser = function(username, callback) {
  jQuery.getJSON("https://api.github.com/users/" + username + "/repos?callback=?", callback);
}
jQuery.githubOrg = function(organization, callback) {
  jQuery.getJSON("https://api.github.com/orgs/" + organization + "/repos?callback=?", callback);  
};