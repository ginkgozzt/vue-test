<template>
  <div class="hello">
    <h3>文本编辑器</h3>
    <el-button
      type="primary"
      @click="getContent"
    >获取</el-button>
    <el-button
      type="primary"
      @click="insertContent"
    >插入节点</el-button>
      <el-button
      type="primary"
      @click="reset"
    >重置</el-button>
    <div id="textarea"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: false,
      setting: {
        height: 500,
      },
    };
  },
  mounted() {
    this.init();
  },
  computed: {},
  beforeDestroy() {
    console.log(" this.tinymce :>> ", this.tinymce.destroy);
    this.tinymce.destroy();
    this.tinymce.off("input keyup Change Undo Redo ExecCommand NodeChange");
  },
  methods: {
    getContent() {
      // console.log(this.tinymce, 'tinymce');
      let text = this.tinymce.getContent();
      this.content = text;
      // this.download(new Blob([text]), 'docx');
      // text = this.tinymce.get()
      console.log("text :>> ", text);
      // this.tinymce.setContent('rrrrrrrrrr')
      // tinymce.init({
      //   selector: '#textarea'
      // })
    },
    async init(editor) {
      if (tinymce.activeEditor) {
        this.tinymce = tinymce.activeEditor;
        return;
      } else {
        await tinymce
          .init({
            selector: "#textarea",
            //skin:'oxide-dark',
            content:'44555',
            branding: false,
            language: "zh_CN",
            plugins:
              "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave  autoresize  ",
            toolbar:
              "code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
              styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
              table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen |  lineheight  ",
            height: 650, //编辑器高度
            min_height: 400,
            /*content_css: [ //可设置编辑区内容展示的css，谨慎使用
                '/static/reset.css',
                '/static/ax.css',
                '/static/css.css',
            ],*/
            forced_root_block: "div",
            fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
            font_formats:
              "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
            link_list: [
              {
                title: "预置链接1",
                value: "http://www.tinymce.com",
              },
              {
                title: "预置链接2",
                value: "http://tinymce.ax-z.cn",
              },
            ],
            image_list: [
              {
                title: "预置图片1",
                value: "https://www.tiny.cloud/images/glyph-tinymce@2x.png",
              },
              {
                title: "预置图片2",
                value: "https://www.baidu.com/img/bd_logo1.png",
              },
            ],
            image_class_list: [
              {
                title: "None",
                value: "",
              },
              {
                title: "Some class",
                value: "class-name",
              },
            ],
            importcss_append: true,
            //自定义文件选择器的回调内容
            file_picker_callback: function (callback, value, meta) {
              if (meta.filetype === "file") {
                callback("https://www.baidu.com/img/bd_logo1.png", {
                  text: "My text",
                });
              }
              if (meta.filetype === "image") {
                callback("https://www.baidu.com/img/bd_logo1.png", {
                  alt: "My alt text",
                });
              }
              if (meta.filetype === "media") {
                callback("movie.mp4", {
                  source2: "alt.ogg",
                  poster: "https://www.baidu.com/img/bd_logo1.png",
                });
              }
            },
            toolbar_sticky: true,
            autosave_ask_before_unload: false,
          })
          .then((res) => {
            console.log("res :>> ", res);
            this.tinymce = res[0];
          });
      }
      console.log(this.tinymce);
      if (this.tinymce) {
        // this.tinymce.on(
        //   "input keyup Change Undo Redo ExecCommand NodeChange",
        //   (e) => {
        //     console.log("e :>> ", e);
        //     // this.getContent()
        //   }
        // );
        this.tinymce.on(
          "click",
          (e) => {
            console.log("e :>> ", e);
            
            // this.getContent()
          }
        );
      }
    },
    insertContent(){
      let span =`<span style="color:#f00">测试册数</span>`
   
      this.tinymce.settings.height = 200;
      this.tinymce.settings.min_height = 200;
      this.tinymce.settings.max_height = 200;
    
      this.tinymce.execCommand('mceInsertContent', false, span)
    
      console.log('tinymce :>> ', this.tinymce);

    },
    reset(){
      this.tinymce.reset()
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

<style scoped>
</style>
