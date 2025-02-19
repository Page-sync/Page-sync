import { useEffect, useState } from "react";
// types
import { NoteInfo } from "../globals";
// helper
import {
  sendDelete,
  sendGet,
  sendPatch,
  sendPost,
} from "@/helpers/requestSender";
// component
import NoteCard from "./NoteCard";
import SingleNote from "./SingleNote";
// UI
import { Button } from "./ui/button";

interface NoteAreaProps {
  // use NoteInfo
  currentPage: number;
  id: string | null;
}
const NoteArea: React.FC<NoteAreaProps> = ({ currentPage, id }) => {
  const [notes, setNotes] = useState<NoteInfo[]>();
  //   view: allNote | singleNote
  const [view, setView] = useState<string>("allNote");
  const [editNote, setEditNote] = useState<NoteInfo | null>(null);
  const [onDeleteId, setOnDeleteId] = useState<number | null>(null);
  const [onSave, setOnSave] = useState<boolean>(false);

  const sampleNotes: NoteInfo[] = [
    {
      id: 1,
      page: 2,

      content: "Notes",
      author: { userId: 1, userName: "user's naem" },
    },
    {
      id: 2,
      page: 2,

      content: "Notes 2",
      author: { userId: 1, userName: "user's naem" },
    },
  ];

  // Rerender to handle changes
  //  get notes when page changes
  useEffect(() => {
    const fetchNotes = async () => {
      // sendGet('/note', {page:currentPage})
      setNotes(sampleNotes);
    };
    fetchNotes();
  }, [currentPage]);

  // rerender when delete notes
  useEffect(() => {
    //
  }, [onDeleteId]);

  useEffect(() => {
    //
  }, [onSave]);

  const handleDeleteNote = async () => {
    if (onDeleteId !== null) {
      try {
        const result = await sendDelete("/note", onDeleteId);
        if (!result?.success) {
          console.error("error during sending request");
        }
        // dynamically display error message or delete successful
      } catch (error) {
        // set error message
        console.error(error);
      } finally {
        setOnDeleteId(null);
      }
    }
  };
  const handleSaveNote = async () => {
    if (editNote && !onSave) {
      setOnSave(true);
      console.log(editNote);
      try {
        let result;
        if (editNote.id) {
          // check and get current use's id
          result = await sendPatch("/note", 1, editNote);
        } else {
          result = await sendPost("/note", 1, editNote);
        }
        if (!result?.success) {
          console.error("error during sending request");
        }
        // dynamically display error message or delete successful
      } catch (error) {
        console.error(error);
        // set error message
      } finally {
        setOnSave(false);
        setEditNote(null);
      }
    }
  };

  return (
    <>
      <div>
        All Notes
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Properties</h2>
          <div className="space-y-2">
            {view === "allNote" && (
              <div>
                <Button
                  className=""
                  onClick={() => {
                    setView("singleNote");
                  }}
                >
                  Add Note
                </Button>
                <div className="all-note-container">
                  {notes &&
                    notes.map((note, idx) => {
                      return (
                        <NoteCard
                          key={idx}
                          noteInfo={note}
                          setView={setView}
                          setEditNote={setEditNote}
                          setOnDeleteId={setOnDeleteId}
                          handleDeleteNote={handleDeleteNote}
                        ></NoteCard>
                      );
                    })}
                </div>
              </div>
            )}

            {view === "singleNote" && (
              <SingleNote
                setView={setView}
                editNote={editNote}
                setEditNote={setEditNote}
                onSave={onSave}
                setOnSave={setOnSave}
                handleSaveNote={handleSaveNote}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default NoteArea;
