import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  FlatList,
  Switch,
  Alert,
  Linking,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import {
  ChevronRight,
  Heart,
  Wallet,
  ShoppingBag,
  Tag,
  HelpCircle,
  Shield,
  Eye,
  Info,
  LogOut,
  X,
  Plus,
  CreditCard,
  Star,
  Facebook,
  MessageCircle,
  Camera,
  Truck,
} from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Merchants from "@/components/merchant/MerchantsList";
import { useMerchantsStore } from "@/store/merchants";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  isDefault: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const Profile: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const merchants = useMerchantsStore((state) => state.merchants);
  const [supportMessage, setSupportMessage] = useState<string>("");
  const colorScheme = useColorScheme();
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    profilePicture: null,
  });
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    cardType: "",
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "Visa", last4: "4242", isDefault: true },
    { id: "2", type: "Mastercard", last4: "8888", isDefault: false },
  ]);

  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >([
    {
      id: "1",
      title: "Promotional Alerts",
      description: "Get notified about discounts and offers",
      enabled: true,
    },
    {
      id: "2",
      title: "Membership Updates",
      description: "Rewards and membership information",
      enabled: true,
    },
    {
      id: "3",
      title: "Recommendations",
      description: "Personalized restaurant suggestions",
      enabled: false,
    },
    {
      id: "4",
      title: "Order Reminders",
      description: "Reminders about your orders",
      enabled: true,
    },
    {
      id: "5",
      title: "Feedback Requests",
      description: "Rate your delivery experience",
      enabled: true,
    },
    {
      id: "6",
      title: "Third-party Ads",
      description: "Advertisements from partner brands",
      enabled: false,
    },
  ]);

  const faqData: FAQ[] = [
    {
      id: "1",
      question: "How do I track my order?",
      answer:
        "You can track your order in real-time through the Orders section. You'll receive notifications about your order status and delivery updates.",
    },
    {
      id: "2",
      question: "What if my order is late?",
      answer:
        "If your order is significantly delayed, you can contact the restaurant directly or reach out to our support team. We may offer compensation for extended delays.",
    },
    {
      id: "3",
      question: "Can I modify my order after placing it?",
      answer:
        "Orders can be modified within 2 minutes of placement. After that, please contact the restaurant directly to see if changes are possible.",
    },
    {
      id: "4",
      question: "How do refunds work?",
      answer:
        "Refunds are processed within 3-5 business days. You can request a refund through the Orders section or by contacting support.",
    },
    {
      id: "5",
      question: "What are the delivery fees?",
      answer:
        "Delivery fees vary by distance and demand. You can see the exact fee before completing your order. ClickNChow+ members get free delivery on orders over $15.",
    },
  ];

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const setDefaultPayment = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };
  const addPaymentMethod = () => {
    if (
      newPaymentMethod.cardNumber &&
      newPaymentMethod.expiryDate &&
      newPaymentMethod.cvv &&
      newPaymentMethod.cardholderName
    ) {
      const cardType = getCardType(newPaymentMethod.cardNumber);
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: cardType,
        last4: newPaymentMethod.cardNumber.slice(-4),
        isDefault: paymentMethods.length === 0,
      };
      setPaymentMethods([...paymentMethods, newMethod]);
      setNewPaymentMethod({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
        cardType: "",
      });
      setActiveModal("wallet");
      Alert.alert("Success", "Payment method added successfully!");
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  const getCardType = (cardNumber: string): string => {
    const num = cardNumber.replace(/\s/g, "");
    if (num.startsWith("4")) return "Visa";
    if (num.startsWith("5") || num.startsWith("2")) return "Mastercard";
    if (num.startsWith("3")) return "American Express";
    return "Unknown";
  };

  const formatCardNumber = (text: string): string => {
    const cleaned = text.replace(/\s/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(" ") : cleaned;
  };

  const formatExpiryDate = (text: string): string => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const toggleNotification = (id: string) => {
    setNotificationSettings((settings) =>
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const sendSupportMessage = () => {
    if (supportMessage.trim()) {
      Alert.alert(
        "Message Sent",
        "Thank you for contacting us. We'll get back to you within 24 hours."
      );
      setSupportMessage("");
    }
  };

  const openDriverApp = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.clicknchow.driver"
    );
  };

  const openLegal = () => {
    Linking.openURL("https://clicknchow.com/legal");
  };

  const rateOnGooglePlay = () => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.clicknchow.app"
    );
  };

  const likeOnFacebook = () => {
    Linking.openURL("https://facebook.com/clicknchow");
  };

  const MenuOption: React.FC<{
    icon: React.ComponentType<any>;
    title: string;
    subtitle?: string;
    onPress: () => void;
    hasNotification?: boolean;
    isNew?: boolean;
  }> = ({ icon: Icon, title, subtitle, onPress, hasNotification, isNew }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-6 border-b border-border/15 dark:border-border/30"
    >
      <View className="flex-row items-center flex-1">
        <View className="mr-4">
          <Icon size={24} color="#666" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-medium text-foreground dark:text-foreground-muted-dark">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-foreground-muted dark:text-foreground-muted-dark/60">
              {subtitle}
            </Text>
          )}
        </View>
        {hasNotification && (
          <View className="bg-primary rounded-full w-6 h-6 items-center justify-center mr-2">
            <Text className="text-white text-xs font-bold">5</Text>
          </View>
        )}
        {isNew && (
          <View className="bg-green-500 rounded-full px-2 py-1 mr-2">
            <Text className="dark:text-white text-xs font-bold">New</Text>
          </View>
        )}
      </View>
      <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const ModalSheet: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <Modal
      visible={activeModal === title.toLowerCase()}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeModal}
    >
      <View className="flex-1 bg-background dark:bg-background-dark">
        <View className="border-b border-border/15 px-6 py-4 flex-row items-center justify-between">
          <Text className="dark:text-white text-2xl font-semibold">
            {title}
          </Text>
          <TouchableOpacity onPress={closeModal}>
            <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1">{children}</ScrollView>
      </View>
    </Modal>
  );

  const PaymentMethodCard: React.FC<{ method: PaymentMethod }> = ({
    method,
  }) => (
    <View className="bg-card dark:bg-card-dark rounded-lg p-4 mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <CreditCard size={24} color="#666" />
        <View className="ml-4">
          <Text className="text-foreground dark:text-white font-semibold">
            {method.type} •••• {method.last4}
          </Text>
          {method.isDefault && (
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-primary rounded-full mr-2" />
              <Text className="text-primary text-sm font-medium">Default</Text>
            </View>
          )}
        </View>
      </View>
      {!method.isDefault && (
        <TouchableOpacity
          onPress={() => setDefaultPayment(method.id)}
          className="bg-primary rounded-full px-3 py-1"
        >
          <Text className="text-white text-sm">Set Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="dark:text-white text-2xl font-semibold">
            My Account
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 bg-background dark:bg-background-dark">
        <View className=" p-6 border-b-2 border-border/15 dark:border-border/30">
          <View className="flex-row items-center">
            <View className="w-20 h-20 bg-card dark:bg-card-dark rounded-full mr-4 items-center justify-center">
              <Text className="dark:text-white text-3xl font-semibold">SJ</Text>
            </View>
            <View>
              <Text className="text-xl font-semibold text-foreground dark:text-white">
                {profileData.name}
              </Text>
              <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg">
                {profileData.phone}
              </Text>
              <TouchableOpacity onPress={() => openModal("edit profile")}>
                <Text className="text-primary text-md">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mt-1">
          <View className="px-6 py-3">
            <Text className="text-md font-medium text-foreground-muted dark:text-foreground-muted-dark">
              QUICK ACCESS
            </Text>
          </View>

          <MenuOption
            icon={Heart}
            title="Favorites"
            onPress={() => openModal("favorites")}
          />

          <MenuOption
            icon={Wallet}
            title="Wallet"
            onPress={() => openModal("wallet")}
          />

          <MenuOption
            icon={ShoppingBag}
            title="Orders"
            onPress={() => router.push("/order")}
            hasNotification={true}
          />

          <MenuOption
            icon={Tag}
            title="Promotions"
            onPress={() => openModal("promotions")}
            isNew={true}
          />
        </View>

        <LinearGradient
          colors={["#ff5a3c", "#ff8a00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mx-6 my-4 p-4"
          style={{ borderRadius: 10 }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white font-semibold text-lg">
              ClickNChow Rewards
            </Text>
            <View className="bg-accent px-2 py-1 rounded-xl">
              <Text className="text-black text-xs font-bold">GOLD</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-white/80 text-md">Points Balance</Text>
              <Text className="text-white text-2xl font-bold">1,250</Text>
              <Text className="text-white/80 text-md mb-2">
                250 more points until your next reward
              </Text>
              <View className="bg-white/20 rounded-full h-2 w-full">
                <View
                  className="bg-white rounded-full h-2"
                  style={{ width: "83.3%" }}
                />
              </View>
              <Text className="text-white/60 text-sm mt-1">
                1,250 / 1,500 points
              </Text>
            </View>
            <TouchableOpacity className="bg-white rounded-full px-4 py-2">
              <Text className="text-primary font-semibold">Redeem</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <TouchableOpacity
          onPress={openDriverApp}
          className="bg-green-50 border border-border/15 dark:border-border/25 mx-6 rounded-lg p-4 mb-4"
        >
          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="dark:text-white text-lg font-semibold">
                Earn by becoming a delivery partner
              </Text>
              <Text className="text-foreground-muted dark:text-foreground-muted-dark text-md">
                Download ClickNChow Driver app
              </Text>
            </View>
            <ChevronRight size={28} color="#666" />
          </View>
        </TouchableOpacity>

        <View className="mt-1">
          <View className="px-6 py-3">
            <Text className="text-md font-medium text-foreground-muted dark:text-foreground-muted-dark">
              SUPPORT & SETTINGS
            </Text>
          </View>

          <MenuOption
            icon={HelpCircle}
            title="Help Center"
            onPress={() => openModal("help")}
          />

          <MenuOption
            icon={Shield}
            title="Privacy Settings"
            onPress={() => openModal("privacy")}
          />

          <MenuOption
            icon={Eye}
            title="Accessibility"
            onPress={() => openModal("accessibility")}
          />

          <MenuOption
            icon={Info}
            title="About ClickNChow"
            subtitle="v2.3.4"
            onPress={() => openModal("about")}
          />
        </View>

        <TouchableOpacity className="mx-6 my-6 border border-destructive rounded-lg py-3 flex flex-row items-center justify-center gap-4">
          <MaterialIcons name="logout" size={24} color="#f13b58" />
          <Text className="text-destructive font-semibold">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalSheet title="Edit Profile">
        <View className="p-6">
          <View className="flex flex-col gap-4 justify-center items-center mb-6">
            <View className="w-28 h-28 bg-card dark:bg-card-dark rounded-full mr-4 items-center justify-center">
              <Text className="dark:text-white text-3xl font-semibold">SJ</Text>
            </View>
            <TouchableOpacity className="flex-row items-center">
              <Camera size={18} color="#ff5a3c" />
              <Text className="text-primary text-lg ml-2">Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg mb-2">
              Firstname
            </Text>
            <TextInput
              className="bg-card dark:bg-card-dark border border-border/15 dark:border-border/30 rounded-lg px-4 py-3 text-foreground dark:text-white"
              value={profileData.name}
              onChangeText={(text) =>
                setProfileData({ ...profileData, name: text })
              }
            />
          </View>

          <View className="mb-4">
            <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg mb-2">
              Lastname
            </Text>
            <TextInput
              className="bg-card dark:bg-card-dark border border-border/15 dark:border-border/30 rounded-lg px-4 py-3 text-foreground dark:text-white"
              value={profileData.name}
              onChangeText={(text) =>
                setProfileData({ ...profileData, name: text })
              }
            />
          </View>

          <View className="mb-4">
            <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg mb-2">
              Email
            </Text>
            <TextInput
              className="bg-card dark:bg-card-dark border border-border/15 dark:border-border/30 rounded-lg px-4 py-3 text-foreground dark:text-white"
              value={profileData.email}
              onChangeText={(text) =>
                setProfileData({ ...profileData, email: text })
              }
              keyboardType="email-address"
            />
          </View>

          <View className="mb-6">
            <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg mb-2">
              Phone
            </Text>
            <TextInput
              className="bg-card dark:bg-card-dark border border-border/15 dark:border-border/30 rounded-lg px-4 py-3 text-foreground dark:text-white"
              value={profileData.phone}
              onChangeText={(text) =>
                setProfileData({ ...profileData, phone: text })
              }
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity className="bg-primary rounded-lg py-3 items-center">
            <Text className="text-white font-semibold">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ModalSheet>

      <ModalSheet title="Favorites">
        <View className="p-4">
          <Merchants merchants={merchants} />
        </View>
      </ModalSheet>

      <ModalSheet title="Wallet">
        <View className="p-4">
          <View className="bg-card dark:bg-card-dark rounded-lg p-4 mb-6">
            <Text className="text-foreground-muted dark:text-foreground-muted-dark text-md">
              Current Balance
            </Text>
            <Text className="text-foreground dark:text-white text-2xl font-bold">
              $0.00
            </Text>
          </View>

          <Text className="text-foreground dark:text-white text-lg font-semibold mb-4">
            Payment Methods
          </Text>

          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.id} method={method} />
          ))}
          <TouchableOpacity
            onPress={() => {
              closeModal();
              router.push("/paymentMethods");
            }}
            className="border border-border/20 dark:border-border/50 rounded-lg py-3 items-center my-4 flex-row justify-center"
          >
            <Plus size={20} color="grey" />
            <Text className="text-foreground-muted dark:text-foreground-muted-dark font-semibold ml-2">
              Add Payment Method
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-foreground rounded-lg py-4 items-center"
            onPress={() => {
              closeModal();
              router.push("/addMoney");
            }}
          >
            <Text className="text-white font-semibold">Add Money</Text>
          </TouchableOpacity>
        </View>
      </ModalSheet>

      <ModalSheet title="Promotions">
        <View className="p-4">
          <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <Text className="text-green-800 font-semibold">
              20% OFF First Order
            </Text>
            <Text className="text-green-600 text-sm">Use code: WELCOME20</Text>
          </View>
          <View className="bg-card rounded-lg p-4 mb-4">
            <Text className="text-foreground font-semibold">
              Free Delivery Weekend
            </Text>
            <Text className="text-foreground-muted text-sm">
              Valid until Sunday
            </Text>
          </View>
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Text className="text-blue-800 font-semibold">
              ClickNChow+ Member Benefits
            </Text>
            <Text className="text-blue-600 text-sm">
              Free delivery on orders over $15
            </Text>
          </View>
        </View>
      </ModalSheet>

      {/* Help Center Modal */}
      <ModalSheet title="Help Center">
        <View className="p-6">
          <Text className="text-foreground text-lg font-semibold mb-4">
            Frequently Asked Questions
          </Text>

          {faqData.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              onPress={() =>
                setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
              }
              className="bg-card rounded-lg mb-3 overflow-hidden"
            >
              <View className="p-4 flex-row justify-between items-center">
                <Text className="text-foreground font-medium flex-1">
                  {faq.question}
                </Text>
                <ChevronRight
                  size={20}
                  color="#666"
                  style={{
                    transform: [
                      { rotate: expandedFAQ === faq.id ? "90deg" : "0deg" },
                    ],
                  }}
                />
              </View>
              {expandedFAQ === faq.id && (
                <View className="px-4 pb-4">
                  <Text className="text-foreground-muted">{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <View className="mt-6 bg-gray-50 rounded-lg p-4">
            <Text className="text-foreground font-semibold mb-2">
              Still need help?
            </Text>
            <Text className="text-foreground-muted text-sm mb-3">
              Describe your issue and we'll get back to you within 24 hours.
            </Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-foreground mb-3"
              placeholder="Type your message here..."
              multiline
              numberOfLines={4}
              value={supportMessage}
              onChangeText={setSupportMessage}
            />
            <TouchableOpacity
              onPress={sendSupportMessage}
              className="bg-primary rounded-lg py-3 items-center"
            >
              <Text className="text-white font-semibold">Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalSheet>

      {/* Privacy Settings Modal */}
      <ModalSheet title="Privacy Settings">
        <View className="p-6">
          <Text className="text-foreground text-lg font-semibold mb-4">
            Data Usage Preferences
          </Text>

          <View className="bg-card rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-foreground font-medium">Location Data</Text>
              <Switch value={true} onValueChange={() => {}} />
            </View>
            <Text className="text-foreground-muted text-sm">
              Used for delivery and restaurant recommendations
            </Text>
          </View>

          <View className="bg-card rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-foreground font-medium">
                Order History Analysis
              </Text>
              <Switch value={true} onValueChange={() => {}} />
            </View>
            <Text className="text-foreground-muted text-sm">
              Helps us provide personalized recommendations
            </Text>
          </View>

          <View className="bg-card rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-foreground font-medium">
                Marketing Analytics
              </Text>
              <Switch value={false} onValueChange={() => {}} />
            </View>
            <Text className="text-foreground-muted text-sm">
              Used for targeted promotions and advertisements
            </Text>
          </View>

          <View className="bg-card rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-foreground font-medium">
                Third-party Data Sharing
              </Text>
              <Switch value={false} onValueChange={() => {}} />
            </View>
            <Text className="text-foreground-muted text-sm">
              Share anonymized data with partner restaurants
            </Text>
          </View>

          <TouchableOpacity className="bg-primary rounded-lg py-3 items-center">
            <Text className="text-white font-semibold">
              Save Privacy Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ModalSheet>

      {/* Accessibility Modal */}
      <ModalSheet title="Accessibility">
        <View className="p-6">
          <Text className="text-foreground text-lg font-semibold mb-4">
            Communication Settings
          </Text>

          <View className="mb-6">
            <Text className="text-foreground font-medium mb-3">
              Email Notifications
            </Text>
            {notificationSettings.map((setting) => (
              <View key={setting.id} className="bg-card rounded-lg p-4 mb-3">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-foreground font-medium">
                    {setting.title}
                  </Text>
                  <Switch
                    value={setting.enabled}
                    onValueChange={() => toggleNotification(setting.id)}
                  />
                </View>
                <Text className="text-foreground-muted text-sm">
                  {setting.description}
                </Text>
              </View>
            ))}
          </View>

          <View className="mb-6">
            <Text className="text-foreground font-medium mb-3">
              Push Notifications
            </Text>
            <View className="bg-card rounded-lg p-4 mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-foreground font-medium">
                  Order Updates
                </Text>
                <Switch value={true} onValueChange={() => {}} />
              </View>
              <Text className="text-foreground-muted text-sm">
                Real-time delivery tracking
              </Text>
            </View>
          </View>

          <View className="bg-card rounded-lg p-4 mb-3">
            <Text className="text-foreground font-semibold">Font Size</Text>
            <Text className="text-foreground-muted text-sm">
              Adjust text size for better readability
            </Text>
          </View>

          <View className="bg-card rounded-lg p-4 mb-3">
            <Text className="text-foreground font-semibold">High Contrast</Text>
            <Text className="text-foreground-muted text-sm">
              Enable high contrast mode
            </Text>
          </View>
        </View>
      </ModalSheet>

      {/* About Modal */}
      <ModalSheet title="About ClickNChow">
        <View className="p-6">
          <Text className="text-foreground text-base mb-6">Version 2.3.4</Text>

          <TouchableOpacity
            onPress={rateOnGooglePlay}
            className="bg-card rounded-lg p-4 mb-3 flex-row items-center"
          >
            <Star size={24} color="#4285f4" />
            <Text className="text-foreground font-semibold ml-4">
              Rate us on Google Play
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={likeOnFacebook}
            className="bg-card rounded-lg p-4 mb-3 flex-row items-center"
          >
            <Facebook size={24} color="#1877f2" />
            <Text className="text-foreground font-semibold ml-4">
              Like us on Facebook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openLegal}
            className="bg-card rounded-lg p-4 mb-3 flex-row items-center justify-between"
          >
            <Text className="text-foreground font-semibold">Legal</Text>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>

          <View className="bg-card rounded-lg p-4 mb-3">
            <Text className="text-foreground font-semibold">
              Terms of Service
            </Text>
          </View>

          <View className="bg-card rounded-lg p-4 mb-3">
            <Text className="text-foreground font-semibold">
              Privacy Policy
            </Text>
          </View>

          <View className="bg-card rounded-lg p-4 mb-3">
            <Text className="text-foreground font-semibold">Licenses</Text>
          </View>
        </View>
      </ModalSheet>
    </SafeAreaView>
  );
};

export default Profile;
