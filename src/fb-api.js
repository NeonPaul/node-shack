export default {
  init: function () {
  return new Promise((resolve) => {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : 2363963992,
        xfbml      : true,
        version    : 'v2.8'
      });
      FB.AppEvents.logPageView()
      resolve(FB)
    }

    ;(function(d, s, id){
      if (d.getElementById(id)) {return}
      var js = d.createElement('script')
      js.id = id
      js.src = '//connect.facebook.net/en_US/sdk.js'
      d.body.appendChild(js)
    }(document, 'script', 'facebook-jssdk'))
  })
  },
  login: function () {
    return this.init().then(FB => new Promise((resolve, reject) => {
      FB.getLoginStatus(response => {
        if (!response.authResponse) {
          FB.login(response => {
            if (response.authResponse) {
              resolve(response)
            } else {
              reject(response)
            }
          }, { scope: 'email' })
        } else {
          resolve(response)
        }
      })
    }))
  }
}
