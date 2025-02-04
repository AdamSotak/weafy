import {
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
} from "react-native";
import { Header } from "../../../components/Header";
import { ArrowLeft, Send } from "lucide-react-native";
import { router } from "expo-router";
import { useState, useCallback, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../../api/api";
import Animated, { SlideInRight, SlideInLeft } from "react-native-reanimated";

// Sample message type
type Message = {
  id: string;
  text: string;
  isSender: boolean;
  isLoading?: boolean;
};

// Add API message type
type APIMessage = {
  role: "user" | "assistant";
  content: string;
};

// Add LoadingDots component at the top of the file
const LoadingDots = () => {
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 300); // Faster animation (300ms instead of 500ms)

    return () => clearInterval(interval);
  }, []);

  return <Text style={{ color: "#333", minWidth: 20 }}>{dots}</Text>;
};

export default function Chat() {
  const insets = useSafeAreaInsets();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const smoothScrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (message.trim().length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isSender: true,
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "...",
      isSender: false,
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setMessage("");

    smoothScrollToBottom();

    try {
      // Convert messages to API format
      const messageHistory: APIMessage[] = messages
        .filter((msg) => !msg.isLoading)
        .map((msg) => ({
          role: msg.isSender ? "user" : "assistant",
          content: msg.text,
        }));

      const response = await api.post("/api/chat", {
        message: message,
        history: messageHistory,
      });

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(data.error || "Failed to send message");
      }

      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                id: msg.id,
                text: data.message,
                isSender: false,
                isLoading: false,
              }
            : msg
        )
      );
      smoothScrollToBottom();
    } catch (error) {
      // Handle error by updating the loading message
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading
            ? {
                id: msg.id,
                text: "Failed to send message. Please try again.",
                isSender: false,
                isLoading: false,
              }
            : msg
        )
      );
      smoothScrollToBottom();
    }
  }, [message, messages, smoothScrollToBottom]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <Header
        title="Chat"
        leadingAction={
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: "#E3F2FF",
            }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />

      {messages.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#333",
              marginBottom: 8,
            }}
          >
            No messages yet
          </Text>
          <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            Start the conversation by sending your first message below
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          style={{ flex: 1, padding: 16 }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          onContentSizeChange={smoothScrollToBottom}
          onLayout={smoothScrollToBottom}
          renderItem={({ item }) => (
            <Animated.View
              entering={
                item.isSender
                  ? SlideInRight.springify()
                      .mass(0.5)
                      .damping(12)
                      .stiffness(100)
                  : SlideInLeft.springify().mass(0.5).damping(12).stiffness(100)
              }
              style={{
                alignSelf: item.isSender ? "flex-end" : "flex-start",
                maxWidth: "70%",
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {!item.isSender ? (
                <LinearGradient
                  colors={["#007AFF", "#5856D6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 1,
                    borderRadius: 12,
                    opacity: item.isLoading ? 0.7 : 1,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 16,
                      borderRadius: 11,
                    }}
                  >
                    {item.isLoading ? (
                      <LoadingDots />
                    ) : (
                      <Text
                        style={{
                          color: "#333",
                          fontSize: 14,
                          fontStyle: item.isLoading ? "italic" : "normal",
                        }}
                      >
                        {item.text}
                      </Text>
                    )}
                  </View>
                </LinearGradient>
              ) : (
                <View
                  style={{
                    backgroundColor: "#007AFF",
                    padding: 16,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 14 }}>
                    {item.text}
                  </Text>
                </View>
              )}
            </Animated.View>
          )}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          backgroundColor: "white",
          paddingBottom: insets.bottom === 0 ? 16 : insets.bottom,
          gap: 8,
        }}
      >
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#f5f5f5",
            fontSize: 14,
          }}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#E3F2FF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Send size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
