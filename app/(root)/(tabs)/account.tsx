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
import React, { useState, useCallback } from "react";
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

// Define modal types as constants
const MODAL_TYPES = {
  EDIT_PROFILE: "edit_profile",
  FAVORITES: "favorites",
  WALLET: "wallet",
  PROMOTIONS: "promotions",
  HELP_CENTER: "help_center",
  PRIVACY_SETTINGS: "privacy_settings",
  ACCESSIBILITY: "accessibility",
  ABOUT: "about",
} as const;

type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES] | null;

const Profile: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
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

  const openModal = useCallback((modalType: ModalType) => {
    setActiveModal(modalType);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setExpandedFAQ(null); // Reset expanded FAQ when closing modal
  }, []);

  const setDefaultPayment = useCallback((id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  }, []);

  const toggleNotification = useCallback((id: string) => {
    setNotificationSettings((settings) =>
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  }, []);

  const sendSupportMessage = useCallback(() => {
    if (supportMessage.trim()) {
      Alert.alert(
        "Message Sent",
        "Thank you for contacting us. We'll get back to you within 24 hours."
      );
      setSupportMessage("");
    }
  }, [supportMessage]);

  const openDriverApp = useCallback(() => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.clicknchow.driver"
    );
  }, []);

  const openLegal = useCallback(() => {
    Linking.openURL("https://clicknchow.com/legal");
  }, []);

  const rateOnGooglePlay = useCallback(() => {
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.clicknchow.app"
    );
  }, []);

  const likeOnFacebook = useCallback(() => {
    Linking.openURL("https://facebook.com/clicknchow");
  }, []);

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

  const PaymentMethodCard: React.FC<{ method: PaymentMethod }> = React.memo(
    ({ method }) => (
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
                <Text className="text-primary text-sm font-medium">
                  Default
                </Text>
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
    )
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
              <TouchableOpacity
                onPress={() => openModal(MODAL_TYPES.EDIT_PROFILE)}
              >
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
            onPress={() => openModal(MODAL_TYPES.FAVORITES)}
          />

          <MenuOption
            icon={Wallet}
            title="Wallet"
            onPress={() => openModal(MODAL_TYPES.WALLET)}
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
            onPress={() => openModal(MODAL_TYPES.PROMOTIONS)}
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
            onPress={() => openModal(MODAL_TYPES.HELP_CENTER)}
          />

          <MenuOption
            icon={Shield}
            title="Privacy Settings"
            onPress={() => openModal(MODAL_TYPES.PRIVACY_SETTINGS)}
          />

          <MenuOption
            icon={Eye}
            title="Accessibility"
            onPress={() => openModal(MODAL_TYPES.ACCESSIBILITY)}
          />

          <MenuOption
            icon={Info}
            title="About ClickNChow"
            subtitle="v2.3.4"
            onPress={() => openModal(MODAL_TYPES.ABOUT)}
          />
        </View>

        <TouchableOpacity className="mx-6 my-6 border border-destructive rounded-lg py-3 flex flex-row items-center justify-center gap-4">
          <MaterialIcons name="logout" size={24} color="#f13b58" />
          <Text className="text-destructive font-semibold">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={activeModal === MODAL_TYPES.EDIT_PROFILE}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="border-b border-border/15 px-4 py-4 flex-row items-center justify-between">
            <Text className="dark:text-white text-2xl font-semibold">
              Edit Profile
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <View className="p-6">
              <View className="flex flex-col gap-4 justify-center items-center mb-6">
                <View className="w-28 h-28 bg-card dark:bg-card-dark rounded-full mr-4 items-center justify-center">
                  <Text className="dark:text-white text-3xl font-semibold">
                    SJ
                  </Text>
                </View>
                <TouchableOpacity className="flex-row items-center">
                  <Camera size={18} color="#ff5a3c" />
                  <Text className="text-primary text-lg ml-2">
                    Change Photo
                  </Text>
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
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={activeModal === MODAL_TYPES.FAVORITES}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="border-b border-border/15 px-4 py-4 flex-row items-center justify-between">
            <Text className="dark:text-white text-2xl font-semibold">
              Favorites
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <View className="p-4">
              <Merchants merchants={merchants} />
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={activeModal === MODAL_TYPES.WALLET}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="border-b border-border/15 px-4 py-4 flex-row items-center justify-between">
            <Text className="dark:text-white text-2xl font-semibold">
              Wallet
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
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
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={activeModal === MODAL_TYPES.PROMOTIONS}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="border-b border-border/15 px-4 py-4 flex-row items-center justify-between">
            <Text className="dark:text-white text-2xl font-semibold">
              Promotions
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <View className="p-4">
              <View className="relative">
                <LinearGradient
                  colors={["#10b981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-xl p-6 mb-4 shadow-lg"
                >
                  <View className="absolute top-4 right-4 bg-white/20 rounded-full px-3 py-1">
                    <Text className="text-white text-xs font-bold">
                      FEATURED
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-3">
                    <View className="bg-white/20 rounded-full p-2 mr-3">
                      <Tag size={24} color="white" />
                    </View>
                    <Text className="text-white text-xl font-bold">
                      20% OFF First Order
                    </Text>
                  </View>
                  <Text className="text-green-100 text-base mb-4">
                    New customer? Get 20% off your first order with us!
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="bg-white/20 rounded-lg px-4 py-2">
                      <Text className="text-white font-mono text-lg font-bold">
                        WELCOME20
                      </Text>
                    </View>
                    <TouchableOpacity className="bg-white rounded-full px-6 py-2">
                      <Text className="text-green-600 font-bold">
                        Copy Code
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>

              <View className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <Text className="text-foreground-muted dark:text-foreground-muted-dark text-sm">
                  Terms & Conditions: Offers cannot be combined. Valid for
                  limited time only. Free delivery applies to orders within
                  standard delivery zones.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={activeModal === MODAL_TYPES.HELP_CENTER}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="border-b border-border/15 px-4 py-4 flex-row items-center justify-between">
            <Text className="dark:text-white text-2xl font-semibold">
              Help Center
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <View className="p-4">
              {faqData.map((faq) => (
                <TouchableOpacity
                  key={faq.id}
                  onPress={() =>
                    setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
                  }
                  className="bg-card dark:bg-card-dark rounded-lg mb-3 overflow-hidden"
                >
                  <View className="p-4 flex-row justify-between items-center">
                    <Text className="text-foreground dark:text-white font-bold flex-1 text-xl">
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
                      <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg">
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <View className="mt-6 rounded-lg">
                <Text className="text-foreground dark:text-white font-semibold mb-2 text-xl">
                  Still need help?
                </Text>
                <Text className="text-foreground-muted dark:text-foreground-muted-dark text-md mb-3">
                  Describe your issue and we'll get back to you within 24 hours.
                </Text>
                <TextInput
                  className="bg-neutral/10 dark:bg-foreground/25 rounded-lg p-3 mt-2 dark:text-white mb-4"
                  placeholder="Type your message here..."
                  multiline
                  value={supportMessage}
                  onChangeText={setSupportMessage}
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  numberOfLines={6}
                  style={{ minHeight: 120 }}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  onPress={sendSupportMessage}
                  className="bg-foreground rounded-lg py-4 items-center"
                >
                  <Text className="text-white font-semibold">Send Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={activeModal === MODAL_TYPES.PRIVACY_SETTINGS}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="border-b border-border/15 px-4 py-4 flex-row items-center justify-between">
            <Text className="dark:text-white text-2xl font-semibold">
              Privacy and Settings
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <View className="p-4 flex-col gap-6">
              <View className="border-b border-border/15 dark:border-border/30 rounded-lg pb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground dark:text-white text-xl font-bold">
                    Location Data
                  </Text>
                  <Switch value={true} onValueChange={() => {}} />
                </View>
                <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg">
                  Used for delivery and restaurant recommendations
                </Text>
              </View>

              <View className="border-b border-border/15 dark:border-border/30 rounded-lg pb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground dark:text-white text-xl font-bold">
                    Order History Analysis
                  </Text>
                  <Switch value={true} onValueChange={() => {}} />
                </View>
                <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg">
                  Helps us provide personalized recommendations
                </Text>
              </View>

              <View className="border-b border-border/15 dark:border-border/30 pb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground dark:text-white text-xl font-bold">
                    Marketing Analytics
                  </Text>
                  <Switch value={false} onValueChange={() => {}} />
                </View>
                <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg">
                  Used for targeted promotions and advertisements
                </Text>
              </View>

              <View className="border-b border-border/15 dark:border-border/30 pb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground dark:text-white text-xl font-bold">
                    Third-party Data Sharing
                  </Text>
                  <Switch onValueChange={() => {}} />
                </View>
                <Text className="text-foreground-muted dark:text-foreground-muted-dark text-lg">
                  Share anonymized data with partner restaurants
                </Text>
              </View>

              <TouchableOpacity className="bg-foreground rounded-lg py-4 items-center">
                <Text className="text-white font-semibold">
                  Save Privacy Settings
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={activeModal === MODAL_TYPES.ACCESSIBILITY}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="border-b border-border/15 px-4 py-4 flex-row items-center justify-between">
            <Text className="dark:text-white text-2xl font-semibold">
              Accessbility
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <View className="p-4">
              <View className="mb-6">
                <Text className="text-foreground dark:text-white text-xl font-bold mb-4">
                  Email Notifications
                </Text>
                {notificationSettings.map((setting) => (
                  <View
                    key={setting.id}
                    className="border-b border-border/15 dark:border-border/30 pb-4 mt-2"
                  >
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-foreground dark:text-white text-lg font-medium">
                        {setting.title}
                      </Text>
                      <Switch
                        value={setting.enabled}
                        onValueChange={() => toggleNotification(setting.id)}
                      />
                    </View>
                    <Text className="text-foreground-muted dark:text-foreground-muted-dark text-md">
                      {setting.description}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="mb-6">
                <Text className="text-foreground dark:text-white text-xl font-bold mb-3">
                  Push Notifications
                </Text>
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-foreground dark:text-white text-lg font-medium">
                      Order Updates
                    </Text>
                    <Switch value={true} onValueChange={() => {}} />
                  </View>
                  <Text className="text-foreground-muted dark:text-foreground-muted-dark text-md">
                    Real-time delivery tracking
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={activeModal === MODAL_TYPES.ABOUT}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="border-b border-border/15 px-4 py-4 flex-row items-center justify-between">
            <Text className="dark:text-white text-2xl font-semibold">
              About ClicknChow
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <X size={24} color={colorScheme === "dark" ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1">
            <View className="p-4">
              <Text className="text-foreground dark:text-foreground-muted-dark text-lg mb-6">
                Version 2.3.4
              </Text>

              <TouchableOpacity
                onPress={rateOnGooglePlay}
                className="bg-card dark:bg-card-dark rounded-lg p-4 mb-3 flex-row items-center"
              >
                <Star size={24} color="#ff5a3c" />
                <Text className="text-foreground dark:text-foreground-muted-dark font-medium ml-4">
                  Rate us on Google Play
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={likeOnFacebook}
                className="bg-card dark:bg-card-dark rounded-lg p-4 mb-3 flex-row items-center"
              >
                <Facebook size={24} color="#ff5a3c" />
                <Text className="text-foreground dark:text-foreground-muted-dark font-medium ml-4">
                  Like us on Facebook
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={openLegal}
                className="bg-card dark:bg-card-dark rounded-lg p-4 mb-3 flex-row items-center justify-between"
              >
                <Text className="text-foreground dark:text-foreground-muted-dark font-semibold">Legal</Text>
                <ChevronRight size={20} color="#666" />
              </TouchableOpacity>

              <View className="bg-card dark:bg-card-dark rounded-lg p-4 mb-3">
                <Text className="text-foreground dark:text-foreground-muted-dark font-semibold">
                  Terms of Service
                </Text>
              </View>

              <View className="bg-card dark:bg-card-dark rounded-lg p-4 mb-3">
                <Text className="text-foreground dark:text-foreground-muted-dark font-semibold">
                  Privacy Policy
                </Text>
              </View>

              <View className="bg-card dark:bg-card-dark rounded-lg p-4 mb-3">
                <Text className="text-foreground dark:text-foreground-muted-dark font-semibold">Licenses</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
