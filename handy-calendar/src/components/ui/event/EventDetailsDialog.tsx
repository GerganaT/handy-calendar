import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  formattedLongDate,
  twelveHoursFormattedTime,
} from "@/pages/calendar/utils/calendarUtils";
import { useDeleteEvent } from "@/services/calendar/event/eventService";
import EventUiState from "@/types/calendar/event/EventUiState";
import { Edit3, Trash2 } from "lucide-react";
import { Button } from "../button";
import ManageEventDialog from "./ManageEventDialog";

interface EventDetailsDialogProps {
  selectedEvent: EventUiState;
  onDialogDismiss: () => void;
  onEventDeleted: () => void;
}

const EventDetailsDialog = ({
  selectedEvent,
  onDialogDismiss,
  onEventDeleted,
}: EventDetailsDialogProps) => {
  const { mutate: deleteEvent, error } = useDeleteEvent();

  return (
    <>
      <Dialog open={true} onOpenChange={() => onDialogDismiss()}>
        <DialogContent className="flex flex-col items-center bg-blue-100 justify-center gap-4 p-6">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                deleteEvent(selectedEvent.id);
                toast({
                  description: ` ${
                    error?.message ?? `Event "${selectedEvent.title}" deleted!`
                  }`,
                });
                onEventDeleted();
              }}
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
            <ManageEventDialog
              event={selectedEvent}
              onDialogDismiss={onDialogDismiss}
            >
              <Button variant="ghost" size="icon">
                <Edit3 className="w-5 h-5 text-blue-500" />
              </Button>
            </ManageEventDialog>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 p-6">
            <DialogTitle className="text-2xl font-bold">
              {selectedEvent.title}
            </DialogTitle>
            <p className="text-xl font-semibold">{selectedEvent.description}</p>
            <p className="text-center">{`${formattedLongDate(
              selectedEvent.startEvent
            )} - ${
              selectedEvent.startEvent.getDay() !==
              selectedEvent.endEvent.getDay()
                ? formattedLongDate(selectedEvent.endEvent)
                : twelveHoursFormattedTime(selectedEvent.endEvent)
            }`}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventDetailsDialog;
