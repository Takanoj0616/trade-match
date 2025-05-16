import { useEffect, useState } from 'react';
import { getCards } from '@/lib/getCards'; // 作成した関数をインポート
import { CardData } from '@/types/card';   // カードの型をインポート
import Link from 'next/link'; // 必要に応じて詳細ページへのリンク用

// 個々のカードを表示するコンポーネント (後で作成)
const CardItem = ({ card }: { card: CardData }) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden bg-gray-800 text-white">
      <img src={card.imageUrl} alt={card.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{card.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className={`px-2 py-1 text-sm font-semibold rounded ${
            card.rarity === 'legendary' ? 'bg-yellow-500' :
            card.rarity === 'epic' ? 'bg-purple-500' :
            card.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
          }`}>
            {card.cost} MP
          </span>
          {card.type === 'unit' && (
            <div className="flex space-x-2">
              <span className="text-red-400">ATK: {card.attack}</span>
              <span className="text-green-400">HP: {card.health}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400 truncate">{card.description}</p>
        {/* 詳細ページへのリンクなど */}
        {/* <Link href={`/cards/${card.id}`}>
          <a className="text-indigo-400 hover:text-indigo-300">詳細を見る</a>
        </Link> */}
      </div>
    </div>
  );
};

const CardsPage = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      const data = await getCards();
      setCards(data);
      setLoading(false);
    };
    fetchCards();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">カード情報を読み込み中...</p>;
  }

  if (cards.length === 0) {
    return <p className="text-center mt-8">表示できるカードがありません。</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">カード一覧</h1>
      {/* ここにフィルターやソート機能を追加できます */}
      {/* 例:
      <div className="mb-4 flex justify-center space-x-2">
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">全て</button>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">所持</button>
        // ...他のフィルターボタン
      </div>
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default CardsPage;