const path = require("path");
// const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }
    console.log(opts)
    return opts
}

const isLoaders = () => {
    const loader = ['babel-loader'];
    return {
        loader,
        options: babelOptions()
    }
}

module.exports = {
    mode: 'development',
    entry: {
        app: './index.jsx',
        admin: './containers/Admin/Admin.jsx'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'www')
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        contentBase: path.join(__dirname, 'html'),
        compress: true,
        port: 9000,
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    enforce: true
                }
            },
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                },
                exclude: '/node_modules/',
                loader: "babel-loader"
            },
            {
                test: /\.jsx$/,
                exclude: '/node_modules/',
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        },
                    },
                    'css-loader'
                ]   // use: ['style-loader', 'css-loader']  ПОСЛЕДОВАТЕЛЬНОСТЬ ВАЖНА!!! ЧИТАЕТСЯ СПРАВА НА ЛЕВО
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                exclude: '/node_modules/',
                use: [{
                    loader: 'file-loader',
                    options: {name: '[name].[ext]'},
                }],
            },
            {
                test: /\.pdf$/,
                exclude: '/node_modules/',
                loader: 'file-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.png', '.jpg', '.jpeg', '.css'],
        alias: {
            '@containers': path.resolve(__dirname, 'tea/containers'),
            '@': path.resolve(__dirname, 'tea')
        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './html/index.html',
            title: 'Чайная жемчужина',
            minify: {
                collapseWhitespace: isProd
            },
            excludeChunks: ['static']
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'html/fonts.css'),
                    to: path.resolve(__dirname, 'www')
                },
                {
                    from: path.resolve(__dirname, 'favicon.ico'),
                    to: path.resolve(__dirname, 'www')
                },
                {
                    from: path.resolve(__dirname, 'html/images'),
                    to: path.resolve(__dirname, 'www/images')
                },
                {
                    from: path.resolve(__dirname, 'html/fonts'),
                    to: path.resolve(__dirname, 'www/fonts')
                },
                {
                    from: path.resolve(__dirname, 'robots.txt'),
                    to: path.resolve(__dirname, 'www')
                },
                {
                    from: path.resolve(__dirname, 'html/PHP'),
                    to: path.resolve(__dirname, 'www/php/PHP')
                },
                {
                    from: path.resolve(__dirname, 'html/PHP_Mailer'),
                    to: path.resolve(__dirname, 'www/php/PHP_Mailer')
                },
                {
                    from: path.resolve(__dirname, 'html/groups.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/products.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/captcha.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/archived.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/addProduct.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/error.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/novelty.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/orders.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/promotion.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/requests.php'),
                    to: path.resolve(__dirname, 'www/php')
                },
                {
                    from: path.resolve(__dirname, 'html/send_mail.php'),
                    to: path.resolve(__dirname, 'www/php')
                }
            ]
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        // new CompressionPlugin({
        //     filename: '[path].gz[query]',
        //     algorithm: "gzip",
        //     test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$/,
        //     threshold: 10240,
        //     minRatio: 0.8
        // })
    ]
};
