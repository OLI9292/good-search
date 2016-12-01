var defaultKeys = function() {
  return [
    {
      site: "youtube",
      url: "https://www.youtube.com/search?q=",
      key: "Y"
    },
    {
      site: "reddit",
      url: "https://www.reddit.com/search?q=",
      key: "R"
    }
  ]
}

var setKeys = function() {
  var keys = [];
  chrome.storage.sync.get("profile", function (obj) {
    if(typeof obj.profile === "undefined") {
      chrome.storage.sync.set({ "profile": defaultKeys() }, function() {
        obj.profile.forEach(function(obj_) { keys.push(obj_.key) });
        saveData(data);
      });
    }
    obj.profile.forEach(function(obj_) { keys.push(obj_.key) });
  });
  return keys;
};

var changeKey = function(site, key) {
  var profile = chrome.storage.sync.get("profile", function (obj) {
    for(obj_ of obj.profile) {
      if(obj_.site === site) { obj_.key = key; }
    }
    chrome.storage.sync.set({ "profile": obj.profile });
    saveData(obj.profile);
  });
}

function saveData(data) {
  chrome.runtime.sendMessage({ data: data }, function(res) { console.log(res); });
}

document.addEventListener('DOMContentLoaded', function() {
  var keys = setKeys();
  jQuery( ".key" ).each(function(i) {
    $(this).load("select.html", function() {
      $("select", this).val(keys[i]);
      var keySelector = document.getElementsByClassName("keys")[i];
      keySelector.addEventListener("change", function() {
        var site = $(this).parent().data("site");
        var key = $(this).find(":selected").text();
        changeKey(site, key);
      });
    });
  });
});
