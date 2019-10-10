import webpack from 'webpack';
import path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import CleanPlugin from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import dotenv from 'dotenv';

const outputDirectory = path.resolve(__dirname, 'dist');
const env = process.env.NODE_ENV || 'development';
const sourceMap = env !== 'production';

if (env === 'development') {
    dotenv.config({
        path: path.resolve(__dirname, ".env.local"),
        silent: true
    });
} else {
    dotenv.config({
        path: path.resolve(__dirname, ".env"),
        silent: true
    });
}

module.exports = {
    mode: sourceMap ? 'development' : 'production',
    entry: {
        main: ['@babel/polyfill/noConflict', './src/globalregister.jsx', './src/index.jsx']
    },
    output: {
        path: outputDirectory,
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.jsx', '.js', '.json', '.scss'],
        modules: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "node_modules"),
            'node_modules'
        ],
        alias: {
            '@': path.resolve(__dirname, 'src/'), //avoid relative pathing to folder in src by using '@' symbol
            'Components': path.resolve(__dirname, 'src/components/'),
            'Api': path.resolve(__dirname, 'src/api/')
        }
    },
    module: {
        rules: [{
                test: /\.(less|scss)$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: sourceMap,
                            minimize: true,
                            localIdentName: '[local]',
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: sourceMap
                        },
                    },
                ]
            },
            {
                test: /\.css$/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: sourceMap,
                            minimize: true,
                            localIdentName: '[local]',
                        },
                    },
                ]
            },
            {
                test: /\.(pdf|jpg|png|gif|svg|ico)$/,
                use: [{
                    loader: 'url-loader'
                }]
            },
            // {
            //     enforce: 'pre',
            //     test: /\.(js|jsx)$/,
            //     exclude: /node_modules/,
            //     loader: "eslint-loader",
            //     options: {
            //         emitError: true,
            //         failOnError: false,
            //         configFile: "./.eslintrc",
            //         cache:true
            //     }
            // },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        sourceMap: sourceMap
                    }
                }
            },

            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader"
                }]
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.(svg)$/,
                loader: 'raw-loader'
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: sourceMap // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
    },
    devServer: {
        contentBase: outputDirectory,
        historyApiFallback: true,
        compress: true,
        port: 9000,
        watchContentBase: true,
        proxy: {
            '/api': {
                target: process.env.API_ROUTE,
                secure: false
            }
        }
    },
    // performance: {
    //     hints: 'warning'
    // },
    performance: {
        maxEntrypointSize: 400000,
        maxAssetSize: 400000
    },
    plugins: [
        new CleanPlugin(['dist'], {}),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css"
        }),
        new CopyPlugin([{
                from: './src/assets/images',
                to: outputDirectory + '/images'
            },
            {
                from: 'nginx.conf',
                to: outputDirectory
            },
            {
                from: './node_modules/@trv-ebus/tds/dist/assets',
                to: outputDirectory
            },
            {
                from: './node_modules/svgxuse/svgxuse.js',
                to: outputDirectory
            },
            {
                from: './404.html',
                to: outputDirectory
            }
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
            }
        }),
        new webpack.EnvironmentPlugin([
            'TRAVELERS_LEGAL_URL', 'TRAVELERS_PREMIUMAUDIT_URL', 'ONLINE_PRIVACY_STATEMENT',
            'TRAVELERS_PRIVATE_STATEMENT', 'CALL_US_NUM', 'CLAIM_CALLUS_NUM', 'LOGIN_URL',
            'TIMEOUT_WARNING_MINUTES', 'TIMEOUT_MINUTES', 'TIMEOUT_EXTENSION_COUNT_ALLOWED',
            'CLAIM_REPORT_URL', 'TECHNICAL_SUPPORT', 'NODE_ENV', 'API_ROUTE', 'TRAVELERS_COM',
            'ANALYTICS_APP_NAME', 'LOB', 'EXPRESSPAY_URL', 'EPAY_CALLUS_NUM', 'TRAVAUTH_SECRETORKEY',
            'TRAVAUTH_ISSUER', 'TRAVAUTH_AUDIENCE'
        ])
    ]
};
