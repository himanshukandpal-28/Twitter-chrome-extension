/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/inject.js ***!
  \***********************/

const triveLoadeerAnimation = `
<svg version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
 <path fill="#fff" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
  c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="2s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
  </path>
 <path fill="#fff" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
  c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="-360 50 50" repeatCount="indefinite"></animateTransform>
  </path>
 <path fill="#fff" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
  L82,35.7z">
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="2s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
  </path>
</svg>
`;

let usage = 0;
let limits = 15;
let isLimitExpired = false;
let isAuth = true;
let userId = '';
const url = `http://localhost:8000`;
// const url = `https://server.tribeforce.ai`;


const makeButtonsDisabled = () => {
  try {
    const buttons = document.querySelectorAll(`.trive__button`);
    console.log('=== makeButtonsDisabled: buttons', buttons);

    for (let i = 0; i < buttons.length; i++) {
      let el = buttons[i];
      el.disabled = true;
    }

    const textDiv = document.querySelectorAll(`.trive__text`);
    console.log('=== makeButtonsDisabled: textDiv', textDiv);
    
    // Inject an updated text
  } catch (e) {}
};


const getUserApi = async () => {
  try {
    console.log('================= CALL API', userId)
    
    const urlServer = `${url}/api/users/id/${userId}`;
    // console.log('================= urlServer', urlServer)
    
    const headers = {
      "Content-type": "application/json",
    };

    const response = await fetch(urlServer, { method: "GET", headers })
    console.log('===== api: response', response)

    const data = await response.json();
    console.log('===== api: data', data)

    if (data && data.token_usage) {
      usage = data.token_usage ? data.token_usage : usage;
      limits = data.token_limits ? data.token_limits : limits;
      console.log('===== api: usage', usage)


      // For test - uncomment to test the limit
      // if (usage >= limits) {
      //   isLimitExpired = true;
      //   makeButtonsDisabled();
      // }

      chrome.storage.sync.set({ 'ttw_usage': data.token_usage });
      chrome.storage.sync.set({ 'ttw_limits': data.token_limits });
    }

    // fetch(urlServer, {
    //   methid: "GET",
    //   headers
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("======== APi data: ", data);
    //   })
    
  } catch (e) {}
};


window.addEventListener('storage', async (e) => {
  console.log('LOCALSTORAGE CHSANGES'); // this never fires after logging a user in.
  // console.log('=== LOCALSTORAGE: e.key:', e.key);
  // console.log('=== LOCALSTORAGE: e.newValue:', e.newValue);

  if (e.key === 'ttw_usage' && e.newValue !== usage) {
    usage = e.newValue;
    chrome.storage.sync.set({ 'ttw_usage': e.newValue });
    // console.log('=== LOCALSTORAGE AFTER SAVING: usage', usage);
  }

  // console.log('=== LOCALSTORAGE: usage', usage);
  // console.log('=== LOCALSTORAGE: isLimitExpired', isLimitExpired);

  if (!isLimitExpired && usage >= limits || !isLimitExpired && limits === undefined) {
    isLimitExpired = true;

    makeButtonsDisabled()
  }

  const dataUsage = await chrome.storage.sync.get("ttw_usage");
  const dataLimits = await chrome.storage.sync.get("ttw_limits");
  const dataUsage2 = await chrome.storage.local.get("ttw_usage");
  const dataUser = await chrome.storage.sync.get("tw_idb");

  // console.log('=== listener: dataUsage in LS:', dataUsage);
  // console.log('=== listener: dataLimits in LS:', dataLimits);
  // console.log('=== listener: dataUsage2 in LS:', dataUsage2);
  // console.log('=== listener: dataUser in LS:', dataUser);


  // chrome.storage.local.get(["ttw_usage"]).then((result) => {
  //   console.log("ttw_usage currently is " + result.key);
  // });
});


const getTokens = async () => {
  try {
    const data = await chrome.storage.sync.get("ttw_token");
    // console.log('=== getTokens START: data in LS:', data);

    const dataUsage = await chrome.storage.sync.get("ttw_usage");
    const dataLimits = await chrome.storage.sync.get("ttw_limits");
    const dataId = await chrome.storage.sync.get("tw_idb");

    // console.log('=== getTokens: dataUsage in LS:', dataUsage);
    // console.log('=== getTokens: dataLimits in LS:', dataLimits);
    // console.log('=== getTokens: dataId in LS:', dataId);

    // usage = dataUsage.ttw_usage ? parseInt(dataUsage.ttw_usage) : usage;
    // limits = dataLimits.ttw_limits ? dataLimits.ttw_limits : limits;
    usage = dataUsage.ttw_usage ? parseInt(dataUsage.ttw_usage) : dataUsage.ttw_usage;
    limits = dataLimits.ttw_limits;
    userId = dataId.tw_idb;

    console.log('=== getTokens: usage in LS:', usage);
    console.log('=== getTokens: limits in LS:', limits);
    console.log('=== getTokens: usage >= limits:', usage >= limits);

    // For tests - uncomment to test the limit
    // if (usage >= limits) {
    //   isLimitExpired = true;
    // }

    if (!userId || userId && userId.length === 0 || usage === undefined) {
      isAuth = false;
    }

    // if (data.ttw_token === undefined) {
    //   isLimitExpired = false;
    // }

    // console.log('=== isLimitExpired:', isLimitExpired);

    const token = data.ttw_token;
    console.log('=== getTokens: token in LS:', token);
  } catch (e) {}
};


const triveLoading = (state, button) => {
  try {
    const element = document.querySelector(`.trive__button[role="${button}"]`);
    
    element.disabled = state;
    // console.log('=== triveLoading: state:', state)

    if (state) {
      element.classList.add("loading");

    } else {
      element.classList.remove("loading");

    }
  } catch (e) {}
};


const callTriveApi = async (btn) => {
  const answerField = document.querySelector("div[contenteditable=true]");
  const msgText = document.querySelector("div[data-testid=tweetText]");

  if (!userId || userId && userId.length === 0) {
    alert('Please login Tribeforce');
    return;
  }

  console.log('btn in callTrive', btn)

  const headers = {
    "Content-type": "application/json",
  };

  const body = JSON.stringify({
    btn, 
    tweet: msgText.innerText,
  });

  // const server = `http://localhost:8000/api/users/reply/123asdasd`;
  const server = `${url}/api/users/reply/${userId}`;

  let buttonSpinner = btn === 1 ? "callapi" : btn === 2 ? "trive" : btn === 3 ? "question" : btn === 4 ? "joke" : btn === 5 ? "basic" : "callapi";
  triveLoading(true, buttonSpinner);

  fetch(server, {
    method: "PUT",
    headers,
    body,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("trive data: ", data);

      if (data && data.isExpired) {
        isLimitExpired = true;
        makeButtonsDisabled();
        triveLoading(false, buttonSpinner);
        return;
      }

      const comment = data;
      const textLines = comment.replace("\r", "").split("\n");

      answerField.focus();
      for (let i = 0; i < textLines.length; i++) {
        document.execCommand("selectAll", false, null);
        document.getSelection().collapseToEnd();
        document.execCommand("insertText", false, textLines[i]);
      }
      triveLoading(false, buttonSpinner);

      chrome.storage.sync.set({ 'ttw_usage': usage+1 });
    })
    .catch((error) => {
      console.error("trive error:", error);
      triveLoading(false, buttonSpinner);
    });
};

const callTriveOne = () => {
  try {
    callTriveApi(1)
  } catch (e) {
    console.log('Error', e)
  }
};

const callTriveTwo = () => {
  try {
    callTriveApi(2)
  } catch (e) {
    console.log('Error', e)
  }
};

const callTriveThree = () => {
  try {
    callTriveApi(3)
  } catch (e) {
    console.log('Error', e)
  }
};

const callTriveFour = () => {
  try {
    callTriveApi(4)
  } catch (e) {
    console.log('Error', e)
  }
};

const callTriveFive = () => {
  try {
    callTriveApi(5)
  } catch (e) {
    console.log('Error', e)
  }
};

const triveAppendButtons = async (toolBar) => {

  // console.log('======= triveAppendButtons: isLimitExpired', isLimitExpired)
  console.log('======= triveAppendButtons: userId', userId)
  console.log('======= triveAppendButtons: usage', usage)
  // console.log('======= triveAppendButtons: limits', limits)

  const triveButtons = `
      <div class="trive__buttons">
          <button class="trive__button" role="callapi" style="width:94px" ${!isLimitExpired && isAuth ? 'enabled' : 'disabled'}><span>👍 General</span>${triveLoadeerAnimation}</button>
          <button class="trive__button" role="joke" style="width:74px" ${!isLimitExpired && isAuth ? 'enabled' : 'disabled'}><span>🤣 Joke</span>${triveLoadeerAnimation}</button>
          <button class="trive__button" role="trive" style="width:94px" ${!isLimitExpired && isAuth ? 'enabled' : 'disabled'}><span>👊 Friendly</span>${triveLoadeerAnimation}</button>
          <button class="trive__button" role="question" style="width:96px" ${!isLimitExpired && isAuth ? 'enabled' : 'disabled'}><span>❔Question</span>${triveLoadeerAnimation}</button>
          <button class="trive__button" role="basic" style="width:79px" ${!isLimitExpired && isAuth ? 'enabled' : 'disabled'}><span>🌿 Basic</span>${triveLoadeerAnimation}</button>
          <div class="trive__text__div trive__text">
            ${isAuth ? `<a href="https://tribeforce.ai/auth" class="trive__text" target="_blank" rel="noopener noreferrer">Comments: ${usage !== undefined ? usage : '-'}/${limits ? limits : '15'}</a>` : ''}
            ${isLimitExpired && isAuth ? '<a href="https://tribeforce.ai/auth" class="trive__text trive__text__price" target="_blank" rel="noopener noreferrer">Get more AI replies</a>' : ''}
            ${!isAuth ? '<a href="https://tribeforce.ai/auth" class="trive__text" target="_blank" rel="noopener noreferrer">Please sign in Tribeforce to generate AI replies</a>' : ''}
            <button class="trive__button__refresh" role="tribe_refresh">Refresh</button>
          </div>
      </div>
      `;

  // const tweetForm = document.querySelector("[data-testid='tweetTextarea_0']");

  const triveDiv = document.createElement("div");
  triveDiv.className = "trive__wrapper";
  triveDiv.innerHTML = triveButtons;

  triveDiv
    .querySelector("button[role=trive]")
    .addEventListener("click", callTriveTwo);
  
  triveDiv
    .querySelector("button[role=question]")
    .addEventListener("click", callTriveThree);

  triveDiv
    .querySelector("button[role=joke]")
    .addEventListener("click", callTriveFour);

  triveDiv
    .querySelector("button[role=basic]")
    .addEventListener("click", callTriveFive);

  triveDiv
    .querySelector("button[role=callapi]")
    .addEventListener("click", callTriveOne);

  triveDiv
  .querySelector("button[role=tribe_refresh]")
  .addEventListener("click", getUserApi);

  toolBar.parentNode.parentNode.insertBefore(
    triveDiv,
    toolBar.parentNode.parentNode.children[0]
  );
};

const triveInject = (n) => {
  if (document.querySelector("div.trive__buttons")) {
    return;
  }
  const toolBarConv = document.querySelector(
    'div[aria-label="Timeline: Conversation"] div[data-testid=toolBar]'
  );
  const toolBar = document.querySelector(
    "div[aria-labelledby=modal-header] div[data-testid=toolBar]"
  );
  if (toolBar || toolBarConv) {
    triveAppendButtons(toolBar || toolBarConv);
  } else {
    if (n < 50) {
      setTimeout(triveInject, 200, n + 1);
    }
  }
};


if (window.location.host == "twitter.com") {
  getTokens();
  triveInject(1);
  // getUserApi(userId);
}


if (window.location.host == "localhost:3000" || window.location.host == "tribeforce.ai") {
  console.log('======= WE ARE WATCHING TRIBEFORCE')
  let tw_idb = localStorage.getItem('tw_idb');
  const ttw_usage = localStorage.getItem('ttw_usage');
  const ttw_limits = localStorage.getItem('ttw_limits');
  console.log('======= tw_idb here no listener', tw_idb)
  // console.log('======= ttw_usage here no listener', ttw_usage)
  // console.log('======= ttw_limits here no listener', ttw_limits)

  if (!userId && tw_idb && tw_idb.length > 0) {
    userId = tw_idb;
    chrome.storage.sync.set({ 'tw_idb': tw_idb });
    chrome.storage.sync.set({ 'ttw_usage': ttw_usage });
    chrome.storage.sync.set({ 'ttw_limits': ttw_limits });
  }

  // if (tw_idb) chrome.storage.sync.clear()

  // if (!tw_idb) {
  //   console.log('========== INTERVAL IS STARTING for tw_idb', tw_idb)
  //   let checker_handler = setInterval(()=>{
  //     console.log('======= INTERVAL for tw_idb', tw_idb)
  
  //     let current_data = localStorage.getItem('tw_idb');
  //     let tw_idb_new = localStorage.getItem('tw_idb')
  //     console.log('======= current_data here', current_data)

  //     if (tw_idb_new && tw_idb_new === current_data) {
  //       return;
  //     }

  //     // if (current_data && !tw_idb_new) {
  //     //   console.log('======= saving...', current_data)

  //     //   tw_idb = localStorage.setItem('tw_idb', current_data)
  //     // };
  
  //     if( tw_idb !== current_data ) alert("changed, new data "  + current_data )
  //   }, 1000 )

  //   clearInterval(checker_handler);
  // }

  // tw_idb = localStorage.getItem('tw_idb')
  // console.log('======= tw_idb AFTER interval', tw_idb)

  // window.addEventListener('storage', async (e) => {
  //   console.log('AUTH LOCALSTORAGE LISTENER');
  //   console.log('=== LOCALSTORAGE: e.key:', e.key);
  //   console.log('=== LOCALSTORAGE: e.newValue:', e.newValue);

  //   if (e.key === 'ttw_usage' && e.newValue !== usage) {
  //     let usage = e.newValue;
  //     chrome.storage.sync.set({ 'ttw_usage': e.newValue });
  //     console.log('=== LOCALSTORAGE AFTER SAVING: usage', usage);
  //   }
  // });

  // chrome.storage.onChanged.addListener(function(changes, namespace) {
  //   if ("active" in changes) {
  //       console.log("LS CHANGER - Old value: " + changes.active.oldValue);
  //       console.log("LS CHANGER - New value: " + changes.active.newValue);
  //   }
  // });
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1EQUFtRCxPQUFPO0FBQzFELElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMERBQTBELGtCQUFrQjs7QUFFNUU7QUFDQTtBQUNBLGlCQUFpQiwrQkFBK0I7QUFDaEQ7QUFDQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHNCQUFzQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixzQkFBc0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RUFBNkUsc0JBQXNCO0FBQ25HO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZ21haWwtbWFpbC10cmFja2VyLy4vc3JjL2luamVjdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB0cml2ZUxvYWRlZXJBbmltYXRpb24gPSBgXG48c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkw3XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgZW5hYmxlLWJhY2tncm91bmQ9XCJuZXcgMCAwIDEwMCAxMDBcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuIDxwYXRoIGZpbGw9XCIjZmZmXCIgZD1cIk0zMS42LDMuNUM1LjksMTMuNi02LjYsNDIuNywzLjUsNjguNGMxMC4xLDI1LjcsMzkuMiwzOC4zLDY0LjksMjguMWwtMy4xLTcuOWMtMjEuMyw4LjQtNDUuNC0yLTUzLjgtMjMuM1xuICBjLTguNC0yMS4zLDItNDUuNCwyMy4zLTUzLjhMMzEuNiwzLjV6XCI+XG4gICAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPVwidHJhbnNmb3JtXCIgYXR0cmlidXRlVHlwZT1cIlhNTFwiIHR5cGU9XCJyb3RhdGVcIiBkdXI9XCIyc1wiIGZyb209XCIwIDUwIDUwXCIgdG89XCIzNjAgNTAgNTBcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIj48L2FuaW1hdGVUcmFuc2Zvcm0+XG4gIDwvcGF0aD5cbiA8cGF0aCBmaWxsPVwiI2ZmZlwiIGQ9XCJNNDIuMywzOS42YzUuNy00LjMsMTMuOS0zLjEsMTguMSwyLjdjNC4zLDUuNywzLjEsMTMuOS0yLjcsMTguMWw0LjEsNS41YzguOC02LjUsMTAuNi0xOSw0LjEtMjcuN1xuICBjLTYuNS04LjgtMTktMTAuNi0yNy43LTQuMUw0Mi4zLDM5LjZ6XCI+XG4gICAgICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPVwidHJhbnNmb3JtXCIgYXR0cmlidXRlVHlwZT1cIlhNTFwiIHR5cGU9XCJyb3RhdGVcIiBkdXI9XCIxc1wiIGZyb209XCIwIDUwIDUwXCIgdG89XCItMzYwIDUwIDUwXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCI+PC9hbmltYXRlVHJhbnNmb3JtPlxuICA8L3BhdGg+XG4gPHBhdGggZmlsbD1cIiNmZmZcIiBkPVwiTTgyLDM1LjdDNzQuMSwxOCw1My40LDEwLjEsMzUuNywxOFMxMC4xLDQ2LjYsMTgsNjQuM2w3LjYtMy40Yy02LTEzLjUsMC0yOS4zLDEzLjUtMzUuM3MyOS4zLDAsMzUuMywxMy41XG4gIEw4MiwzNS43elwiPlxuICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT1cInRyYW5zZm9ybVwiIGF0dHJpYnV0ZVR5cGU9XCJYTUxcIiB0eXBlPVwicm90YXRlXCIgZHVyPVwiMnNcIiBmcm9tPVwiMCA1MCA1MFwiIHRvPVwiMzYwIDUwIDUwXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCI+PC9hbmltYXRlVHJhbnNmb3JtPlxuICA8L3BhdGg+XG48L3N2Zz5cbmA7XG5cbmNvbnN0IHRyaXZlTG9hZGluZyA9IChzdGF0ZSwgYnV0dG9uKSA9PiB7XG4gIHRyeSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnRyaXZlX19idXR0b25bcm9sZT1cIiR7YnV0dG9ufVwiXWApLmRpc2FibGVkID0gc3RhdGU7XG4gIH0gY2F0Y2ggKGUpIHt9XG59O1xuXG5jb25zdCB0cml2ZVByb2dyZXNzID0gKHN0YXRlKSA9PiB7XG4gIGlmIChzdGF0ZSkge1xuICAgIGNvbnN0IGxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbG9hZGVyLmNsYXNzTmFtZSA9IFwidHJpdmVMb2FkZXJcIjtcbiAgICBsb2FkZXIuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJsZHMtcm9sbGVyXCI+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjxkaXY+PC9kaXY+PGRpdj48L2Rpdj48ZGl2PjwvZGl2PjwvZGl2PmA7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuYXBwZW5kQ2hpbGQobG9hZGVyKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2LnRyaXZlTG9hZGVyXCIpO1xuICAgIGlmIChsb2FkZXIpIHtcbiAgICAgIGxvYWRlci5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHNheVRyaXZlID0gKCkgPT4ge1xuICBjb25zdCBhbnN3ZXJGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXZbY29udGVudGVkaXRhYmxlPXRydWVdXCIpO1xuICBhbnN3ZXJGaWVsZC5mb2N1cygpO1xuICBjb25zdCB0ZXh0TGluZXMgPSBbXG4gICAgYNCd0LDQtCDRgdC10LTQvtC5INGA0LDQstC90LjQvdC+0Lkg0LzQvtGA0Y8g0LLQtdGC0LXRgCDRgtGD0YfQuCDRgdC+0LHQuNGA0LDQtdGCLiDQnNC10LbQtNGDINGC0YPRh9Cw0LzQuCDQuCDQvNC+0YDQtdC8INCz0L7RgNC00L4g0YDQtdC10YIg0JHRg9GA0LXQstC10YHRgtC90LjQuiwg0YfQtdGA0L3QvtC5INC80L7Qu9C90LjQuCDQv9C+0LTQvtCx0L3Ri9C5LmAsXG4gICAgYNCi0L4g0LrRgNGL0LvQvtC8INCy0L7Qu9C90Ysg0LrQsNGB0LDRj9GB0YwsINGC0L4g0YHRgtGA0LXQu9C+0Lkg0LLQt9C80YvQstCw0Y8g0Log0YLRg9GH0LDQvCwg0L7QvSDQutGA0LjRh9C40YIsINC4IOKAlCDRgtGD0YfQuCDRgdC70YvRiNCw0YIg0YDQsNC00L7RgdGC0Ywg0LIg0YHQvNC10LvQvtC8INC60YDQuNC60LUg0L/RgtC40YbRiy5gLFxuICBdO1xuXG4gIHRyaXZlUHJvZ3Jlc3ModHJ1ZSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dExpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJzZWxlY3RBbGxcIiwgZmFsc2UsIG51bGwpO1xuICAgIGRvY3VtZW50LmdldFNlbGVjdGlvbigpLmNvbGxhcHNlVG9FbmQoKTtcbiAgICAvLyBkb2N1bWVudC5leGVjQ29tbWFuZChcImluc2VydFBhcmFncmFwaFwiLCBmYWxzZSwgbnVsbCk7XG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJpbnNlcnRUZXh0XCIsIGZhbHNlLCB0ZXh0TGluZXNbaV0pO1xuICB9XG4gIHNldFRpbWVvdXQodHJpdmVQcm9ncmVzcywgNTAwMCwgZmFsc2UpO1xufTtcblxuY29uc3QgY2FsbFRyaXZlID0gKCkgPT4ge1xuICBjb25zdCBhbnN3ZXJGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJkaXZbY29udGVudGVkaXRhYmxlPXRydWVdXCIpO1xuICBjb25zdCBtc2dUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdltkYXRhLXRlc3RpZD10d2VldFRleHRdXCIpO1xuXG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgQXV0aG9yaXphdGlvbjogXCJCZWFyZXIgc2sta2pHYzVIdVZMU1NFd2RJemNCV09UM0JsYmtGSlFXbXBMNk9TbDhEc1VvQ1N0dldpXCIsXG4gIH07XG5cbiAgY29uc3QgcHJvbXB0ID0gYCBDcmVhdGUgYSBzaG9ydCBjb21tZW50IHRvIHRoZSBwb3N0OiBcIiR7bXNnVGV4dC5pbm5lclRleHR9XCJgO1xuXG4gIGNvbnN0IGJvZHkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgbW9kZWw6IFwiZ3B0LTMuNS10dXJib1wiLFxuICAgIG1lc3NhZ2VzOiBbeyByb2xlOiBcInVzZXJcIiwgY29udGVudDogcHJvbXB0IH1dLFxuICAgIG1heF90b2tlbnM6IDcwLFxuICAgIHRlbXBlcmF0dXJlOiAwLjcsXG4gIH0pO1xuXG4gIGNvbnN0IHVybCA9IFwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MS9jaGF0L2NvbXBsZXRpb25zXCI7XG5cbiAgLy8gdHJpdmVQcm9ncmVzcyh0cnVlKTtcbiAgdHJpdmVMb2FkaW5nKHRydWUsIFwiY2FsbGFwaVwiKTtcblxuICBmZXRjaCh1cmwsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGhlYWRlcnMsXG4gICAgYm9keSxcbiAgfSlcbiAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJ0cml2ZSBkYXRhOiBcIiwgZGF0YSk7XG4gICAgICBjb25zdCBjb21tZW50ID0gZGF0YS5jaG9pY2VzWzBdLm1lc3NhZ2UuY29udGVudC50b1N0cmluZygpO1xuICAgICAgY29uc3QgdGV4dExpbmVzID0gY29tbWVudC5yZXBsYWNlKFwiXFxyXCIsIFwiXCIpLnNwbGl0KFwiXFxuXCIpO1xuXG4gICAgICBhbnN3ZXJGaWVsZC5mb2N1cygpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0TGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJzZWxlY3RBbGxcIiwgZmFsc2UsIG51bGwpO1xuICAgICAgICBkb2N1bWVudC5nZXRTZWxlY3Rpb24oKS5jb2xsYXBzZVRvRW5kKCk7XG4gICAgICAgIC8vIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiaW5zZXJ0UGFyYWdyYXBoXCIsIGZhbHNlLCBudWxsKTtcbiAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJpbnNlcnRUZXh0XCIsIGZhbHNlLCB0ZXh0TGluZXNbaV0pO1xuICAgICAgfVxuICAgICAgdHJpdmVMb2FkaW5nKGZhbHNlLCBcImNhbGxhcGlcIik7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwidHJpdmUgZXJyb3I6XCIsIGVycm9yKTtcbiAgICAgIHRyaXZlTG9hZGluZyhmYWxzZSwgXCJjYWxsYXBpXCIpO1xuICAgIH0pO1xufTtcblxuY29uc3QgdHJpdmVRdW90ZVRleHQgPSAoKSA9PiB7XG4gIGNvbnN0IG1zZ1RleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2W2RhdGEtdGVzdGlkPXR3ZWV0VGV4dF1cIik7XG4gIGNvbnN0IGFuc3dlckZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdltjb250ZW50ZWRpdGFibGU9dHJ1ZV1cIik7XG4gIGNvbnN0IHF1b3RlVGV4dCA9IG1zZ1RleHQuaW5uZXJUZXh0LnJlcGxhY2UoXCJcXHJcIiwgXCJcIikuc3BsaXQoXCJcXG5cIik7XG5cbiAgdHJ5IHtcbiAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xuICAgICAgYW5zd2VyRmllbGQuZm9jdXMoKTtcbiAgICAgIC8vIGFuc3dlckZpZWxkLnNlbGVjdCgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHF1b3RlVGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZChcInNlbGVjdEFsbFwiLCBmYWxzZSwgbnVsbCk7XG4gICAgICAgIGRvY3VtZW50LmdldFNlbGVjdGlvbigpLmNvbGxhcHNlVG9FbmQoKTtcbiAgICAgICAgLy8gZG9jdW1lbnQuZXhlY0NvbW1hbmQoXCJpbnNlcnRQYXJhZ3JhcGhcIiwgZmFsc2UsIG51bGwpO1xuICAgICAgICB2YXIga2V5Ym9hcmRFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KFwia2V5cHJlc3NcIiwge1xuICAgICAgICAgIGNvZGU6IFwiRW50ZXJcIixcbiAgICAgICAgICBrZXk6IFwiRW50ZXJcIixcbiAgICAgICAgICBjaGFyS29kZTogMTMsXG4gICAgICAgICAga2V5Q29kZTogMTMsXG4gICAgICAgICAgdmlldzogd2luZG93LFxuICAgICAgICB9KTtcblxuICAgICAgICBhbnN3ZXJGaWVsZC5kaXNwYXRjaEV2ZW50KGtleWJvYXJkRXZlbnQpO1xuXG4gICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiaW5zZXJ0VGV4dFwiLCBmYWxzZSwgcXVvdGVUZXh0W2ldKTtcbiAgICAgIH1cbiAgICAgIC8vIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiaW5zZXJ0UGFyYWdyYXBoXCIsIGZhbHNlLCBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRvY3VtZW50LnNlbGVjdGlvbiAmJiBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UpIHtcbiAgICAgICAgZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dCA9IG1zZ1RleHQuaW5uZXJUZXh0O1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJ0cml2ZSBmYXRhbDo6XCIsIGUpO1xuICB9XG59O1xuXG5jb25zdCB0cml2ZUFwcGVuZEJ1dHRvbnMgPSAodG9vbEJhcikgPT4ge1xuICBjb25zdCB0cml2ZUJ1dHRvbnMgPSBgXG4gICAgICA8ZGl2IGNsYXNzPVwidHJpdmVfX2J1dHRvbnNcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwidHJpdmVfX2J1dHRvblwiIHJvbGU9XCJxdW90ZVwiPlF1b3RlPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInRyaXZlX19idXR0b25cIiByb2xlPVwidHJpdmVcIj5OZXc8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwidHJpdmVfX2J1dHRvblwiIHJvbGU9XCJjYWxsYXBpXCI+PHNwYW4+Q2FsbEFQSTwvc3Bhbj4ke3RyaXZlTG9hZGVlckFuaW1hdGlvbn08L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgYDtcblxuICBjb25zdCB0cml2ZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRyaXZlRGl2LmNsYXNzTmFtZSA9IFwidHJpdmVfX3dyYXBwZXJcIjtcbiAgdHJpdmVEaXYuaW5uZXJIVE1MID0gdHJpdmVCdXR0b25zO1xuXG4gIHRyaXZlRGl2XG4gICAgLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25bcm9sZT1xdW90ZV1cIilcbiAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRyaXZlUXVvdGVUZXh0KTtcblxuICB0cml2ZURpdlxuICAgIC5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uW3JvbGU9dHJpdmVdXCIpXG4gICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzYXlUcml2ZSk7XG5cbiAgdHJpdmVEaXZcbiAgICAucXVlcnlTZWxlY3RvcihcImJ1dHRvbltyb2xlPWNhbGxhcGldXCIpXG4gICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYWxsVHJpdmUpO1xuXG4gIHRvb2xCYXIucGFyZW50Tm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShcbiAgICB0cml2ZURpdixcbiAgICB0b29sQmFyLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jaGlsZHJlblswXVxuICApO1xufTtcblxuY29uc3QgdHJpdmVJbmplY3QgPSAobikgPT4ge1xuICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImRpdi50cml2ZV9fYnV0dG9uc1wiKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB0b29sQmFyQ29udiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgJ2RpdlthcmlhLWxhYmVsPVwiVGltZWxpbmU6IENvbnZlcnNhdGlvblwiXSBkaXZbZGF0YS10ZXN0aWQ9dG9vbEJhcl0nXG4gICk7XG4gIGNvbnN0IHRvb2xCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiZGl2W2FyaWEtbGFiZWxsZWRieT1tb2RhbC1oZWFkZXJdIGRpdltkYXRhLXRlc3RpZD10b29sQmFyXVwiXG4gICk7XG4gIGlmICh0b29sQmFyIHx8IHRvb2xCYXJDb252KSB7XG4gICAgdHJpdmVBcHBlbmRCdXR0b25zKHRvb2xCYXIgfHwgdG9vbEJhckNvbnYpO1xuICB9IGVsc2Uge1xuICAgIGlmIChuIDwgNTApIHtcbiAgICAgIHNldFRpbWVvdXQodHJpdmVJbmplY3QsIDIwMCwgbiArIDEpO1xuICAgIH1cbiAgfVxufTtcblxuaWYgKHdpbmRvdy5sb2NhdGlvbi5ob3N0ID09IFwidHdpdHRlci5jb21cIikge1xuICB0cml2ZUluamVjdCgxKTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==