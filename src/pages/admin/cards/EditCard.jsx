import { useParams, useNavigate } from "react-router-dom";
import { useCard } from "../../../hooks/use-cards";
import { useUpdateCard } from "../../../hooks/use-admin";
import CreateCard from "./CreateCard";
import LoadingState from "../../../components/LoadingState";

export default function EditCard() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: card, isLoading } = useCard(id);
  const { mutate: updateCard, isPending } = useUpdateCard();


  if (isLoading) return <LoadingState />;
  if (!card) return <div className="text-white p-10">Card not found.</div>;

  const handleUpdate = (cardData) => {
    updateCard({ id, cardData }, {
      onSuccess: () => navigate("/admin/cards")
    });
  };

  return (
    <CreateCard 
      initialData={card} 
      onSubmit={handleUpdate} 
      isEditing={true}
      externalLoading={isPending}
    />
  );
}