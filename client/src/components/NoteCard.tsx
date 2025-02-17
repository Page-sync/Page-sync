import { useState } from "react";
import { NoteInfo } from "../globals";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
      <Card>
        <CardTitle>Note</CardTitle>
        <CardContent>{noteInfo.content}</CardContent>
        {editable && (
          <Button
            onClick={() => {
              setEditNote(noteInfo);
              setView("singleNote");
            }}
          >
            Edit
          </Button>
        )}
      </Card>
    </>
  );
};
export default NoteCard;
