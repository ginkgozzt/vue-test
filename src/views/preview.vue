<template>
  <div ref="preview">
    <!-- <el-upload 
        ref="uploadRef" 
        class="upload-demo" 
        :on-change="changeFile"
        :before-upload="beforeUpload"
        :auto-upload="false"
        action="/" 
        >
        <template #trigger>
          <el-button type="primary">select file</el-button>
</template>
      <el-button class="ml-3" type="success" @click="submitUpload">
        upload to server
      </el-button>
<template #tip>
  <div class="el-upload__tip">
    jpg/png files with a size less than 500kb
  </div>
</template>
    </el-upload>

    <div>
       <el-button type="primary"  @click="previewPDfTest">pdf预览</el-button>
    </div> -->
    <div>
      <span>pdf预览</span>
      <input type="file" @change="previewPDf" ref="pdffile">
    </div>
    <div>
      <span>docx预览</span>
      <input type="file" @change="preview" ref="file">
    </div>
   
  </div>
</template>
<script>
  const docx = require('docx-preview');
  const jszip = require('jszip');
  export default {
    data() {
      return {
        pdfSrc: ''
      }
    },
    methods: {
      async preview(e) {
        let div = document.createElement('div');
        div.className = 'box'
        let file = this.$refs.file.files[0];
        let a = await docx.renderAsync(this.$refs.file.files[0], div) // 渲染到页面预览
        console.log('a :>> ', a);
        this.$refs.preview.appendChild(div);
        console.log('this.$refs.file.files[0] :>> ', this.$refs.file.files[0]);
        await  this.$nextTick();
        console.log( div);
        let b = div.querySelector('.docx-wrapper')
        let text = b.innerHTML;
          const blob = new Blob([text]);
          let url = URL.createObjectURL(blob);
          let link = document.createElement('a');
          link.href = url;
          link.style.display = 'none';
          link.download = 'test111.txt' ;
          document.body.appendChild(link);
          link.click();
          console.log( div);
        // this.download(this.$refs.file.files[0], 'html')
      },
      submitUpload() {
        let uploadRef = this.$refs.uploadRef;
        console.log('uploadRef :>> ', uploadRef, uploadRef.value);
      },
      beforeUpload(file) {
        console.log('file :>>333', file);
        return false;
      },
      changeFile(file) {
        if (file.status === 'ready') {
          this.file = file
        };
      },
      async previewPDfTest() {
        if (!this.file) return;
        let {
          raw
        } = this.file;
        console.log(' this.file :>> ', this.file);
        console.log('pdfjsLib :>> ', pdfjsLib);
        var reader = new FileReader();
        await reader.readAsDataURL(raw);
        console.log('reader :>> ', reader);
        // reader.onload = e => {
        //   let target = e.target;
        //   let getPdf = target.result;
        //   this.getPdf(getPdf)
        // }
      },
      async getPdf(result) {
        pdfjsLib.getDocument(result).promise.then(res => {
          console.log('res :>> ', res);
        })
        // console.log('a66666 :>> ', pdf);
        // console.log(' pdf.numPages :>> ',  pdf._transport);
      },
      async previewPDf() {
        let container = this.$refs.pdffile;
        let file = container.files[0];
        this.file = file
          var reader = new FileReader();
        await reader.readAsDataURL(file);
        console.log('reader :>> ', reader);
     
        return
        let url = encodeURIComponent(URL.createObjectURL(file));
        this.pdfSrc = '/pdfjs/web/viewer.html?file=' + url;
        console.log('url :>> ', url);
        this.download(file, 'pdf')
      },
      download(file, type) {
        let url = URL.createObjectURL(file);
        console.log(url, 'url')
        let link = document.createElement('a');
        link.href = url;
        link.style.display = 'none';
        link.download = 'aaa.' + type;
        document.body.appendChild(link);
        link.click();
      }
    }
  };
</script>
<style>

</style>
