export const generateInvitationCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
};

export const alphabet = "#abcdefghijklmnopqrstuvwxyz";

export const randomAvatar = () => {
  const num = Math.floor(Math.random() * 60);
  const avatarSize = 36;
  return `https://i.pravatar.cc/${avatarSize}?img=${num}`;
};

export const formatCallDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
