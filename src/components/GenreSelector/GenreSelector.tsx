interface GenreSelectorProps {
  onShowCarousel: () => void;
}

function GenreSelector({ onShowCarousel }: GenreSelectorProps) {
  const buttonLabels = Array.from(
    { length: 5 },
    (_, index) => `Button ${index + 1}`
  );

  return (
    <table className="border border-collapse border-gray-300 table-auto">
      <thead>
        <tr>
          <th className="p-2 border border-gray-300">Fast</th>
          <th className="p-2 border border-gray-300">Feels</th>
          <th className="p-2 border border-gray-300">Heavy</th>
          <th className="p-2 border border-gray-300">House</th>
          <th className="p-2 border border-gray-300">Focus</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {buttonLabels.map((label, colIndex) => (
              <td key={colIndex} className="p-2 border border-gray-300">
                <button
                  onClick={onShowCarousel}
                  className="p-1 text-white bg-blue-500 rounded"
                >
                  {label}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GenreSelector;
