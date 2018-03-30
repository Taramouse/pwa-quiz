<template>
  <v-app id="app">
    <toolbar
      :login="login"
      :logout="logout"
      :profile="profile"
      :loggedIn="loggedIn"
    />
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import Toolbar from '@/components/Toolbar'

export default {
  name: 'app',

  components: { Toolbar },

  computed: {
      ...mapGetters('user', {
        profile: 'profile',
        loggedIn: 'loggedIn'
      })
    },

  methods: {
      ...mapActions('user', {
        login: 'login',
        logout: 'logout'
      })
    }
}
</script>

<style>
#app {
  font-family: Roboto, Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
