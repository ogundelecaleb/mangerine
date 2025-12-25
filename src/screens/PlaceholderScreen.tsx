import React from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabList } from '../utils/ParamList';
import BaseScreenComponent from '../components/BaseScreenComponent';
import Box from '../components/Box';
import Text from '../components/Text';
import Button from '../components/Button';

type Props = BottomTabScreenProps<BottomTabList, keyof BottomTabList>;

const PlaceholderScreen = ({ route }: Props) => {
  const { title } = route.params || { title: 'Screen' };

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <Box 
          flex={1} 
          justifyContent="center" 
          alignItems="center" 
          paddingHorizontal="l"
          gap="l"
        >
          <Text variant="bold" fontSize={24} textAlign="center">
            {title}
          </Text>
          
          <Text variant="regular" fontSize={16} textAlign="center" color="label">
            This screen will be implemented in the next migration phase
          </Text>
          
          <Button 
            displayText="Coming Soon" 
            onPress={() => console.log(`${title} feature coming soon!`)}
            buttonProps={{ opacity: 0.6 }}
          />
        </Box>
      </Box>
    </BaseScreenComponent>
  );
};

export default PlaceholderScreen;