interface Props {
  onClick: () => void;
}

export default function StartButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-white font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
    >
      スタート！
    </button>
  );
}