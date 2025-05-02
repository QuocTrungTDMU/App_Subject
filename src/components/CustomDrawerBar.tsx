import React, { useState } from "react";
import { Divider, Drawer } from "react-native-paper";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

const CustomDrawerBar = ({ navigation }: DrawerContentComponentProps) => {
  const [active, setActive] = useState("");

  return (
    <Drawer.Section title="Admin">
      <Drawer.Item
        label="Home"
        icon="home"
        active={active === "Home"}
        onPress={() => {
          navigation.navigate("Home");
          setActive("Home");
        }}
      />
      <Drawer.Item
        label="Profile"
        icon="account"
        active={active === "Profile"}
        onPress={() => {
          navigation.navigate("Profile");
          setActive("Profile");
        }}
      />
      <Divider />
      <Drawer.Item
        label="Logout"
        icon="logout"
        onPress={() => {
          navigation.navigate("Profile");
        }}
      />
    </Drawer.Section>
  );
};

export default CustomDrawerBar;
