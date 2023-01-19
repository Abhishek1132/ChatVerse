export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser.userid ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser.userid ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 21;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isUpperUserSame = (messages, m, i) => {
  if (i <= 0) {
    return false;
  }

  return messages[i - 1].sender._id === m.sender._id;
};

export const isSameUser = (m, userId) => {
  return userId === m.sender._id;
};

export const getDateDMY = (date) => {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  let ds = "";
  if (d < 10) {
    ds = "0" + d;
  } else {
    ds += d;
  }
  let ms = "";
  if (m < 10) {
    ms = "0" + m;
  } else {
    ms += m;
  }

  return ds + "-" + ms + "-" + y;
};

export const getTimeMS = (date) => {
  const h = date.getHours();
  const m = date.getMinutes();
  let hs = "";
  if (h < 10) {
    hs = "0" + h;
  } else {
    hs += h;
  }
  let ms = "";
  if (m < 10) {
    ms = "0" + m;
  } else {
    ms += m;
  }

  return hs + ":" + ms;
};
