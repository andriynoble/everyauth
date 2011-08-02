var oauthModule = require('./oauth2');

var basecamp = module.exports = 
oauthModule.submodule('basecamp')
  .configurable({
    apiHost: 'e.g., https://graph.facebook.com'
    
  })
  
  .oauthHost('https://launchpad.37signals.com')
  
  .authPath('/authorization/new')
  .accessTokenPath('/authorization/token')
  
  .accessTokenHttpMethod('post')
  
  .entryPath('/auth/basecamp')
  .callbackPath('/auth/basecamp/callback')
  
  .fetchOAuthUser( function (accessToken) {
    var p = this.Promise();
    this.oauth.get(this.apiHost() + '/user/show', accessToken, function (err, data) {
      if (err) return p.fail(err);
      var oauthUser = JSON.parse(data).user;
      p.fulfill(oauthUser);
    })
    return p;
  });

basecamp.moreAuthQueryParams = {'type':'web_server'}