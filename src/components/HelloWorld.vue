<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div v-text="inputData"></div>
    <ul>
      <li v-for="(item,key) in inputData" :key="key">
        <input type="text" v-model="item.value">
        <div v-text="item"></div>
        <div v-text="key"></div>

      </li>
    </ul>
    
  
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      inputData:{
        name:{
          value:'xxxxx',
          type:'string'
        },
        age :{
          value:18,
          type :'integer'
        }
      },
      proxyData:{}

    }
  },
  watch:{

  },
  mounted() {
    // this.init();
  },
  methods:{
    init(){
      let handle = {
        get: function(target,name,receiver){
          // console.log(target,'target---get');
          // console.log('name :>> ', name);
          return Reflect.get(target, name,receiver);
        },
        set: function(target,name,value,receiver){
          console.log(target,'target---set');
          console.log('set :>>:value ', name + ':' + value);
          return Reflect.set(target, name,value,receiver);
        }
      };
      let proxy = new Proxy(this.inputData,handle);
      console.log('proxy :>> ', proxy);
      // proxy.name = {
      //   value :'xxxxx'
      // };
      proxy.height = 180
      this.proxyData = proxy;


    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
</style>
