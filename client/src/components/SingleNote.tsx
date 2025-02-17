import { useState, useEffect } from "react";
import { NoteInfo } from "../globals";
interface SingleNoteProps {
  // use NoteInfo
  setView: Function;
  editNote: NoteInfo | null;
  setEditNote: Function;
}
const SingleNote: React.FC<SingleNoteProps> = ({
  setView,
  editNote,
  setEditNote,
}) => {
  const [currentText, setCurrentText] = useState<string>();
  const [onSave, setAutoSave] = useState(false);

  useEffect(() => {
    console.log(editNote);
  }, [editNote]);
  return (
    <>
      <div>
        <textarea
          className="note-content"
          id="input-note-content"
          value={editNote?.content}
          onChange={(e) => {
            setEditNote((prev: NoteInfo) => {
              return { ...prev, content: e.target.value };
            });
          }}
        />
        <button
          onClick={() => {
            setView("allNote");
          }}
        >
          Close
        </button>
      </div>
    </>
  );
};
export default SingleNote;
