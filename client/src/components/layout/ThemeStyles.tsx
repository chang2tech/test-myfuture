import { Be_Vietnam_Pro } from 'next/font/google';
import { THEME_CSS } from '@/constants/layout/assets';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-be-vietnam-pro',
});

export function ThemeStyles() {
  return (
    <>
      {THEME_CSS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style>{`body { font-family: ${beVietnamPro.style.fontFamily}, sans-serif; }`}</style>
    </>
  );
}

export { beVietnamPro };
