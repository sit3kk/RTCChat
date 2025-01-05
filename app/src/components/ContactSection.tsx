import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, SectionList, Image, StyleSheet } from "react-native";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  Extrapolation,
  interpolate,
  measure,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Contact, ContactSectionsType } from "../types/ContactData";
import { Colors } from "../styles/commonStyles";
import { alphabet, randomAvatar } from "../utils/utils";

const ITEM_SPACING = 8;
const AVATAR_SIZE = 36;
const ITEM_HEIGHT = AVATAR_SIZE + ITEM_SPACING * 2;
const SECTION_HEADER_HEIGHT = 50;
const ALPHABET_INDICATOR_SIZE = 30;
const KNOB_SIZE = 25;
const HIT_SLOP = {
  // controls the area for gesture recognition
  left: 25,
  bottom: 25,
  right: 25,
  top: 25,
};

type AlphabetLetterProps = {
  index: number;
  letter: string;
  scrollableIndex: SharedValue<number>;
};

const AlphabetLetter = ({
  index,
  letter,
  scrollableIndex,
}: AlphabetLetterProps) => {
  const styles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollableIndex.value,
        [index - 1, index, index + 1],
        [0.5, 1, 0.5],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            scrollableIndex.value,
            [index - 2, index, index + 2],
            [1, 1.5, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        },
        styles,
      ]}
    >
      <Animated.Text
        style={[
          {
            color: Colors.textLight,
            position: "absolute",
            fontFamily: "Menlo",
            left: -20,
            fontWeight: "900",
          },
        ]}
      >
        {letter.toUpperCase()}
      </Animated.Text>
    </Animated.View>
  );
};

function generateContactSections(contacts: Contact[]): ContactSectionsType[] {
  const groupedContacts: { [key: string]: Contact[] } = {};

  contacts.forEach((contact) => {
    const firstLetter = contact.name[0].toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  });

  const contactSections: ContactSectionsType[] = Object.keys(groupedContacts)
    .sort()
    .map((letter, index) => ({
      title: letter,
      index,
      key: `list-${letter}`,
      data: groupedContacts[letter],
    }));

  return contactSections;
}

// Utility to generate contacts for each section
const mockContacts: ContactSectionsType[] = [
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

export function ContactsListHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

export function ContactsListItem({ item }: { item: Contact }) {
  return (
    <View style={styles.contactItem}>
      <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
      <View style={styles.contactNameContainer}>
        <Text style={styles.contactName}>{item.name}</Text>
      </View>
    </View>
  );
}

interface ContactSectionProps {
  contactsData: Contact[];
}

export function ContactSection({ contactsData }: ContactSectionProps) {
  const [contactItems, setContactItems] = useState<ContactSectionsType[]>(
    generateContactSections(contactsData)
    // mockContacts
  );
  const y = useSharedValue(0);
  const isInteracting = useSharedValue(false);
  const scrollableIndex = useSharedValue(0);
  const activeScrollIndex = useSharedValue(0);
  const alphabetRef = useAnimatedRef<View>();
  const scrollViewRef = useRef<SectionList>(null);

  const snapIndicatorTo = (index: number) => {
    runOnUI(() => {
      console.log("FRYTKI scrollableIndex", scrollableIndex.value);
      if (scrollableIndex.value === index || isInteracting.value) {
        return;
      }

      const alphabetLayout = measure(alphabetRef);
      if (!alphabetLayout) {
        return;
      }

      const snapBy =
        (alphabetLayout.height - KNOB_SIZE) / Math.max(1, alphabet.length - 1);
      const snapTo = index * snapBy;

      y.value = withTiming(snapTo);
      scrollableIndex.value = withTiming(index);
    })();
  };

  const scrollToLocation = (index: number) => {
    scrollViewRef.current?.scrollToLocation({
      itemIndex: 0,
      sectionIndex: index,
      animated: false,
      viewOffset: 0,
      viewPosition: 0,
    });
  };

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onBegin(() => {
      isInteracting.value = true;
    })
    .onChange((event) => {
      const alphabetLayout = measure(alphabetRef);
      if (!alphabetLayout) {
        return;
      }
      y.value = clamp(
        (y.value += event.changeY),
        alphabetLayout.y,
        alphabetLayout.height - KNOB_SIZE
      );

      const snapBy =
        (alphabetLayout.height - KNOB_SIZE) / Math.max(1, alphabet.length - 1);

      scrollableIndex.value = y.value / snapBy;
      const snapToIndex = Math.round(scrollableIndex.value);
      const clampedIndex = Math.max(
        0,
        Math.min(snapToIndex, contactItems.length - 1)
      );
      runOnJS(scrollToLocation)(clampedIndex);

      if (clampedIndex !== activeScrollIndex.value) {
        activeScrollIndex.value = clampedIndex;
      }
    })
    .onEnd(() => {
      runOnJS(snapIndicatorTo)(activeScrollIndex.value);
    })
    .onFinalize(() => {
      isInteracting.value = false;
    });

  const gestureDetectorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: y.value,
        },
      ],
    };
  });

  // useEffect(() => {
  //   // ensure the knob starts on the first contact's letter
  //   const firstIndex = 0;
  //   const alphabetLayout = measure(alphabetRef);

  //   if (alphabetLayout) {
  //     const snapBy =
  //       (alphabetLayout.height - KNOB_SIZE) / Math.max(1, alphabet.length - 1);
  //     y.value = firstIndex * snapBy;
  //     scrollableIndex.value = firstIndex;
  //     activeScrollIndex.value = firstIndex;
  //   }
  // }, [contactsData]);

  const getItemLayout = useMemo(() => {
    return sectionListGetItemLayout({
      getItemHeight: () => ITEM_HEIGHT,
      getSectionHeaderHeight: () => SECTION_HEADER_HEIGHT,
    });
  }, []);

  const onViewableItemsChanged = useMemo(
    () =>
      ({
        viewableItems,
      }: {
        viewableItems: { section?: ContactSectionsType }[];
      }) => {
        if (isInteracting.value) {
          return;
        }

        const half = Math.floor(viewableItems.length / 2);
        const section = viewableItems[half]?.section;
        if (section) {
          const { index } = section as ContactSectionsType;
          runOnJS(snapIndicatorTo)(index);
        }
      },
    []
  );

  return (
    <View style={styles.container}>
      <SectionList
        ref={scrollViewRef}
        sections={contactItems}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING * 2 }}
        // @ts-ignore
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        renderSectionHeader={({ section: { title } }) => (
          <ContactsListHeader title={title} />
        )}
        renderItem={({ item }) => <ContactsListItem item={item} />}
        keyExtractor={(item) => item.id}
      />

      {/* Alphabet Indicator */}
      <View
        style={{
          position: "absolute",
          right: -ALPHABET_INDICATOR_SIZE,
          top: ALPHABET_INDICATOR_SIZE,
          bottom: ALPHABET_INDICATOR_SIZE,
        }}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.knob, gestureDetectorAnimatedStyle]}
            hitSlop={HIT_SLOP}
          />
        </GestureDetector>
        <View
          ref={alphabetRef}
          style={{
            flex: 1,
            width: 20,
            justifyContent: "space-around",
          }}
          pointerEvents="box-none"
        >
          {[...Array(alphabet.length).keys()].map((i) => {
            return (
              <AlphabetLetter
                key={i}
                letter={alphabet.charAt(i)}
                index={i}
                scrollableIndex={scrollableIndex}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    height: SECTION_HEADER_HEIGHT,
    justifyContent: "center",
    paddingLeft: 10,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.textLight,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    height: ITEM_HEIGHT,
  },
  contactNameContainer: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: 0.5,
    width: "80%",
    paddingBottom: 3,
    height: "100%",
    justifyContent: "center",
  },
  contactAvatar: {
    marginRight: 10,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  contactName: {
    color: Colors.primary,
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    // borderWidth: 4, // for debugging uncomment to see the knob
    borderColor: Colors.primary,
    position: "absolute",
    right: KNOB_SIZE,
    zIndex: 1,
  },
});

export default ContactSection;
