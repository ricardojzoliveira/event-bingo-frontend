import BingoSquare from "./BingoSquare";

export default function BingoCard({ data, isLogged }) {
  const events = data?.events || [];

  const gridSize = data?.cols || 3;

  const gridColsClasses = {
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
  };

  const smGridClass = gridColsClasses[gridSize] || "sm:grid-cols-3";

  return (
    <div className="border-2 border-bingo-red rounded-2xl p-4 sm:p-8 bg-[#02182B] shadow-[0_0_20px_rgba(220,38,38,0.1)] text-white w-full max-w-full overflow-hidden">
      <h3 className="font-bold text-xl mb-6 uppercase tracking-tight italic">Bingo Card</h3>

      {events.length > 0 ? (
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] ${smGridClass} gap-3 sm:gap-6 mx-auto`}
        >
          {events.map((event, index) => (
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