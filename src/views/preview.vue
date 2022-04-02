<template>
  <div class="my-component" ref="preview">
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
      preview(e) {
        let div = document.createElement('div');
        div.className = 'box'
        docx.renderAsync(this.$refs.file.files[0], div) // 渲染到页面预览
        this.$refs.preview.appendChild(div);
        this.download(this.$refs.file.files[0],'docx')
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
        console.log(url,'url')
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
