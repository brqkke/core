declare module '@mui/material/styles' {
  import {PaletteOptions as MUIPaletteOptions} from "@mui/material";

  interface Palette {
    bitcoin: Palette['primary'];
  }
  interface PaletteOptions {
    bitcoin: MUIPaletteOptions['primary'];
  }
}
