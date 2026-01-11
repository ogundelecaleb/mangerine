import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuItem } from 'react-native-material-menu';
import moment from 'moment';
import { useTheme } from '@shopify/restyle';

import Box from './Box';
import Text from './Text';
import { Transaction } from '../utils/ParamList';
import { Theme } from '../utils/theme';

interface Props {
  item: Transaction;
  maxNameWidth?: number;
}

const PaymentHistoryItem = ({ item, maxNameWidth }: Props) => {
  const theme = useTheme<Theme>();
  const [menuVisible, setMenuVisible] = useState(false);

  const formatDateTime = () => {
    const date = moment(item?.createdAt);
    return date.format('DD MMM, YYYY | h:mma');
  };

  const formatAmount = () => {
    return `${item?.currency} ${parseFloat(item?.amount).toFixed(2)}`;
  };

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      paddingVertical="m"
      gap="l"
      paddingHorizontal="l"
      borderBottomWidth={1}
      borderBottomColor="border">
      <Box maxWidth={maxNameWidth} minWidth={maxNameWidth}>
        <Text numberOfLines={1} variant="medium">
          {item?.consultant?.fullName}
        </Text>
        <Text
          numberOfLines={1}
          fontSize={10}
          color="label"
          marginTop="xs">
          {formatAmount()}
        </Text>
      </Box>
      <Box
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="l">
        <Box>
          <Text fontSize={14}>{formatDateTime()}</Text>
        </Box>
        <Box>
          <Menu
            style={{
              backgroundColor: theme.colors.background,
            }}
            visible={menuVisible}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Box
                  height={40}
                  width={40}
                  borderWidth={1}
                  borderRadius={4}
                  borderColor="border"
                  justifyContent="center"
                  alignItems="center">
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={24}
                    color={theme.colors.foreground}
                  />
                </Box>
              </TouchableOpacity>
            }
            onRequestClose={() => setMenuVisible(false)}>
            <MenuItem
              onPress={() => {
                setMenuVisible(false);
              }}>
              <Box flexDirection="row" alignItems="center" gap="s">
                <MaterialCommunityIcons
                  name="eye"
                  size={18}
                  color={theme.colors.label}
                />
                <Text fontSize={16}>View Payment Receipt</Text>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentHistoryItem;
