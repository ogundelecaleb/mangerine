import React, { useState } from 'react';
import { Image, ImageProps } from 'react-native';
import Box from './Box';
import LoadingSpinner from './LoadingSpinner';

interface Props extends Omit<ImageProps, 'style'> {
  uri: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  borderRadius?: number;
}

const ScaledImage = ({ 
  uri, 
  width, 
  height, 
  aspectRatio, 
  borderRadius = 0,
  ...props 
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleLoad = () => {
    setLoading(false);
    if (uri) {
      Image.getSize(
        uri,
        (w, h) => {
          setDimensions({ width: w, height: h });
        },
        () => setError(true)
      );
    }
  };

  const getImageStyle = () => {
    if (width && height) {
      return { width, height };
    }
    
    if (width && aspectRatio) {
      return { width, height: width / aspectRatio };
    }
    
    if (width && dimensions.width && dimensions.height) {
      const calculatedHeight = (width * dimensions.height) / dimensions.width;
      return { width, height: calculatedHeight };
    }
    
    return { width: width || 200, height: height || 200 };
  };

  if (error) {
    return (
      <Box 
        {...getImageStyle()} 
        backgroundColor="faded" 
        justifyContent="center" 
        alignItems="center"
        borderRadius={borderRadius}
      >
        <Text variant="regular" fontSize={12} color="label">
          Failed to load image
        </Text>
      </Box>
    );
  }

  return (
    <Box borderRadius={borderRadius} overflow="hidden">
      {loading && (
        <Box 
          {...getImageStyle()} 
          justifyContent="center" 
          alignItems="center"
          backgroundColor="faded"
        >
          <LoadingSpinner size="small" />
        </Box>
      )}
      
      <Image
        source={{ uri }}
        style={[
          getImageStyle(),
          { borderRadius },
          loading && { position: 'absolute' }
        ]}
        onLoad={handleLoad}
        onError={() => setError(true)}
        {...props}
      />
    </Box>
  );
};

export default ScaledImage;