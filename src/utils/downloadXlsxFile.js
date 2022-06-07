
import fs  from 'file-saver'
import XLSX from 'xlsx'
import XLSXS from "xlsx-style";
import jsyaml from "js-yaml";
function downloadXlsxFile(filename="test",inputsData = {}, inputs_json = {} ,stack_name ='',stack_description = '') {
  const titles = {
    xlsx_type:'字段标识(请勿编辑)',
    stack_name:'应用名称(必填)',
    stack_description:'应用描述'
  };
  const typeObj = {xlsx_type:'字段类型(请勿编辑）', stack_name:'string', stack_description:'string'};
  const keyObj =  {xlsx_type:'字段名(请勿编辑）', stack_name:'stack_name', stack_description:'stack_description'};
  const valObj =  {xlsx_type:'实例数据1', stack_name, stack_description};
  const emptObj =  {xlsx_type:'', stack_name:'', stack_description:''};
  Object.keys(inputsData).map(key =>{
    const item = inputsData[key] || {};
    const {description = '' ,type = 'string',metadata ={} , required= true} = item;
    const display = metadata.display;
    const label = metadata.label || key;
    const i = key.substring(0,1);
    if(i !== '_' && display !=='none'){
      titles[key] = label;
      typeObj[key] = type;
      keyObj[key] = key;
      let val =  inputs_json[key];
      if(Array.isArray(val)){
        let obj = {list:val}
        val =  jsyaml.dump(obj);
      }else if(val && val instanceof Object){
        val =  jsyaml.dump(val);
      };
      valObj[key] =  val == undefined ? '' : val;
      emptObj[key] = '';
      if(required){
        titles[key] = label + '（必填）'
      }  
    }
  })
  const dataArray =[
    typeObj,
    keyObj,
    valObj
  ];
  dataArray.push(...new Array(1000 - dataArray.length).fill(emptObj))
  var newData = [];
  dataArray.forEach((item) => {
    if (item) {
      const obj = {};
      for (let i in item) {
        if (titles.hasOwnProperty(i)) {
          obj[titles[i]] = item[i];
        }
      }
      newData.push(obj);
    }
  });
 
  let sheetName = filename //excel的文件名称
  let wb = XLSX.utils.book_new()  //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
  let ws = XLSX.utils.json_to_sheet(newData, { header: Object.values(titles) }) //将JS对象数组转换为工作表。
  const alignment = {
    wrapText: true,
    horizontal: "left",
    vertical: "center",
  };
  const border = {
    top: {
      style: "thin",
      color: {
        rgb: 'cccccc'
      }
    },
    bottom: {
      style: "thin",
      color: {
        rgb: 'cccccc'
      }
    },
    left: {
      style: "thin",
      color: {
        rgb: 'cccccc'
      }
    },
    right: {
      style: "thin",
      color: {
        rgb: 'cccccc'
      }
    },
  };
  Object.keys(ws).map(key =>{
    if(!key.includes('!')){
      const reg = /^[A][0-9]+$/g, reg1 = /^[A-Z]+1$/g,  reg2 = /^[A-Z]+[2|3]$/g
      if(reg.test(key)){
        ws[key].s = {
          alignment,
          fill: { fgColor: { rgb: "fde9d9" } } ,
          border
        }
      }else if(reg1.test(key)){
        // （必填）
        const item =  ws[key];
        let color = '000000'
        if(item.v.includes('（必填）')){
          color = 'ff0000';
        }
        item.s = {
          alignment,
          fill: { fgColor: { rgb: "92d050" } } ,
          border,
          font:{
            color: {rgb: color},
          }
        }
      }else if(reg2.test(key)){
        ws[key].s = {
          alignment,
          fill: { fgColor: { rgb: "d8e4bc" } } ,
          border
        }
      }else {
        ws[key].s = {
          alignment,
          border:{
            top: {
              style: "dotted",
              color: {
                rgb: 'acacac'
              }
            },
            bottom: {
              style: "dotted",
              color: {
                rgb: 'acacac'
              }
            },
            left: {
              style: "dotted",
              color: {
                rgb: 'acacac'
              }
            },
            right: {
              style: "dotted",
              color: {
                rgb: 'acacac'
              }
            },
          }
        }

      }
    }
  })

  wb.SheetNames = [sheetName];
  wb.Sheets[sheetName] = ws

  ws["!cols"] =  new Array(Object.keys(titles).length).fill({wpx:200});

  let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, showGridLines: true }  //写入的样式

  let wbout = XLSXS.write(wb, wopts)
  let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  fs.saveAs(blob, filename + '.xlsx') 
}
function  s2ab(s) {
  if (typeof ArrayBuffer !== 'undefined') {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  } else {
    var buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}
export { downloadXlsxFile };