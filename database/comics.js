const prisma = require("./prisma");

const getComics = () => {
    return prisma.Comic.findMany();
};

const addComic = (comicData, userId) => {
    return prisma.Comic.create({
        data: {
            name: comicData.name,
            issue: comicData.issue,
            publisher: comicData.publisher,
            release_year: comicData.release_year,
            userId: userId,
        },
    });
};

module.exports = { addComic, getComics };
