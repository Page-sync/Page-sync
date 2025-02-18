import { useState, useEffect } from "react";
import { NoteInfo } from "../globals";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
interface SingleNoteProps {
  // use NoteInfo
  setView: Function;
  editNote: NoteInfo | null;
  setEditNote: Function;
  onSave: boolean;
  // change save btn
  setOnSave: Function;
  handleSaveNote: Function;
}
const SingleNote: React.FC<SingleNoteProps> = ({
  setView,
  editNote,
  setEditNote,
  setOnSave,
  handleSaveNote,
}) => {
  const [currentText, setCurrentText] = useState<string>();
  const [onSave, setAutoSave] = useState(false);

  useEffect(() => {}, [editNote]);
  // will include more features like comment or discussion
  return (
    <>
      <div>
        <Textarea
          className="note-content"
          id="input-note-content"
          value={editNote?.content}
          onChange={(e) => {
            setEditNote((prev: NoteInfo) => {
              return { ...prev, content: e.target.value };
            });
          }}
        />
        <Button
          onClick={() => {
            handleSaveNote();
            setView("allNote");
          }}
          disabled={onSave}
          className={`px-4 py-2 rounded ${
            onSave
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-zinc-800 hover:bg-zinc-400"
          } text-white`}
        >
          {onSave ? "Saving..." : "Done"}
        </Button>
      </div>
    </>
  );
};
export default SingleNote;
