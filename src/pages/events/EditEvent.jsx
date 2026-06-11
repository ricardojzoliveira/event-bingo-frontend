import { useParams, useNavigate } from "react-router-dom";
import { useAdminEvent, useUpdateEvent } from "../../hooks/use-admin";
import CreateEvent from "./CreateEvent"; 
import LoadingState from "../../components/common/LoadingState";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Hooks de dados
  const { data: event, isLoading } = useAdminEvent(id);
  const { mutate: updateEvent, isPending } = useUpdateEvent();

  if (isLoading) return <LoadingState />;
  if (!event) return <div className="text-white p-10">Event not found.</div>;

  const handleUpdate = (eventData) => {
    updateEvent({ id, eventData }, {
      onSuccess: () => navigate("/admin/events")
    });
  };

  return (
    <CreateEvent 
      initialData={event} 
      onSubmit={handleUpdate} 
      isEditing={true} 
      externalLoading={isPending}
    />
  );
}