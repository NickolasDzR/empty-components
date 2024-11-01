import {defineConfig} from 'vite';
import path from "path";
import ViteSvgSpriteWrapper from 'vite-svg-sprite-wrapper';
import ip from "ip";
import tsconfigPaths from "vite-tsconfig-paths";
import removeConsole from "vite-plugin-remove-console";
import process from "process";

// postcss plugins
import postcssNested from 'postcss-nested';
import postcssImport from 'postcss-import';
import postcssMath from "@davidwells/postcss-math";
import postcssSimpleVars from 'postcss-simple-vars';
import sortMediaQueries from 'postcss-sort-media-queries';
import postcssMixins from 'postcss-mixins';
import postcssPercentage from 'postcss-percentage';
import postcssZindex from "postcss-zindex";
import autoprefixer from "autoprefixer";
import postcssCombineDuplicatedSelectors from "postcss-combine-duplicated-selectors";
import pugPlugin from "vite-plugin-pug";

const removeConsoleSettings = {
    includes: ["debug", "log"]
};

export default defineConfig(({command, mode}) => {
    const servMode = process.env.NODE_ENV;

    return {
        plugins: [
            pugPlugin({pretty: true}, {name: "My Name"}),
            tsconfigPaths(),
            ViteSvgSpriteWrapper({
                icons: 'src/images/svg/*.svg',
                outputDir: 'public/images/sprite/',
                sprite: {
                    shape: {
                        transform: ['svgo', {
                            removeUselessStrokeAndFill: true,
                            removeViewBox: false,
                            removeUselessDefs: false,
                            removeUnknownsAndDefaults: false,
                            convertShapeToPath: false,
                            mergePaths: false,
                        }],
                    },
                    svg: {
                        namespaceClassnames: false,
                    }
                }
            }),
            removeConsole(servMode === "production" ? removeConsoleSettings : undefined)
        ],
        resolve: {
            alias: {
                '@splideJs': path.resolve(__dirname, 'node_modules/@splidejs/splide/dist/js/splide.esm.js'),
                '@splideCss': path.resolve(__dirname, 'node_modules/@splidejs/splide/dist/css/splide-core.min.css'),
            },
            extensions: ['.js', '.ts', '.pcss', '.css']
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern',
                    quietDeps: true,
                    silenceDeprecations: ['import']
                }
            }
        },
        server: {
            host: ip.address(),
            hmr: {
                host: ip.address(),
            },
            cors: {
                origin: '*',
            },
            watch: {
                // Ставить true когда share
                usePolling: false,
            }
        },
    }
});
