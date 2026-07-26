import BingoSquare from "./BingoSquare";

export default function BingoCard({ data, isLogged }) {
  const signature = data?.eventsSignature || "";
  
  const orderedIds = signature.trim() 
    ? signature.trim().split('-').map(id => Number(id)) 
    : [];

  const rawEvents = data?.events || [];
  const sortedEvents = [...rawEvents].sort((a, b) => {
    const indexA = orderedIds.indexOf(Number(a.id));
    const indexB = orderedIds.indexOf(Number(b.id));

    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  const gridSize = data?.cols || 3;

  // Força o número fixo de colunas
  const gridColsClasses = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  // Ajusta o espaçamento (gap) consoante o tamanho do cartão
  const gridGapClasses = {
    3: "gap-1.5 sm:gap-6",
    4: "gap-1 sm:gap-4",
    5: "gap-0.5 sm:gap-3", // Gap mínimo para 5x5 caber no telemóvel
  };

  const gridClass = gridColsClasses[gridSize] || "grid-cols-3";
  const gapClass = gridGapClasses[gridSize] || "gap-1.5 sm:gap-6";

  return (
    <div className="border border-bingo-red rounded-2xl p-2 sm:p-8 bg-bingo-dark shadow-[0_0_20px_rgba(220,38,38,0.1)] text-white w-full max-w-full overflow-hidden">
      <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 uppercase tracking-tight italic">
        Bingo Card
      </h3>

      {sortedEvents.length > 0 ? (
        <div className={`grid ${gridClass} ${gapClass} mx-auto w-full`}>
          {sortedEvents.map((event) => (
            <BingoSquare 
              key={event.id} 
              event={event} 
              isLogged={isLogged} 
              gridSize={gridSize} // Passa o gridSize para o filho ajustar a fonte!
            />
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