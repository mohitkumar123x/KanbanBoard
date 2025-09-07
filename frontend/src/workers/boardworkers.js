self.onmessage = function (e) {
    const { tasks } = e.data;
    const sortedBoards = [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    self.postMessage(sortedBoards);
  };