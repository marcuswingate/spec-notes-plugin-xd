const React = require('react');
const { Artboard, Rectangle, Ellipse, Text, Color, Group, RootNode } = require("scenegraph");
const NoteList = require('./components/NoteList');
const styles = require('./App.css');


class App extends React.Component {

    constructor(props) {
        super(props);

        
        this.state = {
            notes: [],
            notesGroup: {},
            name: "",
        };

        this.panel = React.createRef();
        this.documentStateChanged = this.documentStateChanged.bind(this);
        this.addNote = this.addNote.bind(this);
    }


    documentStateChanged(selection) {
        const board = selection.items[0];
        let notesArr = [];
        let notesGrp = {};

        if ( board instanceof Artboard || board instanceof Group) {
            let groupExists = false;
            if (this.state.name != board.name) {
                document.querySelector("panel").classList.remove("singleView");
            } 
            this.setState({name: board.name});
            board.children.forEach(function (childNode) {
                if (childNode instanceof Group && childNode.name=="Annotations") {
                    groupExists = true;
                    notesGrp = childNode;
                    childNode.children.forEach(function(noteNode) {
                        if (noteNode instanceof Text) {
                            notesArr.push(noteNode);
                        }
                    });   
                } else if (childNode instanceof Text && childNode.pluginData) {
                    notesArr.push(childNode);
                } else if (childNode instanceof Text && !childNode.pluginData && (childNode.name == "CSS" || childNode.name == "JavaScript" || childNode.name == "Notes")) {
                    console.log(childNode);
                }
            });
            document.querySelector("panel").classList.remove("hide");
            
        } else {
            document.querySelector("panel").classList.add("hide");
        }

        this.setState({notes: notesArr});
        this.setState({notesGroup: notesGrp});
        //console.log(this.state.notes);
    }

    addNote(selection) {
        const { editDocument } = require("application");
                
        editDocument({editLabel: "Add Note"}, () => {
            let text = new Text();
            text.text = " ";
            text.visible = false;
            text.name = "New Note";
            text.pluginData = {
                "category":"N/A",
                "type":"note",
            };
            
            if (Object.keys(this.state.notesGroup).length === 0 ) {
                this.props.selection.insertionParent.addChild(text);
                text.moveInParentCoordinates(200,100);
            } else {
                this.state.notesGroup.addChild(text);
                text.moveInParentCoordinates(200,100);
            }
            

        });
    }


    render() {
        const {selection} = this.props;
        let board = selection.items[0];
        if (board instanceof Artboard || board instanceof Group) {
            return (
                <panel className={styles.panel}>
                    <h1 className="noSelection">Select an Artboard or Group</h1>
                    <h1 className="itemTitle">{this.state.name}</h1>
                    <NoteList notes={this.state.notes} />
                    <footer>
                        <button className="btnNewNote" onClick={this.addNote} uxp-variant="cta">New Note</button>
                    </footer>
                </panel>
            );
        }
        
        return (
            <panel className={styles.panel}>
                <h1 className="noSelection">Select an Artboard or Group</h1>
            </panel>
        )
        
    }
}

module.exports = App;
