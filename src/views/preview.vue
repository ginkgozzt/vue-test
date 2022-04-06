<template>
  <div class="my-component" ref="preview">
    <el-upload 
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
    </div>
    <div>
      <span>pdf预览</span>
      <input type="file" @change="previewPDf" ref="pdffile">
    </div>
    <div>
      <span>docx预览</span>
      <input type="file" @change="preview" ref="file">
    </div>
    <div>
      <iframe :src="pdfSrc" frameborder="0" style="height: 500px;width:1000px;overflow:auto;"></iframe>
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
      submitUpload(){
        let uploadRef = this.$refs.uploadRef;
        console.log('uploadRef :>> ', uploadRef,uploadRef.value);
      },
      beforeUpload(file){
        console.log('file :>>333', file);
        return false;


      },
      changeFile(file){
        if(file.status === 'ready'){
          this.file = file
        };
    
      },
      previewPDfTest(){
        if(!this.file) return;
        let {raw} = this.file;
        console.log(' this.file :>> ',  this.file);
        console.log('pdfjsLib :>> ', pdfjsLib);
        var reader = new FileReader();
        reader.readAsDataURL(raw);
        reader.onload = e =>{
           let target = e.target;
           let getPdf = target.result;
           this.getPdf(getPdf)
             
         }
      },
      async getPdf(result){
       
         pdfjsLib.getDocument(result).promise.then(res =>{
           console.log('res :>> ', res);
         })
        
        
        // console.log('a66666 :>> ', pdf);
        // console.log(' pdf.numPages :>> ',  pdf._transport);
      },
      preview(e) {
        let div = document.createElement('div');
        div.className = 'box'
        docx.renderAsync(this.$refs.file.files[0], div) // 渲染到页面预览
        this.$refs.preview.appendChild(div);
        this.download(this.$refs.file.files[0], 'docx')
      },
      previewPDf() {
        let container = this.$refs.pdffile;
        let file = container.files[0];
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
  .my-component {
    width: 100%;
    height: 90vh;
    border: 1px solid #000;
  }
  .box {
    height: 300px;
    width: 500px;
    overflow: auto;
    padding: 10px;
    border: 1px solid #ccc;
  }
  .box .docx-wrapper {
    display: inherit;
    padding: 0;
  }
</style>
