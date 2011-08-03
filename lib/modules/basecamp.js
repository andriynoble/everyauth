var oauthModule = require('./oauth2'),
    xml         = require('o3-xml');

var basecamp = module.exports = 
oauthModule.submodule('basecamp')
  .configurable({
    apiHost: 'e.g., https://graph.facebook.com'
    
  })
  
  .oauthHost('https://launchpad.37signals.com')
  
  .authPath('/authorization/new')
  .authQueryParam({'type':'web_server'})
  .accessTokenPath('/authorization/token')
  
  .accessTokenHttpMethod('post')
  .postAccessTokenParamsVia('data')
  .accessTokenParam({'type':'web_server'})
  
  .entryPath('/auth/basecamp')
  .callbackPath('/auth/basecamp/callback')
  
  .fetchOAuthUser( function (accessToken) {
    var p = this.Promise();
    this.oauth.get(this.apiHost() + '/people/me.xml', accessToken, function (err, data) {
      console.log(err.toString());
      if (err) return p.fail(err);
      var oauthUser = xml.parseFromString(data).person;
      console.log(oauthUser.toString());
      p.fulfill(oauthUser);
    })
    return p;
  });

