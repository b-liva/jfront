<template>
  <nav>
    <v-app-bar flat app>
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <span class="font-weight-lighten">معاونت بازرگانی <span class="text-uppercase green--text">جمکو</span></span>
      </v-toolbar-title>

    </v-app-bar>
    <v-navigation-drawer
    app
    v-model="drawer"
    right>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="../assets/logo.png"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>شرکت جمکو</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="link in links" :key="link.name" route :to="link.route">
          <v-list-item-content>
            <v-list-item-title>{{link.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn @click="logout" small class="error--text">خروج</v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
  </nav>
</template>

<script>
  import {onLogout} from "../vue-apollo";

  export default {
    data(){
      return{
        name: "Navbar",
        drawer: null,
        links: [
          {name:'dashboard', icone: '', text: 'داشبورد', route:'/dashboard'},
          {name:'customer', icone: '', text: 'مشتری', route:'/customers'},
          {name:'order', icone: '', text: 'سفارش', route:'/orders'},
          {name:'income', icone: '', text: 'واریزی', route:'/incomes'},
        ]
      }
    },
    components: {},
    methods: {
      logout(){
        onLogout(this.$apollo.provider.defaultClient)
        this.$router.push('/')
      }
    }
  }
</script>

<style scoped>

</style>
