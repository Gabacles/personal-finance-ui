import nubankImg from "@/assets/img/nubank-ultravioleta.png";
import amazonImg from "@/assets/img/cartao-de-credito-amazon-prime.png";
import mercadoPagoImg from "@/assets/img/mp-cartao.png";
import unknownImg from "@/assets/img/unknown-card.png";
import type { StaticImageData } from "next/image";

export const CARD_PRESETS = [
  {
    label: "Nubank Ultravioleta",
    value: "Nubank Ultravioleta",
    image: nubankImg as StaticImageData,
  },
  {
    label: "Mercado Pago",
    value: "Mercado Pago",
    image: mercadoPagoImg as StaticImageData,
  },
  {
    label: "Amazon Prime",
    value: "Amazon Prime",
    image: amazonImg as StaticImageData,
  },
] as const;

export type CardPresetName = (typeof CARD_PRESETS)[number]["value"];

export const unknownCardImage = unknownImg as StaticImageData;

export function getCardImage(name: string): StaticImageData {
  const preset = CARD_PRESETS.find((p) => p.value === name);
  return preset?.image ?? unknownCardImage;
}
