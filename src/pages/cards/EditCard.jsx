import { useParams, useNavigate } from "react-router-dom";
import { useCards } from "../../hooks/useCards";
import { useUpdateCard } from "../../hooks/useAdmin";
import CreateCard from "./CreateCard"; // Vamos ajustar o CreateCard para aceitar props
import LoadingState from "../../components/common/LoadingState";

export default function EditCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: cards, isLoading } = useCards();
  const { mutate: updateCard, isPending } = useUpdateCard();

  const cardToEdit = cards?.find((c) => c.id === id);

  if (isLoading) return <LoadingState />;
  if (!cardToEdit) return <div className="text-white p-10">Card not found.</div>;

  const handleUpdate = (cardData) => {
    updateCard({ id, cardData }, {
      onSuccess: () => navigate("/admin/cards")
    });
  };

  return (
    <CreateCard 
      initialData={cardToEdit} 
      onSubmit={handleUpdate} 
      isEditing={true}
      externalLoading={isPending}
    />
  );
}