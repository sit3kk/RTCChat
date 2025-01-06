import { ContactSectionsType, Invitation } from "../types/commonTypes";
import { alphabet, randomAvatar } from "../utils/utils";

export const mockContacts: ContactSectionsType[] = [
  ...Array(alphabet.length - 15).keys(),
].map((sectionIndex) => {
  const letter = alphabet.charAt(sectionIndex + 5).toUpperCase();
  return {
    title: letter,
    index: sectionIndex,
    key: `list-${letter}`,
    data: [...Array(Math.floor(Math.random() * 7) + 5).keys()].map((i) => ({
      id: `${letter}-Contact-${i + 1}`,
      name: `${letter}-Contact ${i + 1}`,
      avatar: randomAvatar(),
    })),
  };
});

export const mockInvitations: Invitation[] = [
  {
    id: "1",
    fromUserId: "user1",
    fromUserName: "Alice",
    toUserId: "user2",
    toUserName: "Bob",
    status: "Pending",
  },
  {
    id: "2",
    fromUserId: "user3",
    fromUserName: "Charlie",
    toUserId: "user4",
    toUserName: "David",
    status: "Accepted",
  },
  {
    id: "3",
    fromUserId: "user5",
    fromUserName: "Eve",
    toUserId: "user6",
    toUserName: "Frank",
    status: "Declined",
  },
  {
    id: "4",
    fromUserId: "user7",
    fromUserName: "Grace",
    toUserId: "user8",
    toUserName: "Hannah",
    status: "Pending",
  },
  {
    id: "5",
    fromUserId: "user9",
    fromUserName: "Ivy",
    toUserId: "user10",
    toUserName: "Jack",
    status: "Accepted",
  },
];
