export interface ColorPalette {
  id: string;
  colors: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "pastel",
    colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E8BAFF", "#FFB3DE", "#B3FFE0"],
  },
  {
    id: "sunset",
    colors: ["#FF6B35", "#F7C59F", "#EFEFD0", "#FF4365", "#A10035", "#D4A373", "#E85D04", "#FFBA08"],
  },
  {
    id: "ocean",
    colors: ["#03045E", "#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#48CAE4", "#023E8A", "#ADE8F4"],
  },
  {
    id: "forest",
    colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2", "#B7E4C7", "#1B4332", "#D8F3DC"],
  },
  {
    id: "neon",
    colors: ["#FF00FF", "#00FFFF", "#FF3F00", "#FFFF00", "#00FF00", "#FF006E", "#8338EC", "#3A86FF"],
  },
  {
    id: "earth",
    colors: ["#8B4513", "#A0522D", "#D2B48C", "#DEB887", "#F5DEB3", "#BC8F8F", "#CD853F", "#DAA520"],
  },
  {
    id: "candy",
    colors: ["#FF69B4", "#FF1493", "#FFB6C1", "#FFC0CB", "#FF85A1", "#FB6F92", "#E0AAFF", "#C77DFF"],
  },
  {
    id: "monochrome",
    colors: ["#111111", "#333333", "#555555", "#777777", "#999999", "#BBBBBB", "#DDDDDD", "#EEEEEE"],
  },
  {
    id: "retro",
    colors: ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557", "#F4A261", "#2A9D8F", "#264653"],
  },
  {
    id: "aurora",
    colors: ["#0B0C10", "#1F2833", "#45A29E", "#66FCF1", "#C5C6C7", "#5CDB95", "#8EE4AF", "#379683"],
  },
];
