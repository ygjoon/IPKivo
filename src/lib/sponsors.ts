export interface Sponsor {
  name: string;
  href: string;
  image?: string;
}

export const sponsors: readonly Sponsor[] = [
  {
    name: "星图大模型聚合平台",
    href: "https://astraflow.ucloud.cn/",
    image: "/sponsors/astraflow-960x274.png",
  },
];
