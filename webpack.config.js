const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: [
        "./index.js",
        "./styles.css",
    ],
    output: {
        path: path.resolve(__dirname, "html"),
        filename: "bundle.js",
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // },
            {
                test: /\.css$/,
                exclude: "/node_modules/",
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(jpe?g|gif|jpg|png|svg)$/,
                exclude: '/node_modules/',
                loader: 'file-loader',
            },
            {
                test: /\.ico$/,
                exclude: '/node_modules/',
                loader: 'file-loader',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                exclude: '/node_modules/',
                loader: 'file-loader',
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                exclude: '/node_modules/',
                use: [{
                    loader: 'file-loader',
                    options: { name: '[name].[ext]' },
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
        extensions: ['.js', '.jsx', '.json']
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: "gzip",
            test: /\.js$|\.ts$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};
