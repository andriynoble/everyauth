var oauthModule = require('./oauth2'),
    xml         = require('node-xml'),
    util        = require('util');

var parser = new xml.SaxParser(function(cb) {
  cb.onStartDocument(function() {

  });
  cb.onEndDocument(function() {

  });
  cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
      sys.puts("=> Started: " + elem + " uri="+uri +" (Attributes: " + JSON.stringify(attrs) + " )");
  });
  cb.onEndElementNS(function(elem, prefix, uri) {
      sys.puts("<= End: " + elem + " uri="+uri + "\n");
         parser.pause();// pause the parser
         setTimeout(function (){parser.resume();}, 200); //resume the parser
  });
  cb.onCharacters(function(chars) {
      //sys.puts('<CHARS>'+chars+"</CHARS>");
  });
  cb.onCdata(function(cdata) {
      sys.puts('<CDATA>'+cdata+"</CDATA>");
  });
  cb.onComment(function(msg) {
      sys.puts('<COMMENT>'+msg+"</COMMENT>");
  });
  cb.onWarning(function(msg) {
      sys.puts('<WARNING>'+msg+"</WARNING>");
  });
  cb.onError(function(msg) {
      sys.puts('<ERROR>'+JSON.stringify(msg)+"</ERROR>");
  });
});

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
    this.oauth._request("GET", this.apiHost() + '/me.xml', { 'Authorization': token_value }, {}, function (err, data, response) {
      if (err) return p.fail(err);
      
      var oauthUser = parser.parseString(data);
      
      p.fulfill(oauthUser);
    });
    return p;
  });

