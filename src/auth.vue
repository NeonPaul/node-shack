<template>
  <div>
    <h1 class="title">Log in</h1>
    <div v-if="alert.message" class="notification" :class="'is-' + alert.type">
      {{ alert.message }}
    </div>
    <div class="tabs"><ul>
      <li>Log in with:
      <li :class="{'is-active':method==='fb'}">
        <button @click="method='fb'">Facebook</button></li>
      <li :class="{'is-active':method==='password'}">
        <button @click="method='password'">Password</button></li>
    </ul></div>
    <form v-if="method==='password'"
          @submit.prevent="login({ email: email, password: password })">
      <p class="control">
        <input class="input"
               name="email"
               type="email"
               v-model="email"
               placeholder="Email"
               autofocus>
      </p>
      <p class="control">
        <input class="input"
               type="password"
               v-model="password"
               placeholder="Password"
               name="password">
      </p>
      <p class="control">
        <button type="submit" class="button is-primary">Login</button>
      </p>
    </form>
    <div v-if="method==='fb'"
         class="columns">
      <div class="column is-4 is-offset-4">
        <button @click="loginFb">
          <div class="card">
            <div class="card-image">
              <figure class="image">
                <img src="https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png">
              </figure>
            </div>
            <div class="card-content">Log in with Facebook</div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions } from 'vuex'

module.exports = {
  data: function(){
    return {
      email: '',
      password: '',
      method: 'fb'
    }
  },
  computed: mapGetters(['alert']),
  methods: mapActions(['login', 'loginFb'])
}
</script>
