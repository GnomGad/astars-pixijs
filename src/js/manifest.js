/**
 * описание всех спрайтов которые необходимо загрузить
 */
const manifest = {
    bundles: [
        {
            name: "bodies",
            assets: [
                {
                    name: "body",
                    srcs: "./src/assets/body.png",
                },
            ],
        },
    ],
};

export default { manifest: manifest };
