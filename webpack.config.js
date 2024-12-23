const PROD = process.env.NODE_ENV === 'production';
const DEPLOY_DEV = process.env.NODE_DEPLOY === 'develop';
const USE_MOCK = !PROD || DEPLOY_DEV;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const WebpackNotifierPlugin = require('webpack-notifier');
const setting = require('./config');
const _ = require('lodash');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function (env, argv) {
  return {
    stats  : PROD ? 'verbose' : 'errors-only',
    entry  : setting.entries,
    output : {
      path    : `${__dirname}`,
      filename: '[name].js',
    },
    optimization: PROD ? {
      splitChunks: setting.splitChunks,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: /AudioWorkletProcessor/,
          },
        }),
      ],

    } : {
      splitChunks: setting.splitChunks,
      minimize: false,
    },
    devtool: PROD ? false : 'inline-source-map',
    resolve: {

      extensions: ['.ts', '.js'],
      alias: {
        // three: "three/build/three.js",// Three.jsでmodules版を使うとIE11で構文エラーが発生するので、あえて、レガシーなバージョンを利用する
      },
    },
    target: ["web", "es5"],// ES5(IE11等)向けの指定（webpack 5以上で必要）
    performance: {
      maxEntrypointSize: 980 * 1024,//980kbまで
      maxAssetSize: 980 * 1024,//980kbまで
    },
    module : {
      rules: [
        {
          test: /\.ts$/,
          use : [
            {loader: 'ts-loader'},
          ],
        },
        {
          test   : /\.(vert|frag|glsl)$/,
          exclude: /node_modules/,
          type: 'asset/source',//webpack5でのraw-loaderの代わり
          use    : [
            {loader: 'glslify-loader'},
          ]
        },
        {
          /**
           * sass-loader を使って Sass を CSS へ変換
           * css-loader で CSS を JavaScript に変換
           * MiniCssExtractPlugin.loader で CSS を 抽出して別ファイルとして出力
           *
           * 指定する際は、逆順に指定し、後ろから順番に適用されます。
           */
          test   : /\.scss$/,
          exclude: /node_modules/,
          use    : [
            {
              loader: MiniCssExtractPlugin.loader,// CSSファイルを書き出すオプションを有効にする
            },
            {
              loader : 'css-loader',
              options: {
                url          : false,// CSS内のurl()メソッドの取り込みを禁止する
                // url          : true,//css内のurl()メソッドの取り込みを許可する（base64エンコードする）
                sourceMap    : !PROD,
                importLoaders: 2,// 2 => postcss-loader, sass-loader
              },
            },
            {
              loader : 'postcss-loader',
              options: {
                sourceMap: !PROD,
                postcssOptions: {
                  plugins: _.compact([
                    // [ 'autoprefixer', { grid: true } ],
                    PROD ? [ 'cssnano', { preset: 'default' } ] : null,
                    {
                      postcssPlugin: 'add-prefix',
                      Declaration(decl) {
                        if ([
                          'appearance',
                          'backdrop-filter',
                          'background-clip',
                          'box-reflect',
                          'box-shadow',
                          'mask',
                          'box-sizing',
                          'filter',
                          'text-fill-color',
                          'text-stroke',
                          'user-select',
                          'tap-highlight-color',
                        ].includes(decl.prop)) {
                          decl.cloneBefore({ prop: `-webkit-${decl.prop}` });
                        }
                      }
                    },
                  ])
                },
              },
            },
            {
              loader : 'sass-loader',
              options: {
                sourceMap  : !PROD,
                sassOptions: {
                  style: PROD ? 'compressed' : 'expanded',
                },
              }
            },
          ],
        },
      ]
    },
    plugins: [
      new WebpackNotifierPlugin({onlyOnError: true}),

      // CSSファイルを外だしにするプラグイン
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),

      // CSSと対で出力されるjsをなしに
      new RemoveEmptyScriptsPlugin(),

      // new BundleAnalyzerPlugin(),
    ]
  };
};
