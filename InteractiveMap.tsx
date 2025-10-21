// --- Interactive Map Page (New Main Hub) ---
interface InteractiveMapProps {
  setActivePage: (page: string) => void;
}

const MapNodeImage: React.FC<{
  label: string;
  onClick: () => void;
  position: React.CSSProperties;
  imgSrc: string;
  glowColor: string;
  imgClass: string;
}> = ({ label, onClick, position, imgSrc, glowColor, imgClass }) => {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer"
      style={position}
      onClick={onClick}
      aria-label={`Go to ${label}`}
    >
      <img
        src={imgSrc}
        alt={label}
        className={`transition-transform duration-300 ease-in-out group-hover:scale-110 ${imgClass}`}
        style={{ filter: `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 5px ${glowColor})` }}
      />
      <span
        className="absolute top-0 -translate-y-full left-1/2 -translate-x-1/2 text-white font-extrabold text-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
      >
        {label}
      </span>
    </div>
  );
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ setActivePage }) => {
  const nodes = [
    { id: 'quest', label: 'Quests', page: 'quest', position: { top: '15%', left: '25%' }, glow: '#3b82f6', imgSrc: 'https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Mutant%20Quest.png?updatedAt=1755764238713', imgClass: 'w-32' },
    { id: 'map', label: 'Go Journey', page: 'home', position: { top: '15%', left: '75%' }, glow: '#a855f7', imgSrc: 'https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Go%20Journey%20Arrow(1).png?updatedAt=1755786344727', imgClass: 'w-24' },
    { id: 'game', label: 'Game', page: 'play', position: { top: '31%', left: '60%' }, glow: '#d946ef', imgSrc: 'https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Mutant%20Games.png?updatedAt=1755762271317', imgClass: 'w-40' },
    { id: 'shop', label: 'Shop', page: 'shop', position: { top: '53%', left: '40%' }, glow: '#22c55e', imgSrc: 'https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Mutant%20Shop.png?updatedAt=1755762275127', imgClass: 'w-40' },
    { id: 'avatar', label: 'Avatar', page: 'avatar', position: { top: '70%', left: '65%' }, glow: '#eab308', imgSrc: 'https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Customize%20Avatar.png?updatedAt=1755762273067', imgClass: 'w-44' },
    { id: 'treasure', label: 'Treasure', page: 'treasure', position: { top: '88%', left: '35%' }, glow: '#ef4444', imgSrc: 'https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Mutant%20Treasure.png?updatedAt=1755762274446', imgClass: 'w-36' }
  ];

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <img src="https://ik.imagekit.io/erriqyxye/Mutant%20Axis/Mutant%20City%20Map%202.png?updatedAt=1755786558629" alt="Mutant City Map" className="w-full h-full object-cover" />
      <div className="absolute inset-0">
        {nodes.map(node => (
          <MapNodeImage
            key={node.id}
            label={node.label}
            onClick={() => setActivePage(node.page)}
            position={node.position}
            glowColor={node.glow}
            imgSrc={node.imgSrc}
            imgClass={node.imgClass}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveMap;