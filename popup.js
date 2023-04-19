document.addEventListener('DOMContentLoaded', async function() {
    const header = document.getElementById('header')
    const message = document.getElementById('message');
    const loginButton = document.getElementById('tribeforce__login-button')
    let hasTokenExpired = false;

    try {
        const cookie = await getCookie('email');
        if (cookie) {
            header.textContent = '';
            loginButton.style.display = 'none';
            message.textContent = `You are already loggedIn with Google as ${cookie.value}`;
        } else {
            console.log('User not logged in');
            loginButton.addEventListener('click', signIn);
        }
    } catch (error) {
        console.error(error);
        message.textContent = 'Error: Failed to get cookie';
    }

    function getCookie(name) {
        return new Promise(resolve => {
            chrome.cookies.get({url: 'http://localhost:3000/', name: name}, (cookie) => {
                resolve(cookie);
            });
        });
    }

    async function setUserCredentials(email, id) {
        await new Promise(resolve => {
            chrome.cookies.set({
                url:"http://localhost:3000/*",
                name: `email`,
                value: email
            }, () => {
                resolve();
            });
        });

        await new Promise(resolve => {
            chrome.cookies.set({
                url:"http://localhost:3000/*",
                name: `id`,
                value: id
            }, () => {
                resolve();
            });
        });

        console.log(`User credentials set: email=${email}, id=${id}`);
    }

    async function signIn() {
            try {
                let userInfo = await getUserInfo();
                if (hasTokenExpired){
                    userInfo = await getUserInfo();
                }
                if (userInfo) {
                    await setUserCredentials(userInfo.email, userInfo.id);
                } else {
                    console.log("issueeeeeee")
                }
            } catch (error) {
                console.error(error);
                message.textContent = 'Error: Failed to sign in';
            }

    }

    function getUserInfo() {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({interactive: true }, (token) => {
                const init = {
                    method: 'GET',
                    async: true,
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    'contentType': 'json'
                };



                fetch('https://www.googleapis.com/oauth2/v2/userinfo', init)
                    .then(response => {
                        if (response.ok) {
                            header.textContent = '';
                            loginButton.style.display = 'none';
                            message.textContent = 'You are now signed in with Google';
                            hasTokenExpired = false;
                            return response.json();
                        }
                        else if(response.status === 401){
                            hasTokenExpired = true;
                            chrome.identity.removeCachedAuthToken({ token: token }, function () {
                                console.log('Token had expired removing from cache');
                            });
                        }
                       return null;
                    })
                    .then(data => resolve(data))
                    .catch(error => reject(error));
            });
        });
    }

});
