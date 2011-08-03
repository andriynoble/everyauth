var oauthModule = require('./oauth2'),
    xml         = require('o3-xml'),
    util        = require('util');

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
  
  .handleAuthCallbackError( function (req, res) {
    var parsedUrl = url.parse(req.url, true)
      , errorDesc = parsedUrl.query.error_description;
    if (res.render) {
      res.render('auth-fail', {
        errorDescription: errorDesc
      });
    } else {
      // TODO Replace this with a nice fallback
      throw new Error("You must configure handleAuthCallbackError if you are not using express");
    }
  })
  
  .fetchOAuthUser( function (accessToken) {
    var p = this.Promise();
    var token_value = 'Token token=' + accessToken ;
    this.oauth._request("GET", this.apiHost() + '/me.xml', { 'Authorization': token_value }, accessToken, function (err, data) {
      if (err) return p.fail(err);
      var oauthUser = xml.parseFromString(data).person;
      console.log(oauthUser);
      p.fulfill(oauthUser);
    });
    return p;
  });

