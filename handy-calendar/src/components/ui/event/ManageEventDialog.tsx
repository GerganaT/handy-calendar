import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSaveEvent } from "@/services/calendar/event/eventService";

import EventUiState, { EventType } from "@/types/calendar/event/EventUiState";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ManageEventDialogProps {
  children: ReactNode;
  event?: EventUiState;
  onDialogDismiss?: () => void;
}

const ManageEventDialog = ({
  children,
  event,
  onDialogDismiss = () => {},
}: ManageEventDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: saveEvent, error } = useSaveEvent();
  const { toast } = useToast();

  const eventSchema = z
    .object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      startEvent: z.string().min(1, "Start time is required"),
      endEvent: z.string().min(1, "End time is required"),
      type: z.nativeEnum(EventType, {
        errorMap: () => ({ message: "Please select an event type" }),
      }),
    })
    .refine((data) => new Date(data.endEvent) > new Date(data.startEvent), {
      message: "End date must be later than start date",
      path: ["endEvent"],
    });

  const formatEventDateForDatePicker = (eventDate: Date) =>
    format(eventDate, "yyyy-MM-dd'T'HH:mm");

  type EventFormValues = z.infer<typeof eventSchema>;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      startEvent: event ? formatEventDateForDatePicker(event.startEvent) : "",
      endEvent: event ? formatEventDateForDatePicker(event.endEvent) : "",
      type: event?.type,
    },
  });

  function onSubmit(values: EventFormValues) {
    saveEvent({
      id: event?.id || createEventId(),
      title: values.title,
      description: values.description,
      startEvent: new Date(values.startEvent),
      endEvent: new Date(values.endEvent),
      type: values.type,
    });

    toast({
      description: ` ${error?.message ?? `Event "${values.title}" saved!`}`,
    });

    form.reset();
    onDialogDismiss();
    setOpen(false);
  }

  function createEventId() {
    return new Date().getTime();
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            form.reset();
            onDialogDismiss();
          }
          setOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="bg-blue-100 p-6"
          aria-describedby="dialog-description"
        >
          <DialogHeader>
            <DialogTitle>
              {event ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>
          <p id="dialog-description" className="sr-only">
            Fill out the details below to create a new event.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Event Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <FormControl>
                      <Input id="title" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">
                      Description (optional)
                    </FormLabel>
                    <FormControl>
                      <Input id="description" {...field} className="bg-white" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Start Event Date/Time */}
              <FormField
                control={form.control}
                name="startEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="startEvent">
                      Start Date & Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="startEvent"
                        type="datetime-local"
                        {...field}
                        className="bg-white"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Event Date/Time */}
              <FormField
                control={form.control}
                name="endEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="endEvent">End Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        id="endEvent"
                        type="datetime-local"
                        {...field}
                        className="bg-white"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="eventType">Event Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="eventType" className="bg-white">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EventType.Birthday}>
                          Birthday
                        </SelectItem>
                        <SelectItem value={EventType.Meeting}>
                          Meeting
                        </SelectItem>
                        <SelectItem value={EventType.Task}>Task</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={!form.formState.isValid}>
                Save
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageEventDialog;
