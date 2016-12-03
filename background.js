var localstorage;

chrome.runtime.onMessage.addListener(function(req) {
  if(req.data) { localstorage = req.data; }
});

function getRedirect(url) {
  var search = url.split("search?q=")[1].split("&oq=")[0];
  var searchKey = search.split("+")[0].toLowerCase();
  var searchTerm = search.split("+").slice(1).join("+");
  return matchRedirect(searchKey, searchTerm);
};

function matchRedirect(searchKey, searchTerm) {
  for(obj of localstorage) {
    if(searchKey === obj["key"].toLowerCase()) {
      return { redirectUrl: obj["searchUrl"] + searchTerm };
    }
  }
};

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if(details.url.indexOf("search?q=") === -1) { return; }
    return getRedirect(details.url);
  },
  { urls: ["<all_urls>"] }, 
  ['blocking']
);
