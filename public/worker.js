
// setTimeout(() =>{
//   self.onmessage(m =>{
//     console.log('m :>> ', m);
//   })
//   self.postMessage('ssss')
//   self.close()

// },1000)
let count = 0;
let timer = setInterval(() =>{
  count ++;
  self.postMessage(count);
  if(count > 20){
    clearInterval(timer);
    timer = null;
  };
 

},2000)

