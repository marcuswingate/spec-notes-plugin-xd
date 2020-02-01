const React = require('react');

class Note extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            noteText: this.props.note.text,
            noteName: this.props.note.name,
            metaData: this.props.note.pluginData,
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.toggleNote = this.toggleNote.bind(this);
        this.deleteNote = this.deleteNote.bind(this);
        this.copyNote = this.copyNote.bind(this);
    }


    handleTextChange(event) {
        const selection = this.props.selection;
        const id = this.props.note.guid;
        
        this.setState({noteText: event.target.value}, () => {
            let text = this.state.noteText;
            const { editDocument } = require("application");
            editDocument({editLabel:"Update Note Text"}, function(selection) {
                let board = selection.items[0];
                //console.log(board);
                board.children.forEach(function (childNode, i) {
                    if (childNode.guid.toString() == id) {
                            childNode.text = text || " ";
                    }
                });
            });
        });
        
    }

    handleTitleChange(event) {
        const selection = this.props.selection;
        const id = this.props.note.guid;

        this.setState({noteName: event.target.value}, () => {
            let title = this.state.noteName;
            const { editDocument } = require("application");
            editDocument({editLabel:"Update Note Title"}, function(selection) {
                let board = selection.items[0];
                //console.log(board);
                board.children.forEach(function (childNode, i) {
                    if (childNode.guid.toString() == id) {
                            childNode.name = title || "Untitled"; 
                    }
                });
            });
        });
    }

    toggleNote() {
        const selection = this.props.selection;
        let title = this.state.noteName;

        let id = this.props.note.guid;
        let note = document.querySelector("#" + id.toString());
        let panel = document.querySelector("panel");

        const { editDocument } = require("application");

        editDocument({editLabel:"Reset Note Title"}, function(selection) {
            let board = selection.items[0];
            //console.log(board);
            if (board !== undefined ) {
                let boardNote = board.children.filter((childNode) => {
                    return childNode.guid == id;
                })[0];
                boardNote.name = title + " ";
                boardNote.name = title.trim();
                panel.classList.toggle("singleView");
                note.classList.toggle("open");
                note.classList.toggle("closed");
            }
            
        });


        

        
    }

    deleteNote() {
        let id = this.props.note.guid;
        let note = document.querySelector("#" + id.toString());
        let panel = document.querySelector("panel");
        let boardNote = this.props.note;
        panel.classList.toggle("singleView");
        note.classList.toggle("open");
        note.classList.toggle("closed");
        const { editDocument } = require("application");
                
        editDocument({editLabel: "Remove Note"}, () => {
            boardNote.removeFromParent();
        });
    }

    copyNote() {
        console.log("run copy");
        let clipboard = require("clipboard");
        let btn = document.querySelector("#" + this.props.note.guid + " .listNoteCopy");
        clipboard.copyText(this.state.noteText);

        btn.classList.add("clicked");
        setTimeout(function(){ 
            btn.classList.remove("clicked"); 
        }, 500);
    }
    
    render() {
        
        return (
            <div className="closed" id={this.props.note.guid}>
                <div className="listNoteMeta">
                    <div className="listNoteTitle" onClick={this.toggleNote}><h1>{this.state.noteName}</h1></div>
                    <div className="listNoteCopy" onClick={this.copyNote}>Copy</div>
                </div>
                <div className="back" onClick={this.toggleNote}>Back to Notes</div>
                <form>
                    <input type="text" uxp-quiet="true" className="noteTitle" defaultValue={this.state.noteName} onChange={this.handleTitleChange}></input>
                    <textarea uxp-quiet="false" className="noteText" onChange={this.handleTextChange} value={this.state.noteText}></textarea>
                    <button onClick={this.deleteNote}>Delete</button>
                </form>
            </div>
        )
    }
}

module.exports = Note;