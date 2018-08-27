class LicenseChecker {

   static checkLicense(toshiuser,oauthuser,version) {
    let license = false;
    let heroinitid;
    var url = "https://toshinou.000webhostapp.com/license/?user=" + toshiuser + "&oauth=" + oauthuser + "&version=" + version;
    var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        xhr.open('GET', url, false);
      } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open('GET', url);
      } else {
        xhr = null;
      }
      xhr.onload = function() {
        var jsonText = xhr.responseText;
        let parsedCmd = JSON.parse(jsonText);
        license = parsedCmd.license;
        heroinitid = parseInt(parsedCmd.heroinithandler);
      };
    xhr.send();
    return {
      works: license,
      heroinithandler: heroinitid
    }
  }

}