/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
  const SERVER_URL = "http://localhost:8000";
  // const SERVER_URL = "https://server.tribeforce.ai";

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url?.startsWith("https://twitter.com")) {
      return undefined;
    }
    if (changeInfo.status == "complete") {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["inject.js"],
      });
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!tab.url?.startsWith("http://localhost:3000/") && !tab.url?.startsWith("https://tribeforce.ai/")) {
      return undefined;
    }
    if (changeInfo.status == "complete") {
      console.log('===== we are listening localhost', changeInfo)
      // console.log('===== we are listening localhost: tabId', tabId)
      console.log('===== we are listening localhost: tab', tab)
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["inject.js"],
      });  
      
    }
  });


const callAuth = async (id, email) => {
  try { 
    
    console.log('=== we are in callAuth for id', id);

    let urlServer = id ? `${SERVER_URL}/api/users/id/${userId}` : `${SERVER_URL}/api/users/email/${email}`;
    console.log('================= urlServer', urlServer)
    
    const response = await fetch(urlServer, { method: "GET", headers })
    // console.log('===== api: response', response)

    const data = await response.json();
    console.log('===== api: data', data)

    if (data && data.token_usage) {
      chrome.storage.sync.set({ 'tw_idb': data.tw_idb });
      chrome.storage.sync.set({ 'ttw_usage': data.token_usage });
      chrome.storage.sync.set({ 'ttw_limits': data.token_limits });
    }

    // fetch(SERVER_URL, {
    //   method,
    //   // headers,
    //   body,
    // })
    //   .then((response) => response.json())
    
  } catch (e) {
    console.log('Error in callAuth', e)
  }
};


 chrome.identity.getProfileUserInfo({ 'accountStatus': 'ANY' }, async function(info) {
  /* Use userInfo.email, or better (for privacy) userInfo.id
     They will be empty if user is not signed in in Chrome */
    console.log('=== info in IDENTITY', info);
    email = info ? info.email : null;
    id = info ? info.id : null;
    // console.log('=== email IDENTITY', email);
    // console.log('=== id IDENTITY', id);

    const dataUsage = await chrome.storage.sync.get("ttw_usage");
    const usage = dataUsage.ttw_usage;
    // console.log('=== dataUsage in LS:', dataUsage);
    // console.log('=== usage in LS:', usage);

    const dataId = await chrome.storage.sync.get("tw_idb");
    const userId = dataId.tw_idb;

    if (!usage && userId || !usage && email) {
      // console.log('=== call to auth');
      callAuth(userId, email);
    }
 });

 
chrome.identity.getAuthToken({interactive: false}, function (token) {
  console.log('=== token in getAuthToken', token);

    if (!token) {
        if (chrome.runtime.lastError.message.match(/not signed in/)) {
            console.log("not signed in");
        } else {
            console.log("signed in ??");

            
        }
    } else {

      console.log('=== we are sending request to google for', token);
      
      fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
      .then((response) => response.json())
      .then((data) => {
          console.log('=== data in fetch', data);
          // chrome.storage.sync.set({ 'tw_idb': data.id });
          // chrome.storage.sync.set({ 'ttw_usage': data.token_usage });
          // chrome.storage.sync.set({ 'ttw_limits': data.token_limits });
      })
    }
});

    chrome.identity.onSignInChanged.addListener((account, signedIn) => {
        if (!signedIn) {
            chrome.cookies.remove({url: 'http://localhost:3000/*', name: 'email'});
            chrome.cookies.remove({url: 'http://localhost:3000/*', name: 'id'});
            console.log('User signed out. Cookies removed.');
        }
    });


// chrome.cookies.get({ url: 'http://localhost:3000', name: 'tw_idb' },
//   function (cookie) {
//     console.log('=== cookie in get ID', cookie);
//     if (cookie) {
//       console.log('cookie.value', cookie.value);
//     }
//     else {
//       console.log('Can\'t get cookie! Check the name!');
//     }
// });

// chrome.cookies.get({ url: 'http://localhost:3000', name: 'ttw_usage' },
//   function (cookie) {
//     console.log('=== cookie in get ttw_usage', cookie);
//     if (cookie) {
//       console.log('cookie.value', cookie.value);
//     }
//     else {
//       console.log('Can\'t get cookie! Check the name!');
//     }
// });

// chrome.cookies.onChanged.addListener(function(changeInfo) {
//   console.log(' COOKIES WAS CHANGED', changeInfo.cookie)
// });


// "oauth2": {
  //   "client_id": "39022377310-mia6bdbkftjfu5c9httq5eq555qmc3q6.apps.googleusercontent.com",
  //   "scopes": [
  //     "https://www.googleapis.com/auth/userinfo.email",
  //     "https://www.googleapis.com/auth/contacts.readonly"
  //   ]
  // },



/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixjQUFjO0FBQzlCO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2dtYWlsLW1haWwtdHJhY2tlci8uL3NyYy9iYWNrZ3JvdW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNocm9tZS50YWJzLm9uVXBkYXRlZC5hZGRMaXN0ZW5lcigodGFiSWQsIGNoYW5nZUluZm8sIHRhYikgPT4ge1xuICBpZiAoIXRhYi51cmw/LnN0YXJ0c1dpdGgoXCJodHRwczovL3R3aXR0ZXIuY29tXCIpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoY2hhbmdlSW5mby5zdGF0dXMgPT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICAgIHRhcmdldDogeyB0YWJJZDogdGFiSWQgfSxcbiAgICAgIGZpbGVzOiBbXCJpbmplY3QuanNcIl0sXG4gICAgfSk7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9