<template>
  <div
    class="hello"
    v-test
  >
    <button @click="test">视口窗口</button>
    <ul class="books-wrap">
      <li
        v-for="item in data"
        :key="item"
      >{{item}}</li>
    </ul>
    <div>{{count}}</div>
    <button @click="increment">add</button>
    <div>who i am ?</div>
    <div id="viewport">
      视口视口视图
    </div>
    <teleport
      to="#viewport"
      v-if="data.length"
    >
      <div
        v-if="flag"
        class="abc"
      >
        123
        <button @click="test">test</button>
      </div>
    </teleport>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { ref, toRefs, toRef, h, watch, onMounted, inject } from "vue";
// const worker = new Worker(URL.createObjectURL(new Blob([`self.onmessage =
// ({data}) => console.log(data);`])));
const worker = new Worker("/zzt/worker.js");
console.log("location.href  :>> ", location.href + "/worker.js");
worker.postMessage("blob worker script");
worker.postMessage("1111yy");
worker.onmessage = (e) => {
  console.log("e.data :>> ", e.data);
};

export default {
  directives: {
    test: {
      beforeMount: (el) => {
        console.log("el :>> directive", el);
      },
    },
  },
  setup(props, { expose, emit, attrs }) {
    console.log(attrs["data-state"], "attrs");
    const { data } = toRefs(props);
    const count = ref(0);
    const titile = inject("titile", 5555);
    const changeTitile = inject("changeTitile");
    console.log("titile :>> ", titile);
    const increment = () => {
      ++count.value;
      emit("change", count.value);
      console.log("books:", data);
    };
    watch(count, (val) => {
      // console.log('count.value :>> ', count.value);
      // titile.value = 'rrr' + count.value
      changeTitile();
    });
    watch(titile, () => {
      console.log(titile.value, "titile99");
    });
    onMounted(() => {
      // console.log('111 :>> ', 111);
      // console.log('count :>> ', count);
    });
    expose({
      increment,
      count,
    });
    // return () => h('div','rrrrr777777777')
    return {
      count,
      increment,
    };
    // return () => h('div', count.value)
  },
  props: {
    msg: String,
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      flag: false,
    };
  },

  mounted() {
    // console.log('2222 :>> ', 2222);
    console.log(" this.$attrs:");
  },
  watch: {
    count() {
      // console.log('this.count :>> ', this.count);
    },
  },
  computed: {},
  methods: {
    test() {
      this.flag = !this.flag;
      // console.log('this.count :>> ', this.count);
    },
  },
};
</script>

<style scoped>
.hello {
  position: relative;
}
#viewport {
  position: absolute;
  left: 20px;
  top: 20px;
  height: 100px;
  width: 200px;
  border: 1px solid rgb(160, 204, 163);
}
.abc {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ddd;
  top: 0;
  left: 0;
}
.books-wrap {
  max-height: 150px;
  overflow: auto;
}
</style>
