import React, { useEffect, useState } from 'react';
import { Image, ImageSourcePropType } from 'react-native';

interface Props {
  width?: number;
  height?: number;
  source?: ImageSourcePropType;
  uri?: string;
}

export default ({ source, uri, ...props }: Props) => {
  const [dimension, setDimension] = useState<{
    width?: number;
    height?: number;
  }>();

  useEffect(() => {
    const getSize = (width: number, height: number) => {
      if (props.width && !props.height) {
        setDimension({
          width: props.width,
          height: height * (props.width / width),
        });
      } else if (!props.width && props.height) {
        setDimension({
          width: width * (props.height / height),
          height: props.height,
        });
      } else {
        setDimension({ width: width, height: height });
      }
    };

    if (source) {
      // Handle local images
      const resolved = Image.resolveAssetSource(source);
      getSize(resolved.width, resolved.height);
    } else if (uri) {
      // Handle remote images
      Image.getSize(
        uri,
        (width, height) => getSize(width, height),
        () => {
          // Fallback dimensions if getSize fails
          setDimension({ width: props.width || 200, height: props.height || 200 });
        }
      );
    }
  }, [source, uri, props.width, props.height]);

  const imageSource = source || (uri ? { uri } : undefined);

  if (!imageSource) {
    return null;
  }

  return (
    <Image
      source={imageSource}
      style={{ height: dimension?.height, width: dimension?.width }}
    />
  );
};