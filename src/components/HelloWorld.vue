<template>
  <div class="hello">
    <el-button
      type="primary"
      @click="getTreeData"
    >获取</el-button>
    <h1>{{ msg }}</h1>
    <div v-text="inputData"></div>
    <ul>
      <li
        v-for="(item,key) in inputData"
        :key="key"
      >
        <input
          type="text"
          v-model="item.value"
        >
        <div v-text="item"></div>
        <div v-text="key"></div>

      </li>
    </ul>

  </div>
</template>

<script>
import testData from "../assets/test.json";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      inputData: {
        name: {
          value: "xxxxx",
          type: "string",
        },
        age: {
          value: 18,
          type: "integer",
        },
      },
      proxyData: {},
    };
  },
  watch: {},
  mounted() {
    // this.init();
  },
  methods: {
    getTreeData() {
      let dataList = testData.data.dataList;

      let originData = JSON.parse(JSON.stringify(dataList));
      let roots = originData.filter((val) => {
        let item = originData.find((item) => val.parent_group_id === item.id);
        return !item;
      });
      let iterationFn = (children, node) => {
        node.children = children;
        if (children.length > 0) {
          children.map((val) => {
            children = originData.filter(
              (item) => item.parent_group_id === val.id
            );
            iterationFn(children, val);
          });
        }
      };
      roots.map((val) => {
        let children = originData.filter(
          (item) => item.parent_group_id === val.id
        );
        iterationFn(children, val);
      });
      console.log("roots :>> ", roots);
    },
    init() {
      let handle = {
        get: function (target, name, receiver) {
          // console.log(target,'target---get');
          // console.log('name :>> ', name);
          return Reflect.get(target, name, receiver);
        },
        set: function (target, name, value, receiver) {
          console.log(target, "target---set");
          console.log("set :>>:value ", name + ":" + value);
          return Reflect.set(target, name, value, receiver);
        },
      };
      let proxy = new Proxy(this.inputData, handle);
      console.log("proxy :>> ", proxy);
      // proxy.name = {
      //   value :'xxxxx'
      // };
      proxy.height = 180;
      this.proxyData = proxy;
    },
  },
};
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
