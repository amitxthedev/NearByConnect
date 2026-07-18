import {
  Code, Gamepad2, Music, Film, Trophy, Camera, Briefcase,
  Brain, MapPin, UtensilsCrossed, Dumbbell, Palette, BookOpen,
  Compass, Heart, Zap, Users, Globe, Clapperboard, Laptop,
} from 'lucide-react';

const interestIconMap = {
  coding: Code,
  gaming: Gamepad2,
  music: Music,
  movies: Film,
  cricket: Trophy,
  photography: Camera,
  business: Briefcase,
  ai: Brain,
  travel: MapPin,
  food: UtensilsCrossed,
  technology: Laptop,
  sports: Trophy,
  fitness: Dumbbell,
  art: Palette,
  books: BookOpen,
  entertainment: Clapperboard,
};

export function getInterestIcon(interest) {
  const name = (interest?.name || interest || '').toLowerCase();
  return interestIconMap[name] || Compass;
}

export function getInterestColor(interest) {
  const name = (interest?.name || interest || '').toLowerCase();
  const colorMap = {
    coding: 'text-blue-500',
    gaming: 'text-purple-500',
    music: 'text-pink-500',
    movies: 'text-red-500',
    cricket: 'text-orange-500',
    photography: 'text-sky-500',
    business: 'text-amber-500',
    ai: 'text-violet-500',
    travel: 'text-teal-500',
    food: 'text-orange-500',
    technology: 'text-indigo-500',
    sports: 'text-red-500',
    fitness: 'text-green-500',
    art: 'text-fuchsia-500',
    books: 'text-indigo-500',
  };
  return colorMap[name] || 'text-gray-500';
}
