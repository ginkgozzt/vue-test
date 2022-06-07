<template>
  <div class="hello">
    <div style="display:flex">
   <div
      id="myPaletteDiv"
      style="width:200px; height:850px; background-color: #ddd;"
    ></div>

    <div
      id="myDiagramDiv"
      style="width:900px; height:850px; background-color: #DAE4E4;"
    >

    </div>
    </div>
   
  
    <textarea
      v-show="false"
      id="mySavedModel"
      style="width:100%;height:300px"
    >{ "class": "go.GraphLinksModel",
"linkFromPortIdProperty": "fromPort",
"linkToPortIdProperty": "toPort",
"nodeDataArray": [
{"category":"Comment", "loc":"360 -10", "text":"Kookie Brittle", "key":-13},
{"key":-1, "category":"Start", "loc":"175 0", "text":"Start"},
{"key":0, "loc":"-5 75", "text":"Preheat oven to 375 F"},
{"key":1, "loc":"175 100", "text":"In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"},
{"key":2, "loc":"175 200", "text":"Gradually beat in 1 cup sugar and 2 cups sifted flour"},
{"key":3, "loc":"175 290", "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"},
{"key":4, "loc":"175 380", "text":"Press evenly into ungreased 15x10x1 pan"},
{"key":5, "loc":"355 85", "text":"Finely chop 1/2 cup of your choice of nuts"},
{"key":6, "loc":"175 450", "text":"Sprinkle nuts on top"},
{"key":7, "loc":"175 515", "text":"Bake for 25 minutes and let cool"},
{"key":8, "loc":"175 585", "text":"Cut into rectangular grid"},
{"key":-2, "category":"End", "loc":"175 660", "text":"Enjoy!"}
],
"linkDataArray": [
{"from":1, "to":2, "fromPort":"B", "toPort":"T"},
{"from":2, "to":3, "fromPort":"B", "toPort":"T"},
{"from":3, "to":4, "fromPort":"B", "toPort":"T"},
{"from":4, "to":6, "fromPort":"B", "toPort":"T"},
{"from":6, "to":7, "fromPort":"B", "toPort":"T"},
{"from":7, "to":8, "fromPort":"B", "toPort":"T"},
{"from":8, "to":-2, "fromPort":"B", "toPort":"T"},
{"from":-1, "to":0, "fromPort":"B", "toPort":"T"},
{"from":-1, "to":1, "fromPort":"B", "toPort":"T"},
{"from":-1, "to":5, "fromPort":"B", "toPort":"T"},
{"from":5, "to":4, "fromPort":"B", "toPort":"T"},
{"from":0, "to":4, "fromPort":"B", "toPort":"T"}
]}
</textarea>
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
import gojs from "gojs";
console.log("gojs :>> ", gojs);
const go = gojs;

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
    this.$nextTick(() => {
      this.test();
    });
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
    test() {
      var myDiagram, myPalette;
      function init() {
        // if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this

        // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
        // For details, see https://gojs.net/latest/intro/buildingObjects.html
        const $ = go.GraphObject.make; // for conciseness in defining templates

        myDiagram = $(
          go.Diagram,
          "myDiagramDiv", // must name or refer to the DIV HTML element
          {
            LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
            LinkRelinked: showLinkLabel,
            "undoManager.isEnabled": true, // enable undo & redo
          }
        );

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener("Modified", (e) => {
          var button = document.getElementById("SaveButton");
          if (button) button.disabled = !myDiagram.isModified;
          var idx = document.title.indexOf("*");
          if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
          } else {
            if (idx >= 0) document.title = document.title.slice(0, idx);
          }
        });

        // helper definitions for node templates

        function nodeStyle() {
          return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
              go.Point.stringify
            ),
            {
              // the Node.location is at the center of each node
              locationSpot: go.Spot.Center,
            },
          ];
        }

        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId,
        // the "align" is used to determine where to position the port relative to the body of the node,
        // the "spot" is used to control how links connect with the port and whether the port
        // stretches along the side of the node,
        // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
        function makePort(name, align, spot, output, input) {
          var horizontal =
            align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
          // the port is basically just a transparent rectangle that stretches along the side of the node,
          // and becomes colored when the mouse passes over it
          return $(go.Shape, {
            fill: "transparent", // changed to a color in the mouseEnter event handler
            strokeWidth: 0, // no stroke
            width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
            height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
            alignment: align, // align the port on the main Shape
            stretch: horizontal
              ? go.GraphObject.Horizontal
              : go.GraphObject.Vertical,
            portId: name, // declare this object to be a "port"
            fromSpot: spot, // declare where links may connect at this port
            fromLinkable: output, // declare whether the user may draw links from here
            toSpot: spot, // declare where links may connect at this port
            toLinkable: input, // declare whether the user may draw links to here
            cursor: "pointer", // show a different cursor to indicate potential link point
            mouseEnter: (e, port) => {
              // the PORT argument will be this Shape
              if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
            },
            mouseLeave: (e, port) => (port.fill = "transparent"),
          });
        }

        function textStyle() {
          return {
            font: "bold 11pt Lato, Helvetica, Arial, sans-serif",
            stroke: "#F8F8F8",
          };
        }

        // define the Node templates for regular nodes

        myDiagram.nodeTemplateMap.add(
          "", // the default category
          $(
            go.Node,
            "Table",
            nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(
              go.Panel,
              "Auto",
              $(
                go.Shape,
                "Rectangle",
                { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                new go.Binding("figure", "figure")
              ),
              $(
                go.TextBlock,
                textStyle(),
                {
                  margin: 8,
                  maxSize: new go.Size(160, NaN),
                  wrap: go.TextBlock.WrapFit,
                  editable: true,
                },
                new go.Binding("text").makeTwoWay()
              )
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
            makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
            makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
          )
        );

        myDiagram.nodeTemplateMap.add(
          "Conditional",
          $(
            go.Node,
            "Table",
            nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(
              go.Panel,
              "Auto",
              $(
                go.Shape,
                "Diamond",
                { fill: "#282c34", stroke: "#00A9C9", strokeWidth: 3.5 },
                new go.Binding("figure", "figure")
              ),
              $(
                go.TextBlock,
                textStyle(),
                {
                  margin: 8,
                  maxSize: new go.Size(160, NaN),
                  wrap: go.TextBlock.WrapFit,
                  editable: true,
                },
                new go.Binding("text").makeTwoWay()
              )
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
          )
        );

        myDiagram.nodeTemplateMap.add(
          "Start",
          $(
            go.Node,
            "Table",
            nodeStyle(),
            $(
              go.Panel,
              "Spot",
              $(go.Shape, "Circle", {
                desiredSize: new go.Size(70, 70),
                fill: "#282c34",
                stroke: "#09d3ac",
                strokeWidth: 3.5,
              }),
              $(go.TextBlock, "Start", textStyle(), new go.Binding("text"))
            ),
            // three named ports, one on each side except the top, all output only:
            makePort("L", go.Spot.Left, go.Spot.Left, true, false),
            makePort("R", go.Spot.Right, go.Spot.Right, true, false),
            makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
          )
        );

        myDiagram.nodeTemplateMap.add(
          "End",
          $(
            go.Node,
            "Table",
            nodeStyle(),
            $(
              go.Panel,
              "Spot",
              $(go.Shape, "Circle", {
                desiredSize: new go.Size(60, 60),
                fill: "#282c34",
                stroke: "#DC3C00",
                strokeWidth: 3.5,
              }),
              $(go.TextBlock, "End", textStyle(), new go.Binding("text"))
            ),
            // three named ports, one on each side except the bottom, all input only:
            makePort("T", go.Spot.Top, go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, go.Spot.Left, false, true),
            makePort("R", go.Spot.Right, go.Spot.Right, false, true)
          )
        );

        // taken from ../extensions/Figures.js:
        go.Shape.defineFigureGenerator("File", (shape, w, h) => {
          var geo = new go.Geometry();
          var fig = new go.PathFigure(0, 0, true); // starting point
          geo.add(fig);
          fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
          fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
          fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
          fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
          var fig2 = new go.PathFigure(0.75 * w, 0, false);
          geo.add(fig2);
          // The Fold
          fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
          fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
          geo.spot1 = new go.Spot(0, 0.25);
          geo.spot2 = go.Spot.BottomRight;
          return geo;
        });

        myDiagram.nodeTemplateMap.add(
          "Comment",
          $(
            go.Node,
            "Auto",
            nodeStyle(),
            $(go.Shape, "File", {
              fill: "#282c34",
              stroke: "#DEE0A3",
              strokeWidth: 3,
            }),
            $(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(200, NaN),
                wrap: go.TextBlock.WrapFit,
                textAlign: "center",
                editable: true,
              },
              new go.Binding("text").makeTwoWay()
            )
            // no ports, because no links are allowed to connect with a comment
          )
        );

        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate = $(
          go.Link, // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: (e, link) =>
              (link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"),
            mouseLeave: (e, link) =>
              (link.findObject("HIGHLIGHT").stroke = "transparent"),
            selectionAdorned: false,
          },
          new go.Binding("points").makeTwoWay(),
          $(
            go.Shape, // the highlight shape, normally transparent
            {
              isPanelMain: true,
              strokeWidth: 8,
              stroke: "transparent",
              name: "HIGHLIGHT",
            }
          ),
          $(
            go.Shape, // the link path shape
            { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
            new go.Binding("stroke", "isSelected", (sel) =>
              sel ? "dodgerblue" : "gray"
            ).ofObject()
          ),
          $(
            go.Shape, // the arrowhead
            { toArrow: "standard", strokeWidth: 0, fill: "gray" }
          ),
          $(
            go.Panel,
            "Auto", // the link label, normally not visible
            {
              visible: false,
              name: "LABEL",
              segmentIndex: 2,
              segmentFraction: 0.5,
            },
            new go.Binding("visible", "visible").makeTwoWay(),
            $(
              go.Shape,
              "RoundedRectangle", // the label shape
              { fill: "#F8F8F8", strokeWidth: 0 }
            ),
            $(
              go.TextBlock,
              "Yes", // the label
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#333333",
                editable: true,
              },
              new go.Binding("text").makeTwoWay()
            )
          )
        );

        // Make link labels visible if coming out of a "conditional" node.
        // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
        function showLinkLabel(e) {
          var label = e.subject.findObject("LABEL");
          if (label !== null)
            label.visible = e.subject.fromNode.data.category === "Conditional";
        }

        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        myDiagram.toolManager.linkingTool.temporaryLink.routing =
          go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing =
          go.Link.Orthogonal;

        load(); // load an initial diagram from some JSON text

        // initialize the Palette that is on the left side of the page
        myPalette = $(
          go.Palette,
          "myPaletteDiv", // must name or refer to the DIV HTML element
          {
            // Instead of the default animation, use a custom fade-down
            "animationManager.initialAnimationStyle": go.AnimationManager.None,
            InitialAnimationStarting: animateFadeDown, // Instead, animate with this function

            nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
            model: new go.GraphLinksModel([
              // specify the contents of the Palette
              { category: "Start", text: "Start" },
              { text: "Step" },
              { category: "Conditional", text: "???" },
              { category: "End", text: "End" },
              { category: "Comment", text: "Comment" },
                { category: "End", text: "测试" },
            ]),
          }
        );

        // This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
        function animateFadeDown(e) {
          var diagram = e.diagram;
          var animation = new go.Animation();
          animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
          animation.easing = go.Animation.EaseOutExpo;
          animation.duration = 900;
          // Fade "down", in other words, fade in from above
          animation.add(
            diagram,
            "position",
            diagram.position.copy().offset(0, 200),
            diagram.position
          );
          animation.add(diagram, "opacity", 0, 1);
          animation.start();
        }
      } // end init

      // Show the diagram's model in JSON format that the user may edit
      function save() {
        document.getElementById("mySavedModel").value =
          myDiagram.model.toJson();
        myDiagram.isModified = false;
      }
      function load() {
        console.log("myDiagram :>> ", myDiagram);
        myDiagram.model = go.Model.fromJson(
          document.getElementById("mySavedModel").value
        );
      }

      // print the diagram by opening a new window holding SVG images of the diagram contents for each page
      function printDiagram() {
        var svgWindow = window.open();
        if (!svgWindow) return; // failure to open a new Window
        var printSize = new go.Size(700, 960);
        var bnds = myDiagram.documentBounds;
        var x = bnds.x;
        var y = bnds.y;
        while (y < bnds.bottom) {
          while (x < bnds.right) {
            var svg = myDiagram.makeSvg({
              scale: 1.0,
              position: new go.Point(x, y),
              size: printSize,
            });
            svgWindow.document.body.appendChild(svg);
            x += printSize.width;
          }
          x = bnds.x;
          y += printSize.height;
        }
        setTimeout(() => svgWindow.print(), 1);
      }
      init();
      // window.addEventListener("DOMContentLoaded", init);
    },
    init() {
      var $ = go.GraphObject.make; // for conciseness in defining templates

      let myDiagram = $(
        go.Diagram,
        "myDiagramDiv", // create a Diagram for the DIV HTML element
        {
          "undoManager.isEnabled": true, // enable undo & redo
        }
      );

      // define a simple Node template
      myDiagram.nodeTemplate = $(
        go.Node,
        "Auto", // the Shape will go around the TextBlock
        $(
          go.Shape,
          "RoundedRectangle",
          { strokeWidth: 0, fill: "white" },
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")
        ),
        $(
          go.TextBlock,
          { margin: 8, font: "bold 14px sans-serif", stroke: "#333" }, // Specify a margin to add some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "key")
        )
      );

      // but use the default Link template, by not setting Diagram.linkTemplate

      // create the model data that will be represented by Nodes and Links
      myDiagram.model = new go.GraphLinksModel(
        [
          { key: "Alpha", color: "lightblue" },
          { key: "Beta", color: "orange" },
          { key: "Gamma", color: "lightgreen" },
          { key: "Delta", color: "pink" },
        ],
        [
          { from: "Alpha", to: "Beta" },
          { from: "Alpha", to: "Gamma" },
          { from: "Beta", to: "Beta" },
          { from: "Gamma", to: "Delta" },
          { from: "Delta", to: "Alpha" },
        ]
      );
      return;
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
