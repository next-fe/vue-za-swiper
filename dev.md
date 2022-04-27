## 开发 Vue3 版本
```shell
cd ./packages/vue3
npm i
npm run dev
```

## 开发 Vue2 版本
```shell
cd ./packages/vue2
npm i
npm run dev
```

## 发布

```shell
npm run build

cd ./packages/vue2
# 修改版本号，接着 publish
npm publish --tag latest-v1

cd ../vu3
# 修改版本号，接着 publish。
# 必须先发 Vue2 再发 Vue3，因为 README.md 在 Vue3 的目录，NPM 上显示的是最新包的 README.md
npm publish
```

## 文档
`vue3` 目录下的 `README.md`，用于在 NPM 展示，根目录下的 `README.md` 用于在 gitlab 展示。两份内容是相同的，所以修改了其中一份的时候需要手动覆盖另一份同步内容。
