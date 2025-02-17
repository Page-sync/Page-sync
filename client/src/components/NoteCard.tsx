import { useState } from "react";
import { NoteInfo } from "../globals";
interface NoteCardProps {
  // use NoteInfo
  noteInfo: NoteInfo;
  setView: Function;
  setEditNote: Function;
}
const NoteCard: React.FC<NoteCardProps> = ({
  noteInfo,
  setView,
  setEditNote,
}) => {
  // if note info 's user id is current uer's id, it can be edit
  const editable = true;
  return (
    <>
      <title className="note-title">Default note title</title>
      <div>{noteInfo.content}</div>
      {editable && (
        <button
          onClick={() => {
            setEditNote(noteInfo);
            setView("singleNote");
          }}
        >
          Edit
        </button>
      )}
    </>
  );
};
export default NoteCard;
