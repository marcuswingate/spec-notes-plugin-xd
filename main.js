/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */

let panel;
let fieldBool = false;
let { Artboard, Rectangle, Ellipse, Text, Color, Group } = require("scenegraph");


function create() {
  const HTML = `<style>
            .break {
                flex-flow: row wrap;
                max-width: 100%;
            }
            label.row > * {
                margin: 3px 0;
            }
            label.row > span {
                color: #8E8E8E;
                width: 20px;
                text-align: right;
                font-size: 9px;
            }
            label.row {
                flex-basis: 100%;
                flex-flow: row wrap;
            }
            label.row textarea {
                flex-basis: 100%;
                min-height: 100px;
            }
            form footer > * {
                position: relative;
                left: 8px;
            }

            form footer {
                position: static;
                top: 0;
            }
            
            .hidden { display: none; }
            
        </style>
        <form method="dialog" id="main">
            <div class="row break">
                <label class="row">
                    <span>Notes</span><br>
                    <textarea type="number" uxp-quiet="true" id="txtN"></textarea>
                </label>
                <label class="row">
                    <span>CSS</span><br>
                    <textarea type="number" uxp-quiet="true" id="txtC"></textarea>
                </label>
                <label class="row">
                    <span>JavaScript</span><br>
                    <textarea type="number" uxp-quiet="true" id="txtJ"></textarea>
                </label>
            </div>
            <footer><button id="ok" type="submit" uxp-variant="cta">Save Changes</button></footer>
        </form>
        `;

        function saveChanges() {
            const { editDocument } = require("application");
            editDocument({editLabel:"Update Notes"}, function(selection) {
               
                let board = selection.items[0];
                if (board instanceof Artboard || board instanceof Group) {
                    console.log(board);
                    board.children.forEach(function (childNode, i) {
                        if (childNode instanceof Text) {
                            if (childNode.name == "CSS") { childNode.text = panel.querySelector("#txtC").value || " "; }
                            if (childNode.name == "JavaScript") { childNode.text = panel.querySelector("#txtJ").value || " "; }
                            if (childNode.name == "Notes") { childNode.text = panel.querySelector("#txtN").value || " "; }
                        } else { console.log("no text here"); } 
    
                    });
                }
            });
            
        }
            
  panel = document.createElement("div");
  panel.innerHTML = HTML;

  panel.querySelector("#ok").addEventListener("click", saveChanges);
  return panel;
}


function show(event) {
  // create panel the first time it's shown
  document.innerHTML = '';
  event.node.appendChild(create());
  
}

function hide(event) {
  
}

function update(selection, root) {
    let board = selection.items[0];
    fieldBool = false;
    if (board instanceof Artboard || board instanceof Group) {
        console.log(board);
        board.children.forEach(function (childNode, i) {
            if (childNode instanceof Text) {
                if (childNode.name == "CSS") { panel.querySelector("#txtC").value = childNode.text; fieldBool = true; }
                if (childNode.name == "JavaScript") { panel.querySelector("#txtJ").value = childNode.text; fieldBool = true; }
                if (childNode.name == "Notes") { panel.querySelector("#txtN").value = childNode.text; fieldBool = true; }
            } else { console.log("no text here"); }
        });
    }
    
    if (!fieldBool) {
        panel.querySelector("form").setAttribute("class","hidden");
    } else if (fieldBool && panel.querySelector("form").hasAttribute("class")) {
        panel.querySelector("form").setAttribute("class","show");
    }
    
}

function createFields(selection) {
    let fields = ["CSS", "JavaScript", "Notes"];
    let board = selection.items[0];
    console.log(board);
    for (let i = 0; i < fields.length; i++) {
        let fieldBool = false;
        let field = fields[i];
        if (board.children.length > 0) {
            console.log("we have nodes");
            board.children.forEach(function (childNode, i) {
                if (childNode instanceof Text) {
                    if (childNode.name == field) { fieldBool = true; }
                } else { console.log("no text here"); } 

            });    
        }
        
      if (!fieldBool) {
            let text = new Text();
            text.text = `Place ${fields[i]} here`;
            text.visible = false;
            text.name = fields[i];
            selection.insertionParent.addChild(text);
            text.moveInParentCoordinates(200 * i, 100 * i);
        }
    
    }
}

module.exports = {
    commands: {
        createFields
    },
  panels: {
    example: {
      show,
      hide,
      update
    }
  }
};