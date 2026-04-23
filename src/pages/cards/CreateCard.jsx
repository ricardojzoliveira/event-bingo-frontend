import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminEvents, useCreateCard } from "../../hooks/useAdmin";
import { ChevronLeft, Plus, Trash2, LayoutGrid, Search, Save, AlertCircle } from "lucide-react";
import LoadingState from "../../components/common/LoadingState";

export default function CreateCard() {
  const navigate = useNavigate();
  const { data: availableEvents, isLoading: loadingEvents } = useAdminEvents();
  const { mutate: createCard, isPending } = useCreateCard();

  const [gridSize, setGridSize] = useState(3);
  const [title, setTitle] = useState("");
  const [prizePerLine, setPrizePerLine] = useState("");
  const [fullPrize, setFullPrize] = useState("");
  const [gridEvents, setGridEvents] = useState(Array(9).fill(null));
  const [searchTerm, setSearchTerm] = useState("");

  const handleSizeChange = (size) => {
    setGridSize(size);
    setGridEvents(Array(size * size).fill(null));
  };

  const addEventToSlot = (event, index) => {
    const newGrid = [...gridEvents];
    newGrid[index] = event;
    setGridEvents(newGrid);
  };

  const handleSave = () => {
    const isGridFull = gridEvents.every(slot => slot !== null);
    if (!title || !prizePerLine || !fullPrize || !isGridFull) {
      alert("Please fill all fields and complete the grid!");
      return;
    }

    const cardData = {
      title,
      size: `${gridSize}x${gridSize}`,
      prizePerLine: `€${prizePerLine}`,
      fullPrize: `€${fullPrize}`,
      events: gridEvents
    };

    createCard(cardData, {
      onSuccess: () => navigate("/admin/cards")
    });
  };

  if (loadingEvents) return <LoadingState />;

  const filteredEvents = availableEvents?.filter(e => 
    e.team1.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.team2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bingo-dark p-6 text-white">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-slate-900/40 border border-bingo-red p-6 rounded-3xl">
          <div className="flex items-center gap-4">
            <Link to="/admin/cards" className="p-2 hover:bg-slate-800 rounded-xl text-bingo-red"><ChevronLeft /></Link>
            <h1 className="text-2xl font-black uppercase">Create New Bingo Card</h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="bg-bingo-red hover:bg-red-600 px-10 py-3 rounded-xl font-black uppercase flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save size={20} /> {isPending ? "Saving..." : "Publish Card"}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3 space-y-4">
            <div className="bg-slate-900/40 border border-bingo-red p-6 rounded-3xl space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Card Title</label>
                <input 
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 mt-2 outline-none focus:border-bingo-red" 
                  placeholder="Ex: Weekend Specials" 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Grid Size</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[3, 4, 5].map(s => (
                    <button 
                      key={s} onClick={() => handleSizeChange(s)}
                      className={`p-3 rounded-xl border-2 font-black transition-all ${gridSize === s ? 'border-bingo-red bg-bingo-red/10 text-white' : 'border-slate-800 text-slate-600 hover:border-slate-700'}`}
                    >
                      {s}x{s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Line Prize (€)</label>
                  <input type="number" value={prizePerLine} onChange={e => setPrizePerLine(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 mt-2 outline-none focus:border-green-500" placeholder="50" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Bingo Prize (€)</label>
                  <input type="number" value={fullPrize} onChange={e => setFullPrize(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 mt-2 outline-none focus:border-yellow-500" placeholder="500" />
                </div>
              </div>
            </div>

            <div className="p-4 border border-bingo-red rounded-2xl flex gap-3 text-white">
              <AlertCircle className="text-bingo-red" size={40} />
              <p className="text-[10px] font-semibold uppercase">Drag and Drop the events from the library to the Bingo Card.</p>
            </div>
          </div>

          <div className="col-span-5 flex justify-center items-start">
             <div 
                className="grid gap-3 p-6 bg-slate-900/20 border border-bingo-red rounded-[40px] w-full max-w-[550px]"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
             >
                {gridEvents.map((slot, idx) => (
                  <div 
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => addEventToSlot(JSON.parse(e.dataTransfer.getData("event")), idx)}
                    className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all relative group
                      ${slot ? 'border-bingo-red bg-slate-900' : 'border-slate-800 bg-slate-950/50 hover:border-slate-600'}`}
                  >
                    {slot ? (
                      <>
                        <span className="text-[8px] font-black text-bingo-red uppercase">{slot.sport}</span>
                        <p className="text-[10px] font-bold leading-tight mt-1">{slot.team1} <br/>vs<br/> {slot.team2}</p>
                        <button 
                          onClick={() => addEventToSlot(null, idx)}
                          className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    ) : (
                      <Plus size={24} className="text-slate-800" />
                    )}
                  </div>
                ))}
             </div>
          </div>

          <div className="col-span-4 bg-slate-900/40 border border-bingo-red rounded-3xl p-6 h-[75vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase">Event Library</h2>
              <span className="bg-slate-800 text-[10px] px-2 py-1 rounded font-bold text-slate-500">{filteredEvents?.length} Available</span>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 text-sm outline-none focus:border-bingo-red" 
                placeholder="Search teams or sports..." 
              />
            </div>

            <div className="overflow-y-auto flex-grow space-y-3 pr-2 custom-scrollbar">
              {filteredEvents?.map(event => (
                <div 
                  key={event.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("event", JSON.stringify(event))}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-2xl cursor-grab active:cursor-grabbing hover:border-bingo-red transition-all group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black text-bingo-red uppercase">{event.sport}</span>
                    <LayoutGrid size={14} className="text-slate-700 group-hover:text-bingo-red transition-colors" />
                  </div>
                  <p className="font-bold text-sm">{event.team1} vs {event.team2}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{event.prediction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}