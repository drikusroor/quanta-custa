interface TileProps {
  children: React.ReactNode;
}

const Tile = ({ children }: TileProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      {children}
    </div>
  );
};

export default Tile;
