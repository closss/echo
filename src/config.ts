import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "hsw's blog",
	subtitle: "❥(^_-)",
	themeColor: {
		hue: 275,
		fixed: false,
	},
	banner: {
		enable: true,
		src: "/Celestia.webp",
		position: "center",
		credit: {
			enable: true,
			text: "Pixiv @chokei",
			url: "https://www.pixiv.net/artworks/122782209",
		},
	},
	toc: {
		enable: true,
		depth: 2,
	},
	favicon: [
		   {
		     src: '/favicon/icons.webp',
		   }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Series,
		LinkPreset.About,
		LinkPreset.Friends,
		{ name: "\u95ee\u7b54", url: "/qna/" },
		/*{
			name: "GitHub",
			url: "https://github.com/yCENzh",
			external: true,
		},*/
		{
			name: "\u5f00\u5f80",
			url: "https://www.travellings.cn/train.html",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/avatar.webp",
	name: "hsw",
	bio: "\u957f\u8def\u6f2b\u6f2b\u4ea6\u70c1\u70c1~",
	links: [
		/*{
			name: "Twitter",
			icon: "fa6-brands:twitter",
			url: "https://twitter.com",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com",
		},*/
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/closss",
		},
		{
			name: "CSDN",
			icon: "simple-icons:csdn",
			url: "https://blog.csdn.net/Surfing_citizen?spm=1000.2115.3001.5343",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

