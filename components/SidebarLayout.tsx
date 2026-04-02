import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { APP_NAME } from '../src/constants/BrandConfig';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = 300;

const NAV_ITEMS = [
  { name: 'index', label: 'Dashboard', icon: 'grid-outline', href: '/(tabs)' },
  { name: 'expenses', label: 'Expenses', icon: 'receipt-outline', href: '/(tabs)/expenses' },
  { name: 'clients', label: 'Clients', icon: 'people-outline', href: '/(tabs)/clients' },
  { name: 'invoices', label: 'Invoices', icon: 'document-text-outline', href: '/(tabs)/invoices' },
  { name: 'profile', label: 'Profile', icon: 'person-outline', href: '/(tabs)/profile' },
];

interface SidebarProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href as any);
  };

  return (
    <View className="flex-1 flex-row">
      {/* Sidebar */}
      <View className={`w-${SIDEBAR_WIDTH/4} bg-[#141413]`}>
        {/* Logo */}
        <View className="flex-row items-center px-2 py-6 mb-12 pl-2">
          <Text className="text-7xl mr-2">🥕</Text>
          <Text className="font-heading text-[#faf9f5] text-lg font-extrabold">{APP_NAME}</Text>
        </View>

        {/* Navigation Items */}
        <View className="flex-1 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.includes(item.name);
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => handleNavigation(item.href)}
                className={`flex-row items-center px-4 py-3.5 ${
                  isActive 
                    ? 'bg-[#D97757]/15 border-l-3 border-l-[#D97757]' 
                    : ''
                }`}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={20} 
                  color={isActive ? '#D97757' : '#999'} 
                  className="mr-3"
                />
                <Text className={`font-heading text-sm font-medium ${
                  isActive 
                    ? 'text-[#D97757] font-semibold' 
                    : 'text-gray-500'
                }`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* User Section */}
        <View className="flex-row items-center gap-3 pt-5 border-t border-t-[#b0aea5] px-2">
          <View className="w-9 h-9 bg-[#D97757] rounded-full justify-center items-center">
            <Text className="font-heading text-[#faf9f5] text-sm font-bold">A</Text>
          </View>
          <View className="flex-1">
            <Text className="font-heading text-[#faf9f5] text-xs font-semibold mb-0.5">A Sathish</Text>
            <Text className="text-gray-500 text-xs">sathish@example.com</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 bg-[#faf9f5]">
        {children}
      </View>
    </View>
  );
}
