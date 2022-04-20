<template>
  <div ref="preview">
    <el-tabs class="demo-tabs">
      <el-tab-pane
        label="User"
        name="first"
      >User</el-tab-pane>
      <el-tab-pane
        label="Configrrrrrrrrrrrrrrrrrrr"
        name="second"
      >Configxxxxxxxxxxxxx</el-tab-pane>
      <el-tab-pane
        label="Role"
        name="third"
      >Role</el-tab-pane>
      <el-tab-pane
        label="Task"
        name="fourth"
      >Task</el-tab-pane>
    </el-tabs>
    <el-button
      type="primary"
      @click="transformWord"
    >转work</el-button>
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
      <input
        type="file"
        @change="previewPDf"
        ref="pdffile"
      >
    </div>
    <div>
      <span>docx预览</span>
      <input
        type="file"
        @change="preview()"
        ref="file"
      >
    </div>

  </div>
</template>
<script>
// import PDFJS from 'pdfjs-dist/es5/build/pdf.js'
// import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.js'
import PDFJS from 'pdfjs-dist'
const docx = require("docx-preview");
const jszip = require("jszip");
const FileSaver = require("jszip/vendor/FileSaver.js");
console.log('PDFJS :>> ', PDFJS);
export default {
  data() {
    return {
      pdfSrc: "",
    };
  },
  methods: {
    async preview(file) {
      let div = document.createElement("div");
      div.className = "box";
      file = this.$refs.file.files[0];
      this.file = file;
      console.log("file :>> ", file);
      let a = await docx.renderAsync(file, div); // 渲染到页面预览
      console.log("a :>> ", a);
      this.$refs.preview.appendChild(div);
      console.log("this.$refs.file.files[0] :>> ", this.$refs.file.files[0]);
      await this.$nextTick();
      console.log(div);
      let b = div.querySelector(".docx-wrapper");
      let text = b.innerHTML;
      let type =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const blob = new Blob([text]);
      this.wordText = text;
      let url = URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = url;
      link.style.display = "none";
      // link.download = 'test111.txt';
      // link.download = 'test111.docx';
      link.download = "test111.html";
      document.body.appendChild(link);
      link.click();
      // console.log(div);
      // this.download(this.$refs.file.files[0], 'html')
    },
    async transformWord() {
      this.wordText = this.exportHTML();
      let type = "application/vnd.ms-word";
      let file1 = new window.File([this.wordText], "filename.docx", {
        type,
      });
      console.log("file1 :>> ", file1);
      var reader = new FileReader();
      await reader.readAsText(file1);
      console.log("reader :>> ", reader);
      // return;
      console.log("reader :>> ", reader);
      let div = document.createElement("div");
      let a = await docx.renderAsync(file1, div); // 渲染到页面预览
      this.$refs.preview.appendChild(div);
      console.log("a :>> ", a);
    },
    exportHTML() {
      var header =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
      var footer = "</body></html>";
      var sourceHTML = header + this.wordText + footer;
      var source =
        "data:application/vnd.ms-word;charset=utf-8," +
        encodeURIComponent(sourceHTML);
      // const blob = new Blob([source]);
      // let url = URL.createObjectURL(blob);
      var fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = "document.docx";
      fileDownload.click();
      document.body.removeChild(fileDownload);
      return source;
    },
    submitUpload() {
      let uploadRef = this.$refs.uploadRef;
      console.log("uploadRef :>> ", uploadRef, uploadRef.value);
    },
    beforeUpload(file) {
      console.log("file :>>333", file);
      return false;
    },
    changeFile(file) {
      if (file.status === "ready") {
        this.file = file;
      }
    },
    async previewPDfTest() {
      if (!this.file) return;
      let { raw } = this.file;
      console.log(" this.file :>> ", this.file);
      console.log("pdfjsLib :>> ", pdfjsLib);
      var reader = new FileReader();
      await reader.readAsDataURL(raw);
      console.log("reader :>> ", reader);
      let result = reader.result;
      console.log('result :>> ', result);
      reader.onload = e => {
        let target = e.target;
        let result = target.result;
        this.getPdf(result)
      }
    },
  
    async previewPDf() {
      let container = this.$refs.pdffile;
      let file = container.files[0];
      this.file = file;
      var reader = new FileReader();
      await reader.readAsDataURL(file);
      console.log("reader :>> ", reader);
      let result = reader.result;
      console.log('result :>> ', reader,result);
      reader.onload = e => {
        let target = e.target;
        let result = target.result;
        this.getPdf(result)
      };
      //  this.getPdf(this.file)
      return;
      let url = encodeURIComponent(URL.createObjectURL(file));
      this.pdfSrc = "/pdfjs/web/viewer.html?file=" + url;
      console.log("url :>> ", url);
      this.download(file, "pdf");
    },
    async getPdf(result) {
      let res = await PDFJS.getDocument(result);
      console.log('res :>>5555 ', res);
     console.log(res.numPages);
      // PDFJS.getDocument(result).promise.then((res) => {
      //   console.log("res :>> ", res);
      // });
      // console.log('a66666 :>> ', pdf);
      // console.log(' pdf.numPages :>> ',  pdf._transport);
    },
    download(file, type) {
      let url = URL.createObjectURL(file);
      console.log(url, "url");
      let link = document.createElement("a");
      link.href = url;
      link.style.display = "none";
      link.download = "aaa." + type;
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>

