<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-form>
            <v-text-field
              v-model="username"
              label="نام کاربری">
            </v-text-field>
            <v-text-field
            v-model="password"
            label="رمز ورود"
            type="password"></v-text-field>
            <v-btn @click="login">ورود</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import {login} from "../grahpql/queries/user/auth";
  import {onLogin} from "../vue-apollo";
  import {AUTH_TOKEN} from "../vue-apollo";

  export default {
    data(){
      return{
        name: "Login",
        username: '',
        password: '',
        token: '',
      }
    },
    beforeRouteEnter(to, from, next){
      if (localStorage.getItem(AUTH_TOKEN)) next({ name: 'DashboardHome'})
      else next()
    },
    methods: {
      login(){
        this.$apollo.mutate({
          mutation: login,
          variables: {
            "username": this.username,
            "password": this.password
          }
        }).then((res) => {
          this.token = res.data.login.token;
          onLogin(this.$apollo.provider.defaultClient, this.token)
          this.$router.push('/dashboard')
        }, error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped>

</style>
