// Inspired by http://aboutcode.net/scripts/site.js
jQuery.fn.loadRepositoriesOrg = function() {
  var target = this;
  $.githubOrg("tkjelectronics",function(response) {
    //console.log('tkjelectronics',response);
    target.append('<a href="https://github.com/TKJElectronics"><h1 style="color:black">TKJ Electronics</h1></a>');
    if(response.meta["X-RateLimit-Remaining"] == 0) {
      //alert("Couldn't load content - You have reached the rate limit for API request to Github");
      return;
    }
    var repos = response.data;
    $.sortByNumberOfWatchers(repos);
    $.printRepos(repos,target);
  });
};
jQuery.fn.loadRepositoriesUsers = function() {
  var target = this;
  $.githubUser("lauszus",function(response) {
    //console.log('lauszus',response);
    target.append('<a href="https://github.com/Lauszus"><h1 style="color:black">Lauszus</h1></a>');
    if(response.meta["X-RateLimit-Remaining"] == 0) {
      alert("Couldn't load content - You have reached the rate limit for API request to Github");
      return;
    }   
    addToHtml(target,"https://github.com/felis/USB_Host_Shield_2.0","USB_Host_Shield_2.0","Revision 2.0 of USB Host Library for Arduino"); // Include the USB Host Shield library manually
    var repos = response.data;
    $.sortByNumberOfWatchers(repos);
    $.printRepos(repos,target);    
  });
  //$.githubUser("mindthomas",function(response)
};
var i = 0;
jQuery.printRepos = function(repos, target) {  
  $(repos).each(function() {
    if(!this.fork && this.name != "tkjelectronics.github.com") {
      var name = this.name;
      var description = this.description;
      var url = this.html_url;
      var ownerLogin = this.owner.login;
      var CNAMEFound = false;
      $.checkGhPage(ownerLogin,name,function(response) { // Check if repo got a "gh-pages" branch
        //console.log('checkGhPage',response);
        var branch = response.data.tree;
        if(branch != null) {
          var length = $(branch).length;
          //console.log('Number of files: ',length);
          $(branch).each(function(index) { // Check all the files
            //console.log('Checking branch file[%s]',index,this);
            if(this.path == "CNAME") {
              //console.log('CNAME found');
              CNAMEFound = true;
              // It take some time before the respons is received we will put the content into this div
              target.append('<div id="site' + i + '"></div>');
              checkFileContent('site' + i,this.url,name,description);
              i++; // Increment the counter
            }
            if(CNAMEFound)
              return false; // This will break the "each function"
            if(index === length-1 && !CNAMEFound) { // It must be hosted at the default location then
              //console.log('Using default site location for: ',name);
              addToHtml(target,'http://' + ownerLogin + '.github.com/' + name,name,description);
            }
          });
        } else {
          //console.log('No gh-pages branch were found for: ',name);
          addToHtml(target,url,name,description);
        }    
      });
    }
  });
};
function checkFileContent(divId,fileUrl,name,description) {
  $.getFileContent(fileUrl,function(response) { // It takes some time before the respond is received
    //console.log('getFileContent',response);
    var url = "http://" + $.base64.decode($.trim(response.content.replace(/[\n]/g, ""))); // Remove the new line, trim, and decode the base64 string
    //console.log('Name: %s and Url: %s',name,url);
    addToHtml($('#' + divId),url,name,description);
  });
};
function addToHtml(target,url,name,description) {
  target.append('<h3><a href="'+ url +'">' + name + '</a></h3>');
  target.append(replaceURLWithHTMLLinks(description) + '<br><br>');
};
function replaceURLWithHTMLLinks(text) { // Source: http://stackoverflow.com/a/6707547
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(exp,"<a href='$1'>$1</a>");
};
jQuery.sortByNumberOfWatchers = function(repos) {
  repos.sort(function(a,b) {
    return b.watchers - a.watchers;
  });
};
jQuery.githubUser = function(username, callback) {
  jQuery.getJSON("https://api.github.com/users/" + username + "/repos?callback=?", callback);
};
jQuery.githubOrg = function(organization, callback) {
  jQuery.getJSON("https://api.github.com/orgs/" + organization + "/repos?callback=?", callback);
};
jQuery.checkGhPage = function(username, repoName, callback) {
  jQuery.getJSON("https://api.github.com/repos/" + username + "/" + repoName + "/git/trees/gh-pages?callback=?", callback);
};
jQuery.getFileContent = function(fileUrl, callback) {
  jQuery.getJSON(fileUrl, callback);
};