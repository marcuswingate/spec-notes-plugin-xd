const React = require('react');

const Note = require('../components/Note');

class NoteList extends React.Component {
    constructor(props) {
      super(props);
      
    }

    handleClick(e) {
      render();
    }

    render() {
        let listItems = this.props.notes.map((note) => {
          return (
            <li key={note.guid} className="noteItem">
              <Note note={note} />
            </li>
          )
        });

        return (
          <div className="notes">
              <ul>{listItems}</ul>
          </div>  
        )
    }
}

module.exports = NoteList;