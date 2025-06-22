import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="HomeTab"
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="WorkshopsTab"
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="ProfileTab"
        options={{ headerShown: false }}
      />
    </Tabs>
  );
}