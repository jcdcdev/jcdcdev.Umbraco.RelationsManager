import {defineConfig} from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: ["src/index.ts"],
			formats: ["es"],
		},
		outDir: "../jcdcdev.Umbraco.RelationsManager/wwwroot/App_Plugins/RelationsManager/dist/",
		sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
});