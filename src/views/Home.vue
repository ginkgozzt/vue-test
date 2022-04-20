<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div>
      <button @click="addRoute">添加子路由</button>
      <router-view/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import editorTemp from './Editor'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    editorTemp
  },
  methods:{
    addRoute(){
      this.$router.addRoute('Home',{
        path:'/Home/test',
        name:'Home-test',
        component: editorTemp
      });
       this.$router.push('/Home/test')


   }
  }
}
</script>
