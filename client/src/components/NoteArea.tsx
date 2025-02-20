import { useEffect, useState } from "react";
import { NoteInfo } from "../globals";
import {
  sendDelete,
  sendGet,
  sendPatch,
  sendPost,
} from "@/helpers/requestSender";
// component
import NoteCard from "./NoteCard";
import SingleNote from "./SingleNote";
import { Button } from "./ui/button";

interface NoteAreaProps {
  // use NoteInfo
  currentPage: number;
  id: string | null;
}
const BASE_URL = import.meta.env.VITE_BASE_URL;

const NoteArea: React.FC<NoteAreaProps> = ({ currentPage, id }) => {
  const [notes, setNotes] = useState<NoteInfo[]>();
  //   view: allNote | singleNote
  const [view, setView] = useState<string>("allNote");
  const [editNote, setEditNote] = useState<NoteInfo | null>(null);
  const [onDeleteNote, setOnDeleteNote] = useState<NoteInfo | null>(null);
  const [onSave, setOnSave] = useState<boolean>(false);

  const sampleNotes: NoteInfo[] = [
    {
      id: 1,
      page: 2,
      isbn: "0573663203",
      content: "Notes",
      userid: "",
      title: "",
    },
    {
      id: 2,
      page: 2,
      isbn: "0573663203",
      userid: "",
      content: "Notes 2",
      title: "",
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
  }, [onDeleteNote]);

  useEffect(() => {
    //
  }, [onSave]);

  const handleDeleteNote = async (note: NoteInfo) => {
    if (note !== null) {
      try {
        const result = await sendDelete(`${BASE_URL}/note`, note);
        if (!result?.success) {
          console.error("error during sending request");
        }
        // dynamically display error message or delete successful
      } catch (error) {
        // set error message
        console.error(error);
      } finally {
        setOnDeleteNote(null);
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
          result = await sendPatch(`${BASE_URL}/note`, editNote);
        } else {
          result = await sendPost(`${BASE_URL}/note`, editNote);
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
                          setOnDeleteNote={setOnDeleteNote}
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
