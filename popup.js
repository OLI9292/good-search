var data = [
  { name: "amazon", searchUrl: "https://www.amazon.com/s/?field-keywords=", key: "A" },
  { name: "bing", searchUrl: "https://www.bing.com/search?q=", key: "B" },
  { name: "facebook", searchUrl: "https://www.facebook.com/search?q=", key: "F" },
  { name: "google", searchUrl: "https://www.google.com/search?q=", key: "G" },
  { name: "linkedin", searchUrl: "https://www.linkedin.com/vsearch/f?type=all&keywords=", key: "L" },
  { name: "reddit", searchUrl: "https://www.reddit.com/search?q=", key: "R" },
  { name: "wikipedia", searchUrl: "https://en.wikipedia.org/wiki/", key: "W" },
  { name: "youtube", searchUrl: "https://www.youtube.com/search?q=", key: "Y"  }
];

var disabledKeys = [];

function setInitialData() {
  chrome.storage.sync.get("profile", function (obj) {
    if(typeof obj.profile === "undefined") {
      chrome.storage.sync.set({ "profile": data });
      sendDataToBackground(data);
    }
  });
};

function loadContent() {
  data.forEach(function(site, i) {
    $(".site-row").eq(i).load("select.html", function() {
      addContent(i, site.name);
      setSelectedKey($("select", this), site.name);
    });
  });
};

function addContent(i, site) {
  $(".site").eq(i).append('<img src="images/' + site + '.png" alt="' + site + '" />');
  $(".key").eq(i).data('site', site);
  document.getElementsByClassName("site-row")[i].addEventListener("change", function() {
    var key = $(this).find(":selected").text();
    changeKey(site, key);
  });
};

function setSelectedKey(div, name) {
  chrome.storage.sync.get("profile", function (obj) {
    for(site of obj.profile) {
      if(site.name === name) {
        div.val(site.key);
        if($.inArray(site.key, disabledKeys)) {
          disabledKeys.push(site.key);
          disableKeys();
        }
      }
    }
  });
};

function changeKey(name, key) {
  chrome.storage.sync.get("profile", function (obj) {
    for(site of obj.profile) {
      if(site.name === name) {
        enableKey(site.key);
        site.key = key;
        disabledKeys.push(site.key);
        disableKeys();
      }
    }
    chrome.storage.sync.set({ "profile": obj.profile });
    sendDataToBackground(obj.profile);
  });
};

function disableKeys() {
  $("select").each(function() {
    var this_ = $(this)
    disabledKeys.forEach(function(key) {
      this_.find('option[value="' + key + '"]').attr("disabled", "disabled");
    });
  });
};

function enableKey(key) {
  var i = disabledKeys.indexOf(key);
  if(i === -1) { return; }
  disabledKeys.splice(i, 1);
  $("select").each(function() {
    console.log($(this).find('option[value="' + key + '"]'));
    $(this).find('option[value="' + key + '"]').removeAttr("disabled")
  });
};

function sendDataToBackground(profile) {
  chrome.runtime.sendMessage({ data: profile });
};

function addInstructions() {
  $(".instructions-button").hover(function() {
      $(".instructions").show();
    }, function() {
      $(".instructions").hide();
    }
  );
};

document.addEventListener('DOMContentLoaded', function() {
  setInitialData();
  loadContent();
  addInstructions();
});
