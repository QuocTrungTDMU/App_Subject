import React from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import { StackHeaderProps } from '@react-navigation/stack';

const CustomNavigationBar = ({
    navigation,
    route,
    options,
    back,
  }: StackHeaderProps) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            onPress={openMenu}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            console.log('Option 1 was pressed');
          }}
          title="Home"
        />
        <Menu.Item
          onPress={() => {
            navigation.navigate('Details');
          }}
          title="Detail"
        />
        <Menu.Item
          onPress={() => {
            console.log('Option 3 was pressed');
          }}
          title="Option 3"
          disabled
        />
      </Menu>
    </Appbar.Header>
  );
};

export default CustomNavigationBar;
