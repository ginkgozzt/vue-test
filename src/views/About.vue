<template>
  <div class="about" ref="about">
    <h1>This is an about page</h1>
    <div>第一书籍：{{persion.name}}</div>
    <div style="margin:10px">一共有书籍：{{list.length}}</div>
    <button @click="changeBooks">更换书籍</button>
    <Books msg="111111" :data="list" class="aa" style="font-size:20px" data-state="active" @change="change" ref="book" />
  </div>
</template>

<script>
  // @ is an alias to /src
  import Books from '@/components/Books/index'
  import {
    ref,
    watch,
    reactive,
    onBeforeUpdate,
    provide
  } from 'vue'
  export default {
    name: 'Home',
    components: {
      Books
    },
  
    setup(props) {
      const about = ref(null);
      const list = ref([]);
      const persion = reactive({
        name: 'zzt'
      });
      const titile = ref('随机书籍')
      const changeTitile = () => {
        titile.value = '随机书籍' + list.value.length;
        console.log('444444:');
      };
      provide('titile', titile)
      provide('changeTitile', changeTitile)
      // console.log(divs,'divs')
      const books = [
        '《西游记》',
        '《三国演义》',
        '《高老头》',
        '《老人与海》',
        '《傲慢与偏见》',
        '《简·爱》',
        '《德兰修女传——在爱中行走》',
        '《从一到无穷大》',
        '《万物生光辉》',
        '《当我谈跑步时，我谈些什么》',
        '《钢铁是怎样炼成的》',
        '《数理化通俗演义》',
        '《一只蚂蚁领着我走》',
        '《狼图腾》',
        '《平凡的世界》',
        '《一万小时天才理论》',
        '《活着》',
        '《我与父辈》',
        '《丘吉尔传》',
        '《复活》',
        '《大江东去》',
        '《霍比特人》',
        '《苏菲的世界》',
        '《国学的天空》',
        '《古文观止》'
      ];
      const changeBooks = () => {
        let length = books.length,
          arr = [];
        let copyBooks = books.slice();
        let n = Math.ceil(Math.random() * length);
        for (let index = 0; index < n; index++) {
          let i = Math.floor(Math.random() * length);
          let book = books[i]
          arr.push(book);
        };
        arr = Array.from(new Set(arr));
        list.value = arr;
        persion.name = arr[0]
        // console.log('root :>> ', about.value);
      };
      watch(persion, (val, oldVal) => {
        console.log('val :>> ', val);
        console.log('oldVal :>> ', oldVal);
      });
      watch(about, () => {
        console.log('about.value :>> ', about.value);
      })
      onBeforeUpdate(() => {
        //  persion.value = {}
      })
      return {
        about,
        list,
        persion,
        changeBooks
      }
    },
    data() {
      return {
        n: 0
      }
    },
    methods: {
      change(val) {
        this.n = val;
        console.log('changeCount :>> ', val);
      },
      test() {
      }
    },
    mounted() {
    },
  }
</script>
