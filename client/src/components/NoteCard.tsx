import { NoteInfo } from "../globals";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
interface NoteCardProps {
  // use NoteInfo
  noteInfo: NoteInfo;
  setView: Function;
  setEditNote: Function;
  setOnDeleteNote: Function;
  handleDeleteNote: Function;
}
const NoteCard: React.FC<NoteCardProps> = ({
  noteInfo,
  setView,
  setEditNote,
  handleDeleteNote,
}) => {
  // if note info 's user id is current uer's id, it can be edit
  const editable = true;

  return (
    <>
      <Card>
        <CardTitle>Note</CardTitle>
        <CardContent>{noteInfo.content}</CardContent>
        {editable && (
          <CardFooter>
            <Button
              onClick={() => {
                setEditNote(noteInfo);
                setView("singleNote");
              }}
            >
              Edit
            </Button>{" "}
            <Button
              onClick={() => {
                handleDeleteNote(noteInfo);
              }}
            >
              Delete
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
  );
};
export default NoteCard;
