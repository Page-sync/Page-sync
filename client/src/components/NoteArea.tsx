import { useEffect, useState } from "react";
import { NoteInfo } from "../globals";
import NoteCard from "./NoteCard";
import SingleNote from "./SingleNote";
import { Button } from "./ui/button";

interface NoteAreaProps {
  // use NoteInfo
  currentPage: number;
  bookId: number;
}
const NoteArea: React.FC<NoteAreaProps> = ({ currentPage, bookId }) => {
  const [notes, setNotes] = useState<NoteInfo[]>();
  //   view: allNote | singleNote
  const [view, setView] = useState<string>("allNote");
  const [editNote, setEditNote] = useState<NoteInfo | null>(null);
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

  useEffect(() => {
    const fetchNotes = async () => {
      setNotes(sampleNotes);
    };
    fetchNotes();
  }, [currentPage]);
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
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default NoteArea;
