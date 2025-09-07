import React from 'react';

const Header = ({ board }) => {
  return (
    <header className="mb-6">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-500 to-purple-500">
        {board.title}
      </h1>
      <p className="text-gray-400">{board.description}</p>
      <div className="flex gap-2 mt-2">
        {board.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-purple-700 bg-opacity-70 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
    </header>
  );
};

export default Header;