# Design patterns used in project:


#### Wzorce stanu sesji

1. Client Session State
   ```
    navigation.navigate("InteractionStack", {
        screen: "IncomingCall",
        params: {
          callData: { ...callData, callSessionId: sessionId } as CallData,
        },
      });

   ```
2. Database Session State
   ```
    const app = initializeApp(firebaseConfig);

    export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
    });

    export const db = getFirestore(app);
    export const storage = getStorage(app);

    ...

    export const rejectInvitation = async (invitationId: string) => {
        try {
            const invitationRef = doc(db, "invitations", invitationId);
            await deleteDoc(invitationRef);
        } catch (error) {
            throw error;
        }
    };
   ```

#### Wzorce podstawowe

3. Gateway
   ```
   fetchUserData in authGateway.ts
   ```

4. Registry
   ```
   UserDataProvider, useUserData
   ```

5. Separated Interface
   ```
   export interface Contact {
        contactId: string;
        userId: string;
        name: string;
        avatar: string;
        createdAt: Timestamp;
    }

   ```
6. Service Stub 
   ```
    fetchMockInvitations
    mockContacts
   ```

#### Wzorce struktury dla mapowania obiektowo-relacyjnego

7. Identity Field
   ```
    export interface UserData {
        id: string;
        name: string;
        email: string;
        picture: string;
        invitationCode: string;k
    }
   ```

8. Foreign Key Mapping
   ```
    export interface Contact {
        contactId: string;
        userId: string;
        name: string;
        avatar: string;
        createdAt: Timestamp;
    }
   ```

#### Wzorce prezentacji internetowych

9. Template View
    ```
    export function ContactsListItem({ item }: { item: Contact }) {
        const navigation = useNavigation<AuthenticatedStackProp>();
        const chatId = [item.userId, item.contactId].sort().join("_");
        const handleItemPress = () => {
            navigation.navigate("InteractionStack", {
            screen: "ChatDetails",
            params: {
                chatId: chatId,
                contactId: item.userId,
                contactName: item.name,
                contactAvatar: item.avatar,
            },
            });
        };
        return (
            <TouchableOpacity style={styles.contactItem} onPress={handleItemPress}>
            <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
            <View style={styles.contactInnerContainer}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Ionicons
                name={"chevron-forward-outline"}
                size={20}
                color={Colors.primary}
                />
            </View>
            </TouchableOpacity>
        );
    }
    ```

#### Wzorce zachowań dla mapowania obiektowo-relacyjnego

10. Lazy Load
    ```
    FlatList in PendingInvitations component

    sectionListGetItemLayout from "react-native-section-list-get-item-layout"
    (Jump directly to any list item without sequentially rendering all previous items.)
    in ContactSection component
    ```

#### Wzorce logiki dziedziny
11. Transaction Script
    ```
    fetchInvitations
    sendInvitation
    acceptInvitation
    rejectInvitation
    ```
12. Service Layer
    ```
    callSessionService.ts
    chatService.ts
    contactService.ts
    ```