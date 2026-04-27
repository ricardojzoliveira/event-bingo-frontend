import BingoSquare from "./BingoSquare";
import { useAdminEvents } from "../../hooks/useAdmin"

export default function BingoCard({ data, isLogged }) {
  const { data: globalEvents } = useAdminEvents();

  const events = data?.events || [];

  const syncedEvents = events.map(cardEvent => {
    const live = globalEvents?.find(g => g.id === cardEvent.id);
    return live ? { ...cardEvent, status: live.status } : cardEvent;
  });

  const gridSize = data?.size ? parseInt(data.size.split("x")[0]) : 3;

  return (
    <div className="border-2 border-bingo-red rounded-2xl p-4 sm:p-8 bg-[#02182B] shadow-[0_0_20px_rgba(220,38,38,0.1)] text-white w-full max-w-full overflow-hidden">
      <h3 className="font-bold text-xl mb-6">Bingo Card</h3>

      {events.length > 0 ? (
        <div
          className="grid gap-3 sm:gap-6 mx-auto"
          style={{
            gridTemplateColumns:
              window.innerWidth < 640
                ? `repeat(auto-fit, minmax(140px, 1fr))`
                : `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {syncedEvents.map((event, index) => (
            <BingoSquare key={index} event={event} isLogged={isLogged} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-slate-500 italic">
          Nenhum evento disponível para este cartão.
        </div>
      )}
    </div>
  );
}
