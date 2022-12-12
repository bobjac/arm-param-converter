var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, '../deployment-orchestrator/client');
var postcssImport = require('postcss-import');
var postcssPresetEnv = require('postcss-preset-env');
var cssnano = require('cssnano');
// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    context: sourcePath,
    entry: {
        app: './index.tsx'
    },
    output: {
        path: outPath,
        filename: 'bundle.js',
        chunkFilename: '[chunkhash].js',
        publicPath: '/'
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.scss', '.css'],
        // Fix webpack's default behavior to not load packages with jsnext:main module
        // (jsnext:main directs not usually distributable es6 format, but es6 sources)
        mainFields: ['module', 'browser', 'main'],
        alias: {
            "@web_portal/store": path.resolve(__dirname, 'src/store'),
            "@web_portal/view-models": path.resolve(__dirname, 'src/view-models'),
            "@web_portal/constants": path.resolve(__dirname, 'src/constants'),
            "@web_portal/components": path.resolve(__dirname, 'src/components'),
            "@web_portal/pages": path.resolve(__dirname, 'src/pages'),
            "@web_portal/lib": path.resolve(__dirname, 'src/lib'),
            "@web_portal/assets/styles": path.resolve(__dirname, 'src/assets/styles'),
            "@web_portal/assets/img": path.resolve(__dirname, 'src/assets/img'),
            "@web_api": path.resolve(__dirname, '../deployment-orchestrator/src/')
            //  theme: path.join(__dirname, '/node_modules/primereact/resources/themes/Nova-Light/theme.css')
        }
    },
    module: {
        rules: [
            // .ts, .tsx
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ],

            },
            {
                test: /\.css$/,
                use: [
                    !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isProduction,
                            importLoaders: 1,
                            import: false
                        },
                    }, // TODO: enable sourceMap in devMode without FOUC
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true //,
                            //plugins: () => [postcssImport, postcssPresetEnv, cssnano],
                        },
                    },
                ],
            },
            // css
            {
                test: /\.scss$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : "style-loader",

                    {
                        loader: "css-loader" // translates CSS into CommonJS
                    },
                    'resolve-url-loader',
                    {
                        loader: "sass-loader", options: { sourceMap: true }
                    },


                ]
            },
            {
                test: /\.(gif|png|jpe?g|jpg|svg)$/,
                use: 'file-loader'
            },

            // static assets
            { test: /\.html$/, use: 'html-loader' },

            { test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: isProduction ? 'production' : 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false
        }),
        /*new WebpackCleanupPlugin({
            preview: false
        }),*/
        new MiniCssExtractPlugin({
            filename: '[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            template: 'assets/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets/img', to: outPath }
            ]
        })
    ],
    devServer: {
        hot: true,
        historyApiFallback: {
            disableDotRule: true
        }
    },
    
    devtool: "source-map"
};
