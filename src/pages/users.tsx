import { useEffect, useState } from 'react';
import { getUsers } from '../lib/getUsers';
import { handleLike } from '../lib/handleLike';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const currentUserId = "currentUser123"; // 現在のユーザーID（仮置き）

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>お相手一覧</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>年齢: {user.age}</p>
            <p>場所: {user.location}</p>
            <button
              onClick={() => handleLike(currentUserId, user.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              いいね
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;