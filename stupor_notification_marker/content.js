function stringToHash(string) {              
  var hash = 0;
  if (string.length == 0) return hash;
  for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
  }
  return hash;
}

function changeTextColor() {
  const pengumumans = document.getElementsByClassName("judulPengumuman");

  // Read
  chrome.storage.local.get({read: [], highlight: []}, function (result) {
    var read = result.read;
    var highlight = result.highlight;
    for (pengumuman of pengumumans){
      if (highlight.includes(stringToHash(pengumuman.innerHTML))) {
        pengumuman.parentNode.parentNode.parentNode.style.setProperty('background-color', '#FFD679', 'important');
      } else if (read.includes(stringToHash(pengumuman.innerHTML))) {
        pengumuman.parentNode.parentNode.parentNode.style.setProperty('background-color', '#CCCCCC', 'important');
      } else {
        pengumuman.parentNode.parentNode.parentNode.style.setProperty('background-color', 'white', 'important');
      }
    }
  });
}

// Mark as read
function mark_as_read(){
  // https://stackoverflow.com/questions/17862228/button-onclick-inside-whole-clickable-div
  event.stopPropagation()
  const value = parseInt(this.getAttribute("value"));

  // https://stackoverflow.com/questions/16605706/store-an-array-with-chrome-storage-local
  chrome.storage.local.get({read: []}, function (result) {
    var read = result.read;
    if (read.includes(value)){
      // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
      read = read.filter(item => item !== value)
    } else {
      read.push(value);
    }

    chrome.storage.local.set({read: read}, function () {
      changeTextColor();
    });
    
  });

  
}

// Mark as highlighted
function mark_as_highlight(){
  event.stopPropagation()
  const value = parseInt(this.getAttribute("value"));

  chrome.storage.local.get({highlight: []}, function (result) {
    var highlight = result.highlight;
    if (highlight.includes(value)){
      highlight = highlight.filter(item => item !== value)
    } else {
      highlight.push(value);
    }

    chrome.storage.local.set({highlight: highlight}, function () {
      changeTextColor();
    });
  });
  
}

function clearLocalStorage(){
  if (confirm("Clear markers?")){
    chrome.storage.local.clear()
  }
  changeTextColor();
}

function initialize(){
  console.log("Studentportal Notification Marker Initializing");
  // Add the buttons

  // https://stackoverflow.com/questions/11371550/change-hover-css-properties-with-javascript
  var css = '.scm-btn:hover{ background-color: #BCBCBC }';
  var style = document.createElement('style');
  
  if (style.styleSheet) {
      style.styleSheet.cssText = css;
  } else {
      style.appendChild(document.createTextNode(css));
  }
  
  document.getElementsByTagName('head')[0].appendChild(style);

  // Trash can button to delete storage
  const rowpb2 = document.getElementsByClassName("row pb-2")[0];
  rowpb2.getElementsByTagName("div")[0].className = "col-8 float-right";
  var trashcan = document.createElement("button");
  trashcan.innerHTML = "🗑️";
  trashcan.className = "col-2";
  trashcan.style.backgroundColor = "transparent";
  trashcan.style.border = "none";
  trashcan.onclick = clearLocalStorage;
  rowpb2.insertBefore(trashcan, rowpb2.firstChild);

  const card_pengumumans = document.getElementsByClassName("card-pengumuman");
  for (card_pengumuman of card_pengumumans){
    var judulPengumuman = card_pengumuman.getElementsByClassName("judulPengumuman")[0].innerHTML;
    
    var br = document.createElement("br");
    card_pengumuman.appendChild(br);
    
    // Buttons container
    var div = document.createElement("div");
    div.style.display = "flex";
    div.style.justifyContent = "space-between";

    // Read button
    var read = document.createElement("button");
    read.value = stringToHash(judulPengumuman);
    read.innerHTML = "✔️";
    read.style.flex = "1";
    read.style.border = "none";
    read.className = "scm-btn";
    read.onclick = mark_as_read;

    // Highlight button
    var highlight = document.createElement("button");
    highlight.value = stringToHash(judulPengumuman);
    highlight.innerHTML = "💡";
    highlight.style.flex = "1";
    highlight.style.border = "none";
    highlight.className = "scm-btn";
    highlight.onclick = mark_as_highlight;

    div.appendChild(read);
    div.appendChild(highlight);
    card_pengumuman.appendChild(div);
  }

  changeTextColor();
}

// https://stackoverflow.com/questions/1462138/event-listener-for-when-element-becomes-visible
var targetNode = document.getElementById('toggle-pengumuman');
var observer = new MutationObserver(function(){
    if(targetNode.style.visibility == 'hidden'){
        initialize()
    }
});
observer.observe(targetNode, { attributes: true, childList: true });


