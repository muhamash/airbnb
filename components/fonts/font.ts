import { Kanit, Playfair_Display, Rubik, Ubuntu } from "next/font/google";

const playfairDisplay = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const rubik = Rubik({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const kanit = Kanit({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export { kanit, playfairDisplay, rubik, ubuntu };
