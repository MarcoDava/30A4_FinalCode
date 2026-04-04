import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { View } from 'react-native/Libraries/Components/View/View';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function Heatmap({ href, ...rest }: Props) {
  return (
    <View>

    </View>
  );
}
